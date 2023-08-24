#include "lib/comlib.cpp"

namespace kaepek
{
  class BaseTester {
    public:
     BaseTester() {}
  };

  class ComTester: public BaseTester
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
      Serial.print("Received control word:");
      Serial.println(control_word);
      Serial.print("Received control word buffer:");
      Serial.println(data_buffer[0]);
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
