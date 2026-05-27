import { getAllServiceProjects } from "../models/projects.js";
import { getProjectDetails } from "../models/projects.js";
import { getUpcomingProjects } from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";

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
// Exporting projects controller functions to be used in routes.js
export { 
    showProjectsPage, 
    showProjectDetailsPage 
};