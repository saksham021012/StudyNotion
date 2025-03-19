const Category = require("../models/Category")

//create category handler function

exports.createCategory = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body

        //validation
        if (!name || !description) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "All fields are required"
                })
        }
        //create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description
        });
        console.log(categoryDetails)
        //return res
        return res
            .status(200)
            .json({
                success: true,
                message: "Category created successfully"
            })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.message
            })
    }
}

// get all categories

exports.showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, { name: true, description: true })
        return res
            .status(200)
            .json({
                success: true,
                message: "All categpries returned successfully",
                allCategory
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: error.message
            })
    }
}

// categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
    try {
        // get categoryId
        const { categoryId } = req.body;
        // get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
            .populate("courses")
            .exec();

        // validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data Not Found",
            });
        }

        // get courses for different categories
        const differentCategories = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate("courses")
            .exec();

        // get top selling courses
        /*const topSellingCourses = await Course.find()
            .sort({ salesCount: -1 }) // Sorting in descending order
            .limit(5) // Get top 5 courses
            .exec();
            */

        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories
            }
        });

    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({
            success: false,
            message: "An error occurred while fetching category details",
            error: error.message
        });
    }
};
