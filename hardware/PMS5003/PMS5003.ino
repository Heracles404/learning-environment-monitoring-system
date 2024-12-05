#include <SoftwareSerial.h>
#include "PMS.h"

// Define pins for SoftwareSerial
const int rxPin = 13;  // RX pin for PMS sensor
const int txPin = 12;  // TX pin for PMS sensor

SoftwareSerial pmsSerial(rxPin, txPin); // Create SoftwareSerial object
PMS pms(pmsSerial);
PMS::DATA data;

void setup()
{
  Serial.begin(9600);     // Initialize Serial for debugging
  pmsSerial.begin(9600);  // Initialize SoftwareSerial for the PMS sensor
  pms.passiveMode();      // Switch to passive mode
}

void loop()
{
  Serial.println(F("Waking up, wait 30 seconds for stable readings..."));
  pms.wakeUp();
  delay(30000);

  Serial.println(F("Send read request..."));
  pms.requestRead();

  Serial.println(F("Wait max. 1 second for read..."));
  if (pms.readUntil(data))
  {
    Serial.print(F("PM 1.0 (ug/m3): "));
    Serial.println(data.PM_AE_UG_1_0);
    
    Serial.print(F("PM 2.5 (ug/m3): "));
    Serial.println(data.PM_AE_UG_2_5);
    
    Serial.print(F("PM 10.0 (ug/m3): "));
    Serial.println(data.PM_AE_UG_10_0);
  }
  else
  {
    Serial.println(F("No data."));
  }

  Serial.println(F("Going to sleep for 5 seconds."));
  pms.sleep();
  delay(5000);
}