// ---------------------------------------------------------------------------
// General Inclusion
#include <Wire.h>

// Internet Components
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Inclusions for BME
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

// Inclusions for BH1750
#include <BH1750.h>

// Inclusions for Time
#include "time.h"

// ---------------------------------------------------------------------------
// Time Components
const char* ntpServer = "time.nist.gov";  // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;      // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;         // No daylight saving time

// ---------------------------------------------------------------------------
// ESP8266 Pins for SCL/SDA (adjust as needed for your board/setup)
const int sclPin = D1;
const int sdaPin = D2;

// ---------------------------------------------------------------------------
// BME680 Sensor
Adafruit_BME680 bme;

// BH1750 Sensor
BH1750 lightMeter;

// ---------------------------------------------------------------------------
// Wi-Fi Credentials
const char* ssid = "iPhone";
const char* password = "angelian";

// ---------------------------------------------------------------------------
// Server API Info
const char* host = "http://172.20.10.3";
const int port = 8000;
const char* endpoint = "/sensors";

// ---------------------------------------------------------------------------
// Variables
float temperature, humidity, voc, IAQIndex, lux;
int heatIndex;
String indoorAir, tempLabel, recordTime;
const String classroom = "401";

// Pin for alert (e.g., LED or external device)
#define alertPin D8

// ---------------------------------------------------------------------------
// Function Prototypes
void wifiInit();
void bme680Readings();
String getFormattedTime();
float calculateIAQ(float gasResistance);
int calculateHeatIndex(float tempC, float relHumidity);
void luxFunc();
void sendDataToServer(String classroom, String recordTime,
                      float temperature, float humidity,
                      float voc, float IAQIndex, float lux,
                      int heatIndex, String indoorAir, String tempLabel);

// ---------------------------------------------------------------------------
// Setup
void setup() {
  Serial.begin(9600);  // Initialize serial communication
  Serial.println(F("Please Wait..."));

  // Initialize Wi-Fi
  wifiInit();

  // Initialize time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // Initialize BME680
  if (!bme.begin(0x77)) {
    Serial.println(F("BME680 not found!"));
    while (1) { delay(1); } // Halt
  }
  // Configure BME oversampling and filter
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150);  // 320°C for 150 ms

  // Initialize BH1750
  lightMeter.begin();

  // Setup alert pin
  pinMode(alertPin, OUTPUT);
  digitalWrite(alertPin, HIGH); // Default state
}

// ---------------------------------------------------------------------------
// Main Loop
void loop() {
  Serial.println(F("--------------------------------"));
  
  // Read sensor data
  bme680Readings();
  luxFunc();

  // Get time
  recordTime = getFormattedTime();
  Serial.print(F("Current Time: "));
  Serial.println(recordTime);

  Serial.println(F("--------------------------------"));

  // Send data to server
  sendDataToServer(
    classroom, recordTime, temperature, humidity,
    voc, IAQIndex, lux, heatIndex, indoorAir, tempLabel
  );

  // Trigger alert if conditions are bad
  if (indoorAir == "UNHEALTHY"       || 
      indoorAir == "VERY UNHEALTHY"  || 
      indoorAir == "HAZARDOUS"       ||
      tempLabel == "DANGER"          ||
      tempLabel == "EXTREME DANGER") {
    digitalWrite(alertPin, LOW);
    Serial.println(F("Alert: Low signal sent to pin D8."));
  } else {
    digitalWrite(alertPin, HIGH);
    Serial.println(F("Alert: Conditions normal."));
  }

  // Delay before next reading
  delay(15000);
}

// ---------------------------------------------------------------------------
// Wi-Fi Initialization
void wifiInit() {
  Serial.println();
  Serial.print(F("Connecting to "));
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println(F("WiFi connected"));
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());
}

// ---------------------------------------------------------------------------
// Read from BME680
void bme680Readings() {
  temperature = bme.readTemperature();
  if (isnan(temperature)) {
    Serial.println(F("Failed to read temperature"));
  } else {
    Serial.print(F("Temperature: "));
    Serial.print(temperature);
    Serial.println(F(" *C"));
  }

  humidity = bme.readHumidity();
  if (isnan(humidity)) {
    Serial.println(F("Failed to read humidity"));
  } else {
    Serial.print(F("Humidity: "));
    Serial.print(humidity);
    Serial.println(F(" %"));
  }

  // Calculate heat index (in °C)
  heatIndex = calculateHeatIndex(temperature, humidity);
  Serial.print(F("Heat Index: "));
  Serial.print(heatIndex);
  Serial.println(F(" *C"));

  // Temperature Concern Level (based on standard Heat Index chart)
  Serial.print(F("Temperature Concern Level: "));
  if (heatIndex < 27) {
    tempLabel = "Good";
  } else if (heatIndex <= 32) {
    tempLabel = "Normal";
  } else if (heatIndex <= 39) {
    tempLabel = "Caution";
  } else if (heatIndex <= 51) {
    tempLabel = "DANGER";
  } else {
    tempLabel = "EXTREME DANGER";
  }
  Serial.println(tempLabel);

  // Gas Resistance (kOhms)
  voc = bme.gas_resistance / 1000.0;
  if (isnan(voc)) {
    Serial.println(F("Failed to read gas resistance"));
  } else {
    Serial.print(F("Gas Resistance: "));
    Serial.print(voc);
    Serial.println(F(" kOhms"));
  }

  // IAQ Calculation & Category
  IAQIndex = calculateIAQ(voc);
  Serial.print(F("IAQ Index: "));
  Serial.println(IAQIndex);

  Serial.print(F("AQ Concern Level: "));
  if (IAQIndex <= 50) {
    indoorAir = "GOOD";
  } else if (IAQIndex <= 100) {
    indoorAir = "MODERATE";
  } else if (IAQIndex <= 150) {
    indoorAir = "UNHEALTHY FOR SENSITIVE GROUPS";
  } else if (IAQIndex <= 200) {
    indoorAir = "UNHEALTHY";
  } else if (IAQIndex <= 300) {
    indoorAir = "VERY UNHEALTHY";
  } else {
    indoorAir = "HAZARDOUS";
  }
  Serial.println(indoorAir);
}

