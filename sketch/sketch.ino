#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

const char* ssid = "VERSALLES2";
const char* password = "Versalles22019%";
 
int ledPin = 13; // GPIO13
WiFiServer server(80);
HTTPClient http;
 
void setup() {
  Serial.begin(115200);                 //Serial connection
  WiFi.begin(ssid, password);   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.print(".");
  } 
}
 
void loop() {
  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
   HTTPClient http;    //Declare object of class HTTPClient
 
   http.begin("http://192.168.0.29:3000/data");      //Specify request destination
   http.addHeader("Content-Type", "application/json");  //Specify content-type header
 
   int httpCode = http.POST("{\"foo\": 234}");   //Send the request
   String payload = http.getString();                  //Get the response payload
 
   Serial.println(httpCode);   //Print HTTP return code
   Serial.println(payload);    //Print request response payload
 
   http.end();  //Close connection
 
 }else{
 
    Serial.println("Error in WiFi connection");   
 
 }
  delay(3000) ;
}
