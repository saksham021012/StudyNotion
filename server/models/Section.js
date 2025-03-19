const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String
    },
    subSection: [  // <-- Fixed field name
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "SubSection"  // <-- Ensure the reference matches the model name
        }
    ]
});

module.exports = mongoose.model("Section", sectionSchema);
