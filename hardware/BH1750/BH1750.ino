#include <Wire.h>
#include <BH1750.h>

BH1750 lightMeter;

void setup() {
  Serial.begin(115200); // Higher baud rate for ESP8266
  Wire.begin(D1, D2);   // SDA and SCL pins (D1 = SDA, D2 = SCL on NodeMCU)

  // Initialize BH1750 sensor
  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x23)) {
    Serial.println(F("BH1750 initialized successfully"));
  } else {
    Serial.println(F("Error initializing BH1750"));
    while (1);
  }
}

void loop() {
  float lux = lightMeter.readLightLevel();

  if (lux >= 0) {
    Serial.print("Light: ");
    Serial.print(lux);
    Serial.println(" lx");
  } else {
    Serial.println("[BH1750] Error reading light level");
  }

  delay(5000);
}
