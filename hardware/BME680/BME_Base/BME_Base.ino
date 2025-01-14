#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

Adafruit_BME680 bme;

float Temperature;
float Humidity;
float Pressure;
float Gas;

void setup() {
  Serial.begin(9600); // Initialize serial communication

  if (!bme.begin(0x77)) {  // Make sure the sensor initializes
    Serial.println(F("BME680 not found!"));
    while (1);
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320°C for 150 ms
}

void loop() {
  Serial.println(F("--------------------------------"));
  bme680Readings();  // Call the readings function
  delay(4000);
}

void bme680Readings() {
  Temperature = bme.readTemperature();
  if (isnan(Temperature)) {
    Serial.println(F("Failed to read temperature"));
  } else {
    Serial.print(F("Temperature: "));
    Serial.print(Temperature);
    Serial.println(F(" *C"));
  }

  Humidity = bme.readHumidity();
  if (isnan(Humidity)) {
    Serial.println(F("Failed to read humidity"));
  } else {
    Serial.print(F("Humidity: "));
    Serial.print(Humidity);
    Serial.println(F(" %"));
  }

  Gas = (bme.gas_resistance / 1000.0);  // Convert gas resistance to kOhms
  if (isnan(Gas)) {
    Serial.println(F("Failed to read gas resistance"));
  } else {
    Serial.print(F("Gas Resistance: "));
    Serial.print(Gas);
    Serial.println(F(" kOhms"));
  }
}
