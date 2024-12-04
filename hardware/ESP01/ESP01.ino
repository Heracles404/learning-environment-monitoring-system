#include <SoftwareSerial.h>

SoftwareSerial ESP8266(2, 3); // RX, TX

const char* wifiSSID = "PLDTHOMEFIBR2X9KX";
const char* wifiPassword = "PLDTWIFID4kzQ";

void setup() {
  Serial.begin(9600);
  ESP8266.begin(9600);
  
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

void loop() {
  // Run once after WiFi connection
  Serial.println("Hello, World!");
  while (true); // Halt after printing
}
