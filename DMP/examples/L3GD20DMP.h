#ifndef L3GD20_DMP
#define L3GD20_DMP
#include "dmp.h"

#include "Adafruit_L3GD20_U.h"
#include "Adafruit_Sensor.h"
class L3GD20DMP : public DMP
{
public:
    Adafruit_L3GD20_Unified gyro;
    void readGyro() override;
    void readAccel() override;
    // begin sensor reading
    void begin();
    void calibrateGyro();

private:
    sensors_event_t event;
    long lastRead;
    FloatVector rotSpeed;
};

void L3GD20DMP::begin()
{
    gyro.enableAutoRange(true);
    gyro.begin();
    lastRead = millis();
}
void L3GD20DMP::readGyro()
{
    gyro.getEvent(&event);
    long newTime = millis();
    float dt = ((float)(newTime - lastRead)) / 1000.0;
    lastRead = newTime;
    rot.x += dt * event.gyro.x;
    rot.y += dt * event.gyro.y;
    rot.z += dt * event.gyro.z;
    rotSpeed.x = event.gyro.x;
    rotSpeed.y = event.gyro.y;
    rotSpeed.z = event.gyro.z;
}

void L3GD20DMP::readAccel()
{
    gyro.getEvent(&event);
    accel.x = event.acceleration.x;
    accel.y = event.acceleration.y;
    accel.z = event.acceleration.z;
    // Serial.println("a" + toString(accel));
}
#endif