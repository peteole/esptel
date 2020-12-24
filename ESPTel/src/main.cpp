#include <DNSServer.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>

DNSServer dnsServer;
AsyncWebServer server(80);





void setup()
{
	SPIFFS.begin();
	WiFi.softAP("esp-captive");
	dnsServer.start(53, "*", WiFi.softAPIP());
	server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send_P(200, "text/html", "This is a great content");
	});
	server.on("/home.html", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/home.html", "text/html");
	});
	server.on("/main.js", HTTP_GET, [](AsyncWebServerRequest *request) {
		request->send(SPIFFS, "/main.js", "text/javascript");
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