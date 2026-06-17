import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { authenticateUser, getAllUsersWithRoles } from '../models/users.js';
import { getProjectsByVolunteer } from '../models/volunteers.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
}; 

// middleware function to check if user is logged in 
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

// middleware function to show dashboard 
const showDashboard = async (req, res) => {
    const user = req.session.user; // cite: uploaded:users.js
    
    try {
        // Fetch projects this user specifically signed up for
        const volunteeredProjects = await getProjectsByVolunteer(user.user_id);

        res.render('dashboard', { 
            title: 'Dashboard', // cite: uploaded:users.js
            name: user.name, // cite: uploaded:users.js
            email: user.email, // cite: uploaded:users.js
            user: user, 
            volunteeredProjects: volunteeredProjects // Passed directly to template
        });
    } catch (error) {
        console.error('Dashboard content retrieval error:', error);
        res.render('dashboard', { 
            title: 'Dashboard', // cite: uploaded:users.js
            name: user.name, // cite: uploaded:users.js
            email: user.email, // cite: uploaded:users.js
            user: user,
            volunteeredProjects: [] 
        });
    }
};

// Middleware factory to require a specific role for route access.
const requireRole = (role) => {
    return (req, res, next) => {
        // Check 1: Are you logged in?
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check 2: Do you have the specific clearance required?
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};

// Controller function to display the admin users page
const showAllUsers = async (req, res) => {
    try {
        const userList = await getAllUsersWithRoles();
        res.render('users-list', { 
            title: 'Manage Users', 
            users: userList 
        });
    } catch (error) {
        console.error('Error fetching users roster:', error);
        req.flash('error', 'Unable to load the user directory at this time.');
        res.redirect('/dashboard');
    }
};


export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showAllUsers };