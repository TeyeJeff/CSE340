// Defining homepage controller function 

const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

// exporting hompepage controller function to be used in routes.js 
export { showHomePage };