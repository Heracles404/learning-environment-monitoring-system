// OVERALL CODE FOR EVERYTHING
#include <Wire.h>

// Internet Components
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// BME680
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

// BH1750
#include <BH1750.h>

// Time
#include "time.h"

// ---------------------------------------------------------------------------
// Time Components
const char* ntpServer = "time.nist.gov";  // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;      // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;         // No daylight saving time

// ---------------------------------------------------------------------------
// ESP8266 Pins for SCL/SDA
const int sclPin = D1;
const int sdaPin = D2;

// ---------------------------------------------------------------------------
// BME680 Sensor
Adafruit_BME680 bme;

// BH1750 Sensor
BH1750 lightMeter;

// ---------------------------------------------------------------------------
// Wi-Fi Credentials
const char* ssid = "ACM2";
const char* password = "0495452821@2024";

// ---------------------------------------------------------------------------
// Server API Info
const char* host = "http://192.168.1.31";
const int port = 8000;
const char* endpoint = "/sensors";

// ---------------------------------------------------------------------------
// Variables
float temperature, humidity, voc, IAQIndex, lux;
float ppm;
int heatIndex;
String indoorAir, tempLabel, lightLabel, recordTime;
const String classroom = "401";

// Pin for alert (LED or external device)
#define alertPin D8
#define TempPin D0
#define LightingPin D5

// ---------------------------------------------------------------------------
// Offsets (optional for Heat Index and IAQ)
const float heatIndexOffsetC = 0.0;  // e.g. 2 °C
const float IAQOffset        = 165.0; // e.g. 50 points

// ---------------------------------------------------------------------------
// Prototypes
void wifiInit();
void bme680Readings();
String getFormattedTime();
float calculateIAQ(float gasResistance);
float calculatePPM(float gasResistance);
int calculateHeatIndex(float tempC, float relHumidity);
void luxFunc();
void sendDataToServer(
  String classroom, String recordTime,
  float temperature, float humidity, 
  float voc, float IAQIndex, float lux, 
  float ppm, int heatIndex, 
  String indoorAir, String tempLabel
);

// ---------------------------------------------------------------------------
// Setup
void setup() {
  Serial.begin(9600);
  Serial.println(F("Please Wait..."));

  // Initialize Wi-Fi
  wifiInit();

  // Initialize time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // Initialize BME680
  if (!bme.begin(0x77)) {
    Serial.println(F("BME680 not found!"));
    while (1) { delay(1); }
  }
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150);  // 320°C for 150 ms

  // Initialize BH1750
  lightMeter.begin();

  // Setup pins
  pinMode(alertPin, OUTPUT);
  pinMode(TempPin, OUTPUT);
  pinMode(LightingPin, OUTPUT);
  digitalWrite(alertPin, HIGH);
  digitalWrite(TempPin, LOW);
  digitalWrite(LightingPin, LOW);
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
    classroom, recordTime, 
    temperature, humidity, 
    voc, IAQIndex, lux, 
    ppm, heatIndex, 
    indoorAir, tempLabel
  );

  // Delay before next reading
  delay(4000);
}

