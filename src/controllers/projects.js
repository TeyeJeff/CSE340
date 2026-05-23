import { getAllServiceProjects } from "../models/projects.js";


// Defining projects controller function
const showProjectsPage = async (req, res) => {
    const projects = await getAllServiceProjects();
    console.log(projects);

    const title = 'Service Projects';
    res.render("projects", { title, projects });
};

// Exporting projects controller function to be used in routes.js
export { showProjectsPage };