var LM75A = function(board, address, minRefresh){
    var // The amount of milliseconds to wait before reading the temperature
        // again. This is because the lm75a has a max internal temperature
        // conversion time (a to d) of 300ms.
        minRefresh = minRefresh || 300,
        // Internal reference to the last temperature read
        temp, tempInterval;

    start();

    function read_temperature(){
        board.sendI2CWriteRequest(address, 0);
        board.sendI2CReadRequest(address, 2, function(data){
            var newTemp = data[0] << 8;
            newTemp |= data[1];
            newTemp = newTemp >> 5;
            temp = newTemp * 0.125;
        });
    }

    function start(){
        board.sendI2CConfig();
        // Grab the temperature now
        read_temperature();
        // And keep reading a new temperature every x milliseconds
        tempInterval = setInterval(read_temperature, minRefresh);
    }

    function isRunning(){
        return typeof(tempInterval) !== 'undefined';
    }

    function stop(){
        clearInterval(tempInterval);
    }

    return {
        temp: temp,
        start: start,
        stop: stop,
        isRunning: isRunning
    };
};

module.exports = {
    LM75A: LM75A
};
