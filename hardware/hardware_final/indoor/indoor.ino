#include <Wire.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"
#include <BH1750.h>
#include "time.h"

// ==================== TIME CONFIG ====================
const char* ntpServer = "time.nist.gov";
const long gmtOffset_sec = 8 * 3600;
const int daylightOffset_sec = 0;
int getCurrentHour();
int getCurrentMinute();
String getFormattedTime();


// ==================== I2C PINS =======================
const int sclPin = D1;
const int sdaPin = D2;

// ==================== SENSOR OBJECTS =================
Adafruit_BME680 bme;
BH1750 lightMeter;

// ==================== WIFI & SERVER ==================
// const char* ssid = "ESLIHS Office_DECO_Guest";
// const char* password = "MCLems@2025!";

const char* ssid = "TP-Link_CB9E";
const char* password = "60848431";

const char* host = "http://147.93.52.170";
const int port = 8000;
const char* sensors = "/sensors";                     
const char* devices = "/devices/classroom/";

// ==================== GLOBALS ========================
float temperature, humidity, voc, IAQIndex, lux;
float ppm;
int heatIndex;
String indoorAir, tempLabel, lightLabel, recordTime;
const String classroom = "MMCL_E311";
// Global or static variable to track blinking state
bool alertTriggered = false;

// ==================== GPIO PINS ======================
#define alertPin D8
const int D0_LED_Pin = D0;  // We're using D0 as the output
#define LightingPin D5
#define BME_RESET_PIN D7

// ==================== TRACK STATES ===================
bool isBMEActive = true;  // BME680 status
bool isBHActive  = true;  // BH1750 status
int frozenCount  = 0;     // For BME680 freeze detection

// ==================== OFFSETS ========================
const float heatIndexOffsetC = 0.0;  // e.g. +2 °C
const float IAQOffset        = 170.0; // e.g. +50 IAQ


// =====================================================
void setup() {
    Serial.begin(9600);
    Serial.println(F("Please Wait..."));

    // Wi-Fi
    wifiInit();
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    // BUZZER
    pinMode(D0_LED_Pin, OUTPUT);
    digitalWrite(D0_LED_Pin, LOW); // default to LOW

  // If you're using the LightingPin for something else:
    pinMode(LightingPin, OUTPUT);
    digitalWrite(LightingPin, LOW);

    // Pin setup
    pinMode(BME_RESET_PIN, OUTPUT);
    pinMode(alertPin, OUTPUT);
    
    pinMode(LightingPin, OUTPUT);
    digitalWrite(BME_RESET_PIN, HIGH);
    digitalWrite(alertPin, LOW);
    
    digitalWrite(LightingPin, LOW);

    // Initialize I2C
    Wire.begin(sdaPin, sclPin);

    // BH1750
    if (!lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x23, &Wire)) {
        Serial.println(F("BH1750 not detected!"));
        isBHActive = false;
    } else {
        Serial.println(F("BH1750 initialized successfully."));
        isBHActive = true;
    }

    // BME680
    if (!bme.begin(0x77)) {
        Serial.println(F("BME680 not found!"));
        isBMEActive = false;
    } else {
        bme.setTemperatureOversampling(BME680_OS_8X);
        bme.setHumidityOversampling(BME680_OS_2X);
        bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
        bme.setGasHeater(320, 150);
        Serial.println(F("BME680 initialized successfully."));
        isBMEActive = true;
    }

    // Mark device as ACTIVE in your system
    setActive();
}

