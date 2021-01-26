#ifndef DMP_H
#define DMP_H

#include "quaternion.h"
#include "floatVector.h"

class DMP
{
public:
    float pitch, bank, yaw;
    enum CalibrationState
    {
        flatten,
        turn
    };
    void processHeadingData(float headingArc, float factor = 0.1);
    void updateReadables();
    n::Quaternion translation = {1, 0, 0, 0};
    //attention!!! This feature is not yet fully implemented! Do not use it!
    void calibrateOrientation(CalibrationState s);
    // read gyro data and add them to the current rotations to process. Reset last read
    virtual void readGyro() = 0;
    //read acceleration data and save them in accel
    virtual void readAccel() = 0;
    // add accumulated rotations to currentRotation
    void processRotations();
    // apply acceleration to currentRotation
    void processAcceleration();
    // most recent acceleration data
    FloatVector accel;
    // accumulated rotation data
    FloatVector rot;
    n::Quaternion currentRotation = {0.7071, 0, 0, 0.7071};
};
#endif