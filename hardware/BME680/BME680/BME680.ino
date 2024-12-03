#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>

Adafruit_BME680 bme;  // Create an instance of the BME680 sensor

void setup() {
  Serial.begin(9600);
  
  // Initialize the sensor
  if (!bme.begin()) {
    Serial.println(F("Could not find a valid BME680 sensor, check wiring!"));
    while (1);
  }

  // Set up the sensor for sampling
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setGasHeater(320, 150);  // Heater settings (temperature in Celsius, time in ms)
  Serial.println(F("BME680 IAQ Sensor"));
}

void loop() {
  // Start a reading
  if (bme.performReading()) {
    // Get gas resistance value (lower means higher VOC concentration)
    uint16_t gasResistance = bme.gas_resistance;

    // Print the gas resistance value
    Serial.print(F("Gas Resistance: "));
    Serial.println(gasResistance / 1000);
    Serial.print(F(" KOhms"));
    // A simple way to estimate air quality based on gas resistance
    String airQuality;
    if (gasResistance < 50000) {
      airQuality = "Poor air quality (High VOCs)";
    } else if (gasResistance < 100000) {
      airQuality = "Moderate air quality";
    } else {
      airQuality = "Good air quality (Low VOCs)";
    }

    // Output air quality based on gas resistance
    Serial.print(F("Air Quality: "));
    Serial.println(airQuality);

    // Print other sensor data
    Serial.print(F("Temperature: "));
    Serial.print(bme.temperature);
    Serial.println(F(" C"));

    Serial.print(F("Humidity: "));
    Serial.print(bme.humidity);
    Serial.println(F(" %"));

    Serial.print(F("Pressure: "));
    Serial.print(bme.pressure / 100.0);  // Pressure in hPa
    Serial.println(F(" hPa"));

    delay(4000);  // Delay before the next reading
  } else {
    Serial.println(F("Failed to perform reading"));
  }
}
