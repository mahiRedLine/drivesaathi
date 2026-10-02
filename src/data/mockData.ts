import { 
  VehicleModel, 
  Trainer, 
  TrainingPackage, 
  CityConfig, 
  PricingRuleConfig, 
  Coupon,
  Booking,
  SafetyIncident
} from '../types';

export const POPULAR_CITIES: CityConfig[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    active: true,
    baseRatePerHour: 599,
    activeTrainersCount: 48,
    lat: 12.9716,
    lng: 77.5946,
    popularAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'JP Nagar', 'Electronic City', 'Malleshwaram']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    active: true,
    baseRatePerHour: 649,
    activeTrainersCount: 42,
    lat: 19.0760,
    lng: 72.8777,
    popularAreas: ['Bandra West', 'Andheri West', 'Powai', 'Juhu', 'Worli', 'Thane West', 'Navi Mumbai']
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi',
    active: true,
    baseRatePerHour: 599,
    activeTrainersCount: 39,
    lat: 28.6139,
    lng: 77.2090,
    popularAreas: ['South Extension', 'Dwarka', 'Gurugram Golf Course Rd', 'Cyber City', 'Noida Sector 62', 'Vasant Kunj']
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    active: true,
    baseRatePerHour: 549,
    activeTrainersCount: 28,
    lat: 17.3850,
    lng: 78.4867,
    popularAreas: ['Gachibowli', 'Jubilee Hills', 'Madhapur', 'Banjara Hills', 'Kondapur', 'Kukatpally']
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    active: true,
    baseRatePerHour: 549,
    activeTrainersCount: 22,
    lat: 18.5204,
    lng: 73.8567,
    popularAreas: ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner', 'Kalyani Nagar', 'Aundh']
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    active: true,
    baseRatePerHour: 549,
    activeTrainersCount: 19,
    lat: 13.0827,
    lng: 80.2707,
    popularAreas: ['Anna Nagar', 'Adyar', 'OMR', 'Velachery', 'T Nagar', 'Besant Nagar']
  }
];

