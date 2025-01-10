#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

Adafruit_BME680 bme;

float Temperature;
float Humidity;
float Pressure;
float Gas;
float Altitude;
float IAQIndex;

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

  // Calculate IAQ based on gas resistance
  IAQIndex = calculateIAQ(Gas);

  Serial.print(F("IAQ Index: "));
  Serial.println(IAQIndex);

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
}

float calculateIAQ(float GasResistance) {
  // Define your maximum and minimum gas resistance values (in kOhms)
  const float R_max = 500.0;   // Maximum gas resistance (worst air quality)
  const float R_min = 10.0;    // Minimum gas resistance (best air quality)
  
  // Define IAQ range
  const int IAQ_max = 500;    // Maximum IAQ index (best air quality)

  float logR = log(R_max / GasResistance);  
  float IAQ = (logR * (IAQ_max - IAQ_min)) / log(R_max / R_min); 
  return IAQ;
}
