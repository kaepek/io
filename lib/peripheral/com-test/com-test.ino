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
      // Serial.print("Received control word buffer:");
      // Serial.println(data_buffer);
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
  
}

void loop()
{
  delay(1000);
  Serial.println("good morning");
  device.run();
  // Serial.println("hihihi");
}
