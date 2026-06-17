import db from "./db.js";

/** Adds a user as a volunteer for a specific project */

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0];
};

/**
 * Removes a user from a project's volunteer roster
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING *;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0];
};

/**
 * Retrieves all projects a specific user has signed up to volunteer for
 */
const getProjectsByVolunteer = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date
        FROM service_project p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

/**
 * Checks if a specific user has already volunteered for a project
 */
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export {addVolunteer, removeVolunteer, getProjectsByVolunteer, isUserVolunteering }