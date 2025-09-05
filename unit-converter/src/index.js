"use strict";
function converter(valueToConvert, currentTab, fromUnit, toUnit) {
    let result = 0;
    const lengthToMeters = {
        m: v => v,
        km: v => v * 1000,
        mi: v => v * 1609.34,
        ft: v => v * 0.3048,
    };
    const metersToLength = {
        m: v => v,
        km: v => v / 1000,
        mi: v => v / 1609.34,
        ft: v => v / 0.3048,
    };
    // Weight conversions (base: kilograms)
    const weightToKg = {
        kg: v => v,
        g: v => v / 1000,
        lb: v => v * 0.453592,
        oz: v => v * 0.0283495,
    };
    const kgToWeight = {
        kg: v => v,
        g: v => v * 1000,
        lb: v => v / 0.453592,
        oz: v => v / 0.0283495,
    };
    function toCelsius(value, from) {
        if (from === "c")
            return value;
        if (from === "f")
            return (value - 32) * (5 / 9);
        if (from === "k")
            return value - 273.15;
        throw new Error("Invalid temperature unit");
    }
    function fromCelsius(value, to) {
        if (to === "c")
            return value;
        if (to === "f")
            return value * (9 / 5) + 32;
        if (to === "k")
            return value + 273.15;
        throw new Error("Invalid temperature unit");
    }
    if (fromUnit === toUnit) {
        result = valueToConvert;
    }
    if (currentTab === 'length') {
        const meters = lengthToMeters[fromUnit](valueToConvert);
        result = metersToLength[toUnit](meters);
    }
    else if (currentTab === 'weight') {
        const kgs = weightToKg[fromUnit](valueToConvert);
        result = kgToWeight[toUnit](valueToConvert);
    }
    else {
        const celsius = toCelsius(valueToConvert, fromUnit);
        result = fromCelsius(celsius, toUnit);
    }
    return result;
}
