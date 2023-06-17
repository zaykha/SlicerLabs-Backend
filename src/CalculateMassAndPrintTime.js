

 function calculateMassAndPrintTime(material, color, dimensions) {
  // Define the density values for different materials
  const densityValues = {
    ABS: 1.04,     // g/cm^3
    PLA: 1.25,     // g/cm^3
    TPU: 1.21,     // g/cm^3
    NYLON: 1.14,   // g/cm^3
    PETG: 1.27,    // g/cm^3
    RESIN: 1.05    // g/cm^3
  };

  // Define the print time per unit volume for different materials (in minutes)
  const printTimePerUnitVolume = {
    ABS: 0.05,     // minutes/cm^3
    PLA: 0.04,     // minutes/cm^3
    TPU: 0.06,     // minutes/cm^3
    NYLON: 0.07,   // minutes/cm^3
    PETG: 0.05,    // minutes/cm^3
    RESIN: 0.03    // minutes/cm^3
  };

  // Calculate the volume
  const volume = dimensions.width * dimensions.height * dimensions.depth; // cm^3

  // Calculate the mass based on the density
  const density = densityValues[material.toUpperCase()] || 0; // g/cm^3
  const mass = volume * density; // grams

  // Calculate the print time based on the print time per unit volume
  const printTime = volume * printTimePerUnitVolume[material.toUpperCase()] || 0; // minutes

  // Return the calculated mass and print time
  return {
    mass: mass.toFixed(2),        // Rounded to 2 decimal places
    printTime: printTime.toFixed(2)
  };
}

