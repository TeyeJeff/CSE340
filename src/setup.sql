-- ORGANIZATION TABLE ---

CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL UNIQUE,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects', 'info@brightfuturebuilders.org
', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers','A volunteer coordination group supporting local charities and service initiatives', 'hello@unityserve.org', 'unityserve-logo.png')

SELECT * FROM organization;


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
-- =========================================================================
-- PROJECTS FOR ORGANIZATION ID: 1
-- =========================================================================
(1, 'Community Park Cleanup', 'Help us rake leaves, clear brush, and repaint benches to restore our local community space.', 'Central Park Recreation Area', '2026-06-05'),
(1, 'Tree Planting Initiative', 'Join our team to plant 50 new native saplings along the northern nature trail system.', 'North Ridge Trailhead', '2026-06-20'),
(1, 'Community Garden Prep', 'Prepare the community vegetable beds for the upcoming planting season by turning soil and adding compost.', 'Downtown Shared Garden', '2026-07-11'),
(1, 'Riverbank Restoration', 'Collect trash and plant groundcover vegetation along the riverbank to prevent structural soil erosion.', 'Anas River Basin', '2026-08-02'),
(1, 'Neighborhood Recycling Drive', 'Assist community residents with sorting and dropping off electronics and plastics at our collection hub.', 'East District Sorting Facility', '2026-08-22'),

-- =========================================================================
-- PROJECTS FOR ORGANIZATION ID: 2
-- =========================================================================
(2, 'Youth Reading Mentorship', 'Spend a Saturday morning reading books and playing educational literacy games with elementary students.', 'City Public Library', '2026-06-13'),
(2, 'School Supply Packing', 'Help sort, pack, and organize backpacks full of essential learning materials for underprivileged children.', 'Hope Youth Center Warehouse', '2026-07-04'),
(2, 'Math Tutoring Workshop', 'Provide specialized, friendly homework help and algebraic skill review for junior high school students.', 'Westside After-School Club', '2026-07-25'),
(2, 'Coding Basics for Kids', 'Act as a lab assistant helping kids learn basic block-based programming logic during our weekend camp.', 'Community Tech Hub', '2026-08-08'),
(2, 'Storytelling Animation Hour', 'Help children convert their creative short stories into basic digital illustrations and audio recordings.', 'City Public Library', '2026-08-30'),

-- =========================================================================
-- PROJECTS FOR ORGANIZATION ID: 3
-- =========================================================================
(3, 'Senior Center Games Night', 'Host a lively evening of board games, trivia, and engaging conversation with our local senior residents.', 'Autumn Leaf Retirement Home', '2026-06-18'),
(3, 'Hot Meals Distribution', 'Help prepare, plate, and serve warm, nutritious meals to local families in need at the community kitchen.', 'Grace Food Pantry', '2026-07-09'),
(3, 'Digital Literacy for Seniors', 'Patiently guide senior citizens through learning how to use video calls, emails, and smartphone security features.', 'Autumn Leaf Retirement Home', '2026-07-30'),
(3, 'Food Pantry Sorting', 'Unpack delivery trucks, inspect expiration dates, and systematically organize shelves at the food bank.', 'Grace Food Pantry', '2026-08-15'),
(3, 'Senior Facility Painting', 'Give the interior community dining hall a fresh, bright coat of paint to liven up the living space.', 'Autumn Leaf Retirement Home', '2026-09-05');

SELECT * FROM service_project;