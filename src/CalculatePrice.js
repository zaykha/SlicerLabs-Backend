
// export function calculateMassAndPrintTime(material, color, dimensions) {
//     // Define the density values for different materials
//     const densityValues = {
//       ABS: 1.04,     // g/cm^3
//       PLA: 1.25,     // g/cm^3
//       TPU: 1.21,     // g/cm^3
//       NYLON: 1.14,   // g/cm^3
//       PETG: 1.27,    // g/cm^3
//       RESIN: 1.05    // g/cm^3
//     };
  
//     // Define the print time per unit volume for different materials (in minutes)
//     const printTimePerUnitVolume = {
//       ABS: 0.05,     // minutes/cm^3
//       PLA: 0.04,     // minutes/cm^3
//       TPU: 0.06,     // minutes/cm^3
//       NYLON: 0.07,   // minutes/cm^3
//       PETG: 0.05,    // minutes/cm^3
//       RESIN: 0.03    // minutes/cm^3
//     };
  
//     // Calculate the volume
//     const volume = dimensions.width * dimensions.height * dimensions.depth; // cm^3
  
//     // Calculate the mass based on the density
//     const density = densityValues[material.toUpperCase()] || 0; // g/cm^3
//     const mass = volume * density; // grams
  
//     // Calculate the print time based on the print time per unit volume
//     const printTime = volume * printTimePerUnitVolume[material.toUpperCase()] || 0; // minutes
  
//     // Return the calculated mass and print time
//     return {
//       mass: mass.toFixed(2),        // Rounded to 2 decimal places
//       printTime: printTime.toFixed(2)
//     };
//   }
  

//   export function calculatePostProcessingTime(complexity) {
//     if (!complexity) {
//       return 0; // Return 0 if complexity is not defined
//     }
  
//     const complexityLower = complexity.toLowerCase(); // Convert to lowercase
//     // Calculate the post-processing time based on the complexity
//     if (complexityLower === "low") {
//       return 1; // Return the desired value for low complexity
//     } else if (complexityLower === "medium") {
//       return 2; // Return the desired value for medium complexity
//     } else if (complexityLower === "high") {
//       return 3; // Return the desired value for high complexity
//     }
  
//     return 0; // Return 0 if complexity is not recognized
//   }
  

// export default function calculatePrice(material, color, dimensions) {
//   // Define the base cost per gram for different materials
//   const materialCosts = {
//     ABS: 0.05, // SGD per gram
//     PLA: 0.04, // SGD per gram
//     TPU: 0.06, // SGD per gram
//     NYLON: 0.07, // SGD per gram
//     PETG: 0.05, // SGD per gram
//     Resin: 0.1, // SGD per gram
//   };

//   // Define the hourly machine usage rate
//   const hourlyRate = 20; // SGD per hour

//   // Define the labor cost per hour for post-processing tasks
//   const laborCost = 25; // SGD per hour

//   // Define any additional overhead costs per print or per hour
//   const overheadCost = 5; // SGD per print or per hour

//   // Calculate mass and print time using the calculateMassAndPrintTime function
//   const { mass, printTime } = calculateMassAndPrintTime(
//     material,
//     color,
//     dimensions
//   );

//   // Calculate material cost based on the weight of the object
//   const materialCost = materialCosts[material] * mass;

//   // Calculate the machine usage cost based on the print time
//   const machineUsageCost = (printTime / 60) * hourlyRate;

//   // Calculate the labor cost based on the post-processing time (if applicable)
//   const postProcessingTime = calculatePostProcessingTime(dimensions.complexity); // Your implementation here
//   const LaborCost = postProcessingTime * laborCost;

//   // Calculate the total cost including material, machine usage, labor, and overhead costs
//   const totalCost = materialCost + machineUsageCost + LaborCost + overheadCost;

//   const roundedTotalCost = totalCost.toFixed(2);
//   // Return the calculated price
//   return parseFloat(roundedTotalCost);
// }


export default function calculatePrice(material, color, dimensions) {
  // Check if dimensions is defined, if not, set it to an empty object
  dimensions = dimensions || {};

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

  // Define the base cost per gram for different materials
  const materialCosts = {
    ABS: 0.05, // SGD per gram
    PLA: 0.04, // SGD per gram
    TPU: 0.06, // SGD per gram
    NYLON: 0.07, // SGD per gram
    PETG: 0.05, // SGD per gram
    Resin: 0.1, // SGD per gram
  };

  // Define the hourly machine usage rate
  const hourlyRate = 20; // SGD per hour

  // Define the labor cost per hour for post-processing tasks
  const laborCost = 25; // SGD per hour

  // Define any additional overhead costs per print or per hour
  const overheadCost = 5; // SGD per print or per hour


  // Calculate mass and print time using the calculateMassAndPrintTime function
  const volume = dimensions.width * dimensions.height * dimensions.depth || 0;; // cm^3
  const density = densityValues[material] || 0; // g/cm^3
  const mass = volume * density; // grams
  const printTime = volume * printTimePerUnitVolume[material] || 0; // minutes

  // Calculate material cost based on the weight of the object
  const materialCost = materialCosts[material] * mass;

  // Calculate the machine usage cost based on the print time
  const machineUsageCost = (printTime / 60) * hourlyRate;

  // Calculate the labor cost based on the post-processing time (if applicable)
  const complexityLower = dimensions.complexity?.toLowerCase() || "";
  let postProcessingTime = 0;

  if (complexityLower === "low") {
    postProcessingTime = 1;
  } else if (complexityLower === "medium") {
    postProcessingTime = 2;
  } else if (complexityLower === "high") {
    postProcessingTime = 3;
  }

  const LaborCost = postProcessingTime * laborCost;

  // Calculate the total cost including material, machine usage, labor, and overhead costs
  const totalCost = materialCost + machineUsageCost + LaborCost + overheadCost;

  const roundedTotalCost = totalCost.toFixed(2);
  // Return the calculated price
  return parseFloat(roundedTotalCost);
}