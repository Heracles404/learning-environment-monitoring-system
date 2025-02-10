#include <SoftwareSerial.h>
#include "PMS.h"

// Internet Components
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Time Components
#include "time.h"

const char* ssid = "AccessPoint";
const char* password = "IoT@2025";
const char* host = "api.lems.systems";
const int port = 443;
const char* endpoint = "/vog";
const char* update_endpoint = "/devices";

const char* ntpServer = "time.nist.gov"; // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;     // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;        // No daylight saving time

const String room = "403";

// PMS Constants
const int txNode = D3;  
const int rxNode = D4;  

SoftwareSerial pmsSerial(rxNode, txNode); 
PMS pms(pmsSerial);
PMS::DATA data;

String recordTime;
float pm25, pm10;
int idx25, idx10, level;
const String classroom = "401";

// Calibration coefficients
float a_pm25 = 0.400;
float b_pm25 = -2.000;

float a_pm10 = 0.400;
float b_pm10 = -2.040;

// Pin definitions
const int ledPin = D1;  // LED connected to D1

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

  // Set up the LED pin as output
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW); // Ensure LED is off initially
}

void loop() {
  // Update Time
  String currentTime = getFormattedTime();

  // Wake up the sensor, get the readings, and send data
  pms.wakeUp();
  delay(10000);  // Wait for sensor to stabilize

  pms.requestRead();
  if (pms.readUntil(data)) {
    updateSensorStatus("active");
    // Apply calibration
    pm25 = a_pm25 * data.PM_AE_UG_2_5 + b_pm25;
    pm10 = a_pm10 * data.PM_AE_UG_10_0 + b_pm10;

    idx25 = calculateAQI(pm25, "PM2.5");
    idx10 = calculateAQI(pm10, "PM10");

    // Adjust both indices by 20
    idx25 = max(0, idx25 - 20);
    idx10 = max(0, idx10 - 20);

    level = concernLevel(max(idx25, idx10));

    recordTime = currentTime; // Use the updated time
    dataDisplay();
    sendDataToServer(classroom, recordTime, pm25, pm10, max(idx25, idx10), level);

    // Control LED based on concern level
    if (level == 5) {
      digitalWrite(ledPin, HIGH); // Turn on LED
    } else {
      digitalWrite(ledPin, LOW);  // Turn off LED
    }
  } else {
    Serial.println(F("No data."));
    updateSensorStatus("inactive");
  }

  pms.sleep();
  delay(2000); // Delay before the next loop cycle
}

int concernLevel(int idx) {
  if (idx > 300) return 5;
  else if (idx > 200) return 4;
  else if (idx > 150) return 3;
  else if (idx > 100) return 2;
  else if (idx > 50) return 1;
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

void sendDataToServer(String classroom, String recordTime, float pm25, float pm10, int OAQIndex, int level) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Skip SSL certificate validation (for testing only)
    HTTPClient http;
    
    String url = "https://api.lems.systems/vog";

    http.begin(client, url); // Use WiFiClient object
    http.addHeader("Content-Type", "application/json");

    // Construct JSON payload
    StaticJsonDocument<512> jsonDoc;
    //jsonDoc["classroom"] = classroom;
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


void updateSensorStatus(String pms5003) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    String url = String(host) + ":" + String(port) + update_endpoint + "/classroom/" + String(room);

    http.begin(client, url); // Use WiFiClient object
    http.addHeader("Content-Type", "application/json");

    // Construct JSON payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["pms5003"] = pms5003;

    String requestBody;
    serializeJson(jsonDoc, requestBody);

    Serial.print(F("Sending PATCH request to: "));
    Serial.println(url);
    Serial.print(F("Payload: "));
    Serial.println(requestBody);

    int httpResponseCode = http.PATCH(requestBody);

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