// =====================================================
void loop() {

  checkBME680();
  checkBH1750();
  
  int currentHour = getCurrentHour();
  int currentMinute = getCurrentMinute();
  String formattedTime = getFormattedTime();

  static int lastPostHour = -1; 
  static bool alertTriggered = false; 

  // --- HOURLY SENSOR READINGS & DATA SEND ---
  if (currentMinute == 0 && currentHour != lastPostHour) {
    Serial.println("Hourly Trigger at: " + formattedTime);

    // Hourly sensor readings
    bme680Readings();
    luxFunc();

    // Compute derived metrics hourly
    heatIndex = calculateHeatIndex(temperature, humidity);
    IAQIndex  = calculateIAQ(voc);
    ppm       = calculatePPM(voc);

    indoorAir = (IAQIndex <= 20) ? "Good" : "Bad";
    tempLabel = (heatIndex <= 20) ? "Good" : "Bad";

    // Send data explicitly once per hour
    sendDataToServer(
      classroom, formattedTime, 
      temperature, humidity,
      voc, IAQIndex, lux, ppm,
      heatIndex, indoorAir, tempLabel
    );

    Serial.println("Hourly data sent at: " + formattedTime);
    lastPostHour = currentHour;
  }

  // --- Your existing continuous threshold & alert checks ---
  //checkBME680();
  //checkBH1750();

  bool thresholdExceeded = (lux > 1500) || (heatIndex > 45) || (ppm > 1000);

  if (thresholdExceeded && !alertTriggered) {
    blinkThreeTimes();
    alertTriggered = true;
  } else if (!thresholdExceeded) {
    alertTriggered = false;
  }

  // Regular sensor checks for debugging (every second)
  if (isBHActive) {
    luxFunc();
    Serial.println(F("---- BH1750 Computed Values ----"));
    Serial.print(F("Light: "));
    Serial.print(lux);
    Serial.println(F(" lx"));
    Serial.print(F("lightRemarks: "));
    Serial.println(lightLabel);
    Serial.println();
  } else {
    Serial.println(F("BH1750 is INACTIVE, skipping luxFunc()..."));
  }

  if (isBMEActive) {
    bme680Readings();

    heatIndex = calculateHeatIndex(temperature, humidity);
    IAQIndex  = calculateIAQ(voc);
    ppm       = calculatePPM(voc);

    indoorAir = (IAQIndex <= 20) ? "Good" : "Bad";
    tempLabel = (heatIndex <= 20) ? "Good" : "Bad";
  } else {
    Serial.println(F("BME680 is INACTIVE, skipping bme680Readings()..."));
  }

  // Regular time log for debugging (every second)
  Serial.print(F("Current Time: "));
  Serial.println(formattedTime);

  delay(1000);
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
  strftime(buffer, sizeof(buffer), "%H:%M", &timeInfo);
  return String(buffer);
}


void blinkThreeTimes() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(D0, HIGH);
    delay(300);          // On for 300 ms
    digitalWrite(D0, LOW);
    delay(300);          // Off for 300 ms
  }
}


// =====================================================
// CHECK BME680: is it responding? Freeze detection?
// =====================================================
void checkBME680() {
    Wire.beginTransmission(0x77);
    if (Wire.endTransmission() != 0) {
        // Not responding on I2C
        if (isBMEActive) {
            Serial.println(F("❌ BME680 is now INACTIVE! Resetting I2C..."));
            isBMEActive = false;
            bmeInactive();
            resetI2CBus();
            reinitializeSensors();
        }
    } else {
        if (!isBMEActive) {
            Serial.println(F("✅ BME680 has reconnected!"));
            isBMEActive = true;
            bmeActive();
            resetI2CBus();
            reinitializeSensors();
        }

        // If active, check for freeze at 33.24°C
        float testTemp = bme.readTemperature();
        if (testTemp == 33.24) {
            frozenCount++;
            Serial.print(F("⚠️ WARNING: BME680 temperature frozen at 33.24°C! Count: "));
            Serial.println(frozenCount);

            if (frozenCount >= 3) {
                Serial.println(F("⚠️ BME680 is frozen! Resetting sensor..."));
                resetBME680();
                frozenCount = 0;
            }
        } else {
            frozenCount = 0;
        }
    }
}

// =====================================================
// CHECK BH1750: is it responding?
// =====================================================
void checkBH1750() {
    float testLux = lightMeter.readLightLevel();
    if (testLux == -1) {
        if (isBHActive) {
            Serial.println(F("❌ BH1750 is now INACTIVE! Resetting I2C..."));
            isBHActive = false;
            bhInactive();
            resetI2CBus();
            reinitializeSensors();
        }
    } else {
        if (!isBHActive) {     
            isBHActive = true;
            Serial.println(F("✅ BH1750 has reconnected!"));
            bhActive();
            resetI2CBus();
            reinitializeSensors();
        }
    }
}

