// file for motion procession for artificial horizon and conpass
#define MPU9250_SENSOR
#ifndef MPU9250DMP_H
#define MPU9250DMP_H
#include "dmp.h"
#include "Wire.h"
#include "MPU9250.h"


class MPU9250DMP : public DMP
{
public:
    MPU9250 mpu;
    MPU9250DMP() : mpu(Wire, 0x68)
    {
    }
    void readGyro() override;
    void readAccel() override;
    // begin sensor reading
    void begin();
    void calibrateGyro();

private:
    long lastRead;
};


void MPU9250DMP::readGyro()
{
	long newTime = micros();
	float dt = ((float)(newTime - lastRead)) / 1000000.0;
	lastRead = newTime;
	mpu.readSensor();
	rot.x += dt * mpu.getGyroX_rads();
	rot.y += dt * mpu.getGyroY_rads();
	rot.z += dt * mpu.getGyroZ_rads();
}

void MPU9250DMP::readAccel()
{
	accel.x = mpu.getAccelX_mss();
	accel.y = mpu.getAccelY_mss();
	accel.z = mpu.getAccelZ_mss();
}
void MPU9250DMP::begin()
{
	mpu.begin();
	lastRead = micros();
}
#endif