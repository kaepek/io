#include "lib/comlib.cpp"

namespace kaepek
{
  /**
   * Dummy Base class
   */
  class BaseTester
  {
  public:
    BaseTester() {}
  };

  /**
   * ComTester a class to demonstrate the use of SerialInputControl
   */
  class ComTester : public BaseTester, public SerialInputControl<4>
  {
  private:
    /**
     * Method to handler control input recieved via the serial port
     * @param control_word The SerialInputCommandWord in question e.g. Start Stop Thrust1UI16
     * @param data_buffer Optional data buffer. Words which have values associated with them e.g. Thrust1UI16 has type bytes worth of data in the buffer.
     */
    void process_host_control_word(uint32_t control_word, uint32_t *data_buffer)
    {
      uint16_t com_torque_value = 0;
      float float_value = 0;
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
        Serial.print("Word value: ");
        Serial.println(com_torque_value);
        break;
      case SerialInputCommandWord::Direction1UI8:
        Serial.println("Recieved word Direction1UI8");
        Serial.print("Word value: ");
        Serial.println(data_buffer[0]);
        break;
      case SerialInputCommandWord::ProportionalF32:
        Serial.println("Recieved word ProportionalF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::IntegralF32:
        Serial.println("Recieved word IntegralF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::DerivativeF32:
        Serial.println("Recieved word DerivativeF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Phase1F32:
        Serial.println("Recieved word Phase1F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Phase2F32:
        Serial.println("Recieved word Phase2F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Offset1F32:
        Serial.println("Recieved word Offset1F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::Offset2F32:
        Serial.println("Recieved word Offset2F32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::SetPointF32:
        Serial.println("Recieved word SetPointF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawSetPointDivisorCWF32:
        Serial.println("Recieved word PowerLawSetPointDivisorCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawRootCWF32:
        Serial.println("Recieved word PowerLawRootCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawSetPointDivisorCCWF32:
        Serial.println("Recieved word PowerLawSetPointDivisorCCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::PowerLawRootCCWF32:
        Serial.println("Recieved word PowerLawRootCCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearSetpointCoefficientCWF32:
        Serial.println("Recieved word LinearSetpointCoefficientCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearSetpointCoefficientCCWF32:
        Serial.println("Recieved word LinearSetpointCoefficientCCWF32");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearBiasCW:
        Serial.println("Recieved word LinearBiasCW");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      case SerialInputCommandWord::LinearBiasCCW:
        Serial.println("Recieved word LinearBiasCCW");
        *((unsigned char *)&float_value + 0) = data_buffer[0];
        *((unsigned char *)&float_value + 1) = data_buffer[1];
        *((unsigned char *)&float_value + 2) = data_buffer[2];
        *((unsigned char *)&float_value + 3) = data_buffer[3];
        Serial.print("Word value: ");
        Serial.println(float_value);
        break;
      default:
        Serial.print("Recieved unknown word: ");
        Serial.println(control_word);
        break;
      }
    }

  public:
    /**
     * ComTester constructor, demostrates multiple inheritance
     */
    ComTester()
        : BaseTester(), SerialInputControl<4>()
    {
    }

    /**
     * Method to invoke the control input read method.
     */
    void run()
    {
      read_input();
    }
  };
}

// Create instance.
kaepek::ComTester device;

// Setup logic.
void setup()
{
}

// Loop logic.
void loop()
{
  device.run();
}