export const VEHICLE_DATABASE: VehicleModel[] = [
  // Popular Cars
  {
    id: 'car-maruti-swift',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    category: 'CAR',
    transmissions: ['MANUAL', 'AMT'],
    fuelTypes: ['PETROL', 'CNG'],
    popular: true,
    ccOrBattery: '1.2L Z-Series',
    image: 'https://images.unsplash.com/photo-1590362891988-f77804702958?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'car-maruti-baleno',
    brand: 'Maruti Suzuki',
    model: 'Baleno',
    category: 'CAR',
    transmissions: ['MANUAL', 'AMT'],
    fuelTypes: ['PETROL', 'CNG'],
    popular: true,
    ccOrBattery: '1.2L DualJet'
  },
  {
    id: 'car-maruti-brezza',
    brand: 'Maruti Suzuki',
    model: 'Brezza',
    category: 'CAR',
    transmissions: ['MANUAL', 'AUTOMATIC'],
    fuelTypes: ['PETROL', 'CNG'],
    popular: true,
    ccOrBattery: '1.5L K15C'
  },
  {
    id: 'car-hyundai-creta',
    brand: 'Hyundai',
    model: 'Creta',
    category: 'CAR',
    transmissions: ['MANUAL', 'AUTOMATIC', 'DCT', 'CVT'],
    fuelTypes: ['PETROL', 'DIESEL'],
    popular: true,
    ccOrBattery: '1.5L Turbo / MPi'
  },
  {
    id: 'car-hyundai-venue',
    brand: 'Hyundai',
    model: 'Venue',
    category: 'CAR',
    transmissions: ['MANUAL', 'DCT'],
    fuelTypes: ['PETROL', 'DIESEL'],
    popular: true,
    ccOrBattery: '1.2L / 1.0L Turbo'
  },
  {
    id: 'car-hyundai-i20',
    brand: 'Hyundai',
    model: 'i20',
    category: 'CAR',
    transmissions: ['MANUAL', 'CVT'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '1.2L Kappa'
  },
  {
    id: 'car-tata-nexon',
    brand: 'Tata Motors',
    model: 'Nexon',
    category: 'CAR',
    transmissions: ['MANUAL', 'AMT', 'DCT', 'EV'],
    fuelTypes: ['PETROL', 'DIESEL', 'EV', 'CNG'],
    popular: true,
    ccOrBattery: '1.2L Turbo / 40.5 kWh EV'
  },
  {
    id: 'car-tata-punch',
    brand: 'Tata Motors',
    model: 'Punch / Punch.ev',
    category: 'CAR',
    transmissions: ['MANUAL', 'AMT', 'EV'],
    fuelTypes: ['PETROL', 'CNG', 'EV'],
    popular: true,
    ccOrBattery: '1.2L Revotron / 35 kWh'
  },
  {
    id: 'car-tata-tiago-ev',
    brand: 'Tata Motors',
    model: 'Tiago.ev',
    category: 'CAR',
    transmissions: ['EV'],
    fuelTypes: ['EV'],
    popular: true,
    ccOrBattery: '24 kWh Battery'
  },
  {
    id: 'car-mahindra-xuv700',
    brand: 'Mahindra',
    model: 'XUV700',
    category: 'CAR',
    transmissions: ['MANUAL', 'AUTOMATIC'],
    fuelTypes: ['PETROL', 'DIESEL'],
    popular: true,
    ccOrBattery: '2.0L mStallion / 2.2L mHawk'
  },
  {
    id: 'car-mahindra-thar',
    brand: 'Mahindra',
    model: 'Thar / Thar ROXX',
    category: 'CAR',
    transmissions: ['MANUAL', 'AUTOMATIC'],
    fuelTypes: ['PETROL', 'DIESEL'],
    popular: true,
    ccOrBattery: '2.0L / 2.2L 4x4'
  },
  {
    id: 'car-toyota-hyryder',
    brand: 'Toyota',
    model: 'Urban Cruiser Hyryder',
    category: 'CAR',
    transmissions: ['MANUAL', 'AUTOMATIC', 'CVT'],
    fuelTypes: ['PETROL', 'HYBRID', 'CNG'],
    popular: true,
    ccOrBattery: '1.5L Strong Hybrid'
  },
  {
    id: 'car-kia-seltos',
    brand: 'Kia',
    model: 'Seltos',
    category: 'CAR',
    transmissions: ['MANUAL', 'AUTOMATIC', 'DCT', 'CVT'],
    fuelTypes: ['PETROL', 'DIESEL'],
    popular: true,
    ccOrBattery: '1.5L Smartstream'
  },
  {
    id: 'car-honda-elevate',
    brand: 'Honda',
    model: 'Elevate',
    category: 'CAR',
    transmissions: ['MANUAL', 'CVT'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '1.5L i-VTEC'
  },
  {
    id: 'car-mg-windsor',
    brand: 'MG',
    model: 'Windsor EV / ZS EV',
    category: 'CAR',
    transmissions: ['EV'],
    fuelTypes: ['EV'],
    popular: true,
    ccOrBattery: '38 kWh Battery'
  },
  {
    id: 'car-bmw-3series',
    brand: 'BMW',
    model: '3 Series Gran Limousine / X1',
    category: 'CAR',
    transmissions: ['AUTOMATIC'],
    fuelTypes: ['PETROL', 'DIESEL'],
    popular: false,
    ccOrBattery: '2.0L TwinPower Turbo'
  },

  // Two Wheelers - Motorcycles
  {
    id: 'bike-re-classic350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    category: 'MOTORCYCLE',
    transmissions: ['MANUAL'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '349cc J-Series'
  },
  {
    id: 'bike-re-hunter350',
    brand: 'Royal Enfield',
    model: 'Hunter 350',
    category: 'MOTORCYCLE',
    transmissions: ['MANUAL'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '349cc'
  },
  {
    id: 'bike-tvs-apache',
    brand: 'TVS',
    model: 'Apache RTR 160 / 200 4V',
    category: 'MOTORCYCLE',
    transmissions: ['MANUAL'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '160cc / 197cc'
  },
  {
    id: 'bike-bajaj-pulsar',
    brand: 'Bajaj',
    model: 'Pulsar N160 / NS200',
    category: 'MOTORCYCLE',
    transmissions: ['MANUAL'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '164cc Oil-Cooled'
  },
  {
    id: 'bike-yamaha-mt15',
    brand: 'Yamaha',
    model: 'MT-15 V2 / FZ-S',
    category: 'MOTORCYCLE',
    transmissions: ['MANUAL'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '155cc VVA'
  },

  // Scooters
  {
    id: 'scooter-honda-activa',
    brand: 'Honda',
    model: 'Activa 6G / 125',
    category: 'SCOOTER',
    transmissions: ['CVT'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '109.5cc eSP'
  },
  {
    id: 'scooter-tvs-jupiter',
    brand: 'TVS',
    model: 'Jupiter 110 / 125',
    category: 'SCOOTER',
    transmissions: ['CVT'],
    fuelTypes: ['PETROL', 'CNG'],
    popular: true,
    ccOrBattery: '113.3cc'
  },
  {
    id: 'scooter-suzuki-access',
    brand: 'Suzuki',
    model: 'Access 125',
    category: 'SCOOTER',
    transmissions: ['CVT'],
    fuelTypes: ['PETROL'],
    popular: true,
    ccOrBattery: '124cc SEP'
  },
  {
    id: 'scooter-ather-450x',
    brand: 'Ather Energy',
    model: '450X / Rizta',
    category: 'SCOOTER',
    transmissions: ['EV'],
    fuelTypes: ['EV'],
    popular: true,
    ccOrBattery: '3.7 kWh PMSM'
  },
  {
    id: 'scooter-ola-s1',
    brand: 'Ola Electric',
    model: 'S1 Pro / S1 Air',
    category: 'SCOOTER',
    transmissions: ['EV'],
    fuelTypes: ['EV'],
    popular: true,
    ccOrBattery: '4.0 kWh Hub/Mid'
  }
];

export const MOCK_TRAINERS: Trainer[] = [
  {
    id: 'tr-priya-sharma',
    name: 'Priya Sharma',
    gender: 'FEMALE',
    phone: '+91 98450 12849',
    email: 'priya.sharma@drivesaathi.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in calming beginner anxiety, clutch finesse, reverse/parallel parking & tight Bangalore traffic driving. 8+ years coaching with over 1,200 successful learners.',
    yearsExperience: 8,
    totalSessions: 1240,
    rating: 4.94,
    reviewCount: 312,
    cancellationRate: 0.012,
    baseHourlyRate: 699,
    city: 'Bengaluru',
    serviceRadiusKm: 12,
    lat: 12.9784,
    lng: 77.6408, // Indiranagar
    languages: ['English', 'Hindi', 'Kannada'],
    vehicleExpertise: {
      categories: ['CAR', 'REFRESHER_CAR'],
      transmissions: ['MANUAL', 'AUTOMATIC', 'AMT', 'CVT', 'EV'],
      electricVehicleExpert: true
    },
    skills: [
      'STARTING_STOPPING',
      'CLUTCH_CONTROL',
      'GEAR_SHIFTING',
      'STEERING_LANE_DISCIPLINE',
      'U_TURNS_TIGHT_TURNS',
      'REVERSE_DRIVING',
      'PARALLEL_PARKING',
      'CITY_HEAVY_TRAFFIC',
      'HILL_START_INCLINE',
      'EV_REGEN_DRIVING'
    ],
    verifiedStatus: {
      isIdentityVerified: true,
      isLicenceVerified: true,
      isAddressVerified: true,
      isBackgroundVerified: true,
      isFirstAidCertified: true,
      verificationStatus: 'APPROVED'
    },
    documents: {
      drivingLicenceNumber: 'KA0320140019283',
      aadhaarOrGovtId: 'XXXX-XXXX-9482',
      policeVerificationRef: 'BLR-POL-2024-8841'
    },
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Mon to Sat
      slots: ['07:00 AM', '08:30 AM', '10:00 AM', '11:30 AM', '04:00 PM', '05:30 PM', '07:00 PM']
    },
    bankDetails: {
      accountHolder: 'Priya Sharma',
      accountNumberMasked: '•••• •••• 4910',
      ifsc: 'HDFC0001824',
      upiId: 'priyasharma@okhdfcbank'
    }
  },
  {
    id: 'tr-rahul-kumar',
    name: 'Rahul Kumar',
    gender: 'MALE',
    phone: '+91 97412 88392',
    email: 'rahul.kumar@drivesaathi.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Two-wheeler and gear bike master trainer. Specialized in balance, slow-speed cone slalom, emergency braking, and city commuting confidence on scooters & heavy gear bikes like Royal Enfield.',
    yearsExperience: 5,
    totalSessions: 842,
    rating: 4.88,
    reviewCount: 198,
    cancellationRate: 0.02,
    baseHourlyRate: 599,
    city: 'Bengaluru',
    serviceRadiusKm: 15,
    lat: 12.9121,
    lng: 77.6446, // HSR Layout
    languages: ['Hindi', 'English', 'Kannada'],
    vehicleExpertise: {
      categories: ['MOTORCYCLE', 'SCOOTER'],
      transmissions: ['MANUAL', 'CVT', 'EV'],
      electricVehicleExpert: true
    },
    skills: [
      'STARTING_STOPPING',
      'CLUTCH_CONTROL',
      'GEAR_SHIFTING',
      'STEERING_LANE_DISCIPLINE',
      'U_TURNS_TIGHT_TURNS',
      'CITY_HEAVY_TRAFFIC',
      'HILL_START_INCLINE',
      'NIGHT_DRIVING'
    ],
    verifiedStatus: {
      isIdentityVerified: true,
      isLicenceVerified: true,
      isAddressVerified: true,
      isBackgroundVerified: true,
      isFirstAidCertified: true,
      verificationStatus: 'APPROVED'
    },
    documents: {
      drivingLicenceNumber: 'KA0120170094821',
      aadhaarOrGovtId: 'XXXX-XXXX-3829',
      policeVerificationRef: 'BLR-POL-2024-5510'
    },
    availability: {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      slots: ['06:30 AM', '08:00 AM', '09:30 AM', '04:30 PM', '06:00 PM', '07:30 PM']
    },
    bankDetails: {
      accountHolder: 'Rahul Kumar',
      accountNumberMasked: '•••• •••• 8391',
      ifsc: 'SBIN0004921',
      upiId: 'rahul99@oksbi'
    }
  },
  {
    id: 'tr-anjali-menon',
    name: 'Anjali Menon',
    gender: 'FEMALE',
    phone: '+91 99001 44512',
    email: 'anjali.menon@drivesaathi.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Certified defensive driving trainer & EV specialist. Passionate about empowering women and first-time car buyers with patient, structured, and zero-fear real-world lessons.',
    yearsExperience: 7,
    totalSessions: 910,
    rating: 4.98,
    reviewCount: 245,
    cancellationRate: 0.005,
    baseHourlyRate: 749,
    city: 'Bengaluru',
    serviceRadiusKm: 10,
    lat: 12.9352,
    lng: 77.6245, // Koramangala
    languages: ['English', 'Malayalam', 'Hindi', 'Tamil', 'Kannada'],
    vehicleExpertise: {
      categories: ['CAR', 'REFRESHER_CAR', 'SCOOTER'],
      transmissions: ['MANUAL', 'AUTOMATIC', 'AMT', 'DCT', 'CVT', 'EV'],
      electricVehicleExpert: true
    },
    skills: [
      'STARTING_STOPPING',
      'CLUTCH_CONTROL',
      'GEAR_SHIFTING',
      'STEERING_LANE_DISCIPLINE',
      'PARALLEL_PARKING',
      'ANGULAR_PERPENDICULAR_PARKING',
      'CITY_HEAVY_TRAFFIC',
      'HIGHWAY_LANE_MERGE',
      'EV_REGEN_DRIVING',
      'NEW_CAR_CONTROLS_ADAS'
    ],
    verifiedStatus: {
      isIdentityVerified: true,
      isLicenceVerified: true,
      isAddressVerified: true,
      isBackgroundVerified: true,
      isFirstAidCertified: true,
      verificationStatus: 'APPROVED'
    },
    documents: {
      drivingLicenceNumber: 'KL0720150029381',
      aadhaarOrGovtId: 'XXXX-XXXX-1120',
      policeVerificationRef: 'BLR-POL-2024-3329'
    },
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      slots: ['07:00 AM', '09:00 AM', '11:00 AM', '03:30 PM', '05:00 PM', '06:30 PM']
    },
    bankDetails: {
      accountHolder: 'Anjali Menon',
      accountNumberMasked: '•••• •••• 9283',
      ifsc: 'ICIC0000047',
      upiId: 'anjalimenon@icici'
    }
  },
  {
    id: 'tr-vikramaditya-d',
    name: 'Vikramaditya Deshmukh',
    gender: 'MALE',
    phone: '+91 98200 77123',
    email: 'vikram.d@drivesaathi.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Former automotive test driver and 11+ yrs senior mentor. Expert in highway lane positioning, expressways, night driving, high-incline flyover bumper-to-bumper stops, and luxury cars.',
    yearsExperience: 11,
    totalSessions: 1680,
    rating: 4.92,
    reviewCount: 420,
    cancellationRate: 0.01,
    baseHourlyRate: 799,
    city: 'Bengaluru',
    serviceRadiusKm: 20,
    lat: 12.9279,
    lng: 77.5871, // Jayanagar
    languages: ['Marathi', 'Hindi', 'English', 'Kannada'],
    vehicleExpertise: {
      categories: ['CAR', 'REFRESHER_CAR'],
      transmissions: ['MANUAL', 'AUTOMATIC', 'AMT', 'DCT', 'CVT', 'EV'],
      electricVehicleExpert: true
    },
    skills: [
      'CLUTCH_CONTROL',
      'GEAR_SHIFTING',
      'PARALLEL_PARKING',
      'CITY_HEAVY_TRAFFIC',
      'HILL_START_INCLINE',
      'HIGHWAY_LANE_MERGE',
      'NIGHT_DRIVING',
      'FLYOVER_CONGESTION',
      'NEW_CAR_CONTROLS_ADAS'
    ],
    verifiedStatus: {
      isIdentityVerified: true,
      isLicenceVerified: true,
      isAddressVerified: true,
      isBackgroundVerified: true,
      isFirstAidCertified: true,
      verificationStatus: 'APPROVED'
    },
    documents: {
      drivingLicenceNumber: 'MH0220110038472',
      aadhaarOrGovtId: 'XXXX-XXXX-9938',
      policeVerificationRef: 'BLR-POL-2024-9122'
    },
    availability: {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      slots: ['06:00 AM', '08:00 AM', '10:00 AM', '04:00 PM', '06:00 PM', '08:00 PM']
    },
    bankDetails: {
      accountHolder: 'Vikramaditya Deshmukh',
      accountNumberMasked: '•••• •••• 5521',
      ifsc: 'UTIB0000832',
      upiId: 'vikram.desh@axisbank'
    }
  },
  {
    id: 'tr-sunita-rao',
    name: 'Sunita Rao',
    gender: 'FEMALE',
    phone: '+91 96112 39941',
    email: 'sunita.rao@drivesaathi.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Patience-first trainer passionate about senior citizens and individuals who have had long driving gaps. We take it step by step in calm residential streets before venturing onto main roads.',
    yearsExperience: 4,
    totalSessions: 620,
    rating: 4.96,
    reviewCount: 165,
    cancellationRate: 0.008,
    baseHourlyRate: 649,
    city: 'Bengaluru',
    serviceRadiusKm: 12,
    lat: 12.9815,
    lng: 77.7289, // Whitefield
    languages: ['Telugu', 'Kannada', 'Hindi', 'English'],
    vehicleExpertise: {
      categories: ['CAR', 'SCOOTER', 'REFRESHER_CAR'],
      transmissions: ['MANUAL', 'AUTOMATIC', 'AMT', 'CVT', 'EV'],
      electricVehicleExpert: false
    },
    skills: [
      'STARTING_STOPPING',
      'CLUTCH_CONTROL',
      'STEERING_LANE_DISCIPLINE',
      'U_TURNS_TIGHT_TURNS',
      'REVERSE_DRIVING',
      'PARALLEL_PARKING',
      'CITY_HEAVY_TRAFFIC'
    ],
    verifiedStatus: {
      isIdentityVerified: true,
      isLicenceVerified: true,
      isAddressVerified: true,
      isBackgroundVerified: true,
      isFirstAidCertified: true,
      verificationStatus: 'APPROVED'
    },
    documents: {
      drivingLicenceNumber: 'KA0420190088319',
      aadhaarOrGovtId: 'XXXX-XXXX-4401',
      policeVerificationRef: 'BLR-POL-2024-1184'
    },
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      slots: ['07:30 AM', '09:00 AM', '10:30 AM', '04:00 PM', '05:30 PM']
    },
    bankDetails: {
      accountHolder: 'Sunita Rao',
      accountNumberMasked: '•••• •••• 1204',
      ifsc: 'KKBK0008123',
      upiId: 'sunitarao@kotak'
    }
  },
  {
    id: 'tr-pooja-patel',
    name: 'Pooja Patel',
    gender: 'FEMALE',
    phone: '+91 98980 44219',
    email: 'pooja.patel@drivesaathi.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Certified biker & tourer. Training gear bike enthusiasts on throttle control, friction zone, lean angle basics, and riding with safety gear.',
    yearsExperience: 6,
    totalSessions: 780,
    rating: 4.91,
    reviewCount: 210,
    cancellationRate: 0.015,
    baseHourlyRate: 649,
    city: 'Bengaluru',
    serviceRadiusKm: 16,
    lat: 13.0034,
    lng: 77.5645, // Malleshwaram
    languages: ['Hindi', 'Gujarati', 'English', 'Kannada'],
    vehicleExpertise: {
      categories: ['MOTORCYCLE', 'SCOOTER'],
      transmissions: ['MANUAL', 'CVT', 'EV'],
      electricVehicleExpert: true
    },
    skills: [
      'STARTING_STOPPING',
      'CLUTCH_CONTROL',
      'GEAR_SHIFTING',
      'STEERING_LANE_DISCIPLINE',
      'U_TURNS_TIGHT_TURNS',
      'CITY_HEAVY_TRAFFIC',
      'HILL_START_INCLINE',
      'NIGHT_DRIVING'
    ],
    verifiedStatus: {
      isIdentityVerified: true,
      isLicenceVerified: true,
      isAddressVerified: true,
      isBackgroundVerified: true,
      isFirstAidCertified: true,
      verificationStatus: 'APPROVED'
    },
    documents: {
      drivingLicenceNumber: 'GJ0120160049281',
      aadhaarOrGovtId: 'XXXX-XXXX-6612',
      policeVerificationRef: 'BLR-POL-2024-7719'
    },
    availability: {
      daysOfWeek: [0, 1, 2, 4, 5, 6],
      slots: ['06:30 AM', '08:00 AM', '09:30 AM', '04:00 PM', '05:30 PM', '07:00 PM']
    },
    bankDetails: {
      accountHolder: 'Pooja Patel',
      accountNumberMasked: '•••• •••• 9811',
      ifsc: 'HDFC0000049',
      upiId: 'poojapatel@okhdfc'
    }
  }
];

export const TRAINING_PACKAGES: TrainingPackage[] = [
  {
    id: 'pkg-beginner-car',
    name: 'Beginner Car Driving Package',
    badge: 'Most Popular',
    tagline: 'Zero to independent city driver with 1-on-1 personalized mentorship.',
    description: '5 hands-on 60-min sessions covering starting, steering, clutch, gearing, U-turns, reverse, and neighborhood traffic.',
    vehicleCategory: 'CAR',
    sessionCount: 5,
    sessionDurationMinutes: 60,
    price: 2999,
    originalPrice: 3495,
    popular: true,
    features: [
      '5 × 60-Minute 1-on-1 Sessions',
      'Doorstep pickup in your own car',
      'Verified Male or Female Trainer choice',
      'Dedicated reverse & parking module',
      'AI-powered session progress tracking',
      'Free rescheduling up to 6h before'
    ]
  },
  {
    id: 'pkg-confidence-mastery',
    name: 'Full Driving Confidence Mastery',
    badge: 'Comprehensive',
    tagline: 'Complete transformation from nervous driver to calm, instinctual commuter.',
    description: '10 comprehensive sessions taking you through flyovers, highway lane merges, night driving, parallel parking, and heavy peak-hour traffic.',
    vehicleCategory: 'CAR',
    sessionCount: 10,
    sessionDurationMinutes: 60,
    price: 5499,
    originalPrice: 6990,
    popular: false,
    features: [
      '10 × 60-Minute Complete Mastery Sessions',
      'Heavy city traffic & flyover stops',
      'Expressway & Highway lane discipline',
      'Night driving & headlight etiquette',
      'Parallel & tight basement parking drills',
      'DriveSaathi Graduation Certificate'
    ]
  },
  {
    id: 'pkg-parking-special',
    name: 'Reverse & Parallel Parking Special',
    badge: 'Skill Focus',
    tagline: 'Never dread tight apartment basements, malls, or parallel curbs again.',
    description: '3 targeted 60-min sessions mastering mirror reference points, 45-degree angle entries, parallel curb parking, and 3-point turns.',
    vehicleCategory: 'CAR',
    sessionCount: 3,
    sessionDurationMinutes: 60,
    price: 1799,
    originalPrice: 2097,
    popular: false,
    features: [
      '3 × 60-Minute Parking Masterclasses',
      'Exact mirror & pillar reference techniques',
      'Basement & multi-level parking lot practice',
      'Parallel street parking confidence',
      'Reverse 90-degree bay parking'
    ]
  },
  {
    id: 'pkg-highway-night',
    name: 'Highway & Night Confidence',
    badge: 'Advanced',
    tagline: 'Conquer long distance road trips, toll plazas, and night glare with ease.',
    description: '3 deep 90-min sessions on expressways, overtaking speeds, emergency braking at speed, and night driving visibility.',
    vehicleCategory: 'CAR',
    sessionCount: 3,
    sessionDurationMinutes: 90,
    price: 2699,
    originalPrice: 3199,
    popular: false,
    features: [
      '3 × 90-Minute Extended Road Sessions',
      'Blind-spot monitoring & lane change protocols',
      'Cruising speed judgment & safe braking gaps',
      'High-beam vs low-beam etiquette',
      'Toll plaza & bottleneck management'
    ]
  },
  {
    id: 'pkg-new-car-familiarisation',
    name: 'New Car / EV Familiarisation',
    badge: 'Specialist',
    tagline: 'Just bought a new car or electric vehicle? Master its dimensions & tech.',
    description: '2 extended 90-min sessions getting comfortable with your new car’s width, touchscreen infotainment, ADAS alerts, EV regenerative braking, and parking sensors.',
    vehicleCategory: 'CAR',
    sessionCount: 2,
    sessionDurationMinutes: 90,
    price: 1699,
    originalPrice: 1999,
    popular: false,
    features: [
      '2 × 90-Minute New Vehicle Familiarisation',
      'Vehicle dimensions & blind spot map',
      'EV Single-pedal & Regenerative modes',
      '360-degree camera & parking sensor mastery',
      'Cruise control & ADAS safety alerts setup'
    ]
  },
  {
    id: 'pkg-bike-riding-basics',
    name: 'Bike & Scooter Riding Bootcamp',
    badge: 'Two Wheeler',
    tagline: 'Master two-wheeler balance, clutch friction zone, and congested traffic.',
    description: '4 focused 45-min sessions for gear bikes or automatic scooters from slow-speed balance to main road navigation.',
    vehicleCategory: 'MOTORCYCLE',
    sessionCount: 4,
    sessionDurationMinutes: 45,
    price: 1999,
    originalPrice: 2396,
    popular: false,
    features: [
      '4 × 45-Minute 1-on-1 Practice Sessions',
      'Slow-speed balance & clutch slip control',
      'Foot-down U-turns and tight figure-8s',
      'Gradual incline & slope starts without rollback',
      'Helmet & road safety gear guidance'
    ]
  }
];

export const DEFAULT_PRICING_CONFIG: PricingRuleConfig = {
  baseHourlyRateCar: 599,
  baseHourlyRateBike: 499,
  baseHourlyRateScooter: 499,
  platformFee: 30,
  gstTaxRate: 0.18,
  trainerCommissionPercent: 0.80,
  peakHourMultiplier: 1.15,
  weekendMultiplier: 1.10,
  cancellationRefundWindowHours: 6,
  freeCancellationFeePercent: 0
};

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'DRIVESAFE200',
    discountType: 'FIXED',
    value: 200,
    minOrderValue: 500,
    description: '₹200 Instant Discount on your first session or package',
    expiryDate: '2026-12-31',
    active: true
  },
  {
    code: 'WOMENDRIVE',
    discountType: 'PERCENTAGE',
    value: 15,
    minOrderValue: 600,
    maxDiscount: 350,
    description: '15% Off with our verified female mentor network',
    expiryDate: '2026-12-31',
    active: true
  },
  {
    code: 'WEEKENDCONFIDENCE',
    discountType: 'PERCENTAGE',
    value: 10,
    minOrderValue: 600,
    maxDiscount: 250,
    description: '10% Off on Saturday & Sunday practice sessions',
    expiryDate: '2026-12-31',
    active: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    bookingNumber: 'DS-2026-1084',
    customerId: 'cust-mahesh-1',
    customerName: 'Mahesh Sharma',
    customerPhone: '+91 98860 41209',
    trainerId: 'tr-priya-sharma',
    trainerName: 'Priya Sharma',
    trainerPhone: '+91 98450 12849',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    trainerGender: 'FEMALE',
    vehicleCategory: 'CAR',
    vehicleDetails: {
      hasOwnVehicle: true,
      brand: 'Hyundai',
      model: 'Creta',
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL'
    },
    experienceLevel: 'HAS_LICENCE_NEEDS_PRACTICE',
    goals: ['PARALLEL_PARKING', 'CITY_HEAVY_TRAFFIC', 'REVERSE_DRIVING'],
    address: {
      id: 'addr-home-1',
      title: 'Home',
      fullAddress: 'Apartment 402, Prestige Ozone, Whitefield Main Road',
      area: 'Whitefield',
      city: 'Bengaluru',
      pincode: '560066',
      locationType: 'CUSTOMER_HOME',
      lat: 12.9698,
      lng: 77.7499
    },
    date: 'Tomorrow',
    timeSlot: '10:00 AM',
    durationMinutes: 60,
    genderPreference: 'FEMALE',
    status: 'CONFIRMED',
    pricing: {
      baseAmount: 699,
      peakMultiplier: 1.0,
      platformFee: 30,
      taxesGst: 131.22,
      discountAmount: 0,
      totalAmount: 860,
      trainerEarnings: 559.20,
      platformCommission: 169.80
    },
    payment: {
      method: 'UPI',
      transactionId: 'UPI-TXN-984210984',
      status: 'PAID',
      paidAt: '2026-10-01T14:22:00Z'
    },
    sessionTracking: {
      sharedWithContact: {
        name: 'Anita Sharma (Spouse)',
        phone: '+91 98860 41210'
      }
    },
    createdAt: '2026-10-01T14:20:00Z',
    updatedAt: '2026-10-01T14:22:00Z'
  },
  {
    id: 'bk-1002',
    bookingNumber: 'DS-2026-1021',
    customerId: 'cust-mahesh-1',
    customerName: 'Mahesh Sharma',
    customerPhone: '+91 98860 41209',
    trainerId: 'tr-priya-sharma',
    trainerName: 'Priya Sharma',
    trainerPhone: '+91 98450 12849',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    trainerGender: 'FEMALE',
    vehicleCategory: 'CAR',
    vehicleDetails: {
      hasOwnVehicle: true,
      brand: 'Hyundai',
      model: 'Creta',
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL'
    },
    experienceLevel: 'HAS_LICENCE_NEEDS_PRACTICE',
    goals: ['STARTING_STOPPING', 'STEERING_LANE_DISCIPLINE', 'U_TURNS_TIGHT_TURNS'],
    address: {
      id: 'addr-home-1',
      title: 'Home',
      fullAddress: 'Apartment 402, Prestige Ozone, Whitefield Main Road',
      area: 'Whitefield',
      city: 'Bengaluru',
      pincode: '560066',
      locationType: 'CUSTOMER_HOME',
      lat: 12.9698,
      lng: 77.7499
    },
    date: 'Yesterday',
    timeSlot: '05:00 PM',
    durationMinutes: 60,
    genderPreference: 'FEMALE',
    status: 'COMPLETED',
    pricing: {
      baseAmount: 699,
      peakMultiplier: 1.0,
      platformFee: 30,
      taxesGst: 131.22,
      discountAmount: 200,
      couponCode: 'DRIVESAFE200',
      totalAmount: 660,
      trainerEarnings: 559.20,
      platformCommission: 70.80
    },
    payment: {
      method: 'UPI',
      transactionId: 'UPI-TXN-11928374',
      status: 'PAID',
      paidAt: '2026-09-30T16:50:00Z'
    },
    sessionTracking: {
      startedAt: '2026-09-30T17:00:00Z',
      completedAt: '2026-09-30T18:02:00Z',
      actualDurationSeconds: 3720,
      practicedSkills: ['STARTING_STOPPING', 'STEERING_LANE_DISCIPLINE', 'U_TURNS_TIGHT_TURNS'],
      trainerNotes: 'Mahesh has great steering control and lane discipline. Took 3 roundabouts smoothly in Whitefield traffic. Needs one more session on mirror judgment during tight reverse parking.',
      aiProgressFeedback: 'Steering stability: 92%. Braking smoothness: 88%. You are ready for moderate traffic.',
      aiNextRecommendation: 'Reverse Parking & 45-degree Bay Entry drill recommended for your next session.'
    },
    review: {
      rating: 5,
      comment: 'Priya was incredibly patient! She helped me overcome my fear of navigating the Hope Farm junction roundabout in peak traffic.',
      punctual: true,
      respectful: true,
      patient: true,
      feltSafe: true,
      createdAt: '2026-09-30T18:15:00Z'
    },
    createdAt: '2026-09-29T10:00:00Z',
    updatedAt: '2026-09-30T18:15:00Z'
  }
];

export const INITIAL_SAFETY_INCIDENTS: SafetyIncident[] = [
  {
    id: 'inc-901',
    bookingId: 'bk-demo-99',
    customerId: 'cust-389',
    customerName: 'Rhea Sen',
    trainerId: 'tr-vikramaditya-d',
    trainerName: 'Vikramaditya Deshmukh',
    type: 'SOS_TRIGGERED',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    reportedAt: '2026-09-28T19:42:00Z',
    details: 'Customer pressed SOS by mistake while adjusting mobile holder. Safety operations called customer within 18 seconds and confirmed 100% safety.',
    location: { lat: 12.9352, lng: 77.6245, area: 'Koramangala 4th Block' },
    actionTakenNotes: 'False alarm verified via two-way voice call. Incident closed with customer confirmation.'
  }
];
