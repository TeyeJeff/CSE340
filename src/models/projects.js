import db from "./db.js";

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


const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

/**
 * Retrieves a limited number of upcoming service projects
 * @param {number} number_of_projects - The maximum number of projects to return
 * @returns {Promise<Array>} An array of service project objects with organization names
 */
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    
    return result.rows;
};

/**
 * Retrieves a single service project by its ID
 * @param {number|string} id - The unique ID of the service project
 * @returns {Promise<Object|null>} The service project object, or null if not found
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    // Return the single project object if found, otherwise return null
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Export the model functions
export { getAllServiceProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails  };