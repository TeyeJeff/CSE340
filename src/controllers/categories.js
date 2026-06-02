import { getAllCategories } from "../models/categories.js";
import { getCategoryDetails } from "../models/categories.js";
import { getProjectsByCategoryId } from "../models/projects.js";
import { getProjectDetails } from "../models/projects.js";
import { getCategoriesByProjectId, updateCategoryAssignments } from "../models/categories.js";

// Defining categories controller function 
const showCategoriesPage =  async (req, res) => {
    const categories = await getAllCategories();
    console.log(categories);

    const title = 'Project Categories';
    res.render('categories', { title, categories });
};


/**
 * Handles the single category detail view and its related projects list
 */
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        
        const category = await getCategoryDetails(categoryId);
        
        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        // Fetch all projects mapped to this category
        const projects = await getProjectsByCategoryId(categoryId);
        
        res.render("category", {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// exporting categories controller function to routes.js
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm};