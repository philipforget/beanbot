#ifndef PID_H
#define PID_H

class PID {
    float previous_error, integral, windup_guard;
    public:
        PID();
        float pgain, igain, dgain;
        int update_pid(float target, float current);
        float get_pgain();
};

#endif
