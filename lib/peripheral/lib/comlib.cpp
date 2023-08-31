#include "comlib.hpp"

namespace kaepek
{
    /*template <std::size_t MAX_BUFFER_SIZE>
    SerialInputControl< MAX_BUFFER_SIZE>::SerialInputControl(T *_device_instance)
    {
        // this->device_instance = _device_instance;
    }*/

    template <std::size_t MAX_BUFFER_SIZE>
    SerialInputControl< MAX_BUFFER_SIZE>::SerialInputControl()
    {
    }

    template <std::size_t MAX_BUFFER_SIZE>
    void SerialInputControl< MAX_BUFFER_SIZE>::read_input()
    {
        cli(); // no interrupt.
        while (Serial.available())
        {
            // we have a byte.
            char next_byte = Serial.read();
            if (!control_word_set)
            {
                // next byte is a word.
                current_control_word = next_byte;
                control_word_set = true;
                // if the word has no data then we are done with this word.
                if (serial_input_command_word_buffer_size[current_control_word] == 0)
                {
                    control_word_set = false;
                    buffer_idx = 0;
                    process_host_control_word(current_control_word, control_word_data_buffer);
                }
            }
            else
            {
                // we are working on a word already, handle the bytes of data
                control_word_data_buffer[buffer_idx] = next_byte;
                buffer_idx++;
                // if the word buffer is complete then we are done with this word
                if (buffer_idx == serial_input_command_word_buffer_size[current_control_word])
                {
                    control_word_set = false;
                    buffer_idx = 0;
                    process_host_control_word(current_control_word, control_word_data_buffer);
                }
            }
        }
        sei(); // enable interrupt.
    }

    template <std::size_t MAX_BUFFER_SIZE>
    void SerialInputControl< MAX_BUFFER_SIZE>::block_until_serial_input()
    {
        // Delay serial read as too early and it gets junk noise data.
        while (!Serial.available())
        {
            delay(300);
        }
    }

}