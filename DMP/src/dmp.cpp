#include "dmp.h"

void DMP::processRotations()
{
	n::Quaternion axis = {0, rot.x, rot.y, rot.z};
	axis = n::turnVector(axis, currentRotation);
	float angle = n::vectorLength(axis);
	n::unify(axis);
	n::makeTurnQuaternion(axis, angle);
	n::Quaternion tmp;
	n::multiply(axis, currentRotation, tmp);
	currentRotation = tmp;
	n::unify(tmp);
	rot.x = 0;
	rot.y = 0;
	rot.z = 0;
}
void DMP::processAcceleration()
{
	n::Quaternion acceleration{0, accel.x, accel.y, accel.z};
	n::unify(acceleration);
	if (acceleration.r == 1)
		return; // acceleration was zero
	n::Quaternion currentLot = {0, 0, 0, -1};
	n::Quaternion measuredLot = n::turnVector(acceleration, currentRotation);
	n::rotateAToB(measuredLot, currentLot, currentRotation, 0.003);
	n::unify(currentRotation);
}
void DMP::processHeadingData(float headingRad,float factor){
	n::Quaternion measuredHead=n::turnVector({0,1,0,0},currentRotation);
	n::Quaternion targetHead={0,cos(headingRad),sin(headingRad),0};
	n::rotateAToB(measuredHead,targetHead,currentRotation,factor);
}

void DMP::calibrateOrientation(CalibrationState s)
{
	switch (s)
	{
	case CalibrationState::flatten:
	{
		translation = n::invers(currentRotation);
	}
	break;

	case CalibrationState::turn:
	{
		n::Quaternion toDraw = currentRotation;
		n::multiply(translation, currentRotation, toDraw);
	}
	break;
	default:
		break;
	}
}
void DMP::updateReadables()
{
	n::Quaternion toDraw;
	n::multiply(currentRotation, translation, toDraw);
	n::toPitchBank(toDraw, pitch, bank, yaw);
}