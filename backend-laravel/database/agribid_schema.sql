-- AgriBid Database Schema
-- Generated based on Admin, Farmer, and Buyer Dashboard features
-- Date: November 19, 2025

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `role` ENUM('admin', 'farmer', 'buyer') NOT NULL DEFAULT 'buyer',
  `status` ENUM('active', 'suspended', 'banned', 'pending') NOT NULL DEFAULT 'active',
  `verification_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `avatar` VARCHAR(255) NULL,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_addresses` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `label` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NULL,
  `province` VARCHAR(100) NULL,
  `postal_code` VARCHAR(20) NULL,
  `is_default` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `icon` VARCHAR(50) NULL,
  `color` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCT LISTINGS
-- ============================================

CREATE TABLE `listings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `farmer_id` BIGINT UNSIGNED NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `type` VARCHAR(100) NOT NULL COMMENT 'e.g., Fruit, Vegetable, Grain, etc.',
  `quantity` VARCHAR(50) NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'kg',
  `starting_bid` DECIMAL(10, 2) NOT NULL,
  `buy_now_price` DECIMAL(10, 2) NULL,
  `current_bid` DECIMAL(10, 2) DEFAULT 0.00,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 8) NULL,
  `longitude` DECIMAL(11, 8) NULL,
  `status` ENUM('pending', 'active', 'sold', 'closed', 'rejected', 'expiring_soon') NOT NULL DEFAULT 'pending',
  `auction_start` TIMESTAMP NULL,
  `auction_end` TIMESTAMP NULL,
  `approval_status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `approved_by` BIGINT UNSIGNED NULL,
  `approved_at` TIMESTAMP NULL,
  `views_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`farmer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_farmer_id` (`farmer_id`),
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_auction_end` (`auction_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `listing_images` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE,
  INDEX `idx_listing_id` (`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BIDDING SYSTEM
-- ============================================

CREATE TABLE `bids` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `buyer_id` BIGINT UNSIGNED NOT NULL,
  `bid_amount` DECIMAL(10, 2) NOT NULL,
  `is_winning` BOOLEAN DEFAULT FALSE,
  `bid_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_listing_id` (`listing_id`),
  INDEX `idx_buyer_id` (`buyer_id`),
  INDEX `idx_bid_amount` (`bid_amount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EQUIPMENT RENTALS
-- ============================================

CREATE TABLE `equipment` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `owner_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `type` VARCHAR(100) NOT NULL COMMENT 'e.g., Tractor, Harvester, Irrigation',
  `rate_per_day` DECIMAL(10, 2) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 8) NULL,
  `longitude` DECIMAL(11, 8) NULL,
  `availability_status` ENUM('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available',
  `next_available_date` DATE NULL,
  `total_bookings` INT DEFAULT 0,
  `rating` DECIMAL(3, 2) DEFAULT 0.00,
  `reviews_count` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_owner_id` (`owner_id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_availability_status` (`availability_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `equipment_images` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `equipment_id` BIGINT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE CASCADE,
  INDEX `idx_equipment_id` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `equipment_rentals` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `equipment_id` BIGINT UNSIGNED NOT NULL,
  `renter_id` BIGINT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `rental_duration` INT NOT NULL COMMENT 'in days',
  `rate_per_day` DECIMAL(10, 2) NOT NULL,
  `total_cost` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`renter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_equipment_id` (`equipment_id`),
  INDEX `idx_renter_id` (`renter_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `equipment_reviews` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `equipment_id` BIGINT UNSIGNED NOT NULL,
  `rental_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `rating` TINYINT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `review_text` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`rental_id`) REFERENCES `equipment_rentals`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_equipment_id` (`equipment_id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRANSACTIONS & ORDERS
-- ============================================

CREATE TABLE `transactions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `listing_id` BIGINT UNSIGNED NULL,
  `seller_id` BIGINT UNSIGNED NOT NULL,
  `buyer_id` BIGINT UNSIGNED NOT NULL,
  `transaction_type` ENUM('auction', 'buy_now') NOT NULL,
  `quantity` VARCHAR(50) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `platform_fee` DECIMAL(10, 2) DEFAULT 0.00,
  `net_amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` VARCHAR(50) NULL,
  `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `transaction_status` ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `delivery_address` TEXT NULL,
  `delivery_status` ENUM('pending', 'in_transit', 'delivered', 'cancelled') NULL,
  `delivery_date` DATE NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_listing_id` (`listing_id`),
  INDEX `idx_seller_id` (`seller_id`),
  INDEX `idx_buyer_id` (`buyer_id`),
  INDEX `idx_transaction_status` (`transaction_status`),
  INDEX `idx_payment_status` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sales_history` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` BIGINT UNSIGNED NOT NULL,
  `farmer_id` BIGINT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_type` VARCHAR(100) NOT NULL,
  `quantity` VARCHAR(50) NOT NULL,
  `sold_price` DECIMAL(10, 2) NOT NULL,
  `buyer_name` VARCHAR(255) NOT NULL,
  `sold_date` DATE NOT NULL,
  `payout_status` ENUM('pending', 'processing', 'paid', 'failed') NOT NULL DEFAULT 'pending',
  `payout_date` DATE NULL,
  `payout_amount` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_farmer_id` (`farmer_id`),
  INDEX `idx_payout_status` (`payout_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DISPUTES & RESOLUTION
-- ============================================

CREATE TABLE `disputes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` BIGINT UNSIGNED NOT NULL,
  `complainant_id` BIGINT UNSIGNED NOT NULL,
  `respondent_id` BIGINT UNSIGNED NOT NULL,
  `dispute_type` ENUM('product_quality', 'delivery', 'payment', 'other') NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('open', 'investigating', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  `resolution` TEXT NULL,
  `resolved_by` BIGINT UNSIGNED NULL,
  `resolved_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`complainant_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`respondent_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_transaction_id` (`transaction_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('bid', 'outbid', 'auction_won', 'auction_lost', 'delivery', 'payment', 'rental', 'new_listing', 'expiration', 'dispute', 'system') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `related_id` BIGINT UNSIGNED NULL COMMENT 'ID of related entity (listing, transaction, etc)',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FAVORITES / WISHLIST
-- ============================================

CREATE TABLE `favorites` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_favorite` (`user_id`, `listing_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_listing_id` (`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ACTIVITY LOGS (AUDIT TRAIL)
-- ============================================

CREATE TABLE `activity_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL COMMENT 'e.g., user, listing, transaction, etc',
  `entity_id` BIGINT UNSIGNED NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_entity_type` (`entity_type`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SYSTEM SETTINGS
-- ============================================

CREATE TABLE `system_settings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  `value` TEXT NULL,
  `type` ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
  `description` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PAYMENT METHODS (For future use)
-- ============================================

CREATE TABLE `payment_methods` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `method_type` ENUM('credit_card', 'debit_card', 'gcash', 'paymaya', 'bank_transfer') NOT NULL,
  `provider` VARCHAR(100) NULL,
  `account_name` VARCHAR(255) NULL,
  `account_number` VARCHAR(255) NULL,
  `is_default` BOOLEAN DEFAULT FALSE,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VOUCHERS / COUPONS (For flash deals feature)
-- ============================================

CREATE TABLE `vouchers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) UNIQUE NOT NULL,
  `description` TEXT NULL,
  `discount_type` ENUM('percentage', 'fixed_amount') NOT NULL,
  `discount_value` DECIMAL(10, 2) NOT NULL,
  `min_purchase_amount` DECIMAL(10, 2) DEFAULT 0.00,
  `max_discount_amount` DECIMAL(10, 2) NULL,
  `usage_limit` INT DEFAULT 1,
  `used_count` INT DEFAULT 0,
  `valid_from` TIMESTAMP NULL,
  `valid_until` TIMESTAMP NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_valid_until` (`valid_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `voucher_usage` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `voucher_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `transaction_id` BIGINT UNSIGNED NULL,
  `discount_applied` DECIMAL(10, 2) NOT NULL,
  `used_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL,
  INDEX `idx_voucher_id` (`voucher_id`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INITIAL DATA SEEDS
-- ============================================

-- Insert default categories
INSERT INTO `categories` (`name`, `slug`, `icon`, `color`, `description`, `is_active`) VALUES
('Fruits', 'fruits', 'Apple', 'text-red-600', 'Fresh fruits and fruit products', TRUE),
('Vegetables', 'vegetables', 'Carrot', 'text-orange-600', 'Fresh vegetables and greens', TRUE),
('Grains', 'grains', 'Wheat', 'text-yellow-700', 'Rice, corn, wheat and other grains', TRUE),
('Herbs', 'herbs', 'Leaf', 'text-green-600', 'Medicinal and culinary herbs', TRUE),
('Dairy', 'dairy', 'Milk', 'text-blue-600', 'Dairy products and milk', TRUE),
('Poultry', 'poultry', 'Egg', 'text-purple-600', 'Eggs and poultry products', TRUE);

-- Insert default admin user (password: password123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`, `verification_status`, `phone`) VALUES
('System Admin', 'admin@agribid.com', '$2y$12$LQv3c1yD1lKO5Mc6LNXxMeYk5bQ9yxZJ5KLxV8kYNxJy1.DxJK.Wy', 'admin', 'active', 'verified', '09123456789');

-- Insert sample system settings
INSERT INTO `system_settings` (`key`, `value`, `type`, `description`) VALUES
('platform_fee_percentage', '5', 'number', 'Platform fee percentage for transactions'),
('min_bid_increment', '50', 'number', 'Minimum bid increment amount'),
('auction_extension_minutes', '5', 'number', 'Minutes to extend auction when bid placed near end'),
('auto_approve_listings', 'false', 'boolean', 'Automatically approve new listings'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('site_name', 'AgriBid', 'string', 'Platform name'),
('contact_email', 'support@agribid.com', 'string', 'Support contact email');
