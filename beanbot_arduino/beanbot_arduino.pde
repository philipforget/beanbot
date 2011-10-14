#include <lm75a.h>
#include <PID.h>
#include <Wire.h>

// The address, in hex, of the l75a. The address schema for the lm75a is
// 1 0 0 1 <a0> <a1> <a2>
// where a0-2 are 1 or 0 if tied to Vcc or ground, respectively
#define lm75_address 0x4F // 1001111
#define relay_pin 2

LM75A lm75a(lm75_address);
PID pid;
float target_temp = 90;

void setup(){
    Wire.begin();
    Serial.begin(9600);

    pinMode(relay_pin, OUTPUT);     
    pid.pgain = 10.0;
}

void loop(){
    int error = (int)pid.update_pid(target_temp, lm75a.get_temp());
    Serial.println(error);
    Serial.println(lm75a.get_temp());
    if(error > 0){
        digitalWrite(relay_pin, HIGH);
    }
    else {
        digitalWrite(relay_pin, LOW);
    }
    delay(abs(error));
}
