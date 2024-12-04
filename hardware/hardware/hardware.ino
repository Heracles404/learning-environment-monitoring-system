#include <Wire.h>

// Inclusions for ESP01
#include <SoftwareSerial.h>

// Inclusions for BME
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

// Inclusions for BH1750
#include <BH1750.h>
#include <Wire.h>

// ESP01 Components
SoftwareSerial ESP8266(2, 3); // RX, TX

// BME Components
Adafruit_BME680 bme;

// BH1750 Components
BH1750 lightMeter;

// ESP01 Variables
const char* wifiSSID = "PLDTHOMEFIBR2X9KX";
const char* wifiPassword = "PLDTWIFID4kzQ";

// BME Variables
float Temperature;
float Humidity;
float Pressure;
float Gas;
float Altitude;


void setup() {
  Serial.begin(115200); // Initialize serial communication
  Serial.println(F("Please Wait..."));

  // Wifi Setup
  ESP8266.begin(115200);
  wifiInit();

  // BME Setup
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

  // BH1750 Set up
  Wire.begin();
  lightMeter.begin();
}

void loop() {
  Serial.println(F("--------------------------------"));
  bme680Readings(); 
  lux();
  delay(4000);
}

void wifiInit(){  
  // WiFi connection setup
  ESP8266.println("AT+RST");
  delay(1000);
  ESP8266.println("AT+CWMODE=3");
  delay(1000);

  // Connect to WiFi
  ESP8266.print("AT+CWJAP=\"");
  ESP8266.print(wifiSSID);
  ESP8266.print("\",\"");
  ESP8266.print(wifiPassword);
  ESP8266.println("\"");
  ESP8266.setTimeout(5000);

  // Wait for connection
  while (!ESP8266.find("WIFI CONNECTED")) {
    Serial.print(".");
  }
  Serial.println("WiFi Connected!");
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


  Serial.print(F("Health Concern Level: "));
  // IAQ based on Gas Resistance
  if ((Gas > 0) && (Gas <= 50)) {
    Serial.println(F("GOOD"));
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
  delay(1000);
}


void lux() {
  float lux = lightMeter.readLightLevel();
  Serial.print("Light: ");
  Serial.print(lux);
  Serial.println(" lx");
  delay(1000);
}


