#include <SoftwareSerial.h>

SoftwareSerial ESP8266(2, 3); // RX, TX

const char* ssid = "IoT";  // Your WiFi SSID
const char* password = "AccessPoint.2024";  // Your WiFi Password
const char* host = "192.168.68.103";  // Correct IP address of your server
const int httpPort = 8000;  // Port number where the API is listening

unsigned char check_connection = 0;
unsigned char times_check = 0;

void setup() {
  Serial.begin(115200); // Start Serial communication for debugging
  ESP8266.begin(115200);  // Begin communication with the ESP8266 module

  delay(1000);

  // Reset ESP8266
  ESP8266.println("AT+RST");
  delay(2000);
  printResponse();

  // Check version
  ESP8266.println("AT+GMR");
  delay(2000);
  printResponse();

  // Set WiFi mode to Station (client)
  ESP8266.println("AT+CWMODE=1");
  delay(2000);
  printResponse();

  // Connect to Wi-Fi
  Serial.println("Connecting to WiFi...");
  ESP8266.print("AT+CWJAP=\"");
  ESP8266.print(ssid);
  ESP8266.print("\",\"");
  ESP8266.print(password);
  ESP8266.println("\"");

  // Wait for the connection
  while (check_connection == 0) {
    if (ESP8266.find("WIFI CONNECTED") == 1) {
      Serial.println("WiFi connected");
      check_connection = 1;
    }
    times_check++;
    if (times_check > 3) {
      times_check = 0;
      Serial.println("Retrying WiFi connection...");
      ESP8266.print("AT+CWJAP=\"");
      ESP8266.print(ssid);
      ESP8266.print("\",\"");
      ESP8266.print(password);
      ESP8266.println("\"");
      delay(5000);
    }
  }

  delay(1000);
}

void loop() {
  if (check_connection == 1) {
    // Open TCP connection to the server
    Serial.println("Connecting to server...");
    ESP8266.print("AT+CIPSTART=\"TCP\",\"");
    ESP8266.print(host);
    ESP8266.print("\",");
    ESP8266.println(httpPort);
    delay(2000);  // Increased delay to allow server connection to settle
    printResponse(); // Print the server connection status

    // Prepare the updated POST data
    String jsonData = "{\"temperature\":36,\"humidity\":33,\"heatIndex\":37,\"lighting\":160,\"voc\":70,\"IAQIndex\":72,\"indoorAir\":\"Good\",\"temp\":\"Good\"}";

    // Create the HTTP POST request
    String postRequest = "POST /sensors HTTP/1.1\r\n";
    postRequest += "Host: " + String(host) + "\r\n";
    postRequest += "Content-Type: application/json\r\n";
    postRequest += "Content-Length: " + String(jsonData.length()) + "\r\n\r\n";
    postRequest += jsonData;

    // Send the request length
    ESP8266.print("AT+CIPSEND=");
    ESP8266.println(postRequest.length());
    delay(1000);
    printResponse(); // Print response of sending command

    // Send the POST request
    ESP8266.print(postRequest);
    delay(1000);  // Wait for ESP8266 to send all data
    printResponse(); // Print the actual data sent

    // Close the connection
    ESP8266.println("AT+CIPCLOSE");
    delay(1000);
    Serial.println("POST request sent.");
  }

  while (1);  // Stop the loop once the POST request is done
}

// Helper function to print response from ESP8266
void printResponse() {
  while (ESP8266.available()) {
    Serial.write(ESP8266.read()); // Print all data received from ESP8266
  }
}
