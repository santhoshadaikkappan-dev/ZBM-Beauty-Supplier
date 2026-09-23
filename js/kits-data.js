/**
 * ZANDRA BEAUTY MATRIX (ZBM) - Curated Private Label Sample Discovery Kits
 * Target Audience Specific Collections • Fixed Uniform Pricing: $99.00 USD + $29.00 USD Insured Express Freight
 * Each Kit Includes 7-10 Unbranded Physical Laboratory Formulations + Turnkey Rebranding Quotation + Full COA Dossier
 */

const ZBM_SAMPLE_KITS = [
  {
    id: "salon-pro",
    title: "Salon Pro & Luxury Spa Discovery Kit",
    audience: "Hair Salons, Nail Salons & Luxury Day Spas",
    tagline: "Turnkey Salon Wash-Basin, Styling & Pedicure Private Label Line",
    badge: "B2B Salon Pro Grade",
    icon: "fa-scissors",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_salon_pro.jpg",
    itemCount: 10,
    highlights: [
      "Wash-station high-margin retail upsells",
      "Spa pedicure and foot-soak recovery treatments",
      "Instant herbal painless body waxing solution",
      "Blowout heat-defense & high-gloss serums"
    ],
    overview: "Engineered specifically for upscale hair salons, nail lounges, and day spas seeking their own branded backbar and retail line. Features professional wash-basin essentials, post-styling shine elixirs, luxury foot care for pedicures, and soothing botanical body polishes.",
    formulations: [
      { num: 50, name: "Moroccan Argan Oil Shampoo", weight: "100ml", category: "Shampoo", actives: "Pure Moroccan Argan Oil & Keratin Amino Acids", pkg: "Frosted Treatment Pump Bottle", note: "Backbar wash-station & take-home retail hero." },
      { num: 147, name: "Rosemary Hair Conditioner", weight: "100ml", category: "Hair Conditioner", actives: "Rosemary Leaf Extract & Botanical Lipids", pkg: "White Frosted Cylinder Bottle", note: "Deep scalp stimulation and detangling emulsion." },
      { num: 97, name: "Smooth & Soft Hair Serum (Water Based)", weight: "50ml", category: "Hair Serum", actives: "Silk Peptides & Micro-Moisture Matrix", pkg: "Frosted Glass Dropper with Gold Collar", note: "Post-blowout mirror shine with zero greasiness." },
      { num: 156, name: "Shea Butter Hair Butter", weight: "80g-100g", category: "Hair Butter", actives: "Unrefined Shea Butter & Coconut Oil", pkg: "Wide-Mouth Brushed Gold Jar", note: "Intense deep conditioning hair spa treatment mask." },
      { num: 176, name: "Rosemary Hair Spray", weight: "100ml", category: "Special Products", actives: "Steam-Distilled Rosemary Hydrosol & Biotin", pkg: "Fine-Mist Gold Sprayer Bottle", note: "Client styling finish & daily scalp revival mist." },
      { num: 131, name: "Foot Care Crack Cream / Balm", weight: "40g", category: "Foot Care", actives: "Urea, Beeswax, Tea Tree & Salicylic Acid", pkg: "Hammered Gold Aluminum Tin", note: "Pedicure service finish & retail checkout upsell." },
      { num: 132, name: "Foot Care Crack Soak Salt", weight: "100g", category: "Foot Care", actives: "Epsom Salt, Peppermint & Dead Sea Minerals", pkg: "Clear Spa Bath Jar", note: "Essential relaxing pedicure foot bath soak." },
      { num: 130, name: "Body Wax Powder", weight: "100g", category: "Wax Powder", actives: "Herbal Depilatory Clays & Soothing Calamine", pkg: "Sealed Barrier Pouch", note: "Pain-free 5-minute instant salon waxing service." },
      { num: 160, name: "Rose Petal Bath Salt", weight: "100g", category: "Bath Salt", actives: "Himalayan Pink Rock Salt & Damask Rose Petals", pkg: "Apothecary Corked Jar", note: "Luxury spa manicure/pedicure tub soak." },
      { num: 164, name: "Rose Petal Body Scrub", weight: "100g", category: "Body Scrub", actives: "Crushed Rose Petals, Walnut Beads & Vitamin E", pkg: "Heavy Frosted Glass Jar", note: "Exfoliating hand & foot polish before pedicure." }
    ]
  },
  {
    id: "clinical-esthetician",
    title: "Clinical Esthetician & Med-Spa Pro Kit",
    audience: "Dermatologists, Med-Spas & Licensed Estheticians",
    tagline: "Medical-Grade Fragrance-Free Actives for Post-Treatment & Clinical Homecare",
    badge: "Clinical Dermatology Grade",
    icon: "fa-user-doctor",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_clinical_esthetician.jpg",
    itemCount: 10,
    highlights: [
      "100% Non-fragrance clinical active serums",
      "Broad-spectrum SPF 50 non-comedogenic shield",
      "Post-peel, microneedling & laser barrier repair",
      "Triple acid clearing (Salicylic, Kojic, Hyaluronic)"
    ],
    overview: "Formulated for medical spas, clinical facialists, and dermatologists who demand clean INCI, high-potency bio-actives, and zero artificial fragrance. Designed for pre-facial extraction prep, microneedling glide, and barrier-soothing homecare regimens.",
    formulations: [
      { num: 73, name: "Hyaluronic Acid Serum (Water Based - Non Fragrance)", weight: "20ml", category: "Face Serum", actives: "Multi-Molecular Hyaluronic Acid & Provitamin B5", pkg: "Medical Dropper with Gold Collar", note: "Instant plumping & microneedling/hydra-facial glide." },
      { num: 75, name: "Niacinamide Face Serum (Water Based - Non Fragrance)", weight: "20ml", category: "Face Serum", actives: "10% Niacinamide (Vitamin B3) & Zinc PCA", pkg: "Frosted Precision Dropper", note: "Sebum regulation, pore tightening & barrier reinforcement." },
      { num: 77, name: "2% Salicylic Acid Face Serum (Non Fragrance)", weight: "20ml", category: "Face Serum", actives: "2% Beta Hydroxy Acid & Witch Hazel", pkg: "Clinical Amber Dropper", note: "Comedone extraction prep and active acne peel." },
      { num: 76, name: "Kojic & Manjistha Face Serum (Non Fragrance)", weight: "20ml", category: "Face Serum", actives: "Kojic Acid, Alpha Arbutin & Indian Madder", pkg: "UV-Coated Protective Dropper", note: "Clinical hyperpigmentation & melasma lightening." },
      { num: 62, name: "Sunscreen SPF 50 (Non Fragrance)", weight: "50ml", category: "Sunscreen", actives: "Micronized Zinc Oxide & Photostable UV Filters", pkg: "Airless Squeeze Pump Bottle", note: "Mandatory post-peel/laser daily UV barrier (zero white cast)." },
      { num: 104, name: "Anti Acne Face Wash", weight: "50ml", category: "Face Wash", actives: "Tea Tree, Salicylic Acid & Green Tea Extract", pkg: "Clinical Frosted Pump Bottle", note: "Deep follicular clarifying wash without barrier disruption." },
      { num: 140, name: "Shea Butter Face Cleanser", weight: "40g", category: "Face Cleanser", actives: "Organic Shea Butter & Botanical Squalane", pkg: "Matte PCR Tube", note: "Gentle non-stripping makeup & lipid cleansing milk." },
      { num: 82, name: "Under Eye Dark Circle Serum (Non Fragrance)", weight: "10ml", category: "Eye Care", actives: "Caffeine, Peptides & Vitamin K Matrix", pkg: "Micro-Dropper Ampoule", note: "Targeted vascular & melanin under-eye lightening." },
      { num: 116, name: "Pure Aloe Vera Gel", weight: "50gm", category: "Face Gel", actives: "99% Pure Cold-Pressed Aloe Barbadensis", pkg: "Heavy-Wall Clear Cosmetic Jar", note: "Instant thermal cooling post-laser or chemical peel." },
      { num: 186, name: "Advanced Anti Aging Face Gel", weight: "30gm", category: "Special Products", actives: "Plant Peptides, Gotu Kola & Marine Collagen", pkg: "Brushed Gold Rim Cosmetic Pot", note: "High-performance cellular firming and wrinkle reduction." }
    ]
  },
  {
    id: "influencer-glow",
    title: "Influencer Viral Glow & Glass-Skin Kit",
    audience: "Beauty Influencers, TikTok, YouTube & Instagram Creators",
    tagline: "Trending Photogenic Formulations Engineered for Viral Social Media Unboxing",
    badge: "Viral Social Media Ready",
    icon: "fa-camera-retro",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_influencer_glow.jpg",
    itemCount: 9,
    highlights: [
      "Dewy glass-skin droppers & golden shimmer oils",
      "Multi-use lip & cheek berry tint with instant payoff",
      "Satisfying blackhead peel-off mask for viral reels",
      "Lash & brow peptide growth serum"
    ],
    overview: "Tailor-made for beauty creators, lifestyle vloggers, and digital trendsetters wanting to launch their own aesthetic beauty line. Features hyper-visual textures, dewy body shimmers, viral multi-use tints, and shelfie-worthy frosted packaging that commands high engagement and instant sales.",
    formulations: [
      { num: 91, name: "Berry Red Lip & Cheek Tint", weight: "12-15gm", category: "Lip Balm", actives: "Organic Beetroot Pigment & Shea Butter", pkg: "Frosted Acrylic Pot with Gold Rim", note: "Viral multi-use dewy flush for lips and cheeks." },
      { num: 184, name: "Shimmer Body Lotion", weight: "30ml", category: "Special Products", actives: "Reflective Mineral Mica & Sweet Almond Oil", pkg: "Sleek Gold Dispenser Bottle", note: "Golden-hour dewy body highlight for reels and shorts." },
      { num: 185, name: "Shimmer Body Oil", weight: "50ml", category: "Special Products", actives: "Fractionated Coconut Oil & 24K Mica Flakes", pkg: "Clear Dropper Flask with Suspended Gold", note: "Liquid gold dewy radiance that sparkles on camera." },
      { num: 65, name: "Vitamin C Face Serum (Oil Based)", weight: "20ml", category: "Face Serum", actives: "THD Ascorbate (Vitamin C) & Rosehip Oil", pkg: "Frosted Amber Glass Dropper", note: "Instant glass-skin dropper aesthetic with golden glow." },
      { num: 159, name: "Beetroot Lip Scrub", weight: "50g", category: "Lip Scrub", actives: "Cane Sugar Crystals & Beetroot Extract", pkg: "Chic Frosted Scrub Pot", note: "Satisfying lip exfoliation video routine content." },
      { num: 86, name: "Beetroot Lip Balm", weight: "12-15gm", category: "Lip Balm", actives: "Beeswax, Cocoa Butter & Natural Tint", pkg: "Slim Rose-Gold Compact Pot", note: "Natural pink pout daily moisture essential." },
      { num: 197, name: "Blackheads Peel Off Mask", weight: "5-8gm", category: "Special Products", actives: "Bamboo Activated Charcoal & Witch Hazel", pkg: "Individual Peel-Pack Sachets", note: "Viral satisfying peel-off video engagement magnet." },
      { num: 83, name: "Lash & Brow Grow Serum (Non Fragrance)", weight: "10ml", category: "Eye Care", actives: "Myristoyl Pentapeptide-17 & Castor Oil", pkg: "Gold Cap Mascara Spoolie Tube", note: "Clean-girl aesthetic daily eyelash & brow booster." },
      { num: 181, name: "Magic Face Gel", weight: "50gm", category: "Special Products", actives: "Chromium Pearl Complex & Aloe Gel", pkg: "Frosted Glass Jar with Gold Rim", note: "Immediate color-morphing glow transformation gel." }
    ]
  },
  {
    id: "d2c-bestseller",
    title: "D2C E-Commerce Bestseller Launch Kit",
    audience: "Shopify Store Founders, Amazon FBA Sellers & Digital Brands",
    tagline: "High-Margin, High-Repeat Consumables with Proven Global Search Demand",
    badge: "High-Conversion D2C Model",
    icon: "fa-chart-line",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_d2c_bestseller.jpg",
    itemCount: 9,
    highlights: [
      "Top-selling global beauty keywords (Vitamin C, Kumkumadi)",
      "High repeat purchase rate creating 30-day subscriptions",
      "Low product weight optimizing D2C shipping margins",
      "High markup potential: 70% to 75% gross retail margin"
    ],
    overview: "Built for e-commerce entrepreneurs who prioritize metrics: high customer lifetime value, low return rates, and high-converting SEO keywords. Contains the universally top-selling categories across Amazon, Shopify, and TikTok Shop.",
    formulations: [
      { num: 64, name: "Kumkumadi Face Serum (Oil Based - Natural)", weight: "20ml", category: "Face Serum", actives: "Authentic Kashmiri Saffron & 26 Ayurvedic Herbs", pkg: "Frosted Glass Dropper with Gold Accents", note: "Top-selling Ayurvedic luxury hero product online." },
      { num: 74, name: "Vitamin C Serum (Water Based - Non Fragrance)", weight: "20ml", category: "Face Serum", actives: "15% L-Ascorbic Acid, Ferulic Acid & Hyaluronic", pkg: "Frosted Dropper Bottle", note: "Globally #1 most searched skincare formulation online." },
      { num: 15, name: "Charcoal Soap", weight: "100-125gm", category: "Soaps", actives: "Activated Bamboo Charcoal & Tea Tree Oil", pkg: "Minimalist Black Paper Band", note: "High-volume universal acne and detox soap bar." },
      { num: 28, name: "Kojic Acid Soap", weight: "100-125gm", category: "Soaps", actives: "Pure Kojic Acid Dipalmitate & Papaya Enzyme", pkg: "Clean White Cardboard Sleeve", note: "Explosive global trending keyword for tan removal." },
      { num: 101, name: "Kumkumadi Face Wash", weight: "50ml", category: "Face Wash", actives: "Saffron Extract & Mild Coconut Surfactants", pkg: "Frosted Foaming Pump Bottle", note: "Daily habit-forming product driving subscription re-orders." },
      { num: 54, name: "Vitamin C Face Cream (with Actives)", weight: "30gm", category: "Face Cream", actives: "Encapsulated Vitamin C & Niacinamide", pkg: "Heavy-Wall Glass Cream Jar", note: "Perfect cross-sell bundle paired with Vit C serum." },
      { num: 40, name: "Onion Hair Oil (Non Fragrance)", weight: "100ml", category: "Hair Oil", actives: "Red Onion Seed Oil, Black Seed & Bhringraj", pkg: "Amber Glass Dropper Flask", note: "Massive D2C hair fall volume & retention driver." },
      { num: 45, name: "Anti-Dandruff Shampoo", weight: "100ml", category: "Shampoo", actives: "Zinc Pyrithione, Ketoconazole & Tea Tree", pkg: "Matte White Squeeze Cylinder", note: "High customer retention problem-solving consumable." },
      { num: 88, name: "Kumkumadi Lip Balm", weight: "12-15gm", category: "Lip Balm", actives: "Saffron Infused Ghee & Organic Beeswax", pkg: "Pocket Gold Tin", note: "Low-ticket $3–$5 cart upsell booster at checkout." }
    ]
  },
  {
    id: "artisanal-boutique",
    title: "Artisanal Boutique & Luxury Gifting Discovery Kit",
    audience: "Concept Stores, Eco-Boutiques, Gift Hamper Creators & Spas",
    tagline: "French Apothecary Aesthetic with Handcrafted Cold-Processed Botanicals",
    badge: "Eco-Luxury Handcrafted",
    icon: "fa-gift",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_artisanal_boutique.jpg",
    itemCount: 10,
    highlights: [
      "45-Day cured cold-process botanical bathing bars",
      "Real dried rose petals & saffron threads embedded",
      "Apothecary cork-top mineral bath salts & vanity sprays",
      "Zero-waste linen paper bands and recyclable packaging"
    ],
    overview: "Designed for brick-and-mortar lifestyle boutiques, high-end hotel gift shops, and curated wellness subscription boxes. Emphasizes tactile sensory luxury: intoxicating natural botanicals, real flower petals, and sustainable earth-tone packaging.",
    formulations: [
      { num: 16, name: "Kumkumadi Saffron Bathing Bar", weight: "100-125gm", category: "Soaps", actives: "Cured Coconut Oil, Saffron & Goat Milk", pkg: "Raw Eco-Linen Paper Band", note: "Royal Ayurvedic 45-day cured cold-processed bar." },
      { num: 26, name: "Rose Petal Bathing Bar", weight: "100-125gm", category: "Soaps", actives: "Damask Rose Oil & Dried Petal Infusion", pkg: "Textured Linen Wrap", note: "Embedded real rose petals visible through wrapper." },
      { num: 30, name: "Red Wine Bathing Bar", weight: "100-125gm", category: "Soaps", actives: "French Grape Polyphenols & Resveratrol", pkg: "Deep Burgundy Eco Band", note: "Exotic luxury gifting soap with antioxidant aroma." },
      { num: 24, name: "Goat Milk Bathing Bar", weight: "100-125gm", category: "Soaps", actives: "Fresh Farm Goat Milk & Shea Butter", pkg: "Cream Linen Paper Wrap", note: "Ultra-creamy nourishing boutique counter staple." },
      { num: 172, name: "Pure Steam-Distilled Rose Water", weight: "100ml", category: "Special Products", actives: "100% Pure Kannauj Rose Hydrosol", pkg: "Amber Bottle with Fine Gold Sprayer", note: "Classic vanity mist and gift basket centerpiece." },
      { num: 161, name: "Kumkumadi Bath Salt", weight: "100g", category: "Bath Salt", actives: "Dead Sea Salt, Epsom & Saffron Threads", pkg: "Cork-Stoppered Glass Apothecary Jar", note: "Self-care Sunday luxury bath ritual jar." },
      { num: 127, name: "Body Moisturizer Lotion", weight: "100ml", category: "Body Lotion", actives: "Mango Butter, Jojoba & Sweet Almond", pkg: "Frosted Bottle with Brushed Gold Pump", note: "Chic luxury vanity pump with long-lasting scent." },
      { num: 157, name: "Lip Lightening Scrub", weight: "50g", category: "Lip Scrub", actives: "Raw Demerara Sugar & Rosehip Seed Oil", pkg: "Frosted Glass Jar with Gold Lid", note: "Cash counter impulse display item." },
      { num: 90, name: "Saffron Lip Balm", weight: "12-15gm", category: "Lip Balm", actives: "Pure Saffron Stigmas, Honey & Beeswax", pkg: "Royal Golden Mini Jar", note: "Premium golden packaging gift set inclusion." },
      { num: 8, name: "Luxury Body Perfume Lotion", weight: "30ml", category: "Celebrity Range", actives: "French Grasse Orchid Oil & Shea Butter", pkg: "Slender Gold Dispenser Tube", note: "High-end long-wearing fragrance cream alternative." }
    ]
  },
  {
    id: "bridal-mua",
    title: "Bridal MUA & Runway Skin-Prep Kit",
    audience: "Bridal Specialists, Celebrity Makeup Artists & Estheticians",
    tagline: "Professional Glass-Skin Canvas Primers, Correctors & Runway Glow",
    badge: "Runway & Bridal MUA Pro",
    icon: "fa-wand-magic-sparkles",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_bridal_mua.jpg",
    itemCount: 9,
    highlights: [
      "Smooth poreless canvas prep for 16-hour makeup wear",
      "Strobe effect liquid golds for decolletage and shoulders",
      "Traditional intense jet-black organic kajal stick",
      "Pre-bridal flash exfoliation and dark-circle depuffing"
    ],
    overview: "Curated specifically for professional makeup artists working bridal seasons, fashion runways, and red-carpet shoots. Focuses on the crucial skin-prep stage: creating a luminous, hydrating base that prevents foundation cake, creases, or flashback.",
    formulations: [
      { num: 192, name: "Bridal Face Cream", weight: "30gm", category: "Special Products", actives: "Pearl Extract, Kumkumadi & Niacinamide", pkg: "Champagne Gold Luxury Cream Jar", note: "Wedding morning glass-skin smoothing primer base." },
      { num: 178, name: "Cover Up Balm", weight: "8-10gm", category: "Special Products", actives: "High-Pigment Zinc Oxide, Calendula & Beeswax", pkg: "Matte Metal Concealer Pot", note: "Heavy-duty blemish & discoloration neutralizing base." },
      { num: 202, name: "Herbal Organic Kajal", weight: "8-10gm", category: "Herbal Kajal", actives: "Pure Castor Oil, Camphor & Almond Soot", pkg: "Sleek Matte Black Stick with Gold Cap", note: "Intense jet-black smudge-proof bridal eye definition." },
      { num: 182, name: "Shimmer Day / Night Cream", weight: "30g", category: "Special Products", actives: "Gold Strobe Mica, Hyaluronic Acid & Aloe", pkg: "Frosted Glass Jar with Gold Rim", note: "Luminous primer glow worn under foundation." },
      { num: 193, name: "Lip Lightening Serum Lip Balm", weight: "8-10gm", category: "Special Products", actives: "Hyaluronic Acid, Vitamin E & Kojic Extract", pkg: "Mini Gold Lip Squeeze Tube", note: "Non-flaky hydration base for matte liquid lipsticks." },
      { num: 128, name: "Body Shimmer & Shine Lotion", weight: "40ml", category: "Body Lotion", actives: "Champagne Gold Pearl & Argan Emulsion", pkg: "Slender Gold Pump Bottle", note: "Collarbones, shoulders & decolletage bridal highlighter." },
      { num: 172, name: "Pure Steam-Distilled Rose Water", weight: "100ml", category: "Special Products", actives: "Pure Kannauj Rose Water", pkg: "Frosted Glass Bottle with Fine Gold Sprayer", note: "Pro makeup setting & refreshing hydration mist." },
      { num: 139, name: "Rosepetal Brightening Face Scrub", weight: "50g", category: "Face Scrub", actives: "Micro-Exfoliating Walnut & Rose Petals", pkg: "Frosted Cream Jar", note: "Pre-bridal facial flash gentle polishing." },
      { num: 82, name: "Under Eye Dark Circle Serum", weight: "10ml", category: "Eye Care", actives: "Caffeine & Tripeptide-5", pkg: "Precision Eye Dropper", note: "Instantly depuffs tired eyes before concealer." }
    ]
  },
  {
    id: "brand-founder",
    title: "Brand Founder's Flagship Launch Collection",
    audience: "First-Time Beauty Brand Founders & Wellness Entrepreneurs",
    tagline: "The Complete 360° Core 4-Step Regimen + Hair & Body Heroes",
    badge: "Turnkey Startup Hero Line",
    icon: "fa-rocket",
    price: 99.00,
    shipping: 29.00,
    total: 128.00,
    image: "assets/images/kits/kit_brand_founder.jpg",
    itemCount: 9,
    highlights: [
      "Complete Cleanse, Treat, Moisturize & Protect line",
      "Includes hair & body hero SKUs for brand completeness",
      "Ready for custom label application and retail box packaging",
      "Flexible scaling from 50 units (Startup) to 1,000+ (Retail)"
    ],
    overview: "The essential starting point for ambitious entrepreneurs launching a new skincare brand. Covers all four fundamental pillars of daily skincare (Cleanse, Treat, Moisturize, Protect) along with breakout hair and body formulations to build immediate brand authority.",
    formulations: [
      { num: 106, name: "Face Brightening Face Wash", weight: "50ml", category: "Face Wash", actives: "Licorice Extract, Mulberry & Vitamin C", pkg: "Frosted Pump Cleanser Bottle", note: "Step 1: Daily Essential Radiance Cleanser." },
      { num: 74, name: "Vitamin C Face Serum", weight: "20ml", category: "Face Serum", actives: "15% Vitamin C, Ferulic Acid & Hyaluronic", pkg: "Amber Dropper Bottle with Gold Cap", note: "Step 2: Universal Demand Hero Active Treatment." },
      { num: 52, name: "Kumkumadi Face Cream (with Actives)", weight: "30gm", category: "Face Cream", actives: "Saffron, Goat Milk & Niacinamide", pkg: "Frosted Jar with Brushed Gold Lid", note: "Step 3: Core Barrier Restorative Daily Cream." },
      { num: 62, name: "Sunscreen SPF 50 (Non Fragrance)", weight: "50ml", category: "Sunscreen", actives: "Zinc Oxide & Photostable Filters", pkg: "Matte White Squeeze Tube", note: "Step 4: Mandatory Daily Broad-Spectrum Shield." },
      { num: 27, name: "Niacinamide Bathing Soap", weight: "100-125gm", category: "Soaps", actives: "2% Niacinamide, Glycerin & Coconut Oil", pkg: "Minimalist Linen Paper Wrap", note: "Accessible entry-level body care hero." },
      { num: 124, name: "Kumkumadi Body Lotion", weight: "100ml", category: "Body Lotion", actives: "Ayurvedic Saffron & Shea Butter Emulsion", pkg: "Frosted Cylinder with Gold Pump", note: "All-over daily luxury body moisturizer." },
      { num: 35, name: "Advanced Herbs Hair Oil - Women", weight: "100ml", category: "Hair Oil", actives: "18 Herbal Infusion & Virgin Sesame Oil", pkg: "Traditional Amber Glass Bottle", note: "Top-selling Ayurvedic hair wellness hero." },
      { num: 49, name: "Smooth & Shine Hair Shampoo", weight: "100ml", category: "Shampoo", actives: "Keratin, Argan & Gentle Surfactants", pkg: "Modern White Disc-Top Bottle", note: "High repeat-order bathroom staple." },
      { num: 85, name: "Berry Red Lip Balm", weight: "12-15gm", category: "Lip Balm", actives: "Beeswax, Raspberry Seed & Shea Butter", pkg: "Pocket Gold Tin Container", note: "High-margin lifestyle impulse cart add-on." }
    ]
  },
  {
    id: "celebrity-vault",
    title: "The Royal Gold Vault: Celebrity VIP Discovery Set",
    audience: "High-Net-Worth Brands, 5-Star Hotel Spas & Celebrity Aesthetic Clinics",
    tagline: "Pharma-Grade L-Glutathione, 24K Pure Gold Flakes & Blue-Pea Butterfly Elixirs",
    badge: "Ultra-Luxury VIP Tier",
    icon: "fa-crown",
    price: 299.00,
    shipping: 29.00,
    total: 328.00,
    image: "assets/images/kits/kit_celebrity_vault.jpg",
    itemCount: 7,
    highlights: [
      "Infused with real suspended 24K pure gold leaf flakes",
      "Pharmaceutical-grade L-Glutathione cellular renewal",
      "Rare Blue-Pea Butterfly Flaxseed Trichology Hair Duo",
      "Red Miracle Rosemary hair regrowth follicle elixir"
    ],
    overview: "The crown jewel of ZANDRA BEAUTY MATRIX (ZBM). Formulated exclusively for luxury clinics in Beverly Hills, Dubai, London, and 5-star hotel spas seeking an ultra-premium tier commanding $150 to $350 retail price points. Infused with pure 24K gold flakes, pharma-grade Glutathione, and rare botanical elixirs.",
    formulations: [
      { num: 1, name: "Premium Glutathione Super Bright Night Cream (The Celebrity Secret)", weight: "30 gm", category: "Celebrity Range", actives: "Pharma-Grade L-Glutathione, Alpha Arbutin & 24K Gold Flakes", pkg: "Heavy-Wall Frosted Crystal Jar with Gold Lid", note: "The flagship celebrity red-carpet cellular brightener." },
      { num: 2, name: "Golden Glow Face Serum (Anti Aging & Brightening)", weight: "30 ml", category: "Celebrity Range", actives: "Real 24K Pure Gold Leaf Flakes & Vitamin C Ester", pkg: "Crystal Dropper Flask with Gold Collar", note: "Ultra-luminous gold-flake elixir with anti-aging peptides." },
      { num: 3, name: "Luxury Golden Saffron Bathing Bar", weight: "100-150g", category: "Celebrity Range", actives: "Grade-A Mongra Kashmiri Saffron & Gold Mica", pkg: "Matte Black Box with Gold Foil Stamping", note: "Royal 45-day cured bathing bar with rich golden lather." },
      { num: 7, name: "Premium Celebrity Full Body Whitening & Detan Body Lotion", weight: "100g", category: "Celebrity Range", actives: "Niacinamide, Licorice & Kojic Dipalmitate", pkg: "Frosted Gold Pump Bottle", note: "Celebrity-grade full body melanin reduction lotion." },
      { num: 11, name: "Red Miracle Rosemary Hair Regrowth Serum", weight: "30ml", category: "Celebrity Range", actives: "Rosemary Terpenes, Redensyl, Procapil & Anagain", pkg: "Amber Dropper with Gold Ring", note: "High-potency clinical follicle reactivation elixir." },
      { num: 12, name: "Premium Blue-Pea Butterfly Flax Seed Hair Conditioner", weight: "100ml", category: "Celebrity Range", actives: "Blue-Pea Butterfly Flower (Clitoria Ternatea) & Organic Flaxseed", pkg: "Cobalt Blue Accented Pump Bottle", note: "Anti-frizz trichology treatment creating glass hair." },
      { num: 13, name: "Premium Blue-Pea Butterfly Flax Seed Shampoo", weight: "100ml", category: "Celebrity Range", actives: "Bio-Active Butterfly Pea Anthocyanins & Cold-Pressed Flaxseed", pkg: "Cobalt Blue Accented Pump Bottle", note: "Deep antioxidant sulfate-free hair cleanser." }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZBM_SAMPLE_KITS };
}
