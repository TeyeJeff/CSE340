import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT 
            category_id, 
            name 
        FROM project_category
        ORDER BY name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves a single category by its ID

 */
const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.project_category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieves all categories assigned to a specific service project
 */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.project_category c
        JOIN public.project_category_mapping b ON c.category_id = b.category_id
        WHERE b.project_id = $1
        ORDER BY c.name ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO public.project_category_mapping (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Target the bridge mapping table instead of the category definition table
    const deleteQuery = `
        DELETE FROM public.project_category_mapping
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments };