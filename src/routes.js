import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';
import { showEditOrganizationForm } from './controllers/organizations.js';
import { processEditOrganizationForm } from './controllers/organizations.js';
import { processNewProjectForm, showNewProjectForm, projectValidation } from './controllers/projects.js';
import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import { showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showCreateCategoryForm, processCreateCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidationRules } from './controllers/categories.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, showDashboard, requireLogin, requireRole } from './controllers/users.js';

const router = express.Router();

// Core application routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);

// Dynamic route for a single service project details page
router.get('/project/:id', showProjectDetailsPage);
// Dynamic route for a single category detail page
router.get('/category/:id', showCategoryDetailsPage);
// Dynamic route for a single organization detail page
router.get('/organization/:id', showOrganizationDetailsPage);

// Categories route
router.get('/categories', showCategoriesPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Route to display the filled project-form
router.get('/edit-project/:id', showEditProjectForm);
// Route to process the submission data prjoect form
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Create Category Routes
router.get('/new-category', showCreateCategoryForm);
router.post('/new-category', categoryValidationRules, processCreateCategoryForm);

// Edit Category Routes
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, processEditCategoryForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected Dashboard Route
router.get('/dashboard', requireLogin, showDashboard);

// --- ORGANIZATION ADMIN ROUTES ---
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// --- PROJECT ADMIN ROUTES ---
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// --- CATEGORY ADMIN ROUTES ---
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidationRules, processCreateCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidationRules, processEditCategoryForm);
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// Error-handling test route
router.get('/test-error', testErrorPage);

export default router;