import db from "./db.js";

// FIX: Fixed the spelling of "getAllServiceProjects"
const getAllServiceProjects = async () => {
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
}

export { getAllServiceProjects };