// =====================================================
// BME680 READINGS (only if active)
// =====================================================
void bme680Readings() {
  // We'll print a heading to group all the BME680 values
  Serial.println(F("---- BME680 Computed Values ----"));

  // ---------- Temperature ----------
  temperature = bme.readTemperature(); //temp offset
  if (!isnan(temperature)) {
    Serial.print(F("Temperature: "));
    Serial.print(temperature);
    Serial.println(F(" *C"));
  } else {
    Serial.println(F("Failed to read temperature"));
  }

  // ---------- Humidity ----------
  humidity = bme.readHumidity() - 11.5; //humidity offset
  if (!isnan(humidity)) {
    Serial.print(F("Humidity: "));
    Serial.print(humidity);
    Serial.println(F(" %"));
  } else {
    Serial.println(F("Failed to read humidity"));
  }

  // ---------- Heat Index (with offset) ----------
  heatIndex = calculateHeatIndex(temperature, humidity);
  Serial.print(F("Heat Index: "));
  Serial.print(heatIndex);
  Serial.println(F(" *C"));

  // ---------- Temperature Concern Level ----------
  Serial.print(F("Temperature Concern Level: "));
  if (heatIndex <= 27) { // 27
    tempLabel = "Good";
  } else if (heatIndex > 41) { //37
    // If you like, you can subdivide further: <= 37, <= 40, etc.
    tempLabel = "Bad";
  } else {
    tempLabel = "Bad";
  }
  Serial.println(tempLabel);

  // ---------- Gas Resistance / VOC ----------
  voc = bme.gas_resistance / 1000.0; // in kOhms
  if (!isnan(voc)) {
    Serial.print(F("Gas Resistance: "));
    Serial.print(voc);
    Serial.println(F(" kOhms"));
  } else {
    Serial.println(F("Failed to read gas resistance"));
  }

  // ---------- IAQ Index (with offset) ----------
  IAQIndex = calculateIAQ(voc);
  Serial.print(F("IAQ Index: "));
  Serial.println(IAQIndex);

  // ---------- AQ Concern Level ----------
  Serial.print(F("AQ Concern Level: "));
  if (IAQIndex <= 50) {
    indoorAir = "Good";
  } else if (IAQIndex <= 100) {
    indoorAir = "Good";
  } else if (IAQIndex >= 101) { //150
    indoorAir = "Bad";
  } else if (IAQIndex <= 200) { //200
    indoorAir = "Bad";
  } else if (IAQIndex <= 300) { //300
    indoorAir = "Bad";
  } else {
    indoorAir = "Bad";
  }
  Serial.println(indoorAir);

  // ---------- PPM (approx) ----------
  ppm = calculatePPM(voc);
  Serial.print(F("VOC (approx): "));
  Serial.println(ppm);


  // (Optional) a blank line for spacing
  Serial.println();
}

// =====================================================
// BH1750 READINGS (only if active)
// =====================================================
void luxFunc() {
    lux = lightMeter.readLightLevel() + 1; // + 200 +200 light
    if (lux >= 300 && lux <= 500) { //300 % 500  && lux <= 200) 
        lightLabel = "Good";
        digitalWrite(LightingPin, LOW);
    } else {
        lightLabel = "Bad";
        digitalWrite(LightingPin, HIGH);
    }
}

// =====================================================
// SENDING DATA
// =====================================================
void sendDataToServer(
  String classroom, String recordTime,
  float temperature, float humidity,
  float voc, float IAQIndex, float lux,
  float ppm, int heatIndex,
  String indoorAir, String tempLabel
) {
  HTTPClient http;
  WiFiClient client;
  String url = String(host) + ":" + String(port) + String(sensors);
  http.begin(client, url);

  StaticJsonDocument<200> jsonDoc;
  String jsonPayload;

  // Always send classroom & time
  jsonDoc["classroom"] = classroom;
  jsonDoc["time"]      = recordTime;

  // ---------------------
  // BME680 fields
  // ---------------------
  if (isBMEActive) {
    // If BME680 is active, add these fields
    jsonDoc["temperature"] = temperature;
    jsonDoc["humidity"]    = humidity;
    jsonDoc["voc"]         = voc;
    jsonDoc["IAQIndex"]    = IAQIndex;
    jsonDoc["ppm"]         = ppm;
    jsonDoc["heatIndex"]   = heatIndex;
    jsonDoc["temp"]        = tempLabel;  // Good/Bad
    jsonDoc["indoorAir"]   = indoorAir;  // Good/Bad
  } 
  // If BME680 is INACTIVE, do NOT add them at all

  // ---------------------
  // BH1750 fields
  // ---------------------
  if (isBHActive) {
    // If BH1750 is active, add these fields
    jsonDoc["lighting"]     = lux;
    jsonDoc["lightRemarks"] = lightLabel; 
  } 
  // If BH1750 is INACTIVE, do NOT add them at all

  // ---------------------
  // Now serialize & send
  // ---------------------
  serializeJson(jsonDoc, jsonPayload);
  http.addHeader("Content-Type", "application/json");
  int responseCode = http.POST(jsonPayload);

  Serial.print(F("Sending POST request to: "));
  Serial.println(url);
  Serial.print(F("Payload: "));
  Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);
  if (httpResponseCode > 0) {
    Serial.print(F("Response code: "));
    Serial.println(httpResponseCode);
    Serial.print(F("Response: "));
    Serial.println(http.getString());
  } else {
    Serial.print(F("Error sending POST request. Code: "));
    Serial.println(httpResponseCode);
  }
  Serial.print(F("Response Code: "));
  Serial.println(responseCode);

  http.end();
}

