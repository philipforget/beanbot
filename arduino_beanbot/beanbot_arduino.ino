#include <lm75a.h>
#include <Wire.h>

// The address, in hex, of the l75a. The address schema for the lm75a is
// 1 0 0 1 <a0> <a1> <a2>
// where a0-2 are 1 or 0 if tied to Vcc or ground, respectively
#define lm75_address 0x4F // 1001111

LM75A lm75a(lm75_address);

void setup(){
    Wire.begin();
    Serial.begin(9600);
    Serial.println("Beanbot");
   
}

void loop(){
    Serial.println("Hello There");
    Serial.println(lm75a.get_temp());
    delay(2000);
}
