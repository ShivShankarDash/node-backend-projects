function converter(valueToConvert : number, currentTab : string, fromUnit : string, toUnit : string){
    let result = 0;
    const lengthToMeters: { [key: string]: (v: number) => number } = {
        m: v => v,
        km: v => v * 1000,
        mi: v => v * 1609.34,
        ft: v => v * 0.3048,
    };
    const metersToLength : { [key : string] : (v : number) => number} = {
        m: v => v,
        km: v => v / 1000,
        mi: v => v / 1609.34,
        ft: v => v / 0.3048,
    }

    // Weight conversions (base: kilograms)
    const weightToKg: { [key: string]: (v: number) => number } = {
        kg: v => v,
        g: v => v / 1000,
        lb: v => v * 0.453592,
        oz: v => v * 0.0283495,
    };
    const kgToWeight: { [key: string]: (v: number) => number } = {
        kg: v => v,
        g: v => v * 1000,
        lb: v => v / 0.453592,
        oz: v => v / 0.0283495,
    };

    function toCelsius(value: number, from: string): number {
        if (from === "c") return value;
        if (from === "f") return (value - 32) * (5 / 9);
        if (from === "k") return value - 273.15;
        throw new Error("Invalid temperature unit");
    }
    function fromCelsius(value: number, to: string): number {
        if (to === "c") return value;
        if (to === "f") return value * (9 / 5) + 32;
        if (to === "k") return value + 273.15;
        throw new Error("Invalid temperature unit");
    }
    if(fromUnit === toUnit)
    {
        result = valueToConvert;
    }
    else if(currentTab === 'length'){
        const meters = lengthToMeters[fromUnit](valueToConvert);
        result = metersToLength[toUnit](meters);

    }
    else if(currentTab === 'weight'){
        console.log("fromUnit:", fromUnit, "toUnit:", toUnit, "valueToConvert:", valueToConvert);
        const kgs = weightToKg[fromUnit](valueToConvert);
        result = kgToWeight[toUnit](kgs);
    }
    else if (currentTab === 'temperature'){
        const celsius = toCelsius(valueToConvert, fromUnit);
        result = fromCelsius(celsius, toUnit);
    }
    return result;
}