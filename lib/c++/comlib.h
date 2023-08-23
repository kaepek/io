#include <Arduino.h>
#include "imxrt.h"

namespace kaepek
{

    /**
     * SerialInputCommandWord class typedef enum:
     * 0: Null word - does nothing
     * 1: Start - starts the device
     * 2: Stop - stops the device
     * 3: Reset - resets the device after a fault
     * 4: SetDirectionUI8 - set the device direction
     * 5: SetThrustUI16 - sets the thrust level
     */
    class SerialInputCommandWord
    {
    public:
        typedef enum
        {
            Null = 0,
            Start = 1,
            Stop = 2,
            Reset = 3,
            SetDirectionUI8 = 4,
            SetThrustUI16 = 5
        } Type;
    };

    template <typename T, std::size_t MAX_BUFFER_SIZE>
    class SerialInputControl
    {
    private:
        /**
         * serial_input_command_word_buffer_size array
         * 0: Null word - No data
         * 1: Start - No data
         * 2: Stop - No data
         * 3: Reset - No data
         * 4: SerialInputFault - No data
         * 5: SetDirectionUI8 - Unsigned Int 8 bit
         * 6: SetThrustUI16 - Unsigned Int 16 bit
         */
        int serial_input_command_word_buffer_size[] = {
            0, // Null
            0, // Start
            0, // Stop
            0, // Reset
            0, // SerialInputFault
            1, // SetDirectionUI8
            2, // SetThrustUI16
        };
        // The current data buffer's index.
        uint32_t buffer_idx = 0;
        // Variable to store if the current word is set or are we waiting for a new word.
        bool control_word_set = false;
        // Pointer to the instance of our device class.
        T *device_instance;

    protected:
        // The current word.
        uint32_t current_control_word = SerialInputCommandWord::Null;
        // The current buffer.
        uint32_t control_word_data_buffer[MAX_BUFFER_SIZE];
        // The current buffer size.
        uint32_t current_buffer_size = 0;

    public:
        SerialInputControl(T *device_instance);
        void read_input();
        void block_until_serial_input();
    };
}