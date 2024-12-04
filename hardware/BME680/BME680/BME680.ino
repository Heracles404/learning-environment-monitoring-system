#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"


Adafruit_BME680 bme;

float Temperature;
float Humidity;
float Pressure;
float Gas;
float Altitude;

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

  Gas = (bme.gas_resistance / 1000.0);
  if (isnan(Gas)) {
    Serial.println(F("Failed to read gas resistance"));
  } else {
    Serial.print(F("Gas Resistance: "));
    Serial.print(Gas);
    Serial.println(F(" kOhms"));
  }


  Serial.println(F("Health Concern Level:"));
  // IAQ based on Gas Resistance
  if ((Gas > 0) && (Gas <= 50)) {
    Serial.println(F(" GOOD"));
  } else if ((Gas > 51) && (Gas <= 100)) {
    Serial.println(F("MODERATE"));
  } else if ((Gas > 101) && (Gas <= 150)) {
    Serial.println(F("UNHEALTHY FOR SENSITIVE GROUPS"));
  } else if ((Gas > 151) && (Gas <= 200)) {
    Serial.println(F("UNHEALTHY"));
  } else if ((Gas > 201) && (Gas <= 300)) {
    Serial.println(F("VERY UNHEALTHY"));
  } else if ((Gas > 301) && (Gas <= 500)) {
    Serial.println(F("HAZARDOUS"));
  }
}



