var LM75A = function(options, callback){
    var board = options.board,
        address = options.address,
        // The amount of milliseconds to wait before reading the temperature
        // again. This is because the lm75a has a max internal temperature
        // conversion time (a to d) of 300ms.
        minRefresh = options.minRefresh || 300,
        // Internal reference to the last temperature read
        _temp,
        tempInterval;

    start(callback);

    function read_temperature(callback){
        board.sendI2CWriteRequest(address, 0);
        board.sendI2CReadRequest(address, 2, function(data){
            var newTemp = data[0] << 8;
            newTemp |= data[1];
            newTemp = newTemp >> 5;

            _temp = newTemp * 0.125;

            callback && callback(_temp);
        });
    }

    function getTemp(){
        return _temp;
    }

    function start(callback){
        board.sendI2CConfig();
        // Grab the temperature now
        read_temperature(callback);
        // And keep reading a new temperature every x milliseconds
        tempInterval = setInterval(read_temperature, minRefresh);
    }

    function isRunning(){
        return typeof(tempInterval) !== 'undefined';
    }

    function stop(){
        clearInterval(tempInterval);
        tempInterval = undefined;
    }

    return {
        getTemp: getTemp,
        start: start,
        stop: stop,
        isRunning: isRunning
    };
};

module.exports = LM75A
