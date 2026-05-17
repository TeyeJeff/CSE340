import db from "./db.js";

// FIX: Fixed the spelling of "getAllServiceProjects"
const getAllServiceProjects = async () => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.title,
                p.description,
                p.location,
                p.date,
                o.name AS organization_name
            FROM service_project p
            JOIN organization o ON p.organization_id = o.organization_id
            ORDER BY p.date DESC;
        `;

        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        // Adding a try/catch block ensures that if your SQL query has a typo, 
        // it logs the error clearly in your terminal instead of crashing your server.
        console.error("Error executing getAllServiceProjects:", error.message);
        throw error;
    }
}

export { getAllServiceProjects };