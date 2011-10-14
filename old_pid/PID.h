
#ifndef LM75A_H
#define LM75A_H

class LM75A {
    public:
        LM75A(int device_address);
        //float get_temp(void);
        float get_temp();
};

#endif
