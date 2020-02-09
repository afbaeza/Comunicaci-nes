#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

const char* ssid = "VERSALLES2";
const char* password = "Versalles22019%";

HTTPClient http;

void setup() {
  // Frecuencia: 9600 Hz

  Serial.begin(9600);

  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);   //WiFi connection

  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

}

void loop() {

  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status

    HTTPClient http;    //Declare object of class HTTPClient

    http.begin("http://192.168.0.29:3000/data");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header

    String data = "";

    if (Serial.available() > 0) {
      Serial.println("Received: ");

      char curr = ' ';

      while (Serial.available() > 0) {
        curr = (char)Serial.read();
        data += String(curr);
      }

      String part01 = getValue(data,';',1);
      String part02 = getValue(data,';',2);
      String part03 = getValue(data,';',3);
      // 
      String sendStr = "{ \"id\": 1, \"ip\": "+part01+", \"irms\": "+part02+", \"potencia\": "+part03+" }";
      Serial.println(data);
      Serial.println(sendStr);
      
      int httpCode = http.POST(sendStr);   //Send the request
      String payload = http.getString();                  //Get the response payload

      //Serial.println(httpCode);   //Print HTTP return code
      //Serial.println(payload);    //Print request response payload
      data = "";

      


      http.end();  //Close connection

    }

  } else {

    Serial.println("Error in WiFi connection");

  }
}


void printData(int Ip, int Irms, int P) {
  Serial.print("Ip: ");
  Serial.print(Ip, 3);

  Serial.print("A , Irms: ");
  Serial.print(Irms, 3);

  Serial.print("A, Potencia: ");
  Serial.print(P, 3);

  Serial.println("W");
}

String getValue(String data, char separator, int index) {
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length() - 1;

  for (int i = 0; i <= maxIndex && found <= index; i++) {
    if (data.charAt(i) == separator || i == maxIndex) {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }

  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}
