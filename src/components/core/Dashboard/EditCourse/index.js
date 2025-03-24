import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderSteps from "../AddCourse/RenderSteps"
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setEditCourse, setCourse } from "../../../../slices/courseSlice";

export default function EditCourse() {

    const dispatch = useDispatch();
    const { courseId } = useParams();
    const { course } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!courseId) {
            console.error("Course ID is missing!");
            return;
        }

        const populateCourseDetails = async () => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            if (result?.courseDetails) {
                dispatch(setCourse(result?.courseDetails));
                dispatch(setEditCourse(true));

            }
            setLoading(false);
        }
        populateCourseDetails();
    }, [courseId, token])

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div  >
            <h1>Edit Course</h1>
            <div>
                {
                    course ? (<RenderSteps />) : <p>Course Not Found</p>
                }
            </div>
        </div>
    )
}
