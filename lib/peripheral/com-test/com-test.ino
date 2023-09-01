#include "lib/comlib.cpp"

namespace kaepek
{
  class BaseTester
  {
  public:
    BaseTester() {}
  };

  class ComTester : public BaseTester, public SerialInputControl<2>
  {
  public:
    ComTester()
        : BaseTester(), SerialInputControl<2>()
    {
    }

    void process_host_control_word(uint32_t control_word, uint32_t *data_buffer)
    {
      uint16_t com_torque_value = 0;
      switch (control_word)
      {
      case SerialInputCommandWord::Null:
        Serial.println("Recieved word Null");
        break;
      case SerialInputCommandWord::Start:
        Serial.println("Recieved word Start");
        break;
      case SerialInputCommandWord::Stop:
        Serial.println("Recieved word Stop");
        break;
      case SerialInputCommandWord::Reset:
        Serial.println("Recieved word Reset");
        break;
      case SerialInputCommandWord::Thrust1UI16:
        Serial.println("Recieved word Thrust1UI16");
        com_torque_value = (data_buffer[1] << 8) | data_buffer[0];
        Serial.print("Word value: ");Serial.println(com_torque_value);
        break;
      case SerialInputCommandWord::Direction1UI8:
        Serial.println("Recieved word Direction1UI8");
        Serial.print("Word value: ");Serial.println(data_buffer[0]);
        break;
      default:
        Serial.print("Recieved unknown word: ");
        Serial.println(control_word);
        break;
      }
    }

    void run()
    {
      read_input();
    }
  };
}

kaepek::ComTester device;

void setup()
{
}

void loop()
{
  device.run();
}
