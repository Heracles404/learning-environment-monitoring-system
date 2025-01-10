#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "Adafruit_BME680.h"
#include <BH1750.h>
#include "time.h"

// Time Components
const char* ntpServer = "time.nist.gov"; // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;     // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;        // No daylight saving time

// WiFi Credentials
const char* ssid = "TP-Link_883A";
const char* password = "95379951";

// Server Components
const char* host = "http://192.168.0.100";
const int port = 8000;
const char* endpoint = "/sensors";

// Sensor Components
Adafruit_BME680 bme;
BH1750 lightMeter;

#define alertPin D3
float temperature, humidity, voc, IAQIndex, lux;
int heatIndex;
String indoorAir, temp, CurrentTime;  // Global CurrentTime variable
int lastPostHour = -1;  // To track when the last post was made
int lastPostMinute = -1;  // To track the last post minute

// Forward declaration of wifiInit function
void wifiInit();  

void setup() {
  Serial.begin(9600); 
  Serial.println(F("System Starting..."));

  // Initialize WiFi
  wifiInit();

  // Initialize Time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // Initialize Sensors
  Wire.begin(D2, D1); // SDA, SCL for ESP8266
  if (!bme.begin(0x77)) {
    Serial.println(F("BME680 initialization failed!"));
    while (1);
  }

  lightMeter.begin();

  // Initialize alert pin
  pinMode(alertPin, OUTPUT);
  digitalWrite(alertPin, HIGH); // Default state
}

void loop() {
  // Update Time
  updateTime();

  // Get the current hour and minute
  int currentHour = getCurrentHour();
  int currentMinute = getCurrentMinute();

  // Define target times
  int targetHour1 = 14;  // 3:00 PM
  int targetMinute1 = 17; // 36 minutes

  int targetHour2 = 14;  // 3:00 PM
  int targetMinute2 = 45; // 45 minutes

  int targetHour3 = 14;  // 3:00 PM
  int targetMinute3 = 0; // 0 minutes

  // Updated condition to check for 3 specific post times
  if ((currentHour == targetHour1 && currentMinute == targetMinute1 && lastPostMinute != currentMinute) ||
      (currentHour == targetHour2 && currentMinute == targetMinute2 && lastPostMinute != currentMinute) ||
      (currentHour == targetHour3 && currentMinute == targetMinute3 && lastPostMinute != currentMinute)) {
    
    // Gather Sensor Readings
    bme680Readings();
    luxFunc();

    // Send Data
    sendDataToServer(CurrentTime, temperature, humidity, voc, IAQIndex, lux, heatIndex, indoorAir, temp);

    // Update last post minute to prevent duplicate posts
    lastPostMinute = currentMinute;

    // Alert Conditions
    checkAlerts();
  }

  delay(60000); // Delay for 1 minute to check time again
}

void wifiInit() {
  Serial.printf("Connecting to %s\n", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("...");
  }
  Serial.println("\nWiFi connected");
  Serial.printf("IP address: %s\n", WiFi.localIP().toString().c_str());
}

void updateTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println(F("Failed to obtain time"));
    return;
  }

  // Convert to 12-hour format and determine AM/PM
  int hour = timeinfo.tm_hour;
  String ampm = "AM";
  if (hour >= 12) {
    ampm = "PM";
    if (hour > 12) {
      hour -= 12;
    }
  } else if (hour == 0) {
    hour = 12; // Midnight case
  }

  // Format time into a readable string (hour and minute only)
  char buffer[64];
  snprintf(buffer, sizeof(buffer), "%02d:%02d %s", hour, timeinfo.tm_min, ampm.c_str());
  CurrentTime = String(buffer);  // Save formatted time to CurrentTime

  Serial.printf("Current Time: %s\n", CurrentTime.c_str());
}

int getCurrentHour() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println(F("Failed to obtain time"));
    return -1;
  }
  return timeinfo.tm_hour;  // Get current hour
}

int getCurrentMinute() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println(F("Failed to obtain time"));
    return -1;
  }
  return timeinfo.tm_min;  // Get current minute
}

void bme680Readings() {
  temperature = bme.readTemperature();
  humidity = bme.readHumidity();
  voc = (bme.gas_resistance / 1000.0); // Convert to kOhms
  heatIndex = calculateHeatIndex(temperature, humidity);
  IAQIndex = calculateIAQ(voc);

  Serial.printf("Temperature: %.2f °C, Humidity: %.2f%%, VOC: %.2f kOhms, Heat Index: %d °C\n",
                temperature, humidity, voc, heatIndex);
  indoorAir = classifyAirQuality(IAQIndex);
  temp = classifyHeatIndex(heatIndex);
}

void luxFunc() {
  lux = lightMeter.readLightLevel();
  Serial.printf("Light Intensity: %.2f lx\n", lux);
}

void sendDataToServer(String time, float temperature, float humidity, float voc, float IAQIndex, float lux, int heatIndex, String indoorAir, String temp) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;
    String url = String(host) + ":" + String(port) + endpoint;
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> jsonDoc;
    jsonDoc["time"] = time;  // Use CurrentTime
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
    Serial.printf("Sending data: %s\n", requestBody.c_str());

    int httpResponseCode = http.POST(requestBody);
    if (httpResponseCode > 0) {
      Serial.printf("Server Response Code: %d\n", httpResponseCode);
    } else {
      Serial.printf("Error Code: %d\n", httpResponseCode);
    }

    http.end();
  } else {
    Serial.println(F("WiFi disconnected, unable to send data"));
  }
}

void checkAlerts() {
  if (indoorAir == "HAZARDOUS" || temp == "EXTREME DANGER") {
    digitalWrite(alertPin, LOW); // Activate alert
    Serial.println(F("Alert: Hazardous conditions detected!"));
  } else {
    digitalWrite(alertPin, HIGH); // Deactivate alert
    Serial.println(F("Alert: Conditions normal"));
  }
}

int calculateHeatIndex(float T, float H) {
  return round(-8.78469475556 + (1.61139411 * T) + (2.33854883889 * H) + (-0.14611605 * T * H) + 
                (-0.012308094 * T * T) + (-0.0164248277778 * H * H) + (0.002211732 * T * T * H) + 
                (0.00072546 * T * H * H) + (-0.000003582 * T * T * H * H));
}

float calculateIAQ(float GasResistance) {
  const float R_max = 500.0, R_min = 10.0;
  const int IAQ_max = 500, IAQ_min = 0;
  return ((log(R_max / GasResistance) * (IAQ_max - IAQ_min)) / log(R_max / R_min));
}

String classifyAirQuality(float IAQ) {
  if (IAQ <= 50) return "GOOD";
  if (IAQ <= 100) return "MODERATE";
  if (IAQ <= 150) return "UNHEALTHY FOR SENSITIVE GROUPS";
  if (IAQ <= 200) return "UNHEALTHY";
  if (IAQ <= 300) return "VERY UNHEALTHY";
  return "HAZARDOUS";
}

String classifyHeatIndex(int HI) {
  if (HI <= 27) return "NOT HAZARDOUS";
  if (HI <= 32) return "CAUTION";
  if (HI <= 41) return "EXTREME CAUTION";
  if (HI <= 51) return "DANGER";
  return "EXTREME DANGER";
}
