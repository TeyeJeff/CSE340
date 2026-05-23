import { getAllCategories } from "../models/categories.js";

// Defining categories controller function 
const showCategoriesPage =  async (req, res) => {
    const categories = await getAllCategories();
    console.log(categories);

    const title = 'Project Categories';
    res.render('categories', { title, categories });
};

// exporting categories controller function to routes.js
export { showCategoriesPage};