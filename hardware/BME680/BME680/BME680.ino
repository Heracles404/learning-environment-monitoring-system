#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>

Adafruit_BME680 bme;  // Create an instance of the BME680 sensor

// Define constants
float hum_weighting = 0.25; // Humidity effect as 25% of the total air quality score
float gas_weighting = 0.75; // Gas effect as 75% of the total air quality score
float gas_reference = 2500; // Reference gas resistance
float hum_reference = 40;   // Optimal humidity level
int gas_lower_limit = 10000;  // Bad air quality limit for gas resistance
int gas_upper_limit = 300000; // Good air quality limit for gas resistance

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

  Serial.println(F("BME680 IAQ Sensor Initialized"));
}

void loop() {
  // Start a reading
  if (bme.performReading()) {
    // Get sensor values
    float temperature = bme.temperature;
    float humidity = bme.humidity;
    float pressure = bme.pressure / 100.0; // Pressure in hPa
    float gasResistance = bme.gas_resistance;

    // Calculate humidity score
    int humidity_score;
    if (humidity >= 38 && humidity <= 42) {
      humidity_score = hum_weighting * 100; // Optimal humidity range
    } else if (humidity < 38) {
      humidity_score = hum_weighting / hum_reference * humidity * 100;
    } else {
      humidity_score = ((-hum_weighting / (100 - hum_reference) * humidity) + 0.416666) * 100;
    }

    // Calculate gas score
    int gas_score = (gas_weighting / (gas_upper_limit - gas_lower_limit) * gasResistance - 
                    (gas_lower_limit * (gas_weighting / (gas_upper_limit - gas_lower_limit)))) * 100;
    if (gas_score > 75) gas_score = 75;
    if (gas_score < 0) gas_score = 0;

    // Combine results for the final IAQ score
    float air_quality_score = humidity_score + gas_score;

    // Determine air quality category
    String IAQ_category;
    int IAQ_score = (100 - air_quality_score) * 5;
    if (IAQ_score >= 301) IAQ_category = "Hazardous";
    else if (IAQ_score >= 201) IAQ_category = "Very Unhealthy";
    else if (IAQ_score >= 176) IAQ_category = "Unhealthy";
    else if (IAQ_score >= 151) IAQ_category = "Unhealthy for Sensitive Groups";
    else if (IAQ_score >= 51) IAQ_category = "Moderate";
    else IAQ_category = "Good";

    // Print sensor readings and calculated scores
    Serial.println(F("Sensor Readings:"));
    Serial.print(F("  Temperature: "));
    Serial.print(temperature);
    Serial.println(F(" °C"));

    Serial.print(F("  Humidity: "));
    Serial.print(humidity);
    Serial.println(F(" %"));

    Serial.print(F("  Pressure: "));
    Serial.print(pressure);
    Serial.println(F(" hPa"));

    Serial.print(F("  Gas Resistance: "));
    Serial.print(gasResistance / 1000.0);
    Serial.println(F(" KOhms"));

    Serial.print(F("Humidity Score: "));
    Serial.print(humidity_score);
    Serial.println(F(" %"));

    Serial.print(F("Gas Score: "));
    Serial.print(gas_score);
    Serial.println(F(" %"));

    Serial.print(F("Air Quality Score: "));
    Serial.print(air_quality_score);
    Serial.println(F(" %"));

    Serial.print(F("Air Quality Category: "));
    Serial.println(IAQ_category);

    Serial.println(F("-------------------------------------------"));
    delay(4000);  // Delay before the next reading
  } else {
    Serial.println(F("Failed to perform reading"));
  }
}
