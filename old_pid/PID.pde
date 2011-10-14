float iState = 0;
float lastTemp = 0;

float pTerm, iTerm, dTerm; 

float updatePID(float targetTemp, float curTemp)
{
  // these local variables can be factored out if memory is an issue, 
  // but they make it more readable
  double result;
  float error;
  float windupGaurd;

  // determine how badly we are doing
  error = targetTemp - curTemp;

  // the pTerm is the view from now, the pgain judges 
  // how much we care about error we are this instant.
  pTerm = readFloat(PGAIN_ADDRESS) * error;

  // iState keeps changing over time; it's 
  // overall "performance" over time, or accumulated error
  iState += error;

  // to prevent the iTerm getting huge despite lots of 
  //  error, we use a "windup guard" 
  // (this happens when the machine is first turned on and
  // it cant help be cold despite its best efforts)

  // not necessary, but this makes windup guard values 
  // be expressed in terms of power values
  windupGaurd = WINDUP_GUARD_GAIN / readFloat(IGAIN_ADDRESS);  

  if (iState > windupGaurd) 
    iState = windupGaurd;
  else if (iState < -windupGaurd) 
    iState = -windupGaurd;
  iTerm = readFloat(IGAIN_ADDRESS) * iState;

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

/*
void printPIDDebugString() {
  // A  helper function to keep track of the PID algorithm 
  char buff[38];
  //Serial.print("PID formula (P + I - D): ");
  floatToString(buff,pTerm, 2, 8, false, false);
  buff[9] = '+';
  floatToString(&buff[11],iTerm, 2, 8, false, false);
  buff[20] = '-';
  floatToString(&buff[22],dTerm, 2, 8, false, false);
  buff[31] = '=';
  floatToString(&buff[33],getHeatCycles(), 0,4, false, false);
  Serial.println(buff);
}
*/
