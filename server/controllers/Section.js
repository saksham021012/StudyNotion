const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;

        //data validation
        if (!sectionName || !courseId) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing properties"
                })
        }

        //create section
        const newSection = await Section.create({ sectionName })

        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSections",
                model: "SubSection"
            }
        });
        // use populate to replace sections/sub-sections both in the updatedCourseDetails -> done

        //return response
        return res
            .status(200)
            .json({
                success: true,
                message: "Section created successfully",
                updatedCourseDetails
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                sucess: false,
                message: "Unable to create section, please try again",
                error: error.message
            })

    }
}

exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);
		res.status(200).json({
			success: true,
			message: section,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
}

exports.deleteSection = async (req, res) => {
    try {
        // Get section ID from request params
        const { sectionId } = req.params;

        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Section ID is required",
            });
        }

        // Find and delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Remove section reference from Course
        await Course.findOneAndUpdate(
            { courseContent: sectionId },
            { $pull: { courseContent: sectionId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully and removed from course",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        });
    }
};
