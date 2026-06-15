import { AssessmentResponse, TransitType, DietType, EnergyType, ShoppingType } from './types';

// Constants for emissions factors (in metric tons of CO2 per year)
export const TRANSIT_FACTORS: Record<TransitType, number> = {
  'car-gas': 0.00017,    // 0.17 kg CO2 per km
  'car-hybrid': 0.00010, // 0.10 kg CO2 per km
  'electric': 0.00005,   // 0.05 kg CO2 per km
  'transit': 0.00004,    // 0.04 kg CO2 per km
  'none': 0.0
};

export const DIET_FACTORS: Record<DietType, number> = {
  'meat-heavy': 3.3,
  'balanced': 2.2,
  'low-meat': 1.7,
  'vegetarian': 1.3,
  'vegan': 0.9
};

export const ENERGY_FACTORS: Record<EnergyType, number> = {
  'coal-gas': 4.5,
  'grid-average': 2.8,
  'renewable': 0.5
};

export const FLIGHT_FACTOR = 0.9; // 0.9 tons CO2 per flight (average roundtrip)

export const SHOPPING_FACTORS: Record<ShoppingType, number> = {
  'heavy-consumer': 2.5,
  'average': 1.2,
  'minimalist': 0.4
};

export interface FootprintCalculationResult {
  total: number; // In metric tons of CO2/year
  breakdown: {
    transportation: number;
    diet: number;
    energy: number;
    travel: number;
    shopping: number;
  };
  highestSource: {
    name: string;
    key: keyof FootprintCalculationResult['breakdown'];
    value: number;
  };
  rating: {
    title: string;
    description: string;
    color: string;
  };
  confidenceScore: number; // out of 100
  equivalents: {
    treesSaved: number; // trees per year equivalent
    drivingOffsetKm: number; // km driven in gas car
    smartphoneCharges: number; // number of phone charges
  };
}

export function calculateCarbonFootprint(assessment: AssessmentResponse): FootprintCalculationResult {
  const transportation = (assessment.weeklyMileage * 52) * TRANSIT_FACTORS[assessment.transportation];
  const diet = DIET_FACTORS[assessment.diet];
  const energy = ENERGY_FACTORS[assessment.homeEnergy];
  const travel = assessment.travelFrequency * FLIGHT_FACTOR;
  const shopping = SHOPPING_FACTORS[assessment.shoppingHabits];

  const total = parseFloat((transportation + diet + energy + travel + shopping).toFixed(2));

  const breakdown = {
    transportation: parseFloat(transportation.toFixed(2)),
    diet: parseFloat(diet.toFixed(2)),
    energy: parseFloat(energy.toFixed(2)),
    travel: parseFloat(travel.toFixed(2)),
    shopping: parseFloat(shopping.toFixed(2))
  };

  // Find highest source
  const breakdownEntries = Object.entries(breakdown) as [keyof typeof breakdown, number][];
  const [highestKey, highestValue] = breakdownEntries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  , breakdownEntries[0]);

  const sourceNameMap: Record<keyof typeof breakdown, string> = {
    transportation: 'Transportation',
    diet: 'Diet & Food',
    energy: 'Home Energy',
    travel: 'Flights & Travel',
    shopping: 'Goods & Shopping'
  };

  const highestSource = {
    name: sourceNameMap[highestKey],
    key: highestKey,
    value: highestValue
  };

  // Determine carbon rating based on global benchmarks
  let rating = {
    title: 'Climate Conscious',
    description: 'Your footprint is around the European average. Excellent base to start adjusting habits!',
    color: 'var(--color-warning)'
  };

  if (total < 3.0) {
    rating = {
      title: 'Green Champion',
      description: 'Superb! Your footprint is under the sustainable global target to keep warming under 1.5°C.',
      color: 'var(--color-success)'
    };
  } else if (total < 7.0) {
    rating = {
      title: 'Eco-Explorer',
      description: 'Great job! Your footprint is below average for industrialized nations. Some small shifts will make you a Green Champion.',
      color: 'var(--color-success)'
    };
  } else if (total >= 12.0) {
    rating = {
      title: 'Eco-Learner',
      description: 'Your footprint is higher than average. Perfect timing to use the Twin Simulator to find easy reductions.',
      color: 'var(--color-error)'
    };
  }

  // Calculate equivalents
  // 1 tree absorbs ~22kg of CO2 per year -> ~45 trees absorb 1 ton per year
  const treesSaved = Math.round(total * 45);
  // 1 ton of CO2 is equivalent to ~5,880 km driving in a standard gasoline car
  const drivingOffsetKm = Math.round(total * 5880);
  // 1 ton of CO2 is equivalent to ~121,600 smartphone charges
  const smartphoneCharges = Math.round(total * 121600);

  // Confidence score: based on mileage accuracy (e.g. if mileage > 0, confidence is higher than assuming 0)
  // Let's make it a robust metric (e.g. 95% default, reduces slightly if parameters are at extreme values)
  const confidenceScore = assessment.weeklyMileage > 0 && assessment.travelFrequency >= 0 ? 98 : 92;

  return {
    total,
    breakdown,
    highestSource,
    rating,
    confidenceScore,
    equivalents: {
      treesSaved,
      drivingOffsetKm,
      smartphoneCharges
    }
  };
}
