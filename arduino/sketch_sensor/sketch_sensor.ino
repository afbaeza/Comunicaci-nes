float Sensibilidad = 0.185; //sensibilidad en V/A para nuestro sensor
float offset       = 0.121; // Equivale a la amplitud del ruido

void setup() {
  // Frecuencia: 9600 Hz
  Serial.begin(9600);
}

void loop() {

  float Ip   = get_corriente();//obtenemos la corriente pico
  float Irms = Ip * 0.707;     //Intensidad RMS = Ipico/(2^1/2)
  float P    = Irms * 122.0;   // P=IV watts

  //Serial.print("Ip: ");
  Serial.print(";");
  Serial.print(Ip, 3);

  // Serial.print("A , Irms: ");
  Serial.print(";");
  Serial.print(Irms, 3);

  // Serial.print("A, Potencia: ");
  Serial.print(";");
  Serial.print(P, 3);
  Serial.print(";");

  //Serial.println("W");
  Serial.println();
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
