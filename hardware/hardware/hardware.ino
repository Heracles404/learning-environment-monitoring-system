// General Inclusion
#include <Wire.h>

// Internet Components
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// API Inclusions
#include <ArduinoJson.h>

// Inclusions for BME
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

// Inclusions for BH1750
#include <BH1750.h>


// Inclusions for Time
#include "time.h"

// Time Components
const char* ntpServer = "time.nist.gov"; // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;     // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;        // No daylight saving time

// ESP01 Components
const int sclPin = D1;  
const int sdaPin = D2;  

// BME Components
Adafruit_BME680 bme;

// BH1750 Components
BH1750 lightMeter;

// ESP01 Variables
const char* ssid = "IoT";
const char* password = "AccessPoint.2024";

// API Components
const char* host = "http://192.168.68.106";
const int port = 8000;
const char* endpoint = "/sensors";

// Variables
float temperature, humidity, voc, IAQIndex, lux;
int heatIndex;
String indoorAir, temp, recordTime;
const String classroom = "401";

#define alertPin D3

void setup() {
  Serial.begin(9600); // Initialize serial communication
  Serial.println(F("Please Wait..."));
  
  Wire.begin(sdaPin, sclPin);

  // Wifi Setup
  wifiInit();

  // // BME Setup
  if (!bme.begin(0x77)) {  // Make sure the sensor initializes
    Serial.println(F("BME680 not found!"));
    while (1);
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320°C for 150 ms

  // BH1750 Set up
  lightMeter.begin();

  pinMode(alertPin, OUTPUT);
  digitalWrite(alertPin, HIGH);
}

void loop() {
  Serial.println(F("--------------------------------"));
  bme680Readings(); 
  luxFunc();
  Serial.println(F("--------------------------------"));
  sendDataToServer(classroom, recordTime, temperature, humidity, voc, IAQIndex, lux, heatIndex, indoorAir, temp); 

  // Check and set alert signal
  if (indoorAir == "UNHEALTHY" || indoorAir == "VERY UNHEALTHY" || 
      indoorAir == "HAZARDOUS" || temp == "UNCOMFORTABLY HOT" || 
      temp == "EXTREMELY HOT") {
      digitalWrite(alertPin, LOW); // Send low signal
      Serial.println(F("Alert: Low signal sent to pin D3."));
  } else {
      digitalWrite(alertPin, HIGH); // Default state
      Serial.println(F("Alert: Conditions normal."));
  }

  delay(15000);
}

void wifiInit(){  
  Serial.println();
  Serial.print(F("Connecting to "));
  Serial.println(ssid);

  WiFi.begin(ssid, password);  

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(F(""));
  Serial.println(F("WiFi connected"));
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());  
}

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

   // Heat Index Calculation
  heatIndex = calculateHeatIndex(temperature, humidity);
  Serial.print(F("Heat Index: "));
  Serial.print(heatIndex);
  Serial.println(F(" *C")); 

  Serial.print(F("Temperature Concern Level: "));
  if (heatIndex <= 27) {
    temp = "NOT HAZARDOUS";
  } else if ((heatIndex >= 28) && (heatIndex <= 32)) {
    temp = "CAUTION";
  } else if ((heatIndex >= 33) && (heatIndex <= 41)) {
    temp = "EXTREME CAUTION";
  } else if ((heatIndex >= 42) && (heatIndex <= 51)) {
    temp = "DANGER";
  } else if (heatIndex > 52) {
    temp = "EXTREME DANGER";
  } 
  Serial.println(temp);

  voc = (bme.gas_resistance / 1000.0);
  if (isnan(voc)) {
    Serial.println(F("Failed to read gas resistance"));
  } else {
    Serial.print(F("Gas Resistance: "));
    Serial.print(voc);
    Serial.println(F(" kOhms"));
  }

  IAQIndex = calculateIAQ(voc);

  Serial.print(F("IAQ Index: "));
  Serial.println(IAQIndex);

  Serial.print(F("AQ Concern Level: "));
  // IAQ based on Gas Resistance
  if ((IAQIndex > 0) && (IAQIndex <= 50)) {
    indoorAir = "GOOD";
  } else if ((IAQIndex > 51) && (IAQIndex <= 100)) {
    indoorAir = "MODERATE";
  } else if ((IAQIndex > 101) && (IAQIndex <= 150)) {
    indoorAir = "UNHEALTHY FOR SENSITIVE GROUPS";
  } else if ((IAQIndex > 151) && (IAQIndex <= 200)) {
    indoorAir = "UNHEALTHY";
  } else if ((IAQIndex > 201) && (IAQIndex <= 300)) {
    indoorAir = "VERY UNHEALTHY";
  } else if ((IAQIndex > 301) && (IAQIndex <= 500)) {
    indoorAir = "HAZARDOUS";
  }
  Serial.println(indoorAir);

}

