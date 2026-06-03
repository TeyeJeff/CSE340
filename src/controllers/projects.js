import { getAllServiceProjects } from "../models/projects.js";
import { getProjectDetails } from "../models/projects.js";
import { getUpcomingProjects } from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { createProject } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from 'express-validator';
import { updateProject } from "../models/projects.js";


const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];


// Global configuration for the maximum number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Handles the route to display a limited number of upcoming service projects
 */
const showProjectsPage = async (req, res, next) => {
    try {
        // Fetch only the next 5 upcoming projects from the model
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        console.log(projects);

        const title = 'Upcoming Service Projects';
        res.render("projects", { title, projects });
    } catch (error) {
        // Pass any unexpected errors to your global error middleware
        next(error);
    }
};

/**
 * Handles the route to display the details of a single specific service project
 */
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        
        // Run both queries safely
        const project = await getProjectDetails(projectId);
        
        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        // Fetch the categories associated with this specific project
        const categories = await getCategoriesByProjectId(projectId);
        
        res.render("project", { 
            title: project.title, 
            project,
            categories // Passed into the view as an array
        });
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
    
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

// 1. Display the Edit Form
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        
        // Fetch existing project data and the full list of organizations concurrently
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        // Format date string to YYYY-MM-DD for the HTML5 date picker input
        if (project.date) {
            project.formattedDate = new Date(project.date).toISOString().split('T')[0];
        }

        res.render('edit-project', {
            title: `Edit ${project.title}`,
            project,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// 2. Process the Form Submission
const processEditProjectForm = async (req, res, next) => {
    // 1. Extract any errors caught by the projectValidation middleware array
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        try {
            const projectId = req.params.id;
            // Re-fetch partner organizations array to re-populate the selection drop-menu dropdown
            const organizations = await getAllOrganizations();

            // Reconstruct a temporary project memory state so the user's typed input isn't lost
            const temporaryProjectState = {
                project_id: projectId,
                title: req.body.title,
                description: req.body.description,
                location: req.body.location,
                organization_id: parseInt(req.body.organizationId),
                // Re-bind the exact raw input date string back to the calendar date input element
                formattedDate: req.body.date 
            };

            // Re-render the correct updated template name, passing the array of error messages
            return res.render('edit-project', {
                title: `Edit ${req.body.title || 'Project'}`,
                project: temporaryProjectState,
                organizations: organizations,
                errors: errors.array() // Sends the array directly to the card list container
            });
        } catch (err) {
            return next(err);
        }
    }

    try {
        const projectId = req.params.id;
        const { title, description, date, location, organizationId } = req.body;

        // If validation errors are completely empty, commit changes securely to the database
        await updateProject(projectId, title, description, date, location, organizationId);

        if (req.flash) req.flash('success', 'Project updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};


// Exporting projects controller functions to be used in routes.js
export { 
    showProjectsPage, 
    showProjectDetailsPage,
    processNewProjectForm,
    showNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};