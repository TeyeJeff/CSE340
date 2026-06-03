import { getAllCategories, createCategory, updateCategory } from "../models/categories.js";
import { getCategoryDetails } from "../models/categories.js";
import { getProjectsByCategoryId } from "../models/projects.js";
import { getProjectDetails } from "../models/projects.js";
import { getCategoriesByProjectId, updateCategoryAssignments } from "../models/categories.js";
import { body, validationResult } from 'express-validator';

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

// GET /new-category
const showCreateCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Create New Category', errors: null, categoryName: '' });
};

// POST /new-category
const processCreateCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    const categoryName = req.body.name || '';

    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'Create New Category',
            errors: errors.array(),
            categoryName
        });
    }

    try {
        await createCategory(categoryName);
        if (req.flash) req.flash('success', 'Category created successfully.');
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

// GET /edit-category/:id
const showEditCategoryForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await getCategoryDetails(id);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('edit-category', {
            title: `Edit Category: ${category.name}`,
            errors: null,
            category
        });
    } catch (error) {
        next(error);
    }
};

// POST /edit-category/:id
const processEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    const id = req.params.id;
    const categoryName = req.body.name || '';

    if (!errors.isEmpty()) {
        return res.render('edit-category', {
            title: `Edit Category`,
            errors: errors.array(),
            category: { category_id: id, name: categoryName }
        });
    }

    try {
        await updateCategory(id, categoryName);
        if (req.flash) req.flash('success', 'Category updated successfully.');
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

// Server-Side Validation Array
const categoryValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters.')
];

// exporting categories controller function to routes.js
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm,
     processAssignCategoriesForm, showCreateCategoryForm, processCreateCategoryForm,  
    showEditCategoryForm, processEditCategoryForm, categoryValidationRules };