#include "lib/comlib.cpp"

namespace kaepek
{
  class BaseTester
  {
  public:
    BaseTester() {}
  };

  class ComTester : public BaseTester
  {
  private:
    SerialInputControl<ComTester, 2> serialInputControl;

  public:
    ComTester()
        : BaseTester(),
          serialInputControl(this)
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
      case SerialInputCommandWord::SetThrustUI16:
        Serial.println("Recieved word SetThrustUI16");
        com_torque_value = (data_buffer[1] << 8) | data_buffer[0];
        Serial.print("Word value: ");Serial.println(com_torque_value);
        break;
      case SerialInputCommandWord::SetDirectionUI8:
        Serial.println("Recieved word SetDirectionUI8");
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
      serialInputControl.read_input();
    }
  };
}

kaepek::ComTester device;

void setup()
{
  // Delay serial read as too early and it gets junk noise data.
  /*while (!Serial.available())
  {
      delay(100);
  }*/
}

void loop()
{
  device.run();
}
