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
float ax = 0.0;
float ay = 0.0;
float az = 0.0;
float gx = 0.0;
float gy = 0.0;
float gz = 0.0;
float mx = 0.0;
float my = 0.0;
float mz = 0.0;
float pitch = 0.0;
float bank = 0.0;
float pitchg = 0;
float bankg = 0;
float dt;
float lastTime = 0;
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

		pitch = 180 * atan(ax / az) / PI;
		bank = 180 * atan(ay / az) / PI;
		dt = millis() - lastTime;
		lastTime = millis();
		pitchg = pitchg - gy * dt / 1000 * 180 / PI;
		bankg = bankg + gx * dt / 1000 * 180 / PI;
		//Kreiselstabiliert bei Gesamtbeschleunigung>1g
		if (sqrt(ax * ax + ay * ay + az * az) < 10)
		{
			pitchg = pitch;
			bankg = bank;
		}
		String JSON = "{\"temperature\":" + String(temp_event.temperature) + ", \"pressure\":" + String(pressure_event.pressure) + ", \"ax\":" + String(ax) + ", \"ay\":" + String(ay) + ", \"az\":" + String(az) + ", \"gx\":" + String(gx) + ", \"gy\":" + String(gy) + ", \"gz\":" + String(gz) + ", \"mx\":" + String(mx) + ", \"my\":" + String(my) + ", \"mz\":" + String(mz) + ", \"pitch\":" + String(pitch) + ", \"bank\":" + String(bank) + ", \"pitchg\":" + String(pitchg) + ", \"bankg\":" + String(bankg) + "}";
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