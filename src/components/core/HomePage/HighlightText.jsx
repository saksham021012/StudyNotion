import React from "react";

function HighlightText({ text }) {
    return (
        <span 
            className="font-bold text-richblue-200" 
            dangerouslySetInnerHTML={{ __html: text }} 
        />
    );
}

export default HighlightText;
