#include <SoftwareSerial.h>
#include "PMS.h"

// Internet Components
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "IoT";
const char* password = "AccessPoint.2024";
const char* host = "http://192.168.68.101";
const int port = 8000;
const char* endpoint = "/vog";

// PMS Components
const int rxNode = D1;  
const int txNode = D2;  

SoftwareSerial pmsSerial(rxNode, txNode); 
PMS pms(pmsSerial);
PMS::DATA data;

float pm25, pm10;
int idx25, idx10, level;

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

void setup() {
  Serial.begin(9600); 
  pmsSerial.begin(9600); 

  wifiConfig();

  pms.passiveMode();
}

void loop() {
  Serial.println(F("Waking up, wait 10 seconds for stable readings..."));
  pms.wakeUp();
  delay(10000);

  Serial.println(F("Send read request..."));
  pms.requestRead();

  Serial.println(F("Wait max. 1 second for read..."));
  if (pms.readUntil(data)) {
    pm25 = data.PM_AE_UG_2_5;
    pm10 = data.PM_AE_UG_10_0;

    idx25 = calculateAQI(pm25, "PM2.5");
    idx10 = calculateAQI(pm10, "PM10");

    level = concernLevel(max(idx25, idx10));

    dataDisplay();

  } else {
    Serial.println(F("No data."));
  }

  pms.sleep();

  sendDataToServer(pm25, pm10, max(idx25, idx10), level);

  delay(2000);
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

void sendDataToServer(float pm25, float pm10, int OAQIndex, int level) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    String url = String(host) + ":" + String(port) + endpoint;

    http.begin(client, url); // Use WiFiClient object
    http.addHeader("Content-Type", "application/json");

    // Construct JSON payload
    StaticJsonDocument<200> jsonDoc;
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
  }else {
      Serial.print(F("WiFi not connected"));
  }
}