// ---------------------------------------------------------------------------
// Get Formatted Time (HH:MM AM/PM)
String getFormattedTime() {
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) {
    Serial.println(F("Failed to obtain time"));
    return "12:00 AM";
  }
  char buffer[9];
  strftime(buffer, sizeof(buffer), "%I:%M %p", &timeInfo); // e.g. "07:32 PM"
  return String(buffer);
}

// ---------------------------------------------------------------------------
// Calculate IAQ using clamped, log-based scale (0–500)
float calculateIAQ(float gasResistance) {
  // Choose realistic min/max based on your environment & sensor data
  const float R_min   = 10.0;    // (kOhms) "Best" environment
  const float R_max   = 200.0;   // (kOhms) "Worst" environment
  const float IAQ_min = 0.0;
  const float IAQ_max = 200.0;

  // Avoid negative or zero
  if (gasResistance < 1.0) gasResistance = 1.0;

  // Clamp to range
  if (gasResistance < R_min) gasResistance = R_min;
  if (gasResistance > R_max) gasResistance = R_max;

  // Logarithmic mapping
  float logR      = log(R_max / gasResistance);
  float logRange  = log(R_max / R_min);
  float IAQ       = (logR * (IAQ_max - IAQ_min)) / logRange + IAQ_min;

  // Final clamp 0–500
  if (IAQ < IAQ_min) IAQ = IAQ_min;
  if (IAQ > IAQ_max) IAQ = IAQ_max;

  return IAQ;
}

// ---------------------------------------------------------------------------
// Calculate Heat Index (in °C) using NOAA formula
int calculateHeatIndex(float tempC, float relHumidity) {
  // Convert °C -> °F
  float tempF = (tempC * 9.0 / 5.0) + 32.0;

  // NOAA coefficients
  float c1 = -42.379;
  float c2 = 2.04901523;
  float c3 = 10.14333127;
  float c4 = -0.22475541;
  float c5 = -0.00683783;
  float c6 = -0.05481717;
  float c7 = 0.00122874;
  float c8 = 0.00085282;
  float c9 = -0.00000199;

  // Heat Index in °F
  float HI_F = c1 +
               (c2 * tempF) +
               (c3 * relHumidity) +
               (c4 * tempF * relHumidity) +
               (c5 * tempF * tempF) +
               (c6 * relHumidity * relHumidity) +
               (c7 * tempF * tempF * relHumidity) +
               (c8 * tempF * relHumidity * relHumidity) +
               (c9 * tempF * tempF * relHumidity * relHumidity);

  // Convert °F -> °C
  float HI_C = (HI_F - 32.0) * 5.0 / 9.0;
  return round(HI_C);
}

// ---------------------------------------------------------------------------
// Read lux from BH1750
void luxFunc() {
  lux = lightMeter.readLightLevel();
  Serial.print(F("Light: "));
  Serial.print(lux);
  Serial.println(F(" lx"));
}

// ---------------------------------------------------------------------------
// Send Data to the Server
void sendDataToServer(String classroom, String recordTime,
                      float temperature, float humidity,
                      float voc, float IAQIndex, float lux,
                      int heatIndex, String indoorAir, String tempLabel) {
  HTTPClient http;
  WiFiClient client;  // Create a WiFiClient object

  String url = String(host) + ":" + String(port) + String(endpoint);
  http.begin(client, url.c_str());  // Pass the WiFiClient object and the URL

  StaticJsonDocument<200> jsonDoc;
  String jsonPayload;

  // Build JSON payload
  jsonDoc["classroom"]   = classroom;
  jsonDoc["time"]        = recordTime;
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"]    = humidity;
  jsonDoc["heatIndex"]   = heatIndex;
  jsonDoc["lighting"]    = lux;
  jsonDoc["voc"]         = voc;
  jsonDoc["IAQIndex"]    = IAQIndex;
  jsonDoc["indoorAir"]   = indoorAir;
  jsonDoc["temp"]        = tempLabel;

  // Serialize and send
  serializeJson(jsonDoc, jsonPayload);
  http.addHeader("Content-Type", "application/json");
  int responseCode = http.POST(jsonPayload);

  Serial.print(F("Response Code: "));
  Serial.println(responseCode);
  http.end();
}
