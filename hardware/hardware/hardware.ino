#include <Wire.h>

// Inclusions for ESP01
#include <SoftwareSerial.h>

// API Inclusions
#include <ArduinoJson.h>

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
const char* ssid = "IoT";
const char* password = "AccessPoint.2024";

// API Components
const char* host = "192.168.68.100";  // Remove "http://"
const int port = 8000;
const char* endpoint = "/sensors";

// Variables
float temperature, humidity, voc, IAQIndex, lux;
int heatIndex;
String indoorAir, temp;


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
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320°C for 150 ms

  // BH1750 Set up
  Wire.begin();
  lightMeter.begin();
}

void loop() {
  Serial.println(F("--------------------------------"));
  bme680Readings(); 
  luxFunc();
  sendDataToServer(temperature, humidity, voc, lux, IAQIndex, heatIndex, indoorAir, temp);
  delay(3000);
}

void wifiInit(){  
  // WiFi connection setup
  ESP8266.println("AT+RST");
  delay(1000);
  ESP8266.println("AT+CWMODE=3");
  delay(1000);

  // Connect to WiFi
  ESP8266.print("AT+CWJAP=\"");
  ESP8266.print(ssid);
  ESP8266.print("\",\"");
  ESP8266.print(password);
  ESP8266.println("\"");
  ESP8266.setTimeout(5000);

  // Wait for connection
  while (!ESP8266.find("WIFI CONNECTED")) {
    Serial.print(".");
  }
  Serial.println("WiFi Connected!");
}

void bme680Readings() {
  temperature = bme.readTemperature();
  if (isnan(temperature)) {
    Serial.println(F("Failed to read temperature"));
  } else {
    Serial.print(F("Temperature: "));
    Serial.print(temperature);
    Serial.println(F(" *C"));
  }

  humidity = bme.readHumidity();
  if (isnan(humidity)) {
    Serial.println(F("Failed to read humidity"));
  } else {
    Serial.print(F("Humidity: "));
    Serial.print(humidity);
    Serial.println(F(" %"));
  }

   // Heat Index Calculation
  heatIndex = calculateHeatIndex(temperature, humidity);
  Serial.print(F("Heat Index: "));
  Serial.print(heatIndex);
  Serial.println(F(" *C")); 

  Serial.print(F("Temperature Concern Level: "));
  if ((heatIndex >= 18) && (heatIndex <= 22)) {
    temp = "COOL";
  } else if ((heatIndex > 22) && (heatIndex <= 27)) {
    temp = "COMFORTABLE";
  } else if ((heatIndex > 27) && (heatIndex <= 30)) {
    temp = "WARM";
  } else if ((heatIndex > 30) && (heatIndex <= 33)) {
    temp = "UNCOMFORTABLY HOT";
  } else if (heatIndex > 33) {
    temp = "EXTREMELY HOT";
  } else if (heatIndex < 18) {
    temp = "COLD";
  }
  Serial.println(temp);

  voc = (bme.gas_resistance / 1000.0);
  if (isnan(voc)) {
    Serial.println(F("Failed to read gas resistance"));
  } else {
    Serial.print(F("Gas Resistance: "));
    Serial.print(voc);
    Serial.println(F(" kOhms"));
  }

  IAQIndex = calculateIAQ(voc);

  Serial.print(F("IAQ Index: "));
  Serial.println(IAQIndex);

  Serial.print(F("AQ Concern Level: "));
  // IAQ based on Gas Resistance
  if ((IAQIndex > 0) && (IAQIndex <= 50)) {
    indoorAir = "GOOD";
  } else if ((IAQIndex > 51) && (IAQIndex <= 100)) {
    indoorAir = "MODERATE";
  } else if ((IAQIndex > 101) && (IAQIndex <= 150)) {
    indoorAir = "UNHEALTHY FOR SENSITIVE GROUPS";
  } else if ((IAQIndex > 151) && (IAQIndex <= 200)) {
    indoorAir = "UNHEALTHY";
  } else if ((IAQIndex > 201) && (IAQIndex <= 300)) {
    indoorAir = "VERY UNHEALTHY";
  } else if ((IAQIndex > 301) && (IAQIndex <= 500)) {
    indoorAir = "HAZARDOUS";
  }
  Serial.println(indoorAir);

  delay(4000);
}

