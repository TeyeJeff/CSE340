import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';

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

// Error-handling test route
router.get('/test-error', testErrorPage);

export default router;