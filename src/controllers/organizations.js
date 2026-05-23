import { getAllOrganizations } from "../models/organizations.js";

// Defining organization controller fuction

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);

    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

// Exporting organization controller function to be used in routes.ejs
export { showOrganizationsPage };