float calculateIAQ(float GasResistance) {
  // Define your maximum and minimum gas resistance values (in kOhms)
  const float R_max = 500.0;   // Maximum gas resistance (worst air quality)
  const float R_min = 10.0;    // Minimum gas resistance (best air quality)
  
  // Define IAQ range
  const int IAQ_max = 500;   // Maximum IAQ index (best air quality)
  const int IAQ_min = 0;     // Minimum IAQ index (worst air quality)

  // Logarithmic mapping of gas resistance to IAQ index
  float logR = log(R_max / GasResistance);  // Logarithmic transformation
  float IAQ = (logR * (IAQ_max - IAQ_min)) / log(R_max / R_min);  // Calculate IAQ index

  return IAQ;
}

void luxFunc() {
  lux = lightMeter.readLightLevel();
  Serial.print("Light: ");
  Serial.print(lux);
  Serial.println(" lx");
  delay(1000);
}

int calculateHeatIndex(float T, float H) {
  // Heat Index calculation based on temperature (T) and humidity (H)
  // Formula Constants
  float c1 = -8.78469475556;
  float c2 = 1.61139411;
  float c3 = 2.33854883889;
  float c4 = -0.14611605;
  float c5 = -0.012308094;
  float c6 = -0.0164248277778;
  float c7 = 0.002211732;
  float c8 = 0.00072546;
  float c9 = -0.000003582;

  // Calculate the Heat Index
  float HI = c1 + (c2 * T) + (c3 * H) + (c4 * T * H) + (c5 * T * T) + (c6 * H * H) + (c7 * T * T * H) + (c8 * T * H * H) + (c9 * T * T * H * H);
  return round(HI);  // Return rounded value of heat index
}

// Helper function to print response from ESP8266
void printResponse() {
  while (ESP8266.available()) {
    Serial.write(ESP8266.read()); // Print all data received from ESP8266
  }
}

void sendDataToServer(float temperature, float humidity, float voc, float lux, float IAQIndex, int heatIndex, String indoorAir, String temp) {
  ESP8266.print("AT+CIPSTART=\"TCP\",\"");
  ESP8266.print(host);
  ESP8266.print("\",");
  ESP8266.println(port);
  delay(2000);  // Increased delay to ensure connection

  String jsonBody = "{";
  jsonBody += "\"temperature\":" + String(temperature) + ",";
  jsonBody += "\"humidity\":" + String(humidity) + ",";
  jsonBody += "\"heatIndex\":" + String(heatIndex) + ",";
  jsonBody += "\"lighting\":" + String(lux) + ",";
  jsonBody += "\"voc\":" + String(voc) + ",";
  jsonBody += "\"IAQIndex\":" + String(IAQIndex) + ",";
  jsonBody += "\"indoorAir\":\"" + indoorAir + "\",";
  jsonBody += "\"temp\":\"" + temp + "\"";
  jsonBody += "}";

  // Print the JSON body for debugging
  Serial.println(jsonBody);

  String postRequest = "POST /sensors HTTP/1.1\r\n";
  postRequest += "Host: " + String(host) + "\r\n";
  postRequest += "Content-Type: application/json\r\n";
  postRequest += "Content-Length: " + String(jsonBody.length()) + "\r\n\r\n";
  postRequest += jsonBody;

  ESP8266.print("AT+CIPSEND=");
  ESP8266.println(postRequest.length());
  delay(1000);  // Wait for the response

  // Read the response from the ESP8266 to ensure it's ready to send the data
  printResponse();

  ESP8266.print(postRequest);
  delay(1000);  // Give ESP8266 time to send the data
  printResponse();  // Print the response after sending data

  ESP8266.println("AT+CIPCLOSE");
  delay(1000);
  Serial.println("POST request sent.");
}
