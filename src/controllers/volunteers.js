import { addVolunteer, getProjectsByVolunteer, removeVolunteer } from "../models/volunteers.js";

// POST /projects/:id/volunteer
const handleVolunteerSignUp = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id; // Safe because requireLogin verified it

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'Thank you for volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'Could not process your volunteer sign-up.');
        res.redirect(`/project/${projectId}`);
    }
};

// POST /projects/:id/unvolunteer
const handleVolunteerCancel = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    // This handles cancellations from both the Details view and the Dashboard view
    const redirectTo = req.body.redirectSource === 'dashboard' ? '/dashboard' : `/projects/${projectId}`;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have removed yourself as a volunteer.');
        res.redirect(redirectTo);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Could not remove your volunteer registration.');
        res.redirect(redirectTo);
    }
};

export { handleVolunteerCancel, handleVolunteerSignUp}