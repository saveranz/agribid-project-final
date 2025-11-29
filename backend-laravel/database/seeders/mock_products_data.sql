-- ============================================================
-- AGRIBID E-COMMERCE SYSTEM - MOCK PRODUCT DATA
-- ============================================================
-- Three Categories:
-- 1. Direct Buy Products (Fixed Price)
-- 2. Auction Products (Bidding System)
-- 3. Farm Inputs - Fertilizers & Pesticides (Fixed Price Only)
-- ============================================================

-- Assuming user_id 2 is a farmer (adjust based on your users table)
-- Category IDs: 1=Vegetables, 2=Fruits, 3=Grains, 4=Farm Inputs

-- ============================================================
-- CATEGORY 1: DIRECT BUY PRODUCTS (Fixed Price)
-- ============================================================

-- 1. Organic Tomatoes (Direct Buy)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, harvest_date, expiry_date, quality_grade, organic_certified, pesticide_free, farm_name, farm_description, variety, growing_method, nutrition_info, storage_requirements, shipping_info, created_at, updated_at) 
VALUES (
    2, 1, 'Fresh Organic Tomatoes', 'produce', 'direct_buy', 150, 'kg', 120.00, 
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Premium quality organic tomatoes, freshly harvested. Rich in lycopene and vitamin C. Perfect for salads, cooking, and sauces.',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
    'active', 'approved',
    '2025-11-25', '2025-12-05', 'Grade A Premium', true, true,
    'Sunshine Organic Farm', 'Family-owned farm specializing in organic vegetables using sustainable farming practices',
    'Roma Tomatoes', 'Organic Soil-based', 'High in Vitamin C, Lycopene, and Potassium',
    'Store in cool, dry place. Refrigerate after 2 days.', 'Same-day delivery within Mindoro. Careful packaging to prevent bruising.',
    NOW(), NOW()
);

-- 2. Fresh Cabbage (Direct Buy)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, harvest_date, expiry_date, quality_grade, organic_certified, pesticide_free, farm_name, variety, growing_method, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 1, 'Fresh Green Cabbage', 'produce', 'direct_buy', 200, 'kg', 45.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Crisp and fresh green cabbage, ideal for coleslaw, stir-fry, and Filipino dishes like lumpia.',
    'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80',
    'active', 'approved',
    '2025-11-26', '2025-12-10', 'Grade A', false, true,
    'Green Valley Farm', 'Green Ball Cabbage', 'Conventional', 'Rich in Vitamin K, Vitamin C, and Fiber',
    'Refrigerate in plastic bag for up to 2 weeks', 'Delivered in breathable mesh bags',
    NOW(), NOW()
);

-- 3. Organic Carrots (Direct Buy)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, harvest_date, quality_grade, organic_certified, gap_certified, pesticide_free, farm_name, variety, growing_method, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 1, 'Organic Baby Carrots', 'produce', 'direct_buy', 100, 'kg', 180.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Sweet and crunchy organic baby carrots. Excellent source of beta-carotene. Great for snacking and cooking.',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80',
    'active', 'approved',
    '2025-11-24', 'Grade A Premium', true, true, true,
    'Sunshine Organic Farm', 'Nantes Carrots', 'Certified Organic', 'High in Beta-carotene, Vitamin A, Fiber',
    'Store in refrigerator crisper drawer for up to 3 weeks',
    NOW(), NOW()
);

-- 4. Premium Mangoes (Direct Buy)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, harvest_date, expiry_date, quality_grade, organic_certified, farm_name, variety, growing_method, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 2, 'Premium Carabao Mangoes', 'produce', 'direct_buy', 80, 'kg', 250.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'World-famous Philippine Carabao mangoes. Sweet, juicy, and aromatic. Export quality.',
    'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80',
    'active', 'approved',
    '2025-11-27', '2025-12-07', 'Export Quality', false,
    'Tropical Fruit Paradise', 'Carabao (Manila Super)', 'Conventional with GAP',
    'Excellent source of Vitamin C, Vitamin A, and Dietary Fiber',
    'Ripen at room temperature. Refrigerate when ripe.', 'Packed in cushioned boxes to prevent bruising',
    NOW(), NOW()
);

-- 5. Fresh Corn (Direct Buy)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, harvest_date, quality_grade, organic_certified, farm_name, variety, growing_method, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 3, 'Sweet Yellow Corn', 'produce', 'direct_buy', 95, 'kg', 85.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Farm-fresh sweet corn with bright yellow kernels. Perfect for grilling, boiling, or making corn soup.',
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
    'active', 'approved',
    '2025-11-28', 'Grade A', false,
    'Golden Harvest Farm', 'Sweet Hybrid', 'Conventional',
    'Good source of Carbohydrates, Fiber, Vitamin B, and Magnesium',
    'Keep refrigerated. Best consumed within 3-5 days of harvest',
    NOW(), NOW()
);

