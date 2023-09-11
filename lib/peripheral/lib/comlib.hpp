#include <Arduino.h>
#include "imxrt.h"

namespace kaepek
{
#ifndef KAEPEK_SERIAL_INPUT
#define KAEPEK_SERIAL_INPUT

    /**
     * SerialInputCommandWord class typedef enum:
     * 0: Null word - does nothing
     * 1: Start - starts the device
     * 2: Stop - stops the device
     * 3: Reset - resets the device after a fault
     * 4: Direction1UI8 - set the device direction
     * 5: Thrust1UI16 - sets the thrust level
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
            Direction1UI8 = 4,
            Thrust1UI16 = 5,
            ProportionalF32 = 6,
            IntegralF32 = 7,
            DerivativeF32 = 8,
        } Type;
    };

    template <std::size_t MAX_BUFFER_SIZE>
    class SerialInputControl
    {
    private:
        /**
         * serial_input_command_word_buffer_size array
         * 0: Null word - No data
         * 1: Start - No data
         * 2: Stop - No data
         * 3: Reset - No data
         * 4: Direction1UI8 - Unsigned Int 8 bit
         * 5: Thrust1UI16 - Unsigned Int 16 bit
         */
        uint32_t serial_input_command_word_buffer_size[9] = {
            0, // Null
            0, // Start
            0, // Stop
            0, // Reset
            1, // Direction1UI8
            2, // Thrust1UI16
            4, // ProportionalF32
            4, // IntegralF32
            4, // DerivativeF32
        };
        // The current data buffer's index.
        uint32_t buffer_idx = 0;
        // Variable to store if the current word is set or are we waiting for a new word.
        bool control_word_set = false;
        // Pointer to the instance of our device class.
        // T *device_instance;

    protected:
        // The current word.
        uint32_t current_control_word = SerialInputCommandWord::Null;
        // The current buffer.
        uint32_t control_word_data_buffer[MAX_BUFFER_SIZE];
        // The current buffer size.
        uint32_t current_buffer_size = 0;

    public:
        // SerialInputControl(T *_device_instance);
        SerialInputControl();
        void read_input();
        void block_until_serial_input();
        virtual void process_host_control_word(uint32_t control_word, uint32_t *data_buffer);
    };
#endif
}