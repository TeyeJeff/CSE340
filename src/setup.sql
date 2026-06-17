-- =========================================================================
-- 1. ORGANIZATION TABLE
-- =========================================================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers','A volunteer coordination group supporting local charities and service initiatives', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT * FROM organization;


-- =========================================================================
-- 2. SERVICE PROJECT TABLE
-- =========================================================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO service_project (organization_id, title, description, location, date) 
VALUES
-- PROJECTS FOR ORGANIZATION ID: 1
(1, 'Community Park Cleanup', 'Help us rake leaves, clear brush, and repaint benches to restore our local community space.', 'Central Park Recreation Area', '2026-06-05'),
(1, 'Tree Planting Initiative', 'Join our team to plant 50 new native saplings along the northern nature trail system.', 'North Ridge Trailhead', '2026-06-20'),
(1, 'Community Garden Prep', 'Prepare the community vegetable beds for the upcoming planting season by turning soil and adding compost.', 'Downtown Shared Garden', '2026-07-11'),
(1, 'Riverbank Restoration', 'Collect trash and plant groundcover vegetation along the riverbank to prevent structural soil erosion.', 'Anas River Basin', '2026-08-02'),
(1, 'Neighborhood Recycling Drive', 'Assist community residents with sorting and dropping off electronics and plastics at our collection hub.', 'East District Sorting Facility', '2026-08-22'),

-- PROJECTS FOR ORGANIZATION ID: 2
(2, 'Youth Reading Mentorship', 'Spend a Saturday morning reading books and playing educational literacy games with elementary students.', 'City Public Library', '2026-06-13'),
(2, 'School Supply Packing', 'Help sort, pack, and organize backpacks full of essential learning materials for underprivileged children.', 'Hope Youth Center Warehouse', '2026-07-04'),
(2, 'Math Tutoring Workshop', 'Provide specialized, friendly homework help and algebraic skill review for junior high school students.', 'Westside After-School Club', '2026-07-25'),
(2, 'Coding Basics for Kids', 'Act as a lab assistant helping kids learn basic block-based programming logic during our weekend camp.', 'Community Tech Hub', '2026-08-08'),
(2, 'Storytelling Animation Hour', 'Help children convert their creative short stories into basic digital illustrations and audio recordings.', 'City Public Library', '2026-08-30'),

-- PROJECTS FOR ORGANIZATION ID: 3
(3, 'Senior Center Games Night', 'Host a lively evening of board games, trivia, and engaging conversation with our local senior residents.', 'Autumn Leaf Retirement Home', '2026-06-18'),
(3, 'Hot Meals Distribution', 'Help prepare, plate, and serve warm, nutritious meals to local families in need at the community kitchen.', 'Grace Food Pantry', '2026-07-09'),
(3, 'Digital Literacy for Seniors', 'Patiently guide senior citizens through learning how to use video calls, emails, and smartphone security features.', 'Autumn Leaf Retirement Home', '2026-07-30'),
(3, 'Food Pantry Sorting', 'Unpack delivery trucks, inspect expiration dates, and systematically organize shelves at the food bank.', 'Grace Food Pantry', '2026-08-15'),
(3, 'Senior Facility Painting', 'Give the interior community dining hall a fresh, bright coat of paint to liven up the living space.', 'Autumn Leaf Retirement Home', '2026-09-05');

SELECT * FROM service_project;


-- =========================================================================
-- 3. PROJECT CATEGORY TABLE (Many-to-Many Step 1)
-- =========================================================================
CREATE TABLE IF NOT EXISTS project_category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO project_category (name) 
VALUES
('Community Clean-up & Environment'),
('Education & Tutoring'),
('Food Security & Healthcare')
ON CONFLICT (name) DO NOTHING;

SELECT * FROM project_category;


-- =========================================================================
-- 4. JUNCTION MAPPING TABLE (Many-to-Many Step 2)
-- =========================================================================
CREATE TABLE IF NOT EXISTS project_category_mapping (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) 
        REFERENCES service_project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) 
        REFERENCES project_category(category_id) ON DELETE CASCADE
);

INSERT INTO project_category_mapping (project_id, category_id) VALUES
(1, 1), 
(2, 1),
(3, 2), 
(4, 2),
(5, 3), 
(6, 3),
(7, 1),
(8, 2),
(9, 3),
(10, 1),
(11, 2),
(12, 3),
(13, 1),
(14, 2),
(15, 3)
ON CONFLICT DO NOTHING;

-- Bonus: Associate a few projects with a second category
INSERT INTO project_category_mapping (project_id, category_id) 
VALUES
(1, 2), 
(7, 3)  
ON CONFLICT DO NOTHING;

SELECT * FROM project_category_mapping;


CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES
	('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role_id INTEGER REFERENCES roles(role_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 1. View all users and roles to locate your new IDs
SELECT * FROM users;
SELECT * FROM roles;

-- 2. Update the dedicated admin testing account to have the admin role
UPDATE users 
SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin') 
WHERE email = 'admin@example.com';

-- 3. Verify the change by listing all users joined with their assigned role name
SELECT users.user_id, users.email, roles.role_name 
FROM users 
JOIN roles ON users.role_id = roles.role_id;

-- Junction Table for Many-to-Many relationship between Users and Projects 
-- which will enable users to volunteer for many projects and projects can have multiple volunteers
CREATE TABLE IF NOT EXISTS project_volunteers (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES service_project(project_id) ON DELETE CASCADE,
    volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id)
);