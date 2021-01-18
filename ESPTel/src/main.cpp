#include <DNSServer.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <Adafruit_BMP280.h>
#include "MPU9250.h"
#include <Wire.h>
DNSServer dnsServer;
AsyncWebServer server(80);

Adafruit_BMP280 bmp; // use I2C interface
Adafruit_Sensor *bmp_temp = bmp.getTemperatureSensor();
Adafruit_Sensor *bmp_pressure = bmp.getPressureSensor();
MPU9250 IMU(Wire, 0x68);
float ax = 0.01; //measured acc
float ay = 0.01;
float az = 10.0;
float axg = 0.01; //Gyro corrected acc
float ayg = 0.01;
float azg = 10;
float axg1;
float ayg1;
float azg1;
float acc;		//Accelaration Betrag
float gx = 0.0; //gyro rate
float gy = 0.0;
float gz = 0.0;
double angx; //angle of rotation since last measurement
double angy;
double angz;
float mx = 0.0; //mag flux
float my = 0.0;
float mz = 0.0;
float pitch = 0.0;
float bank = 0.0;
float pitchg = 0;
float bankg = 0;
float dt = 0.1;
unsigned long lastTime = 0;
int status;

void setup()
{
	Serial.begin(9600);
	Wire.begin(0, 2);
	Serial.println(F("BMP280 Sensor event test"));

	if (!bmp.begin(0x76))
	{
		Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
		while (1)
			delay(10);
	}

	status = IMU.begin();
	if (status < 0)
	{
		Serial.println("IMU initialization unsuccessful");
		Serial.println("Check IMU wiring or try cycling power");
		Serial.print("Status: ");
		Serial.println(status);
		while (1)
		{
		}
	}
	// setting the accelerometer full scale range to +/-8G
	IMU.setAccelRange(MPU9250::ACCEL_RANGE_8G);
	// setting the gyroscope full scale range to +/-500 deg/s
	IMU.setGyroRange(MPU9250::GYRO_RANGE_500DPS);
	// setting DLPF bandwidth to 20 Hz
	IMU.setDlpfBandwidth(MPU9250::DLPF_BANDWIDTH_20HZ);
	// setting SRD to 19 for a 50 Hz update rate
	IMU.setSrd(19);

	SPIFFS.begin();
	WiFi.softAP("ESP");
	dnsServer.start(53, "*", WiFi.softAPIP());
	server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send_P(200, "text/html", "This is a great content");
	});

	server.on("/data", HTTP_GET, [](AsyncWebServerRequest *request) {
		sensors_event_t temp_event, pressure_event;
		bmp_temp->getEvent(&temp_event);
		bmp_pressure->getEvent(&pressure_event);
		// read the sensor
		IMU.readSensor();

		ax = IMU.getAccelX_mss() - 0.06;
		ay = IMU.getAccelY_mss() - 0.05;
		az = IMU.getAccelZ_mss() + 0.435;

		gx = IMU.getGyroX_rads();
		gy = IMU.getGyroY_rads();
		gz = IMU.getGyroZ_rads();

		mx = IMU.getMagX_uT();
		my = IMU.getMagY_uT();
		mz = IMU.getMagZ_uT();
		//dt = 0.1;
		dt = (millis() - lastTime); //Milliseconds since last measurement
		lastTime = millis();
		acc = sqrt(ax * ax + ay * ay + az * az);
		angx = -gz * dt / 1000;
		angy = -gy * dt / 1000;
		angz = -gx * dt / 1000;

		//Kreiselstabiliert bei Gesamtbeschleunigung>1g
		if (acc > 10 || acc < 9.7)
		{

			axg1 = axg * (cos(angy) * cos(angx)) + ayg * (sin(angz) * sin(angy) * cos(angx) - cos(angz) * sin(angx)) + azg * (cos(angz) * sin(angy) * cos(angx) + sin(angz) * sin(angx));
			ayg1 = axg * (cos(angy) * sin(angx)) + ayg * (sin(angz) * sin(angy) * sin(angx) + cos(angz) * cos(angx)) + azg * (cos(angz) * sin(angy) * sin(angx) - sin(angz) * cos(angz));
			azg1 = axg * (-sin(angy)) + ayg * (sin(angz) * cos(angy)) + azg * (cos(angz) * cos(angy));
			axg = axg1;
			ayg = ayg1;
			azg = azg1;
		}
		else
		{
			axg = ax;
			ayg = ay;
			azg = az;
		}
		pitch = 180 * atan(axg / azg) / PI;
		bank = 180 * atan(ayg / azg) / PI;
		if (azg < 0)
		{
			//pitch = pitch - 180;
			bank = bank + 180;
		}
		

		String JSON = "{\"temperature\":" + String(temp_event.temperature) + ", \"pressure\":" + String(pressure_event.pressure) + ", \"ax\":" + String(ax) + ", \"ay\":" + String(ay) + ", \"az\":" + String(az) + ", \"acc\":" + String(acc) + ", \"gx\":" + String(gx) + ", \"gy\":" + String(gy) + ", \"gz\":" + String(gz) + ", \"mx\":" + String(mx) + ", \"my\":" + String(my) + ", \"mz\":" + String(mz) + ", \"pitch\":" + String(pitch) + ", \"bank\":" + String(bank) + ", \"pitchg\":" + String(pitchg) + ", \"bankg\":" + String(bankg) + ", \"angx\":" + String(angx) + ", \"dt\":" + String(dt) + "}";
		request->send_P(200, "application/json", &JSON[0]);
	});
	server.on("/home.html", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/home.html", "text/html");
	});
	server.on("/horizon.html", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/horizon.html", "text/html");
	});
	server.on("/main.js", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/main.js", "text/javascript");
	});
	server.on("/horizon.js", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/horizon.js", "text/javascript");
	});

	server.on("/main.css", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/main.css", "text/css");
	});
	//more handlers...
	server.begin();
}

void loop()
{
	dnsServer.processNextRequest();
}