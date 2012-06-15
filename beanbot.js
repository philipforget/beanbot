console.log("Beanbot Bootin")


var fs = require('fs'),
    repl = require('repl'),
    Board = require('firmata').Board,
    LM75A = require('LM75A').LM75A,
    PID = require('PID').PID,
    logPath = 'log/beanbot.log',
    stream = fs.createWriteStream(logPath, {
        'flags': 'a+',
        'encoding': 'utf8',
        'mode': 0644
    }),
    log = function(message){
        stream.write(message + "\n", 'utf8');
    },
    //
    boardAddress = '/dev/ttyUSB0',
    boilerPin = 3,
    pumpPin = 2,
    board = new Board(boardAddress, function(){
        log("Got board at " + boardAddress);

        function pulseBoiler(delay){
            board.digitalWrite(boilerPin, 1);
            setTimeout(function(){
                board.digitalWrite(boilerPin, 0);
            }, delay);
        };

        // Toggle boiler
        var tp = (function(){
            var state = 0;
            return function(){
                state = !Boolean(state)?1:0;
                board.digitalWrite(pumpPin, state);
            }
        }());

        var lm75a = LM75A({board: board, address: 0x4f}, function(firstTemp){
                var desiredTemperature = 90,
                    delay = 350,
                    pidMax = 4,
                    pidMin = -4,
                    pid = PID({
                        setPoint: desiredTemperature,
                        input: lm75a.getTemp,
                        delay: delay,
                        max: pidMax,
                        min: pidMin
                    }, function(output){
                        log(new Date());
                        log("Pid Output: " + output)
                        log("Current temp: " + lm75a.getTemp());

                        if(output > 0){
                            var pulse = output / (pidMax * 4) * delay;

                            log("Pulsing boiler for " + pulse)

                            pulseBoiler(pulse);
                        }
                    });

                repl.start("Beanbot ahoy!>");
            });
    });
