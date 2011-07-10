#!/usr/bin/env python

import serial
import sys
import time

from datetime import datetime

class SerialMonitor():
    def __init__(self, serial_port=None):
        self.serial_port = serial_port if serial_port else '/dev/ttyUSB0'
        self.sleep_time = 2

    def loop(self):
        ser = serial.Serial(self.serial_port)
        try:
            while True:
                now = datetime.now()
                sys.stdout.write(now.strftime("%H:%M:%S - ") + ser.readline())
                # Reset the sleep timer if this first line doesnt throw an exception
                if self.sleep_time != 2:
                    self.sleep_time = 2

        except KeyboardInterrupt:
            print("Exiting")
            return 0

        # Uploading to the board will cause the resource to be temporarily
        # unavailable
        except Exception as exc:
            print("Resource not available, trying again in %i seconds" % self.sleep_time)
            time.sleep(self.sleep_time)
            # Increase the sleep time every failure
            self.sleep_time += 1
            self.loop()


if __name__ == '__main__':
    serial_monitor = SerialMonitor()
    serial_monitor.loop()
