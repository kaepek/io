enum ControlWords {
    Null = 0,
    Start = 1,
    Stop = 2,
    Reset = 3,
    SetDirectionUI8 = 4,
    SetThrustUI16 = 5
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