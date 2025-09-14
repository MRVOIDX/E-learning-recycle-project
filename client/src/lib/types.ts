export interface WasteCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  gradient?: string;
  borderColor?: string;
  iconBg?: string;
  accent?: string;
  pattern?: string;
  effects?: string;
}

export interface WasteDetails {
  title: string;
  whatGoesIn: string[];
  whatStaysOut: string[];
  instructions: string[];
  tips: string[];
  content: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'plastic',
    name: 'Plastic & Polymers',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    icon: '♻️',
    description: 'Bottles, containers, packaging materials',
    gradient: 'from-blue-50 via-cyan-50 to-blue-100',
    borderColor: 'border-blue-300/50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    accent: 'text-blue-700',
    pattern: 'bg-blue-500/5',
    effects: 'shadow-blue-200/50 hover:shadow-blue-300/60'
  },
  {
    id: 'glass',
    name: 'Glass & Crystal',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    icon: '✨',
    description: 'Jars, bottles, transparent containers',
    gradient: 'from-emerald-50 via-teal-50 to-emerald-100',
    borderColor: 'border-emerald-300/50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    accent: 'text-emerald-700',
    pattern: 'bg-emerald-500/5',
    effects: 'shadow-emerald-200/50 hover:shadow-emerald-300/60'
  },
  {
    id: 'organic',
    name: 'Organic Matter',
    color: 'bg-gradient-to-br from-amber-500 to-orange-500',
    icon: '🌱',
    description: 'Food waste, yard trimmings, biodegradables',
    gradient: 'from-amber-50 via-orange-50 to-amber-100',
    borderColor: 'border-amber-300/50',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    accent: 'text-amber-700',
    pattern: 'bg-amber-500/5',
    effects: 'shadow-amber-200/50 hover:shadow-amber-300/60'
  },
  {
    id: 'ewaste',
    name: 'Electronic Waste',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: '⚡',
    description: 'Electronics, batteries, digital devices',
    gradient: 'from-purple-50 via-pink-50 to-purple-100',
    borderColor: 'border-purple-300/50',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    accent: 'text-purple-700',
    pattern: 'bg-purple-500/5',
    effects: 'shadow-purple-200/50 hover:shadow-purple-300/60'
  }
];

export const WASTE_DETAILS: Record<string, WasteDetails> = {
  plastic: {
    title: "Plastic Waste Sorting",
    whatGoesIn: ["Water bottles", "Food containers", "Milk jugs", "Detergent bottles"],
    whatStaysOut: ["Plastic bags", "Styrofoam", "Broken plastic toys"],
    instructions: ["Remove caps and lids", "Rinse clean of food residue", "Check recycling number", "Place in designated bin"],
    tips: ["Plastic bottles can be recycled multiple times", "Look for the recycling number on the bottom"],
    content: "Plastic recycling helps reduce environmental waste and creates new products."
  },
  glass: {
    title: "Glass Waste Sorting",
    whatGoesIn: ["Glass bottles", "Food jars", "Beverage containers", "Cosmetic jars"],
    whatStaysOut: ["Window glass", "Light bulbs", "Mirrors", "Ceramics"],
    instructions: ["Remove all caps and lids", "Empty contents completely", "Quick rinse (no soap needed)", "Sort by color if required"],
    tips: ["Glass can be recycled infinitely without losing quality", "It takes about 30 days to go from bin to shelf"],
    content: "Glass recycling conserves raw materials and energy while reducing landfill waste."
  },
  organic: {
    title: "Organic Waste Composting",
    whatGoesIn: ["Fruit and vegetable scraps", "Coffee grounds and filters", "Eggshells", "Yard trimmings"],
    whatStaysOut: ["Meat and dairy products", "Pet waste", "Diseased plants", "Treated wood"],
    instructions: ["Separate food scraps", "Add yard waste", "Keep meat and dairy out", "Turn compost regularly"],
    tips: ["Organic waste makes up 30% of household trash", "Compost creates nutrient-rich soil"],
    content: "Composting organic waste reduces methane emissions and creates valuable soil amendment."
  },
  ewaste: {
    title: "Electronic Waste (E-waste)",
    whatGoesIn: ["Old smartphones and tablets", "Computer equipment", "Batteries (all types)", "Small appliances"],
    whatStaysOut: ["Items with personal data intact", "Damaged batteries", "Large appliances without arrangement"],
    instructions: ["Wipe personal data", "Remove batteries if possible", "Take to certified center", "Never put in regular trash"],
    tips: ["E-waste contains valuable metals like gold and silver", "Proper recycling prevents toxic materials from landfills"],
    content: "E-waste recycling recovers valuable materials and prevents environmental contamination."
  }
};
