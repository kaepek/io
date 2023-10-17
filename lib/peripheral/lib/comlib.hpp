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
     * 6: ProportionalF32 - set the proportional pid coefficient
     * 7: IntegralF32 - sets the integral pid coefficient
     * 8: DerivativeF32 - sets the derivative pid coefficient
     * 9: Phase1F32 - sets phase 1 value
     * 10: Phase2F32 - sets phase 2 value
     * 11: Offset1F32 - sets offset 1 value
     * 12: Offset2F32 - sets offset 2 value
     * 13: SetPointF32 - sets the setpoint target
     * 14: PowerLawSetPointDivisorCWF32 - sets the power law bias setpoint divisor for the clockwise direction
     * 15: PowerLawRootCWF32 - sets the power law bias root for the clockwise direction
     * 16: PowerLawSetPointDivisorCCWF32 - sets the power law bias setpoint divisor for the counter clockwise direction
     * 17: PowerLawRootCCWF32 - sets the power law bias root for the counter clockwise direction
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
            Phase1F32 = 9,
            Phase2F32 = 10,
            Offset1F32 = 11,
            Offset2F32 = 12,
            SetPointF32 = 13,
            PowerLawSetPointDivisorCWF32 = 14,
            PowerLawRootCWF32 = 15,
            PowerLawSetPointDivisorCCWF32 = 16,
            PowerLawRootCCWF32 = 17,
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
         * 6: ProportionalF32 - Float32
         * 7: IntegralF32 - Float32
         * 8: DerivativeF32 - Float32
         * 9: Phase1F32 - Float32
         * 10: Phase2F32 - Float32
         * 11: Offset1F32 - Float32
         * 12: Offset2F32 - Float32
         * 13: SetPointF32 - Float32
         * 14: PowerLawSetPointDivisorCWF32 - Float32
         * 15: PowerLawRootCWF32 - Float32
         * 16: PowerLawSetPointDivisorCCWF32 - Float32
         * 17: PowerLawRootCCWF32 - Float32
         */
        uint32_t serial_input_command_word_buffer_size[18] = {
            0, // Null
            0, // Start
            0, // Stop
            0, // Reset
            1, // Direction1UI8
            2, // Thrust1UI16
            4, // ProportionalF32
            4, // IntegralF32
            4, // DerivativeF32
            4, // Phase1F32
            4, // Phase2F32
            4, // Offset1F32
            4, // Offset2F32
            4, // SetPointF32
            4, // PowerLawSetPointDivisorCWF32
            4, // PowerLawRootCWF32
            4, // PowerLawSetPointDivisorCCWF32
            4, // PowerLawRootCCWF32
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