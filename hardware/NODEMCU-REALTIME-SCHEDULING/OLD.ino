#include <ESP8266WiFi.h>
#include "time.h"

const char* ssid = "IoT";
const char* password = "AccessPoint.2024";

const char* ntpServer = "time.nist.gov"; // Reliable NTP server
const long gmtOffset_sec = 8 * 3600;     // Adjust for your timezone (GMT+8)
const int daylightOffset_sec = 0;        // No daylight saving time

const int ledPin = LED_BUILTIN;          // NodeMCU built-in LED pin

bool ledActivated = false;               // Track whether the LED has already been activated

void printLocalTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

  // Format the time and print it
  char buffer[64];
  strftime(buffer, sizeof(buffer), "%A, %B %d %Y %H:%M:%S", &timeinfo);
  Serial.println(buffer);

  // Check if it is 1:59 PM and the LED has not been activated yet
  if (timeinfo.tm_hour == 13 && timeinfo.tm_min == 59 && !ledActivated) {
    digitalWrite(ledPin, LOW);  // LED is active LOW on NodeMCU
    Serial.println(F("LED turned ON at 1:59 PM!"));
    delay(500);                 // LED stays on for 500ms
    digitalWrite(ledPin, HIGH); // Turn the LED OFF
    Serial.println(F("LED turned OFF!"));
    ledActivated = true;        // Mark the LED as activated
  }

  // Check if it is 2:04 PM and the LED has not been activated yet
  if (timeinfo.tm_hour == 14 && timeinfo.tm_min == 4 && !ledActivated) {
    digitalWrite(ledPin, LOW);  // LED is active LOW on NodeMCU
    Serial.println(F("LED turned ON at 2:04 PM!"));
    delay(500);                 // LED stays on for 500ms
    digitalWrite(ledPin, HIGH); // Turn the LED OFF
    Serial.println(F("LED turned OFF!"));
    ledActivated = true;        // Mark the LED as activated
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);    // Initialize the LED pin
  digitalWrite(ledPin, HIGH); // Default state (LED off)

  // Connect to WiFi
  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" CONNECTED");

  // Initialize and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
}

void loop() {
  delay(1000); // Check every second
  printLocalTime();
}
