#include "comlib.hpp"

namespace kaepek
{
    template <typename T, std::size_t MAX_BUFFER_SIZE>
    SerialInputControl<T, MAX_BUFFER_SIZE>::SerialInputControl(T *device_instance)
        : device_instance(device_instance)
    {
    }

    template <typename T, std::size_t MAX_BUFFER_SIZE>
    void SerialInputControl<T, MAX_BUFFER_SIZE>::read_input()
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
            }
            else
            {
                // we are working on a word already, handle the byte
                control_word_data_buffer[buffer_idx] = next_byte;
                buffer_idx++;
                if (buffer_idx > serial_input_command_word_buffer_size[current_control_word])
                {
                    control_word_set = false;
                    device_instance->process_host_control_word(current_control_word, control_word_data_buffer);
                }
            }
        }
        sei(); // enable interrupt.
    }

    template <typename T, std::size_t MAX_BUFFER_SIZE>
    void SerialInputControl<T, MAX_BUFFER_SIZE>::block_until_serial_input()
    {
        // Delay serial read as too early and it gets junk noise data.
        while (!Serial.available())
        {
            delay(300);
        }
    }

}