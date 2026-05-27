import { getAllCategories } from "../models/categories.js";
import { getCategoryDetails } from "../models/categories.js";
import { getProjectsByCategoryId } from "../models/projects.js";

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

// exporting categories controller function to routes.js
export { showCategoriesPage, showCategoryDetailsPage};