-- 6. Premium White Rice (Direct Buy)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, quality_grade, farm_name, variety, growing_method, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 3, 'Premium Jasmine Rice', 'produce', 'direct_buy', 500, 'kg', 55.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Premium quality jasmine rice with fragrant aroma. Fluffy texture when cooked. Milled and cleaned.',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    'active', 'approved',
    'Grade A Premium',
    'Riceland Farms', 'Jasmine 85', 'Conventional Paddy System',
    'Primary source of Carbohydrates, provides Energy and B Vitamins',
    'Store in cool, dry place in airtight container. Avoid moisture.',
    'Packed in sealed sacks. Delivery within 2-3 days.',
    NOW(), NOW()
);

-- ============================================================
-- CATEGORY 2: AUCTION PRODUCTS (Bidding System)
-- ============================================================

-- 7. Premium Pineapples (Auction)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, starting_bid, current_bid, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, auction_start, auction_end, harvest_date, quality_grade, gap_certified, farm_name, variety, growing_method, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 2, 'Premium Queen Pineapples', 'produce', 'auction', 60, 'kg', 120.00, 120.00, 180.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Sweet and juicy Queen pineapples. Export quality with perfect golden color. Ideal for fresh consumption and processing.',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80',
    'active', 'approved',
    '2025-11-28 08:00:00', '2025-12-02 18:00:00',
    '2025-11-27', 'Export Quality', true,
    'Tropical Fruit Paradise', 'Queen Variety', 'Good Agricultural Practice (GAP)',
    'Rich in Vitamin C, Manganese, and Bromelain enzyme',
    'Store at room temperature until ripe, then refrigerate',
    NOW(), NOW()
);

-- 8. Organic Lettuce (Auction)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, starting_bid, current_bid, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, auction_start, auction_end, harvest_date, quality_grade, organic_certified, pesticide_free, farm_name, variety, growing_method, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 1, 'Fresh Organic Lettuce', 'produce', 'auction', 40, 'kg', 150.00, 150.00, 220.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Crisp and fresh organic lettuce. Perfect for salads and healthy meals. Grown without synthetic pesticides.',
    'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80',
    'active', 'approved',
    '2025-11-28 06:00:00', '2025-12-01 18:00:00',
    '2025-11-27', 'Grade A Premium', true, true,
    'Sunshine Organic Farm', 'Butterhead Lettuce', 'Certified Organic Hydroponic',
    'Low in calories, high in Vitamin K, Vitamin A, and Folate',
    'Keep refrigerated in sealed bag with paper towel to absorb moisture',
    NOW(), NOW()
);

-- 9. Fresh Eggplants (Auction)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, starting_bid, current_bid, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, auction_start, auction_end, harvest_date, quality_grade, farm_name, variety, growing_method, nutrition_info, created_at, updated_at)
VALUES (
    2, 1, 'Fresh Purple Eggplants', 'produce', 'auction', 75, 'kg', 55.00, 55.00, 85.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Fresh purple eggplants with glossy skin. Perfect for Filipino dishes like tortang talong and pinakbet.',
    'https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=800&q=80',
    'active', 'approved',
    '2025-11-28 07:00:00', '2025-12-03 17:00:00',
    '2025-11-27', 'Grade A',
    'Green Valley Farm', 'Black Beauty Eggplant', 'Conventional',
    'Good source of Dietary Fiber, Vitamins, and Antioxidants',
    NOW(), NOW()
);

-- 10. Premium Palay/Unmilled Rice (Auction)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, starting_bid, current_bid, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, auction_start, auction_end, harvest_date, quality_grade, farm_name, variety, growing_method, storage_requirements, created_at, updated_at)
VALUES (
    2, 3, 'Premium Palay (Unmilled Rice)', 'produce', 'auction', 1000, 'kg', 28.00, 28.00, 42.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Bulk palay (unmilled rice) for rice mill operators and traders. Clean and well-dried. High milling recovery rate.',
    'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80',
    'active', 'approved',
    '2025-11-28 09:00:00', '2025-12-05 17:00:00',
    '2025-11-26', 'Grade A',
    'Riceland Farms', 'PSB RC 82', 'Conventional Paddy',
    'Store in dry ventilated area. Moisture content below 14%',
    NOW(), NOW()
);

-- ============================================================
-- CATEGORY 3: FARM INPUTS - FERTILIZERS & PESTICIDES (Fixed Price Only)
-- ============================================================

-- 11. Complete Fertilizer NPK 14-14-14
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, quality_grade, farm_name, variety, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 4, 'Complete Fertilizer NPK 14-14-14', 'farm_input', 'direct_buy', 500, 'kg', 1450.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Balanced complete fertilizer with equal proportions of Nitrogen, Phosphorus, and Potassium. Ideal for vegetables, fruits, and field crops. Promotes healthy growth, flowering, and fruiting.',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    'active', 'approved',
    'Commercial Grade',
    'AgriSupply Center', 'Complete NPK 14-14-14',
    'Contains 14% Nitrogen, 14% Phosphorus (P2O5), 14% Potassium (K2O)',
    'Store in cool, dry place away from direct sunlight. Keep sealed to prevent moisture absorption.',
    'Packed in 50kg sacks. Bulk orders delivered within 3-5 days.',
    NOW(), NOW()
);

-- 12. Urea Fertilizer 46-0-0
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, quality_grade, farm_name, variety, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 4, 'Urea Fertilizer 46-0-0', 'farm_input', 'direct_buy', 1000, 'kg', 1250.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'High-nitrogen urea fertilizer (46% N). Best for vegetative growth and leaf development. Suitable for rice, corn, and vegetables during vegetative stage.',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    'active', 'approved',
    'Commercial Grade',
    'AgriSupply Center', 'Prilled Urea 46-0-0',
    '46% Nitrogen content. Water-soluble for quick absorption.',
    'Store in moisture-proof containers. Keep away from rain and humidity.',
    'Available in 50kg bags. Free delivery for orders above 500kg.',
    NOW(), NOW()
);

-- 13. Organic Compost Fertilizer
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, organic_certified, quality_grade, farm_name, variety, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 4, 'Organic Compost Fertilizer', 'farm_input', 'direct_buy', 2000, 'kg', 25.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Premium organic compost made from decomposed plant materials and animal manure. Improves soil structure, water retention, and nutrient availability. Certified organic.',
    'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&q=80',
    'active', 'approved', true,
    'Organic Certified',
    'Sunshine Organic Farm', 'Composted Organic Matter',
    'Rich in organic matter, NPK (1-1-1), beneficial microorganisms, and humus',
    'Store in shaded, well-ventilated area. Can be stored for extended periods.',
    NOW(), NOW()
);

-- 14. Insecticide - Cypermethrin 10% EC
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, quality_grade, farm_name, variety, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 4, 'Cypermethrin 10% EC Insecticide', 'farm_input', 'direct_buy', 100, 'liter', 650.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Broad-spectrum synthetic pyrethroid insecticide. Effective against aphids, caterpillars, beetles, and other crop pests. For vegetables, fruits, and field crops.',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80',
    'active', 'approved',
    'Agricultural Grade',
    'AgriSupply Center', 'Emulsifiable Concentrate (EC)',
    'Active Ingredient: Cypermethrin 10%. Mix 20-30ml per 16L of water for foliar spray.',
    'Store in original container in cool, dry, locked storage. Keep away from food and feed. Highly toxic - handle with care.',
    'Delivered in sealed bottles. Requires proper handling documentation.',
    NOW(), NOW()
);

-- 15. Fungicide - Mancozeb 80% WP
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, quality_grade, farm_name, variety, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 4, 'Mancozeb 80% WP Fungicide', 'farm_input', 'direct_buy', 150, 'kg', 380.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Protective fungicide for prevention and control of fungal diseases. Effective against late blight, downy mildew, and leaf spots on tomatoes, potatoes, and vegetables.',
    'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80',
    'active', 'approved',
    'Agricultural Grade',
    'AgriSupply Center', 'Wettable Powder (WP)',
    'Active Ingredient: Mancozeb 80%. Application rate: 2-3 kg per hectare. Preventive application recommended.',
    'Store in original sealed packaging in dry place. Protect from moisture and direct sunlight.',
    NOW(), NOW()
);

-- 16. Herbicide - Glyphosate 41% SL
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, quality_grade, farm_name, variety, nutrition_info, storage_requirements, shipping_info, created_at, updated_at)
VALUES (
    2, 4, 'Glyphosate 41% SL Herbicide', 'farm_input', 'direct_buy', 80, 'liter', 420.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Non-selective systemic herbicide for control of annual and perennial weeds. Effective for pre-planting weed control in rice, corn, and vegetable fields.',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    'active', 'approved',
    'Agricultural Grade',
    'AgriSupply Center', 'Soluble Liquid (SL) 41%',
    'Active Ingredient: Glyphosate 41%. Mix 30-50ml per 16L water. Apply when weeds are actively growing.',
    'Keep in original container. Store in cool, dry, locked facility away from food. Avoid contamination of water sources.',
    'Requires valid pesticide applicator license for purchase. Proper disposal of empty containers required.',
    NOW(), NOW()
);

