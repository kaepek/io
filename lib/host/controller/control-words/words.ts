const ControlWordsUI8: {[word_name: string]: number} = {
    Null : 0,
    Start : 1,
    Stop : 2,
    Reset : 3,
    SetDirectionUI8 : 4,
    SetThrustUI16 : 5
};

const ControlWordNames = Object.keys(ControlWordsUI8).reduce((acc: {[word_name: string]:string}, word_name: string) => {
    acc[word_name] = word_name;
    return acc;
}, {});

const ControlWordsUI8Inverted = Object.keys(ControlWordsUI8).reduce((acc: {[word_name: string]:string}, word_name: string) => {
    const word_value = ControlWordsUI8[word_name];
    acc[word_value] = word_name;
    return acc;
}, {});

const ControlWordDataTypes = {
    Int8: "Int8",
    UInt8: "UInt8",
    Int16LE: "Int16LE",
    UInt16LE: "UInt16LE",
    Int32LE: "Int32LE",
    UInt32LE: "UInt32LE",
    Int16BE: "Int16BE",
    UInt16BE: "UInt16BE",
    Int32BE: "Int32BE",
    UInt32BE: "UInt32BE",
    Float32LE: "Float32LE",
    Float64LE: "Float64LE",
    Float32BE: "Float32BE",
    Float64BE: "Float64BE",
}

export { ControlWordsUI8, ControlWordNames, ControlWordDataTypes, ControlWordsUI8Inverted }