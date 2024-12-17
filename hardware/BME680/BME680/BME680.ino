#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"
#include <ESP8266WiFi.h>

Adafruit_BME680 bme;

// Wi-Fi credentials
const char* ssid = "IoT";           // Replace with your SSID
const char* password = "AccessPoint.2024";   // Replace with your Password

float Temperature, Humidity, Gas, IAQIndex;

void setup() {
  Serial.begin(9600);
  Wire.begin(4, 5);  // Custom I2C pins: SDA = GPIO 4, SCL = GPIO 5

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi!");
  Serial.print("IP Address: "); Serial.println(WiFi.localIP());

  // Initialize BME680
  if (!bme.begin(0x77)) {
    Serial.println(F("BME680 not found! Check wiring."));
    while (1);
  }
  Serial.println(F("BME680 sensor initialized successfully."));

  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150);  // 320°C for 150 ms
}

void loop() {
  if (bme.performReading()) {
    Temperature = bme.temperature;
    Humidity = bme.humidity;
    Gas = bme.gas_resistance / 1000.0;  // Convert to kOhms
    IAQIndex = calculateIAQ(Gas);

    Serial.println(F("--------------------------------"));
    Serial.print(F("Temperature: ")); Serial.print(Temperature); Serial.println(F(" *C"));
    Serial.print(F("Humidity: ")); Serial.print(Humidity); Serial.println(F(" %"));
    Serial.print(F("Gas Resistance: ")); Serial.print(Gas); Serial.println(F(" kOhms"));
    Serial.print(F("IAQ Index: ")); Serial.println(IAQIndex);

    // Health Concern Level
    Serial.println(F("Health Concern Level:"));
    if (IAQIndex >= 0 && IAQIndex <= 50) {
      Serial.println(F("GOOD"));
    } else if (IAQIndex > 50 && IAQIndex <= 100) {
      Serial.println(F("AVERAGE"));
    } else if (IAQIndex > 100 && IAQIndex <= 150) {
      Serial.println(F("LITTLE BAD"));
    } else if (IAQIndex > 150 && IAQIndex <= 200) {
      Serial.println(F("BAD"));
    } else if (IAQIndex > 200 && IAQIndex <= 300) {
      Serial.println(F("WORSE"));
    } else if (IAQIndex > 300 && IAQIndex <= 500) {
      Serial.println(F("VERY BAD"));
    }
  } else {
    Serial.println(F("Failed to perform reading!"));
  }
  delay(4000);
}

float calculateIAQ(float GasResistance) {
  const float R_max = 500.0, R_min = 10.0;
  float IAQ = map(GasResistance, R_min, R_max, 0, 500);
  return constrain(IAQ, 0, 500);
}
