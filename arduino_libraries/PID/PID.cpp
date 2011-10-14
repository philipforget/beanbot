#include "PID.h"
#include "WProgram.h"


// Constructor
PID::PID() {
    // Tuning parameters
    float pgain = .25;
    float igain = .25;
    float dgain = 1;

    float windup_guard = 0;

    float integral = 0;
    float previous_error = 0;
}

int PID::update_pid(float target, float current) {
    float error, pterm, iterm, dterm;

    error = target - current;
    // Integral  keeps changing over time
    integral += error;
    // The instantaenous error to correct for
    pterm = pgain * error;
    iterm = integral * igain;
    dterm = dgain * (error - previous_error);
    previous_error = error;

    return  pterm + iterm - dterm;
}

/*
float integral = 0;
float lastTemp = 0;

float updatePID(float targetTemp, float curTemp)
{
  // determine how badly we are doing
  error = targetTemp - curTemp;

  // the pTerm is the view from now, the pgain judges 
  // how much we care about error we are this instant.
  pTerm = readFloat(PGAIN_ADDRESS) * error;

  // iState keeps changing over time; it's 
  // overall "performance" over time, or accumulated error
  integral += error;

  // to prevent the iTerm getting huge despite lots of 
  //  error, we use a "windup guard" 
  // (this happens when the machine is first turned on and
  // it cant help be cold despite its best efforts)

  if (integral > windupGaurd) 
    integral = windupGaurd;
  else if (integral < -windupGaurd) 
    integral = -windupGaurd;
  iTerm = readFloat(IGAIN_ADDRESS) * integral;

  // the dTerm, the difference between the temperature now
  //  and our last reading, indicated the "speed," 
  // how quickly the temp is changing. (aka. Differential)
  dTerm = (readFloat(DGAIN_ADDRESS)* (curTemp - lastTemp));

  // now that we've use lastTemp, put the current temp in
  // our pocket until for the next round
  lastTemp = curTemp;

  // the magic feedback bit
  return  pTerm + iTerm - dTerm;
}
*/