// =====================================================
// CALCULATIONS
// =====================================================
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

    float HI_F = c1
               + (c2 * tempF)
               + (c3 * relHumidity)
               + (c4 * tempF * relHumidity)
               + (c5 * tempF * tempF)
               + (c6 * relHumidity * relHumidity)
               + (c7 * tempF * tempF * relHumidity)
               + (c8 * tempF * relHumidity * relHumidity)
               + (c9 * tempF * tempF * relHumidity * relHumidity);

    float HI_C = (HI_F - 32.0) * 5.0 / 9.0;
    HI_C -= heatIndexOffsetC;
    return round(HI_C);
}

float calculateIAQ(float gasResistance) {
    const float R_max = 500.0; //200
    const float R_min = 10.0;
    const int IAQ_max = 350; //650
    const int IAQ_min = 10.0;

    if (gasResistance < 1.0) gasResistance = 1.0;
    if (gasResistance < R_min) gasResistance = R_min;
    if (gasResistance > R_max) gasResistance = R_max;

    float logR     = log(R_max / gasResistance);
    float logRange = log(R_max / R_min);
    float IAQ      = (logR * (IAQ_max - IAQ_min)) / logRange + IAQ_min;

    IAQ -= IAQOffset;
    if (IAQ < IAQ_min) IAQ = IAQ_min;
    if (IAQ > IAQ_max) IAQ = IAQ_max;
    return IAQ;
}

float calculatePPM(float gasResistance) {
    const float cleanAirResistance = 100.0;
    const float scalingFactor      = 100.0;
    if (gasResistance <= 0.0) {
        return 10.0;
    }
    float ppmVal = scalingFactor * ((cleanAirResistance / gasResistance) - 1);
    if (ppmVal < 0.0) ppmVal = 10.0;
    return ppmVal;
}


// =====================================================
// MARK DEVICE ACTIVE
// =====================================================
void setActive() {
    HTTPClient http;
    WiFiClient client;
    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
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

// =====================================================
// BME680 ACTIVE/INACTIVE
// =====================================================
void bmeActive() {
    HTTPClient http;
    WiFiClient client;

    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    Serial.println(url);
    http.begin(client, url);

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bme680"] = "ACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.PATCH(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

void bmeInactive() {
    HTTPClient http;
    WiFiClient client;

    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    Serial.println(url);

    http.begin(client, url);

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bme680"] = "INACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.PATCH(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

// =====================================================
// BH1750 ACTIVE/INACTIVE
// =====================================================
void bhActive() {
    HTTPClient http;
    WiFiClient client;

    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    http.begin(client, url);

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bh1750"] = "ACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.PATCH(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

void bhInactive() {
    HTTPClient http;
    WiFiClient client;

    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    http.begin(client, url);

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bh1750"] = "INACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.PATCH(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

// =====================================================
// RESET I2C, REINITIALIZE, RESET BME680
// =====================================================
void resetI2CBus() {
    Serial.println(F("🔄 Resetting I2C bus..."));
    Wire.begin(D2, D1);
    delay(500);
}

void reinitializeSensors() {
    Serial.println(F("🔄 Reinitializing Sensors..."));

    // BH1750
    if (!lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x23, &Wire)) {
        Serial.println(F("❌ BH1750 reinitialization failed!"));
        isBHActive = false;
    } else {
        Serial.println(F("✅ BH1750 reinitialized successfully."));
        isBHActive = true;
    }

    // BME680
    if (!bme.begin(0x77)) {
        Serial.println(F("❌ BME680 reinitialization failed!"));
        isBMEActive = false;
    } else {
        Serial.println(F("✅ BME680 reinitialized successfully."));
        isBMEActive = true;
    }
}

void resetBME680() {
    Serial.println(F("🔄 Resetting BME680..."));
    digitalWrite(BME_RESET_PIN, LOW);
    delay(1000);
    digitalWrite(BME_RESET_PIN, HIGH);
    delay(500);

    resetI2CBus();
    if (bme.begin(0x77)) {
        Serial.println(F("✅ BME680 Reset Successful!"));
        isBMEActive = true;
    } else {
        Serial.println(F("❌ BME680 Reset Failed!"));
        isBMEActive = false;
    }
}

// =====================================================
// WIFI INIT
// =====================================================
void wifiInit() {
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
