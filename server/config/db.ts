import mongoose from 'mongoose';
import { ProductModel, CategoryModel } from '../models/schemas.js';

function generateDummyProducts() {
  const categories = [
    'Electronics',
    'Footwear',
    'Apparel',
    'Accessories',
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books & Stationery',
    'Groceries & Gourmet'
  ];

  // Adjectives, nouns, images, and price-ranges for each category
  const categoryConfig: Record<string, {
    adjectives: string[];
    nouns: string[];
    images: string[];
    descriptions: string[];
    minPrice: number;
    maxPrice: number;
  }> = {
    'Electronics': {
      adjectives: ['Quantum', 'Apex', 'Hyper', 'Sonic', 'Aero', 'Nova', 'Titan', 'Pro', 'Elite', 'Flex', 'Optic', 'Nomad', 'Volt', 'Infinity', 'Matrix', 'Spectra', 'Zenith', 'Prism', 'Orbit', 'Pulse'],
      nouns: ['Buds', 'Soundbar', 'Hub', 'Mic', 'Pad', 'Link', 'Lens', 'Drive', 'Deck', 'Sensor', 'Core', 'Node', 'Grid', 'Module', 'Beam', 'Speaker', 'Router', 'Display', 'Charger', 'Powerbank'],
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563968743331-044189619c1e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'State-of-the-art gadget designed for active performance, featuring low-latency signal transmission and an elegant structural finish.',
        'Experience immersive, rich audio output with custom-engineered drivers and ambient sound dampening technologies.',
        'High-speed premium device designed to seamlessly connect all your modern workspace elements and power-delivery peripherals.'
      ],
      minPrice: 999,
      maxPrice: 39999
    },
    'Footwear': {
      adjectives: ['Stratus', 'Vapor', 'Zoom', 'Glide', 'Trek', 'Trail', 'Swift', 'Roam', 'Metro', 'Urban', 'Fleet', 'Cloud', 'Active', 'Peak', 'Racer', 'Stride', 'Sprint', 'Velocity', 'Propel'],
      nouns: ['Sneaker', 'Runner', 'Trainer', 'Boot', 'Sandal', 'Walker', 'Loafer', 'Oxford', 'Slipon', 'HighTop', 'Clog', 'Slipper', 'Wedge', 'Derby', 'Espadrille', 'Chukka', 'Brogue', 'Platform'],
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Take on any surface with superior grip, designed with shock-absorbing multi-density foam and an engineered hyper-knit weave.',
        'Premium quality footwear crafted with supple leather and soft interior cushioning for a perfect blend of comfort and style.',
        'Extremely lightweight shoe ideal for marathon sessions, athletic tracks, or daily urban commutes with active heel support.'
      ],
      minPrice: 599,
      maxPrice: 8999
    },
    'Apparel': {
      adjectives: ['Thermal', 'Organic', 'Heavyweight', 'SoftTouch', 'Seamfree', 'Tailored', 'Classic', 'AllWeather', 'Cozy', 'Active', 'Luxe', 'Modern', 'Urban', 'Daily', 'Signature', 'Vanguard', 'Pure'],
      nouns: ['Hoodie', 'Jogger', 'Sweater', 'Tee', 'Polo', 'Jacket', 'Coat', 'Parka', 'Windbreaker', 'Blazer', 'Shorts', 'Cardigan', 'Vest', 'Chino', 'Sweatpants', 'Trousers', 'Shirt'],
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Stitched with premium extra-long staple certified organic fibers, offering absolute shape retention and luxury texture.',
        'Upgrade your core apparel collection with this ultra-durable classic fit, engineered with smart temperature-regulating fabric.',
        'A versatile staple designed with high-density weave, robust stitching details, and a tailored silhouette for daily smart-casual wear.'
      ],
      minPrice: 399,
      maxPrice: 4999
    },
    'Accessories': {
      adjectives: ['Leather', 'RFID', 'Sleek', 'Minimalist', 'Compact', 'Durable', 'Travel', 'Canvas', 'Classic', 'Utility', 'Tactical', 'Urban', 'Nomad', 'Executive', 'Signature', 'Vanguard', 'Apex'],
      nouns: ['Wallet', 'Backpack', 'Watch', 'Belt', 'Sunglasses', 'Cap', 'Beanie', 'Duffel', 'Tote', 'Ring', 'Bracelet', 'Keyholder', 'Socks', 'Gloves', 'Umbrella', 'Scarf'],
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1627124424074-76576d9da990?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611085583191-a3b1a30a8a34?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Refined everyday carry made of high-quality robust materials, providing multiple slots and active structural protection.',
        'A modern travel accessory offering exceptional storage layout, hidden compartments, and lightweight ergonomic build.',
        'Exquisite premium accessory featuring precise mechanical craftsmanship and a versatile design suited for all occasions.'
      ],
      minPrice: 199,
      maxPrice: 6999
    },
    'Home & Living': {
      adjectives: ['Nordic', 'Ergonomic', 'Artisanal', 'Minimalist', 'Boho', 'Rustic', 'Modernist', 'Aromatic', 'Cozy', 'Zen', 'Organic', 'Luxe', 'Polished', 'Comfort', 'Heritage'],
      nouns: ['Chair', 'Desk Lamp', 'Ceramic Vase', 'Bed Linen', 'Essential Diffuser', 'Frame Art', 'Scented Candle', 'Throw Blanket', 'Coffee Mug', 'Planter', 'Cushion', 'Rugs'],
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Add architectural elegance to your home space with this handcrafted, carefully balanced premium accent element.',
        'Meticulously designed with premium components to promote ambient tranquility, superior utility, and exquisite comfort.',
        'Bring a touch of organic warmth and luxury textures to any living room, bedroom, or dedicated creative workspace.'
      ],
      minPrice: 299,
      maxPrice: 12999
    },
    'Beauty & Personal Care': {
      adjectives: ['Botanical', 'Hydrating', 'Organic', 'Restorative', 'Revitalizing', 'Nourishing', 'Luminous', 'Pure', 'Rejuvenating', 'Vegan', 'Elixir', 'Gentle', 'Herbal'],
      nouns: ['Serum', 'Moisturizer', 'Cleanser', 'Perfume', 'Hair Oil', 'Face Mask', 'Shampoo', 'Body Wash', 'Lip Balm', 'Toner'],
      images: [
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Formulated with certified organic botanicals to support natural cellular defense and lock in absolute hydration.',
        'A sensory luxury experience designed to rejuvenate fatigued skin lines, offering deeply absorbing rich nutrient blends.',
        'Premium daily essentials created to elevate your personal care regimen with dermatologically tested botanical profiles.'
      ],
      minPrice: 149,
      maxPrice: 3499
    },
    'Sports & Outdoors': {
      adjectives: ['Aero', 'Performance', 'Endurance', 'Tactical', 'All-Weather', 'Heavy-Duty', 'Ultralight', 'Peak', 'Flex', 'Thermoband', 'Trekker', 'Hydro', 'Dynamic'],
      nouns: ['Dumbbell', 'Soccer Ball', 'Yoga Mat', 'Water Bottle', 'Camping Tent', 'Tennis Racket', 'Helmet', 'Resistance Band', 'Grip Gloves', 'Backpack'],
      images: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515555233972-7bc15b248a3a?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Engineered to withstand rigorous daily workout regimes, using highly resilient slip-proof composite materials.',
        'Ideal gear for adventure seeking and outdoor pursuits, ensuring outstanding safety, utility, and weatherproofing.',
        'Maximize athletic efficiency and stay completely hydrated with this ergonomically optimized, eco-friendly gear.'
      ],
      minPrice: 299,
      maxPrice: 14999
    },
    'Books & Stationery': {
      adjectives: ['Hardcover', 'Premium', 'Acid-Free', 'Classic', 'Executive', 'Water-Resistant', 'Handcrafted', 'Minimalist', 'Planner', 'Vintage', 'Artistic'],
      nouns: ['Novel', 'Notebook', 'Sketchbook', 'Desk Organizer', 'Fountain Pen', 'Journal', 'Markers Set', 'Binder', 'Planner Diary'],
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1585336261022-675929945037?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Featuring extra-smooth ink-friendly heavy stock pages bound in a beautifully textured premium synthetic cover.',
        'A masterpiece of fine stationery craftsmanship, perfect for journaling, scheduling, or technical drafting and sketching.',
        'Organize your work desks with clean elegant geometric outlines and high-grade sustainable materials.'
      ],
      minPrice: 99,
      maxPrice: 1999
    },
    'Groceries & Gourmet': {
      adjectives: ['Organic', 'Gourmet', 'Cold-Pressed', 'Artisanal', 'Stone-Ground', 'Raw', 'Rich', 'Pure', 'Premium', 'Whole', 'Sourdough', 'Spiced'],
      nouns: ['Spice Blend', 'Leaf Tea', 'Coffee Beans', 'Olive Oil', 'Wheat Flour', 'Wild Honey', 'Dark Chocolate', 'Maple Syrup', 'Sea Salt', 'Herbal Infusion'],
      images: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&auto=format&fit=crop&q=80'
      ],
      descriptions: [
        'Grown with absolute devotion to sustainable traditional agriculture, offering intense deep aromas and premium quality.',
        'Sourced from certified small-batch premium estates to deliver unmatched taste, freshness, and organic nutritional properties.',
        'Handcrafted culinary luxury designed to delight your gastronomic senses and enrich any wholesome gourmet preparation.'
      ],
      minPrice: 149,
      maxPrice: 2499
    }
  };

  const generated: any[] = [];

  for (let i = 1; i <= 1505; i++) {
    // Select category round-robin
    const category = categories[i % categories.length];
    const config = categoryConfig[category];

    // Select components based on indices
    const adj = config.adjectives[i % config.adjectives.length];
    const noun = config.nouns[(i + 7) % config.nouns.length];
    const name = `${adj} ${noun}`;

    // Select description and image
    const baseDesc = config.descriptions[i % config.descriptions.length];
    const description = `${baseDesc} Perfect for online shoppers looking for premium daily utility. Tested under rigid quality assurance guidelines.`;
    
    const imgBase = config.images[i % config.images.length];
    const image = `${imgBase}&sig=${category.replace(/[^a-zA-Z]/g, '')}_${i}`;

    // Dynamic realistic pricing calculations in INR (₹)
    const priceRange = config.maxPrice - config.minPrice;
    const offset = (i % 25) / 25;
    let price = Math.floor(config.minPrice + (priceRange * offset));
    
    // Add realistic endings: 99, 49, 95
    const endings = [99, 49, 95, 0];
    const ending = endings[i % endings.length];
    if (ending > 0) {
      price = Math.floor(price / 100) * 100 + ending;
    }

    const baseRating = Number((3.8 + ((i % 13) * 0.1)).toFixed(1)); // 3.8 to 5.0
    const stock = (i % 35) === 0 ? 0 : Math.floor(15 + (i % 65));
    const featured = (i % 12) === 0;

    generated.push({
      id: `p_dummy_${i}`,
      name,
      description,
      price,
      image,
      category,
      stock,
      rating: baseRating,
      reviewsCount: Math.floor(5 + (i % 45)),
      featured,
      reviews: []
    });
  }

  return generated;
}

// State container to mimic MongoDB operations if Atlas is not connected yet
class LocalDatabaseStore {
  users: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  orders: any[] = [];
  coupons: any[] = [];
  reviews: any[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // Seed initial categories
    this.categories = [
      { id: 'cat1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat2', name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat3', name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat4', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat5', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat6', name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat7', name: 'Sports & Outdoors', slug: 'sports-outdoors', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat8', name: 'Books & Stationery', slug: 'books-stationery', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60' },
      { id: 'cat9', name: 'Groceries & Gourmet', slug: 'groceries-gourmet', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60' }
    ];

    // Seed initial products (consists of our robust generated products list)
    this.products = generateDummyProducts();

    // Seed default admin user (hash will be checked via bcrypt, but we seed plain or let backend login handle it)
    // To make mock login work smoothly with seeded pass, we store bcrypt hashed 'password123'
    // '$2a$10$XU.hU.8q60.ZJ2zU8H4b.eJ6m6O7Rk7r638yJgC8kEq5e860/2.K.'
    this.users = [
      {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@shpnex.com',
        password: '$2a$10$XU.hU.8q60.ZJ2zU8H4b.eJ6m6O7Rk7r638yJgC8kEq5e860/2.K.', // password123
        role: 'admin',
        addresses: [
          { street: '1 Infinite Loop', city: 'Cupertino', state: 'CA', zipCode: '95014', country: 'United States', isDefault: true }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'u2',
        name: 'Tushar Mendhule',
        email: 'tusharmendhule1@gmail.com',
        password: '$2a$10$XU.hU.8q60.ZJ2zU8H4b.eJ6m6O7Rk7r638yJgC8kEq5e860/2.K.', // password123
        role: 'customer',
        addresses: [
          { street: '456 Tech Lane', city: 'San Francisco', state: 'CA', zipCode: '94107', country: 'United States', isDefault: true }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'u3',
        name: 'Global Seller',
        email: 'seller@shpnex.com',
        password: '$2a$10$XU.hU.8q60.ZJ2zU8H4b.eJ6m6O7Rk7r638yJgC8kEq5e860/2.K.', // password123
        role: 'seller',
        addresses: [
          { street: '789 Trade Avenue', city: 'New York', state: 'NY', zipCode: '10001', country: 'United States', isDefault: true }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    // Seed coupons
    this.coupons = [
      { id: 'c1', code: 'NEX20', discount: 20, expiryDate: '2027-12-31', active: true },
      { id: 'c2', code: 'WELCOME10', discount: 10, expiryDate: '2027-12-31', active: true },
    ];
  }
}

export const localDb = new LocalDatabaseStore();

let isConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('YOUR_MONGODB_ATLAS_CONNECTION_STRING')) {
    console.log('⚠️ [Database] MONGO_URI is missing or placeholder. Running in-memory Mock DB mode.');
    isConnected = false;
    return false;
  }

  try {
    console.log('🔄 [Database] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      dbName: 'shpnex',
    });
    console.log('✅ [Database] MongoDB Atlas connected successfully.');
    isConnected = true;
    
    // Auto seed MongoDB Atlas
    await seedMongoDatabase();

    return true;
  } catch (error) {
    console.error('❌ [Database] MongoDB connection failed:', error);
    console.log('⚠️ [Database] Falling back to high-performance in-memory Mock DB mode.');
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected;
}

async function seedMongoDatabase() {
  try {
    // 1. Seed categories if empty
    const catCount = await CategoryModel.countDocuments({});
    if (catCount === 0) {
      console.log('🌱 [Database] Seeding categories to MongoDB Atlas...');
      const catsToInsert = localDb.categories.map((c: any) => ({
        name: c.name,
        slug: c.slug,
        image: c.image
      }));
      await CategoryModel.insertMany(catsToInsert);
      console.log(`🌱 [Database] Successfully seeded ${catsToInsert.length} categories.`);
    }

    // 2. Seed products if empty/low or containing old placeholder prices
    const prodCount = await ProductModel.countDocuments({});
    const hasOldPrice = await ProductModel.findOne({ price: 39.99 });
    if (prodCount < 1450 || hasOldPrice) {
      console.log('🌱 [Database] Seeding 1505 products with genuine prices to MongoDB Atlas...');
      await ProductModel.deleteMany({});
      const prodsToInsert = localDb.products.map((p: any) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        stock: p.stock,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        featured: p.featured,
        reviews: p.reviews || []
      }));
      await ProductModel.insertMany(prodsToInsert);
      console.log(`🌱 [Database] Successfully seeded ${prodsToInsert.length} products with genuine pricing.`);
    }
  } catch (err) {
    console.error('❌ [Database] Auto-seeding MongoDB Atlas failed:', err);
  }
}
