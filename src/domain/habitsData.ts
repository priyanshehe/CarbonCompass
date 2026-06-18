import { Habit } from './types';

export const HABITS_REGISTRY: Habit[] = [
  // Transportation Habits
  {
    id: 'walk-bike-short-trips',
    category: 'transportation',
    title: 'Walk or Bike Short Trips',
    description: 'Replace car trips under 3 km with walking, running, or cycling.',
    difficulty: 'easy',
    impact: 'medium',
    co2ReductionPerWeek: 4.8, // in kg CO2
    metricAnalogy: 'equivalent to saving 28 km of gasoline driving.'
  },
  {
    id: 'transit-commute-twice',
    category: 'transportation',
    title: 'Public Transit Commute',
    description: 'Use the bus, subway, or train for your commute at least twice a week instead of driving alone.',
    difficulty: 'medium',
    impact: 'high',
    co2ReductionPerWeek: 12.5,
    metricAnalogy: 'equivalent to planting 0.3 mature trees.'
  },
  {
    id: 'wfh-one-day',
    category: 'transportation',
    title: 'Work from Home 1 Day',
    description: 'Work remotely one day per week to eliminate a full day of commuting.',
    difficulty: 'easy',
    impact: 'medium',
    co2ReductionPerWeek: 8.2,
    metricAnalogy: 'equivalent to 1,000 smartphone charges.'
  },

  // Diet & Food Habits
  {
    id: 'meatless-monday',
    category: 'diet',
    title: 'Meatless Mondays',
    description: 'Eat entirely plant-based (vegetarian or vegan) for one day every week.',
    difficulty: 'easy',
    impact: 'medium',
    co2ReductionPerWeek: 5.5,
    metricAnalogy: 'equivalent to avoiding 32 km of driving emissions.'
  },
  {
    id: 'vegetarian-shift',
    category: 'diet',
    title: 'Adopt a Vegetarian Diet',
    description: 'Eliminate meat from all meals, replacing it with vegetables, grains, legumes, and dairy.',
    difficulty: 'hard',
    impact: 'high',
    co2ReductionPerWeek: 18.0,
    metricAnalogy: 'equivalent to planting 0.4 mature trees every week.'
  },
  {
    id: 'meal-prep-no-waste',
    category: 'diet',
    title: 'Zero Food Waste Planner',
    description: 'Plan meals weekly to buy only what you need and eat all leftovers, reducing food waste to zero.',
    difficulty: 'medium',
    impact: 'medium',
    co2ReductionPerWeek: 6.0,
    metricAnalogy: 'equivalent to running a smart TV for 150 hours.'
  },

  // Home Energy Habits
  {
    id: 'thermostat-tweak',
    category: 'energy',
    title: '1°C Thermostat Adjustment',
    description: 'Set your thermostat 1°C lower in winter or 1°C higher in summer to conserve heating/cooling energy.',
    difficulty: 'easy',
    impact: 'medium',
    co2ReductionPerWeek: 7.2,
    metricAnalogy: 'equivalent to turning off 10 standard lightbulbs for a week.'
  },
  {
    id: 'wash-cold-water',
    category: 'energy',
    title: 'Wash Laundry in Cold Water',
    description: 'Use cold cycles for laundry instead of warm/hot water to save electricity on water heating.',
    difficulty: 'easy',
    impact: 'medium',
    co2ReductionPerWeek: 3.4,
    metricAnalogy: 'equivalent to saving 410 smartphone charges.'
  },
  {
    id: 'unplug-vampire-loads',
    category: 'energy',
    title: 'Kill Vampire Power Draw',
    description: 'Unplug chargers and electronics from outlets or turn off smart power strips when not in use.',
    difficulty: 'easy',
    impact: 'low',
    co2ReductionPerWeek: 1.5,
    metricAnalogy: 'equivalent to running a laptop for 24 hours straight.'
  },

  // Shopping & Consumption Habits
  {
    id: 'secondhand-first',
    category: 'consumption',
    title: 'Secondhand Fashion First',
    description: 'Commit to buying clothing secondhand or trading rather than purchasing brand new fast-fashion items.',
    difficulty: 'medium',
    impact: 'medium',
    co2ReductionPerWeek: 5.2,
    metricAnalogy: 'equivalent to saving 1,200 liters of water and manufacturing emissions.'
  },
  {
    id: 'minimalist-shopping',
    category: 'consumption',
    title: 'Mend and Reuse Week',
    description: 'Repair broken items and sew minor clothing tears rather than buying new replacements.',
    difficulty: 'easy',
    impact: 'medium',
    co2ReductionPerWeek: 4.0,
    metricAnalogy: 'equivalent to saving 24 km of gas car delivery transit.'
  }
];