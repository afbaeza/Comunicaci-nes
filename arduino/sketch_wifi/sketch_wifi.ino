#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

// Generic esp8266 module

const char* ssid = "VERSALLES2";
const char* password = "Versalles22019%";

// Identificador del Posta
int identificador = 1;

String IP = "192.168.0.29";

HTTPClient http;
float Sensibilidad = 0.185; //sensibilidad en V/A para nuestro sensor
float offset       = 0.121; // Equivale a la amplitud del ruido


void setup() {
  // Frecuencia: 9600 Hz
  pinMode(A0, INPUT);

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

    http.begin("http://"+IP+":3000/data");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header

    String data = "";

    

      float Ip   = get_corriente();//obtenemos la corriente pico
      float Irms = Ip * 0.707;     //Intensidad RMS = Ipico/(2^1/2)
      float P    = Irms * 122.0;   // P=IV watts
      P = P - 330.0;
    
      if(P < 4.0) {
        P = 0.0;
      }
      
      String sendStr = "{ \"id\": "+String(identificador)+", \"potencia\": "+String(P)+" }";
      
      Serial.println(sendStr);
      
      int httpCode = http.POST(sendStr);   //Send the request
      String payload = http.getString();                  //Get the response payload

      Serial.println("Enviado");
    

      //Serial.println(httpCode);   //Print HTTP return code
      //Serial.println(payload);    //Print request response payload
      data = "";
      http.end();  //Close connection

    

  } else {

    Serial.println("Error in WiFi connection");

  }

  delay(1000);
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


float get_corriente() {
  float voltajeSensor = 0.0;
  float corriente     = 0.0;

  long tiempo = millis();
  float Imax  = 0.0;
  float Imin  = 0.0;

  while ( (millis() - tiempo) < 500) { //realizamos mediciones durante 0.5 segundos
    voltajeSensor = analogRead(A0) * (5.0 / 1023.0);//lectura del sensor
    corriente = 0.9 * corriente + 0.1 * ((voltajeSensor - 2.527) / Sensibilidad); //Ecuación  para obtener la corriente
    if (corriente > Imax)Imax = corriente;
    if (corriente < Imin)Imin = corriente;
  }
  return (((Imax - Imin) / 2.0) - offset);
}
