#include <SoftwareSerial.h>
#include "PMS.h"

// Internet Components
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Time Components
#include "time.h"

const char* ssid = "ACM2";
const char* password = "0495452821@2024";
const char* host = "http://192.168.1.31";
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
  int targetHour1 = 11;  // Example: 11:50 AM
  int targetMinute1 = 57;

  int targetHour2 = 11;  // Example: 11:51 AM
  int targetMinute2 = 58;

  int targetHour3 = 11;  // Example: 3:00 PM
  int targetMinute3 = 59;

  int targetHour4 = 12;  // Example: 6:30 PM
  int targetMinute4 = 1;

  int targetHour5 = 12;  // Example: 8:45 PM
  int targetMinute5 = 2;

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
      pm25 = data.PM_AE_UG_2_5;
      pm10 = data.PM_AE_UG_10_0;

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
  if (pollutant == "PM2.5") {
    if (concentration <= 12.0) return map(concentration, 0.0, 12.0, 0, 50);
    else if (concentration <= 35.4) return map(concentration, 12.1, 35.4, 51, 100);
    else if (concentration <= 55.4) return map(concentration, 35.5, 55.4, 101, 150);
    else if (concentration <= 150.4) return map(concentration, 55.5, 150.4, 151, 200);
    else if (concentration <= 250.4) return map(concentration, 150.5, 250.4, 201, 300);
    else return 301;  
  } else if (pollutant == "PM10") {
    if (concentration <= 54) return map(concentration, 0.0, 54, 0, 50);
    else if (concentration <= 154) return map(concentration, 55, 154, 51, 100);
    else if (concentration <= 254) return map(concentration, 155, 254, 101, 150);
    else if (concentration <= 354) return map(concentration, 255, 354, 151, 200);
    else if (concentration <= 424) return map(concentration, 355, 424, 201, 300);
    else return 301;
  }
  return -1;
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
//PUKEPUKEPUKE