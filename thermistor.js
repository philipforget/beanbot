// Reading a simple 10k Thermistor attached to pin 0. 
// Attach a 10k Resistor to ground and analog in, and attach the thermistor
// between analog in and +5v.
// (ground)--(^10k^)--(AnalogIn0)--(^Thermistor^)--(+5v)
//
var Board = require('firmata').Board;

var board = new Board('/dev/tty.usbserial-A700fiqN', function(){
    var counter = 0;
        // Average the temperature over a series of readings, analog
        // thermistors can be a bit noisy.
        temps = [];

    board.analogRead(0, function(data){
        counter ++;
        var temp = Math.log(((10240000/data) - 10000));
        temp = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * temp * temp ))* temp );
        temp = temp - 273.15; // Convert Kelvin to Celcius
        temp = (temp * 9) / 5 + 32; // Convert Celcius to Fahrenheit

        temps.push(temp);

        if(counter == 40){
            // Log out the average of the last x readings stored in the array
            console.log(temps.reduce(function(a,b){ return a+b; } ) / temps.length);
            counter = 0;
            temps = [];
        }
    });
});
