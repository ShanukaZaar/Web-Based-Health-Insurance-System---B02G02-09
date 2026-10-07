-- ==============================================================================
-- Web-Based Health Insurance Management System
-- Database Dummy / Seed Data Script
-- ==============================================================================

-- 1. Insert Dummy Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Administrator role with full system privileges'),
(2, 'ROLE_CUSTOMER', 'Policyholder customer role'),
(3, 'ROLE_SUPPORT', 'Customer support agent role')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 2. Insert Dummy Users
INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone_number, is_active) VALUES
(1, 'admin', 'admin@healthinsurance.com', '$2a$10$e7xV6aG7hG...dummyhash', 'System', 'Admin', '+1-555-0100', true),
(2, 'johndoe', 'john.doe@example.com', '$2a$10$e7xV6aG7hG...dummyhash', 'John', 'Doe', '+1-555-0101', true),
(3, 'janesmith', 'jane.smith@example.com', '$2a$10$e7xV6aG7hG...dummyhash', 'Jane', 'Smith', '+1-555-0102', true),
(4, 'support_bob', 'bob.support@healthinsurance.com', '$2a$10$e7xV6aG7hG...dummyhash', 'Bob', 'Miller', '+1-555-0103', true),
(5, 'alice_w', 'alice.williams@example.com', '$2a$10$e7xV6aG7hG...dummyhash', 'Alice', 'Williams', '+1-555-0104', true)
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);

-- 3. Associate Users with Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin -> ROLE_ADMIN
(2, 2), -- John -> ROLE_CUSTOMER
(3, 2), -- Jane -> ROLE_CUSTOMER
(4, 3), -- Bob -> ROLE_SUPPORT
(5, 2)  -- Alice -> ROLE_CUSTOMER
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- 4. Insert Initial Dummy Support Tickets
INSERT INTO support_tickets (id, ticket_number, user_id, subject, description, status, priority) VALUES
(1, 'TKT-1001-DEMO', 2, 'Claim Status Query', 'Inquiring about status of hospitalization claim #CLM-5021 submitted last week.', 'OPEN', 'HIGH'),
(2, 'TKT-1002-DEMO', 3, 'Policy Renewal Assistance', 'Need assistance modifying payment method for annual health plan renewal.', 'IN_PROGRESS', 'MEDIUM'),
(3, 'TKT-1003-DEMO', 5, 'Hospital Network Empanelment', 'Is St. Jude City Hospital covered under Comprehensive Gold Plan?', 'RESOLVED', 'LOW')
ON DUPLICATE KEY UPDATE subject=VALUES(subject);
