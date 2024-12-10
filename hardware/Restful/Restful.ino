#include <ESP8266WiFi.h>  // For ESP8266
#include <ESP8266HTTPClient.h>

// Replace with your network credentials
const char* ssid = "12345";
const char* password = "Gear.123";

void setup() {
  Serial.begin(9600);
  delay(10);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP()); 
  Serial.println(" connected!");

  // Send POST request
  sendPostRequest();
}

void loop() {
  // Nothing to do here
}

void sendPostRequest() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    Serial.println("WiFi connected, preparing POST request...");

    // Specify the URL
    String url = "http://192.168.159.196:8000/vog";
    http.begin(client, url);

    // http.begin(client, "http://jsonplaceholder.typicode.com/posts");

    // Specify headers
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Connection", "keep-alive");

    // Create JSON body
    String jsonBody = "{\"pm25\": 30, \"pm10\": 15, \"OAQIndex\": 80, \"level\": 1}";
    // String jsonBody = "{\"title\": \"foo\", \"body\": \"bar\", \"userId\": 1}";

    Serial.println("Sending the following JSON payload:");
    Serial.println(jsonBody);

    // Set timeout
    http.setTimeout(10000);

    // Send the POST request
    int httpResponseCode = http.POST(jsonBody);

    // Handle the response
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response Code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error in POST request");
      Serial.println("HTTP Response Code: " + String(httpResponseCode));
      Serial.println("Error: " + http.errorToString(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}
