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

// ==================== I2C PINS =======================
const int sclPin = D1;
const int sdaPin = D2;

// ==================== SENSOR OBJECTS =================
Adafruit_BME680 bme;
BH1750 lightMeter;

// ==================== WIFI & SERVER ==================
const char* ssid = "AccessPoint";
const char* password = "IoT@2025";
const char* host = "http://192.168.45.196";
const int port = 8000;
const char* sensors = "/sensors";
const char* devices = "/devices/classroom/";

// ==================== GLOBALS ========================
float temperature, humidity, voc, IAQIndex, lux;
float ppm;
int heatIndex;
String indoorAir, tempLabel, lightLabel, recordTime;
const String classroom = "402";

// ==================== GPIO PINS ======================
#define alertPin D8
#define TempPin D0
#define LightingPin D5
#define BME_RESET_PIN D7

// ==================== TRACK STATES ===================
bool isBMEActive = true;  // BME680 status
bool isBHActive  = true;  // BH1750 status
int frozenCount  = 0;     // For BME680 freeze detection

// ==================== OFFSETS ========================
const float heatIndexOffsetC = 0.0;  // e.g. +2 °C
const float IAQOffset        = 170.0; // e.g. +50 IAQ

// ============== FORWARD DECLARATIONS ================
void wifiInit();
void checkBME680();
void checkBH1750();
void resetI2CBus();
void resetBME680();
void reinitializeSensors();

void bme680Readings();
void luxFunc();

void sendDataToServer(String, String, float, float, float, float, float, float, int, String, String);

int calculateHeatIndex(float tempC, float relHumidity);
float calculateIAQ(float gasResistance);
float calculatePPM(float gasResistance);
String getFormattedTime();

void setActive();
void bmeActive();
void bmeInactive();
void bhActive();
void bhInactive();

// =====================================================
void setup() {
    Serial.begin(9600);
    Serial.println(F("Please Wait..."));

    // Wi-Fi
    wifiInit();
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    // Pin setup
    pinMode(BME_RESET_PIN, OUTPUT);
    pinMode(alertPin, OUTPUT);
    pinMode(TempPin, OUTPUT);
    pinMode(LightingPin, OUTPUT);
    digitalWrite(BME_RESET_PIN, HIGH);
    digitalWrite(alertPin, LOW);
    digitalWrite(TempPin, LOW);
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
  // Continuously check sensors
  checkBME680();
  checkBH1750();

  // Only read BH1750 if active
  if (isBHActive) {
    // BH1750 reading
    luxFunc();

    // Print BH1750 data under its own heading
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

  // Only read BME680 if active
  if (isBMEActive) {
    // 1) Read raw data
    bme680Readings();

    // 2) Compute derived metrics
    heatIndex = calculateHeatIndex(temperature, humidity);
    IAQIndex  = calculateIAQ(voc);
    ppm       = calculatePPM(voc);

    // 3) Decide indoorAir label (based on IAQIndex) & tempLabel (based on heatIndex)
    //    (If you prefer the "Good"/"Bad" logic in bme680Readings, you can remove it there.)
    if (IAQIndex <= 100) {
      indoorAir = "Good";
    } else {
      indoorAir = "Bad";
    }
    if (heatIndex <= 27) {
      tempLabel = "Good";
    } else {
      tempLabel = "Bad";
    }

  } else {
    Serial.println(F("BME680 is INACTIVE, skipping bme680Readings()..."));
  }

  // Get time
  recordTime = getFormattedTime();
  Serial.print(F("Current Time: "));
  Serial.println(recordTime);

  // If at least one sensor is active, we can send data
  if (isBHActive || isBMEActive) {
    sendDataToServer(
      classroom, recordTime, 
      temperature, humidity,
      voc, IAQIndex, lux, ppm,
      heatIndex, indoorAir, tempLabel
    );
  } else {
    Serial.println(F("No active sensors, skipping sendDataToServer()..."));
  }

  delay(2000);
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
            Serial.println(F("✅ BH1750 has reconnected!"));
            isBHActive = true;
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
  temperature = bme.readTemperature();
  if (!isnan(temperature)) {
    Serial.print(F("Temperature: "));
    Serial.print(temperature);
    Serial.println(F(" *C"));
  } else {
    Serial.println(F("Failed to read temperature"));
  }

  // ---------- Humidity ----------
  humidity = bme.readHumidity();
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
  if (heatIndex <= 27) {
    tempLabel = "Good";
  } else if (heatIndex <= 37) {
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
  } else if (IAQIndex <= 150) {
    indoorAir = "Bad";
  } else if (IAQIndex <= 200) {
    indoorAir = "Bad";
  } else if (IAQIndex <= 300) {
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
    lux = lightMeter.readLightLevel() + 200;
    if (lux >= 300 && lux <= 500) {
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
  http.begin(client, url.c_str());

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
    const float R_max = 200.0;
    const float R_min = 10.0;
    const int IAQ_max = 650;
    const int IAQ_min = 0.0;

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
        return 0.0;
    }
    float ppmVal = scalingFactor * ((cleanAirResistance / gasResistance) - 1);
    if (ppmVal < 0.0) ppmVal = 0.0;
    return ppmVal;
}

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

// =====================================================
// MARK DEVICE ACTIVE
// =====================================================
void setActive() {
    HTTPClient http;
    WiFiClient client;
    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    http.begin(client, url.c_str());

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["status"] = "ACTIVE";
    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.POST(jsonPayload);

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
    http.begin(client, url.c_str());

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bme680"] = "ACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.POST(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

void bmeInactive() {
    HTTPClient http;
    WiFiClient client;

    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    http.begin(client, url.c_str());

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bme680"] = "INACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.POST(jsonPayload);

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
    http.begin(client, url.c_str());

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bh1750"] = "ACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.POST(jsonPayload);

    Serial.print("Response Code: ");
    Serial.println(responseCode);
    http.end();
}

void bhInactive() {
    HTTPClient http;
    WiFiClient client;

    String url = String(host) + ":" + String(port) + String(devices) + String(classroom);
    http.begin(client, url.c_str());

    StaticJsonDocument<200> jsonDoc;
    String jsonPayload;

    jsonDoc["bh1750"] = "INACTIVE";

    serializeJson(jsonDoc, jsonPayload);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.POST(jsonPayload);

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
