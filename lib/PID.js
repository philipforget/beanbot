var PID = function(options, callback){
    var setPoint = options.setPoint,
        input = options.input,
        delay = options.delay || 350,
        epsilon = 0.01,
        max = options.max || 4,
        min = options.min || -4,
        // PID coefficients
        cProportional = 0.1,
        cDerivative = 0.01,
        cIntegral = 0.005,
        isRunning;

    start();

    function loop(){
        var preError = 0,
            integral = 0,
            error,
            derivative,
            output;

        //Caculate P,I,D
        error = setPoint - (typeof(input) === 'function' ? input() : input);


        //In case of error too small then stop intergration
        if(Math.abs(error) > epsilon) {
            integral = integral + error * delay;
        }

        derivative = (error - preError) / delay;

        output = (cProportional * error) +
            (cIntegral * integral) + 
            (cDerivative * derivative);

        //Saturation Filter
        if(output > max){
            output = max;
        }
        else if(output < min) {
            output = min;
        }

        //Update error
        preError = error;

        callback(output);
        
        isRunning && setTimeout(loop, delay);
    }

    function start(){
        isRunning = true;
        loop();
    }

    function isRunning(){
        return isRunning;
    }

    function stop(){
        self.isRunning = False;
    }

    return {
        start: start,
        stop: stop,
        isRunning: isRunning
    };
}

module.exports = {
    PID: PID
}
