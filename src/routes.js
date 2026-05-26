import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectDetailsPage } from './controllers/projects.js';

const router = express.Router();

// Core application routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);

// Dynamic route for a single service project details page
router.get('/project/:id', showProjectDetailsPage);

// Categories route
router.get('/categories', showCategoriesPage);

// Error-handling test route
router.get('/test-error', testErrorPage);

export default router;