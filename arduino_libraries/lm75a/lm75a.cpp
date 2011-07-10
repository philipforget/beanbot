#include "lm75a.h"

#include "WProgram.h"
#include "WConstants.h"

#include <Wire.h>
#include <inttypes.h>


int instance_address;

LM75A::LM75A(int device_address) {
    instance_address = device_address;
}

float LM75A::get_temp() {
    unsigned int val = 0;
    unsigned int shifted = 0;
    float val_f = 0.0;

    Wire.beginTransmission(instance_address);
    Wire.send(0x00);  // 0 = 'temperature register' and this implies that we expect 2 bytes (msb, lsb) in return to our request
    Wire.endTransmission();

    Wire.requestFrom(instance_address, 2); // read 2 bytes

    val = (Wire.receive() << 8); // MSB
    val |= Wire.receive();       // LSB

    // now, deal with the funky lm75a bit-shifting
    shifted = (val >> 5);

    // NOTE!!! I'm making a big assumption here; that the MS bit (highest bit in MS byte) is not 1 and therefore this is not
    // a 2's compliment number.  this only happens when you are below 0 in binary value (0 binary == 0C, 1 binary == 0.125C, etc)
    // for room temperature electronics, we should rarely see freezing temperatures
    return (float)shifted * 0.125;
}
