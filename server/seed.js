require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Car = require("./models/Car");

const cars = [
  {
    slug: "picanto",
    name: "Kia Picanto",
    category: "Economy",
    seats: 4,
    doors: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    consumption: "5.0 L / 100 km",
    bags: 2,
    dailyRate: 35,
    weeklyRate: 210,
    monthlyRate: 780,
    year: 2023,
    color: "Silver",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Compact and fuel friendly. Easy to park in town and ideal for short trips around the island.",
    longDescription: "The Kia Picanto is the perfect city companion. With its compact size you slip into any parking spot, while its low fuel consumption keeps your trip budget friendly. Air conditioning, Bluetooth audio, and a quiet ride make it a comfortable choice for day trips and quick errands.",
    features: ["Air conditioning", "Bluetooth audio", "USB charging ports", "Power windows", "Central locking", "ABS brakes", "Front airbags", "Reverse camera"],
    highlights: ["Lowest daily rate in our fleet", "Easy to park anywhere", "Great fuel economy"],
  },
  {
    slug: "soul",
    name: "Kia Soul",
    category: "Comfort",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    consumption: "6.4 L / 100 km",
    bags: 3,
    dailyRate: 55,
    weeklyRate: 330,
    monthlyRate: 1180,
    year: 2023,
    color: "Black",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Spacious cabin with great visibility for longer drives.",
    longDescription: "The Kia Soul mixes the easy footprint of a hatchback with the head room of a small SUV. The high seating position gives you great visibility on island roads and the boxy shape leaves plenty of room for luggage and beach gear. A smooth automatic and a quiet cabin make longer drives feel light.",
    features: ["Air conditioning with rear vents", "Apple CarPlay and Android Auto", "Cruise control", "Reverse camera", "Bluetooth and USB", "Power windows and mirrors", "Front and side airbags", "Roomy trunk"],
    highlights: ["Great for families and groups", "Plenty of trunk space", "Easy step-in height"],
  },
  {
    slug: "sportage",
    name: "Kia Sportage",
    category: "SUV",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    consumption: "7.6 L / 100 km",
    bags: 4,
    dailyRate: 75,
    weeklyRate: 450,
    monthlyRate: 1620,
    year: 2023,
    color: "White",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Premium drive with the height and space of a true SUV.",
    longDescription: "The Kia Sportage gives you a confident view of the road and a comfortable ride for the whole group. With four full-size bags of luggage capacity, a smooth automatic, and modern driver assists, it is a great pick for families, surfers, and groups exploring beyond the city.",
    features: ["Climate control air conditioning", "Touchscreen infotainment", "Apple CarPlay and Android Auto", "Reverse camera with sensors", "Cruise control", "Lane departure warning", "Six airbags", "Power tailgate"],
    highlights: ["Roomy for five with luggage", "Higher driving position", "Premium feel inside"],
  },
  {
    slug: "rio",
    name: "Kia Rio",
    category: "Economy",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    consumption: "5.6 L / 100 km",
    bags: 2,
    dailyRate: 40,
    weeklyRate: 240,
    monthlyRate: 880,
    year: 2022,
    color: "Red",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "A solid daily driver with low running costs.",
    longDescription: "The Kia Rio is a balanced choice if you want a roomier feel than the Picanto without giving up the easy daily cost. A smooth automatic, good visibility, and a usable trunk make it a comfortable pick for couples and solo travelers.",
    features: ["Air conditioning", "Bluetooth audio", "USB charging", "Power windows", "Reverse camera", "ABS brakes", "Front airbags", "Cruise control"],
    highlights: ["Smooth daily driver", "Good trunk space for the size", "Friendly running costs"],
  },
  {
    slug: "hyundai-tucson",
    name: "Hyundai Tucson",
    category: "SUV",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    consumption: "7.8 L / 100 km",
    bags: 4,
    dailyRate: 80,
    weeklyRate: 480,
    monthlyRate: 1720,
    year: 2023,
    color: "Gray",
    image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Comfortable family SUV with great trunk space.",
    longDescription: "The Hyundai Tucson is a refined family SUV with a quiet cabin and plenty of trunk space. The smooth automatic and modern driver assists take the stress out of longer drives, and the high seating position is great for seeing more of the island.",
    features: ["Dual zone climate control", "Large touchscreen infotainment", "Apple CarPlay and Android Auto", "Blind spot monitor", "Reverse camera with sensors", "Cruise control", "Six airbags", "Heated mirrors"],
    highlights: ["Quiet and refined ride", "Big trunk for luggage", "Modern driver assists"],
  },
  {
    slug: "toyota-yaris",
    name: "Toyota Yaris",
    category: "Comfort",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    consumption: "5.4 L / 100 km",
    bags: 3,
    dailyRate: 50,
    weeklyRate: 300,
    monthlyRate: 1080,
    year: 2023,
    color: "Blue",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Quiet, smooth ride for daily errands and weekends.",
    longDescription: "The Toyota Yaris is a dependable, fuel-friendly choice with a comfortable ride and Toyota build quality. A great middle ground between economy and comfort, with enough room for a small group and a few bags.",
    features: ["Air conditioning", "Touchscreen audio", "Bluetooth and USB", "Cruise control", "Reverse camera", "Front and side airbags", "Power windows", "Stability control"],
    highlights: ["Toyota build quality", "Excellent fuel economy", "Smooth automatic"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await User.create({ email: "admin@carrental.com", password: "password" });
  console.log("Admin user created: admin@carrental.com / password");

  await Car.deleteMany({});
  await Car.insertMany(cars);
  console.log(`Seeded ${cars.length} cars`);

  await mongoose.disconnect();
  console.log("Done. You can now start the server.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