float calculateIAQ(float GasResistance) {
  // Define your maximum and minimum gas resistance values (in kOhms)
  const float R_max = 500.0;   // Maximum gas resistance (worst air quality)
  const float R_min = 10.0;    // Minimum gas resistance (best air quality)
  
  // Define IAQ range
  const int IAQ_max = 500;   // Maximum IAQ index (best air quality)
  const int IAQ_min = 0;     // Minimum IAQ index (worst air quality)

  // Logarithmic mapping of gas resistance to IAQ index
  float logR = log(R_max / GasResistance);  // Logarithmic transformation
  float IAQ = (logR * (IAQ_max - IAQ_min)) / log(R_max / R_min);  // Calculate IAQ index

  return IAQ;
}

void luxFunc() {
  lux = lightMeter.readLightLevel();
  Serial.print("Light: ");
  Serial.print(lux);
  Serial.println(" lx");
}

int calculateHeatIndex(float T, float H) {
  // Heat Index calculation based on temperature (T) and humidity (H)
  // Formula Constants
  float c1 = -8.78469475556;
  float c2 = 1.61139411;
  float c3 = 2.33854883889;
  float c4 = -0.14611605;
  float c5 = -0.012308094;
  float c6 = -0.0164248277778;
  float c7 = 0.002211732;
  float c8 = 0.00072546;
  float c9 = -0.000003582;

  // Calculate the Heat Index
  float HI = c1 + (c2 * T) + (c3 * H) + (c4 * T * H) + (c5 * T * T) + (c6 * H * H) + (c7 * T * T * H) + (c8 * T * H * H) + (c9 * T * T * H * H);
  return round(HI);  // Return rounded value of heat index
}

void sendDataToServer(String classroom, String recordTime, float temperature, float humidity, float voc, float IAQIndex, float lux, int heatIndex, String indoorAir, String temp) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    String url = String(host) + ":" + String(port) + endpoint;

    http.begin(client, url); // Use WiFiClient object
    http.addHeader("Content-Type", "application/json");

    // Construct JSON payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["time"] = recordTime;
    jsonDoc["temperature"] = temperature;
    jsonDoc["humidity"] = humidity;
    jsonDoc["voc"] = voc;
    jsonDoc["IAQIndex"] = IAQIndex;
    jsonDoc["lighting"] = lux;
    jsonDoc["heatIndex"] = heatIndex;
    jsonDoc["indoorAir"] = indoorAir;
    jsonDoc["temp"] = temp;

    String requestBody;
    serializeJson(jsonDoc, requestBody);

    Serial.print(F("Sending POST request to: "));
    Serial.println(url);
    Serial.print(F("Payload: "));
    Serial.println(requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      Serial.print(F("Response code: "));
      Serial.println(httpResponseCode);
      Serial.print(F("Response: "));
      Serial.println(http.getString());
    } else {
      Serial.print(F("Error sending POST request. Code: "));
      Serial.println(httpResponseCode);
    }

    http.end();
  }else {
      Serial.print(F("WiFi not connected"));
  }
}
