#include <SoftwareSerial.h>
#include "PMS.h"

// Internet Components
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Time Components
#include "time.h"
int getCurrentHour();
int getCurrentMinute();
String getFormattedTime();

// --------------------------------------------------
// WIFI & SERVER CONFIG
// --------------------------------------------------
// const char* ssid        = "ESLIHS Office_DECO_Guest";
// const char* password    = "MCLems@2025!";

const char* ssid = "TP-Link_CB9E";
const char* password = "60848431";

const char* host   = "http://147.93.52.170"; // for localhost
const int   port   = 8000; // for localhost
const char* devices  = "/devices/classroom/";
const char*  vog = "/vog";
//const char* cloudAPI    = "https://api.lems.systems/vog";  // if using external endpoint

const String classroom       = "R102";   // or "401", pick one

// --------------------------------------------------
// NTP CONFIG
// --------------------------------------------------
const char* ntpServer   = "time.nist.gov"; 
const long  gmtOffset   = 8 * 3600;      // GMT+8
const int   dstOffset   = 0;

// --------------------------------------------------
// PMS SENSOR PINS & LIB
// --------------------------------------------------
const int txNode = D4;
const int rxNode = D3;
SoftwareSerial pmsSerial(rxNode, txNode); 
PMS pms(pmsSerial);
PMS::DATA data;

// --------------------------------------------------
// CALIBRATION
// --------------------------------------------------
float a_pm25 = 0.400;
float b_pm25 = -2.000;

float a_pm10 = 0.400;
float b_pm10 = -2.040;

// --------------------------------------------------
// LED Pin (D1)
// --------------------------------------------------
const int ledPin = D0;

// --------------------------------------------------
// GLOBALS
// --------------------------------------------------
float pm25, pm10;
int   idx25, idx10, level;

// --------------------------------------------------
// WIFI Setup
// --------------------------------------------------
void wifiConfig() {
  Serial.println();
  Serial.print(F("Connecting to "));
  Serial.println(ssid);

  WiFi.begin(ssid, password);  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println(F("\nWiFi connected"));
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());  
}

// --------------------------------------------------
// TIME Setup
// --------------------------------------------------
void setupTime() {
  configTime(gmtOffset, dstOffset, ntpServer);
}


int getCurrentHour() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println(F("Failed to obtain time"));
    return -1;
  }
  return timeinfo.tm_hour;
}

int getCurrentMinute() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println(F("Failed to obtain time"));
    return -1;
  }
  return timeinfo.tm_min;
}

String getFormattedTime() {
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) {
    Serial.println(F("Failed to obtain time"));
    return "--:--";
  }
  char buffer[6];
  sprintf(buffer, "%02d:%02d", timeInfo.tm_hour, timeInfo.tm_min);
  return String(buffer);
}

// --------------------------------------------------
// ARDUINO SETUP
// --------------------------------------------------
void setup() {
  Serial.begin(9600);
  pmsSerial.begin(9600);

  wifiConfig();
  setupTime();

  // PMS in Passive Mode
  pms.passiveMode();

  // Set Device Status to ACTIVE at Startup
  setActive();

  // Initialize LED
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
}

// --------------------------------------------------
// MAIN LOOP
// --------------------------------------------------
void loop() {

  int currentHour = getCurrentHour();
  int currentMinute = getCurrentMinute();
  String currentTime = getFormattedTime();

  static int lastPostHour = -1;

  // Continuously read PMS sensor
  PMS::DATA data;
  pms.requestRead();
  if (pms.readUntil(data)) {
    updateSensorStatus("ACTIVE");

    // Calibration
    float rawPM25 = data.PM_AE_UG_2_5;
    float rawPM10 = data.PM_AE_UG_10_0;

    float pm25 = max(0.0f, a_pm25 * rawPM25 + b_pm25);
    float pm10 = max(0.0f, a_pm10 * rawPM10 + b_pm10);

    // AQI Calculation
    int idx25 = calculateAQI(pm25, "PM2.5");
    int idx10 = calculateAQI(pm10, "PM10");

    idx25 = max(0, idx25 - 30);
    idx10 = max(0, idx10 - 20);

    int maxIdx = max(idx25, idx10);
    int level = concernLevel(maxIdx);

    // Display continuous sensor data
    dataDisplay(pm25, pm10, maxIdx, level);

    // Control LED based on AQI level
    digitalWrite(ledPin, (level == 5) ? HIGH : LOW);

    // Send data explicitly once per hour (minute == 0)
    // if (currentMinute == 0 && currentHour != lastPostHour) {
    if ((currentMinute == 0 || currentMinute % 5 == 0) && currentHour != lastPostHour) {

      Serial.println("Hourly Data Sent to Server at: " + currentTime);
      sendDataToServer(classroom, currentTime, pm25, pm10, maxIdx, level);
      lastPostHour = currentHour;
    }

  } else {
    Serial.println(F("No data received from PMS."));
    updateSensorStatus("INACTIVE");
  }

  // Delay between continuous readings (every 10 seconds)
  delay(10000);
}




// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------
int calculateAQI(float concentration, String pollutant) {
  struct AQIRange {
    float cLow, cHigh;
    int iLow, iHigh;
  };

  // US-EPA PM2.5 breakpoints
  AQIRange rangesPM25[] = {
    {  0.0,  12.0,   0,  50},
    { 12.1,  35.4,  51, 100},
    { 35.5,  55.4, 101, 150},
    { 55.5, 150.4, 151, 200},
    {150.5, 250.4, 201, 300},
    {250.5, 350.4, 301, 400},
    {350.5, 500.4, 401, 500}
  };

  // US-EPA PM10 breakpoints
  AQIRange rangesPM10[] = {
    {   0,   54,   0,  50},
    {  55,  154,  51, 100},
    { 155,  254, 101, 150},
    { 255,  354, 151, 200},
    { 355,  424, 201, 300},
    { 425,  504, 301, 400},
    { 505,  604, 401, 500}
  };

  AQIRange* ranges;
  int size;
  
  if (pollutant == "PM2.5") {
    ranges = rangesPM25;
    size = sizeof(rangesPM25) / sizeof(rangesPM25[0]);
  } else if (pollutant == "PM10") {
    ranges = rangesPM10;
    size = sizeof(rangesPM10) / sizeof(rangesPM10[0]);
  } else {
    return -1; // invalid pollutant
  }
  
  for (int i = 0; i < size; i++) {
    if (concentration >= ranges[i].cLow && concentration <= ranges[i].cHigh) {
      return round((ranges[i].iHigh - ranges[i].iLow) /
                   (ranges[i].cHigh - ranges[i].cLow) *
                   (concentration - ranges[i].cLow) + ranges[i].iLow);
    }
  }
  return 501; // above scale
}

int concernLevel(int idx) {
  // Example for typical breakpoints:
  if      (idx <= 50)  return 1;
  else if (idx <= 100) return 2;
  else if (idx <= 150) return 3;
  else if (idx <= 200) return 4;
  else if (idx <= 300) return 5;
  else                 return 5; // or 6 if you prefer
}

void dataDisplay(float pm25Val, float pm10Val, int oaq, int lvl) {
  pm25Val -= 3.5;
  pm10Val += 2.5; 
  

  Serial.print(F("PM 2.5 (ug/m3): "));
  Serial.println(pm25Val);

  Serial.print(F("PM 10.0 (ug/m3): "));
  Serial.println(pm10Val);

  Serial.print(F("OAQ Index: "));
  Serial.println(oaq);

  Serial.print(F("Concern Level: "));
  Serial.println(lvl);
}

// --------------------------------------------------
// SET DEVICE ACTIVE (initially or on startup)
// --------------------------------------------------
void setActive() {
    HTTPClient http;
    WiFiClient client;
    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    Serial.println(url);

    
    http.begin(client, url);

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["status"] = "ACTIVE";
    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.PATCH(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

// --------------------------------------------------
// SEND SENSOR DATA TO CLOUD
// --------------------------------------------------
void sendDataToServer(String classroom, String timeStr, float pm25Val, float pm10Val, int OAQIndex, int level) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("WiFi not connected!"));
    return;
  }

  WiFiClient client;    // using secure
  HTTPClient http;

  // If you are sure you want to use "api.lems.systems/vog"
  String url = String(host) + ":" + String(port) + String(vog);
  http.begin(client, url.c_str());  

  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<512> jsonDoc;
  jsonDoc["classroom"] = classroom;
  jsonDoc["time"]     = timeStr;
  jsonDoc["pm25"]     = pm25Val;
  jsonDoc["pm10"]     = pm10Val;
  jsonDoc["OAQIndex"] = OAQIndex;
  jsonDoc["level"]    = level;

  String requestBody;
  serializeJson(jsonDoc, requestBody);

  Serial.print(F("Sending POST to: "));
  Serial.println(host);
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
}

// --------------------------------------------------
// UPDATE SENSOR STATUS
// --------------------------------------------------
void updateSensorStatus(String pms5003Status) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("WiFi not connected!"));
    return;
  }
  
  WiFiClient client; // Or WiFiClient if your local host is HTTP
  HTTPClient http;

  String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
  http.begin(client, url);

  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> jsonDoc;
  jsonDoc["pms5003"] = pms5003Status;
  String requestBody;
  serializeJson(jsonDoc, requestBody);

  Serial.print(F("Sending PATCH to: "));
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
    Serial.print(F("Error sending PATCH request. Code: "));
    Serial.println(httpResponseCode);
  }

  http.end();
}
