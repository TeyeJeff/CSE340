import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllServiceProjects } from './src/models/projects.js';

// 1. Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

// 2. Recreate __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Initialize the Express application
const app = express();

/**
 * Configure Express middleware
 */

// 4. Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


// 5. Define routes
/**
  * Routes
  */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);

    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    const projects = await getAllServiceProjects();
    console.log(projects);

    const title = 'Service Projects';
    res.render("projects", { title, projects });
});

app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });
});

// 6. Start the server and lock it open permanently
app.listen(PORT, () => {
    console.log(`🚀 Server is actively listening at http://127.0.0.1:${PORT}`);
    console.log(`💻 Environment: ${NODE_ENV}`);
    
    // Test connection in the background so it never interferes with thread survival
    testConnection().catch(err => console.error("Database connection check failed:", err.message));
});

