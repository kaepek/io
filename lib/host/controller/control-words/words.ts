enum ControlWords {
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
};

enum ControlWordDataTypes {
    None = "None",
    Int8 = "Int8",
    UInt8 = "UInt8",
    Int16LE = "Int16LE",
    UInt16LE = "UInt16LE",
    Int32LE = "Int32LE",
    UInt32LE = "UInt32LE",
    Int16BE = "Int16BE",
    UInt16BE = "UInt16BE",
    Int32BE = "Int32BE",
    UInt32BE = "UInt32BE",
    Float32LE = "Float32LE",
    Float64LE = "Float64LE",
    Float32BE = "Float32BE",
    Float64BE = "Float64BE",
}

export { ControlWords, ControlWordDataTypes }