// ---------------------------------------------------------------------------
// Calculate PPM using a basic approximation based on gas resistance
float calculatePPM(float gasResistance) {
  const float cleanAirResistance = 100.0; // Calibrate this value for clean air
  const float scalingFactor = 100.0;     // Adjust this to scale the PPM range

  if (gasResistance <= 0.0) {
    return 0.0; // Avoid division by zero or nonsensical values
  }

  // Calculate PPM based on the adjusted formula
  float ppmVal = scalingFactor * ((cleanAirResistance / gasResistance) - 1);

  // Clamp values to avoid negative PPM readings
  if (ppmVal < 0.0) ppmVal = 0.0;

  return ppmVal;
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
// ---------------------------------------------------------------------------
// Read from BME680 with Offsets
void bme680Readings() {
  // Read temperature and apply offset
  temperature = bme.readTemperature() - 2.0; // Offset: -1°C
  if (isnan(temperature)) {
    Serial.println(F("Failed to read temperature"));
  } else {
    Serial.print(F("Temperature (adjusted): "));
    Serial.print(temperature);
    Serial.println(F(" *C"));

    // Temperature Logic for D0
    if (temperature >= 27 && temperature <= 32) {
      tempLabel = "Good";
      digitalWrite(TempPin, LOW); // Turn OFF LED
    } else {
      tempLabel = "Bad";
      digitalWrite(TempPin, HIGH); // Turn ON LED
    }
    Serial.println("Temperature Condition: " + tempLabel);
  }

  // Read humidity and apply offset
  humidity = bme.readHumidity() + 3.0; // Offset: +3%
  if (isnan(humidity)) {
    Serial.println(F("Failed to read humidity"));
  } else {
    Serial.print(F("Humidity (adjusted): "));
    Serial.print(humidity);
    Serial.println(F(" %"));
  }

  // Heat Index in °C with offset already applied
  heatIndex = calculateHeatIndex(temperature, humidity);
  Serial.print(F("Heat Index (adjusted): "));
  Serial.print(heatIndex);
  Serial.println(F(" *C"));

  // Determine temperature concern level
  Serial.print(F("Temperature Concern Level: "));
  if (heatIndex <= 27) {
    tempLabel = "Good";
  } else if (heatIndex <= 37) {
    tempLabel = "Normal";
  } else if (heatIndex <= 40) {
    tempLabel = "Caution";
  } else if (heatIndex <= 45) {
    tempLabel = "DANGER";
  } else {
    tempLabel = "EXTREME DANGER";
  }
  Serial.println(tempLabel);

  // Read gas resistance
  voc = bme.gas_resistance / 1000.0;
  if (isnan(voc)) {
    Serial.println(F("Failed to read gas resistance"));
  } else {
    Serial.print(F("Gas Resistance: "));
    Serial.print(voc);
    Serial.println(F(" kOhms"));
  }

  

  // Calculate IAQ Index
  IAQIndex = calculateIAQ(voc);
  Serial.print(F("IAQ Index (adjusted): "));
  Serial.println(IAQIndex);

  // IAQ Concern Level
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

  // Calculate PPM
  ppm = calculatePPM(voc);
  Serial.print(F("VOC (approx): "));
  Serial.println(ppm);
}

// ---------------------------------------------------------------------------
// Read lux from BH1750
void luxFunc() {
  lux = lightMeter.readLightLevel();
  if (lux >= 300 && lux <= 500) {
    lightLabel = "Good";
    digitalWrite(LightingPin, LOW); // Turn OFF LED
    Serial.println(F("Lighting Condition: Good"));
  } else {
    lightLabel = "Bad";
    digitalWrite(LightingPin, HIGH); // Turn ON LED
    Serial.println(F("Lighting Condition: Bad"));
  }
  Serial.print(F("Light: "));
  Serial.print(lux);
  Serial.println(F(" lx"));
}

// ---------------------------------------------------------------------------
// Get Formatted Time (HH:MM AM/PM)
String getFormattedTime() {
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) {
    Serial.println(F("Failed to obtain time"));
    return "00:00 AM";
  }
  char buffer[9];
  strftime(buffer, sizeof(buffer), "%I:%M %p", &timeInfo);
  return String(buffer);
}

// ---------------------------------------------------------------------------
// Calculate IAQ using clamped, log-based scale (0–500) + offset
float calculateIAQ(float gasResistance) {
  const float R_min   = 10.0;    // kOhms
  const float R_max   = 200.0;   // kOhms
  const float IAQ_min = 0.0;
  const float IAQ_max = 650.0;

  if (gasResistance < 1.0)  gasResistance = 1.0;
  if (gasResistance < R_min) gasResistance = R_min;
  if (gasResistance > R_max) gasResistance = R_max;

  float logR     = log(R_max / gasResistance);
  float logRange = log(R_max / R_min);
  float IAQ      = (logR * (IAQ_max - IAQ_min)) / logRange + IAQ_min;

  // Subtract offset
  IAQ -= IAQOffset;

  // Clamp 0–500
  if (IAQ < IAQ_min) IAQ = IAQ_min;
  if (IAQ > IAQ_max) IAQ = IAQ_max;

  return IAQ;
}

// ---------------------------------------------------------------------------
// Calculate Heat Index (in °C) using NOAA formula, then apply offset
int calculateHeatIndex(float tempC, float relHumidity) {
  float tempF = (tempC * 9.0 / 5.0) + 32.0;

  float c1 = -42.379;
  float c2 = 2.04901523;
  float c3 = 10.14333127;
  float c4 = -0.22475541;
  float c5 = -0.00683783;
  float c6 = -0.05481717;
  float c7 = 0.00122874;
  float c8 = 0.00085282;
  float c9 = -0.00000199;

  float HI_F = c1 +
               (c2 * tempF) +
               (c3 * relHumidity) +
               (c4 * tempF * relHumidity) +
               (c5 * tempF * tempF) +
               (c6 * relHumidity * relHumidity) +
               (c7 * tempF * tempF * relHumidity) +
               (c8 * tempF * relHumidity * relHumidity) +
               (c9 * tempF * tempF * relHumidity * relHumidity);

  float HI_C = (HI_F - 32.0) * 5.0 / 9.0;

  // subtract offset
  HI_C -= heatIndexOffsetC;

  return round(HI_C);
}

// ---------------------------------------------------------------------------
// Send Data to the Server
void sendDataToServer(
  String classroom, String recordTime,
  float temperature, float humidity, 
  float voc, float IAQIndex, float lux, 
  float ppm, int heatIndex, 
  String indoorAir, String tempLabel
) {
  HTTPClient http;
  WiFiClient client;

  String url = String(host) + ":" + String(port) + String(endpoint);
  http.begin(client, url.c_str());

  StaticJsonDocument<256> jsonDoc;
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
  jsonDoc["ppm"]         = ppm;

  // Serialize and send
  serializeJson(jsonDoc, jsonPayload);
  http.addHeader("Content-Type", "application/json");
  int responseCode = http.POST(jsonPayload);

  Serial.print(F("Response Code: "));
  Serial.println(responseCode);

  http.end();
}