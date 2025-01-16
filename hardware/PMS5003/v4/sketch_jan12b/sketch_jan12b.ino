#include <SoftwareSerial.h>
#include "PMS.h"

// Internet Components
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Time Components
#include "time.h"

const char* ssid = "iPhone";
const char* password = "angelian";
const char* host = "http://172.20.10.3";
const int port = 8000;
const char* endpoint = "/vog";

const char* ntpServer = "time.nist.gov"; // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;     // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;        // No daylight saving time

// PMS Constants
const int txNode = D3;  
const int rxNode = D4;  

SoftwareSerial pmsSerial(rxNode, txNode); 
PMS pms(pmsSerial);
PMS::DATA data;

String recordTime;
float pm25, pm10;
int idx25, idx10, level;

// Calibration coefficients
float a_pm25 = 0.887;
float b_pm25 = -0.633;

float a_pm10 = 0.900;
float b_pm10 = -0.040;

// Time variables
int lastPostMinute = -1;

void wifiConfig() {
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

void setupTime() {
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

String getFormattedTime() {
    struct tm timeInfo;
    if (!getLocalTime(&timeInfo)) {
        Serial.println("Failed to obtain time");
        return "12:00 AM"; // Fallback value
    }
    char buffer[9];
    strftime(buffer, sizeof(buffer), "%I:%M %p", &timeInfo); // Format: HH:MM AM/PM
    return String(buffer);
}

void setup() {
  Serial.begin(9600); 
  pmsSerial.begin(9600); 

  wifiConfig();
  setupTime();

  pms.passiveMode();
}

void loop() {
  // Update Time
  String currentTime = getFormattedTime();
  
  // Get the current time from the struct tm
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

  // Get current hour and minute from timeInfo struct
int currentHour = timeInfo.tm_hour;   // Get the current hour (24-hour format)
int currentMinute = timeInfo.tm_min;  // Get the current minute

// Define target times for data posting
int targetHour1 = 18;  // Example: 6:11 PM
int targetMinute1 = 42;

int targetHour2 = 18;  // Example: 6:12 PM
int targetMinute2 = 43;

int targetHour3 = 18;  // Example: 7:00 PM
int targetMinute3 = 44;

int targetHour4 = 18;  // Example: 8:30 PM
int targetMinute4 = 45;

int targetHour5 = 18;  // Example: 9:45 PM
int targetMinute5 = 46;

// Check if it's time to post data (based on defined target times)
if ((currentHour == targetHour1 && currentMinute == targetMinute1 && lastPostMinute != currentMinute) ||
    (currentHour == targetHour2 && currentMinute == targetMinute2 && lastPostMinute != currentMinute) ||
    (currentHour == targetHour3 && currentMinute == targetMinute3 && lastPostMinute != currentMinute) ||
    (currentHour == targetHour4 && currentMinute == targetMinute4 && lastPostMinute != currentMinute) ||
    (currentHour == targetHour5 && currentMinute == targetMinute5 && lastPostMinute != currentMinute)) {

    
    // Wake up the sensor, get the readings, and send data
    pms.wakeUp();
    delay(10000);  // Wait for sensor to stabilize
    pms.requestRead();
    if (pms.readUntil(data)) {
      // Apply calibration
      pm25 = a_pm25 * data.PM_AE_UG_2_5 + b_pm25;
      pm10 = a_pm10 * data.PM_AE_UG_10_0 + b_pm10;

      idx25 = calculateAQI(pm25, "PM2.5");
      idx10 = calculateAQI(pm10, "PM10");

      level = concernLevel(max(idx25, idx10));

      recordTime = currentTime; // Use the updated time
      dataDisplay();
      sendDataToServer(recordTime, pm25, pm10, max(idx25, idx10), level);
    } else {
      Serial.println(F("No data."));
    }

    // Update last post minute to prevent duplicate posts
    lastPostMinute = currentMinute;
  }

  pms.sleep();
  delay(2000); // Delay before the next loop cycle
}

int concernLevel(int idx) {
  if (idx > 300) return 6;
  else if (idx > 200) return 5;
  else if (idx > 150) return 4;
  else if (idx > 100) return 3;
  else if (idx > 50) return 2;
  else return 1;
}

void dataDisplay() {
  Serial.print(F("PM 2.5 (ug/m3): "));
  Serial.println(pm25);
    
  Serial.print(F("PM 10.0 (ug/m3): "));
  Serial.println(pm10);

  Serial.print(F("OAQ Index: "));
  Serial.println(max(idx25, idx10));

  Serial.print(F("Concern Level: "));
  Serial.println(level);
}

int calculateAQI(float concentration, String pollutant) {
  struct AQIRange {
    float cLow, cHigh;
    int iLow, iHigh;
  };
  
  AQIRange rangesPM25[] = {
    {0.0, 12.0, 0, 50}, {12.1, 35.4, 51, 100}, {35.5, 55.4, 101, 150},
    {55.5, 150.4, 151, 200}, {150.5, 250.4, 201, 300},
    {250.5, 350.4, 301, 400}, {350.5, 500.4, 401, 500}};
    
  AQIRange rangesPM10[] = {
    {0, 54, 0, 50}, {55, 154, 51, 100}, {155, 254, 101, 150},
    {255, 354, 151, 200}, {355, 424, 201, 300},
    {425, 504, 301, 400}, {505, 604, 401, 500}};
  
  AQIRange *ranges;
  int size;
  
  if (pollutant == "PM2.5") {
    ranges = rangesPM25;
    size = sizeof(rangesPM25) / sizeof(rangesPM25[0]);
  } else if (pollutant == "PM10") {
    ranges = rangesPM10;
    size = sizeof(rangesPM10) / sizeof(rangesPM10[0]);
  } else {
    return -1; // Invalid pollutant
  }
  
  for (int i = 0; i < size; i++) {
    if (concentration >= ranges[i].cLow && concentration <= ranges[i].cHigh) {
      return round((ranges[i].iHigh - ranges[i].iLow) / 
             (ranges[i].cHigh - ranges[i].cLow) * (concentration - ranges[i].cLow) + ranges[i].iLow);
    }
  }
  return 501; // Out of range
}

void sendDataToServer(String recordTime, float pm25, float pm10, int OAQIndex, int level) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    String url = String(host) + ":" + String(port) + endpoint;

    http.begin(client, url); // Use WiFiClient object
    http.addHeader("Content-Type", "application/json");

    // Construct JSON payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["time"] = recordTime;
    jsonDoc["pm25"] = pm25;
    jsonDoc["pm10"] = pm10;
    jsonDoc["OAQIndex"] = OAQIndex;
    jsonDoc["level"] = level;

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
  } else {
    Serial.print(F("WiFi not connected"));
  }
}
//test