-- 17. Bio-Pesticide - Bacillus thuringiensis (Bt)
INSERT INTO listings (user_id, category_id, name, type, listing_type, quantity, unit, buy_now_price, location, latitude, longitude, description, image_url, status, approval_status, organic_certified, quality_grade, farm_name, variety, nutrition_info, storage_requirements, created_at, updated_at)
VALUES (
    2, 4, 'Bacillus thuringiensis (Bt) Bio-Pesticide', 'farm_input', 'direct_buy', 50, 'kg', 850.00,
    'Bongabong, Oriental Mindoro, Philippines', 12.692843, 121.509388,
    'Organic biological insecticide containing Bt bacteria. Safe and effective against caterpillars and lepidopteran pests. Approved for organic farming. Safe for beneficial insects.',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
    'active', 'approved', true,
    'Organic Certified',
    'Sunshine Organic Farm', 'Bt var. kurstaki',
    'Contains viable Bt spores. Apply 500g-1kg per hectare. Mix with water for foliar spray. Best applied in evening or cloudy days.',
    'Store in cool, dry place below 30°C. Protect from direct sunlight. Use within 2 years of manufacture date.',
    NOW(), NOW()
);

-- ============================================================
-- STOCK BATCHES FOR TIERED PRICING (for Direct Buy products)
-- ============================================================

-- Stock batches for Product #1: Organic Tomatoes
INSERT INTO stock_batches (listing_id, batch_number, quantity, remaining_quantity, price, batch_date, notes, created_at, updated_at)
VALUES 
(1, 'BAT-TOM-001', 40, 40, 150.00, '2025-11-25', 'Premium Grade - First Harvest', NOW(), NOW()),
(1, 'BAT-TOM-002', 50, 50, 120.00, '2025-11-25', 'Bulk Order Discount', NOW(), NOW()),
(1, 'BAT-TOM-003', 60, 60, 100.00, '2025-11-25', 'Maximum Bulk Discount', NOW(), NOW());

-- Stock batches for Product #2: Fresh Cabbage
INSERT INTO stock_batches (listing_id, batch_number, quantity, remaining_quantity, price, batch_date, notes, created_at, updated_at)
VALUES 
(2, 'BAT-CAB-001', 50, 50, 50.00, '2025-11-26', 'Small Orders', NOW(), NOW()),
(2, 'BAT-CAB-002', 75, 75, 45.00, '2025-11-26', 'Medium Bulk', NOW(), NOW()),
(2, 'BAT-CAB-003', 75, 75, 40.00, '2025-11-26', 'Large Bulk', NOW(), NOW());

-- Stock batches for Product #3: Organic Carrots
INSERT INTO stock_batches (listing_id, batch_number, quantity, remaining_quantity, price, batch_date, notes, created_at, updated_at)
VALUES 
(3, 'BAT-CAR-001', 30, 30, 200.00, '2025-11-24', '1-10kg', NOW(), NOW()),
(3, 'BAT-CAR-002', 40, 40, 180.00, '2025-11-24', '11-50kg', NOW(), NOW()),
(3, 'BAT-CAR-003', 30, 30, 160.00, '2025-11-24', '51kg+', NOW(), NOW());

-- Stock batches for Product #4: Premium Mangoes
INSERT INTO stock_batches (listing_id, batch_number, quantity, remaining_quantity, price, batch_date, notes, created_at, updated_at)
VALUES 
(4, 'BAT-MAN-001', 30, 30, 280.00, '2025-11-27', 'Export Quality - Premium', NOW(), NOW()),
(4, 'BAT-MAN-002', 50, 50, 250.00, '2025-11-27', 'Bulk Discount', NOW(), NOW());

-- Stock batches for Product #11: Complete Fertilizer
INSERT INTO stock_batches (listing_id, batch_number, quantity, remaining_quantity, price, batch_date, notes, created_at, updated_at)
VALUES 
(11, 'BAT-FER-001', 200, 200, 1500.00, '2025-11-20', 'Small Orders (50kg sacks)', NOW(), NOW()),
(11, 'BAT-FER-002', 300, 300, 1450.00, '2025-11-20', 'Bulk Orders (10+ sacks)', NOW(), NOW());

-- ============================================================
-- END OF MOCK DATA
-- ============================================================
