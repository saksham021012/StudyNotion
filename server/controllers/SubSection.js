const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Sub-Section
exports.createSubSection = async (req, res) => {
    try {
        // Fetch data from req body
        const { sectionId, title, timeDuration, description } = req.body;

        // Extract file/video
        const video = req.files.video

        // Validate data
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // Create sub-section
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Update section with this sub-section object
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: subSectionDetails._id } },
            { new: true }
        ).populate("subSection");

        // Log updated section
        console.log("Updated Section: ", updatedSection);

        // Return response
        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully",
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update Sub-Section
exports.updateSubSection = async (req, res) => {
    try {
        // Extract sub-section ID and new details
        const { subSectionId, title, timeDuration, description } = req.body;

        let videoUrl;

        // Check if a new video is provided
        if (req.files?.video) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            videoUrl = uploadDetails.secure_url;  // Set videoUrl only if video is provided
        }

        const updateFields = { title, timeDuration, description };

        // If a new video was provided, add videoUrl to the updateFields
        if (videoUrl) {
            updateFields.videoUrl = videoUrl;
        }

        // Find and update the sub-section
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            updateFields,
            { new: true }
        );

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        // Return response
        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully",
            updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Delete Sub-Section
exports.deleteSubSection = async (req, res) => {
    try {
        // Extract sub-section ID and section ID
        const { subSectionId, sectionId } = req.body;

        // Remove sub-section from the Section's array
        await Section.findByIdAndUpdate(sectionId, {
            $pull: { subSection: subSectionId },
        });

        // Delete the sub-section
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        // Return response
        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
