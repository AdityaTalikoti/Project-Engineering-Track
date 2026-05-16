-- CorpFlow v1.0 Database Schema
-- Standard tables for users, projects, and billing.

DROP TABLE IF EXISTS billing_details;
DROP TABLE IF EXISTS project_assignments;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    salary DECIMAL(10,2), -- Base salary for payroll management
    UNIQUE (id, tenant_id)
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    budget DECIMAL(12,2),
    UNIQUE (id, tenant_id)
);

CREATE TABLE project_assignments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id, tenant_id) REFERENCES users(id, tenant_id),
    FOREIGN KEY (project_id, tenant_id) REFERENCES projects(id, tenant_id)
);

CREATE TABLE billing_details (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    user_id INTEGER NOT NULL,
    card_holder_name VARCHAR(100),
    card_last4 VARCHAR(4),
    expiry_date VARCHAR(5),
    billing_address TEXT,
    FOREIGN KEY (user_id, tenant_id) REFERENCES users(id, tenant_id)
);

-- Move 7: Composite Indexes on tenant_id for tenant-specific tables
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_project_assignments_tenant_id ON project_assignments(tenant_id);
CREATE INDEX idx_billing_details_tenant_id ON billing_details(tenant_id);

-- Seed Initial Data
INSERT INTO tenants (name) VALUES 
('Pouch.io'), 
('Velocity');

INSERT INTO users (tenant_id, full_name, email, password_hash, role, salary) VALUES
(1, 'Alice Johnson', 'alice@pouch.io', 'pbkdf2:sha256:600000$hasher$81726a', 'admin', 125000.00),
(1, 'Bob Smith', 'bob@pouch.io', 'pbkdf2:sha256:600000$hasher$81726b', 'manager', 95000.00),
(2, 'Charlie Davis', 'charlie@velocity.com', 'pbkdf2:sha256:600000$hasher$81726c', 'admin', 140000.00),
(2, 'David Miller', 'david@velocity.com', 'pbkdf2:sha256:600000$hasher$81726d', 'user', 75000.00);

INSERT INTO projects (tenant_id, name, description, status, budget) VALUES
(1, 'Pouch Portal', 'Customer portal for Pouch.io', 'active', 50000.00),
(2, 'Velocity Engine', 'Back-end engine for Velocity', 'active', 120000.00),
(2, 'Secret R&D', null, 'inactive', 250000.00);

INSERT INTO project_assignments (tenant_id, project_id, user_id) VALUES
(1, 1, 1),
(1, 1, 2),
(2, 2, 3),
(2, 2, 4),
(2, 3, 3);

INSERT INTO billing_details (tenant_id, user_id, card_holder_name, card_last4, expiry_date, billing_address) VALUES
(1, 1, 'Alice Johnson', '4242', '12/28', '123 Tech Lane, SF'),
(2, 3, 'Charlie Davis', '9182', '08/26', '789 Velocity Rd, NY');
