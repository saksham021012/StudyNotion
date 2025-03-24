import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { COURSE_STATUS } from '../../../../utils/constants';
import ConfirmationModal from "../../../common/ConfirmationModal"
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../slices/courseSlice';
import { useNavigate } from 'react-router-dom';

export default function CoursesTable({ courses, setCourses }) {

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const navigate = useNavigate();

    const handleCourseDelete = async (courseId) => {
        setLoading(true);
         
        await deleteCourse({courseId: courseId}, token);
        const result = await fetchInstructorCourses(token);

        if(result){
            setCourses(result);
        }
        setConfirmationModal(null);
        setLoading(false);
    }

    return (
        <div className='text-white'>
            <Table>
                <Thead>
                    <Tr className="flex gap-x-10 border-richblack-800 p-8">
                        <Th>
                            Courses
                        </Th>
                        <Th>
                            Duration
                        </Th>
                        <Th>
                            Price
                        </Th>
                        <Th>
                            Actions
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        courses.length === 0 ?
                            (
                                <Tr>
                                    <Td>
                                        No Courses found
                                    </Td>
                                </Tr>
                            )
                            : (
                                courses?.map((course) => (
                                    <Tr key={course._id} className="flex gap-x-10 border-richblack-800 p-8"  >
                                        <Td className="flex gap-x-4">
                                            <img
                                                src={course?.thumbnail}
                                                className='h-[150px] w-[220px] rounded-lg object-cover'
                                            />
                                            <div className='flex flex-col'>
                                                <p>{course.courseName}</p>
                                                <p>{course.courseDescription}</p>
                                                <p>Created: </p>
                                                {
                                                    course.status === COURSE_STATUS.DRAFT ? (
                                                        <p className='text-pink-50'>Drafted</p>
                                                    )
                                                        : (
                                                            <p className='text-yellow-50'>Published</p>
                                                        )
                                                }
                                            </div>
                                        </Td>
                                        <Td>
                                            2hr 30min
                                        </Td>
                                        <Td>
                                            ${course.price}
                                        </Td>
                                        <Td>
                                            <button
                                                disabled={loading}
                                                onClick={()=>{
                                                    navigate(`/dashboard/edit-course/${course._id}`)
                                                }}
                                                className='mr-[19px]'>
                                                EDIT
                                            </button>

                                            <button
                                                disabled={loading}
                                                onClick={() => {
                                                    setConfirmationModal({
                                                        text1: "Do you want to delete this course?",
                                                        text2: "All the data related to this course will be deleted",
                                                        btn1Text: "Delete",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => { },
                                                        btn2Handler: !loading ? () => setConfirmationModal(null) : () => { }
                                                    })
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </Td>
                                    </Tr>
                                ))
                            )
                    }
                </Tbody>
            </Table>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}

        </div>
    )
}


