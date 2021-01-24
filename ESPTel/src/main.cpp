#include <DNSServer.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <Adafruit_BMP280.h>
#include "MPU9250DMP.h"
#include "dmp.h"
#include <Wire.h>

DNSServer dnsServer;
AsyncWebServer server(80);

Adafruit_BMP280 bmp; // use I2C interface
Adafruit_Sensor *bmp_temp = bmp.getTemperatureSensor();
Adafruit_Sensor *bmp_pressure = bmp.getPressureSensor();
MPU9250DMP dmp;

void setup()
{
	Serial.begin(9600);
	Wire.begin(0, 2);
	dmp.begin();
	Serial.println(F("BMP280 Sensor event test"));

	if (!bmp.begin(0x76))
	{
		Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
		while (1)
			delay(10);
	}

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
		dmp.updateReadables();
		mx = IMU.getMagX_uT();
		my = IMU.getMagY_uT();
		mz = IMU.getMagZ_uT();
		

		String JSON = "{\"temperature\":" + String(temp_event.temperature) + ", \"pressure\":" + String(pressure_event.pressure) + ", \"mhdg\":" + String(dmp.yaw) + ", \"ax\":" + String(dmp.accel.x) + ", \"ay\":" + String(dmp.accel.y) + ", \"az\":" + String(dmp.accel.z) + ", \"pitch\":" + String(dmp.pitch) + ", \"bank\":" + String(dmp.bank) + "}";
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
	dmp.readGyro();
	dmp.readAccel();
	dmp.processRotations();
	dmp.processAcceleration();
}