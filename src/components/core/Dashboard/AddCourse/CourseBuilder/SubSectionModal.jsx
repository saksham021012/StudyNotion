import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1, RxCross2 } from "react-icons/rx"
import Upload from "../Upload"
import IconBtn from "../../../../common/IconBtn"

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false
}) => {


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        getValues,
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, []);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if (currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl) {
            return true
        }
        else {
            return false
        }
    }

    const handleEditSubSection = async (data) => {

        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if (currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle)
        }

        if (currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc); // FIXED: Use the correct property name
        }

        if (currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currentValues.lectureVideo)
        }

        setLoading(true);

        //api call

        const result = await updateSubSection(formData, token);
        if (result) {
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section)
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            dispatch(setCourse(updatedCourse));

        }
        setModalData(null);
        setLoading(false);

    }

    // Fix for the onSubmit function in SubSectionModal.jsx
    const onSubmit = async (data) => {
        if (view) {
            return;
        }

        if (edit) {
            if (!isFormUpdated()) {
                toast.error("No changes made to the form");
            } else {
                handleEditSubSection(data);
            }
            return;
        }

        // For ADD subsection
        const formData = new FormData();
        formData.append("sectionId", modalData); // This is the section ID
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc); // Use lectureDesc from the form
        formData.append("video", data.lectureVideo);
        setLoading(true);

        try {
            // API call
            const result = await createSubSection(formData, token);

            if (result) {
                console.log("Subsection created successfully:", result);

                // Create a complete new copy of the course
                const updatedCourse = JSON.parse(JSON.stringify(course));

                // Find the index of the section that was updated
                const sectionIndex = updatedCourse.courseContent.findIndex(
                    section => section._id === modalData
                );

                if (sectionIndex !== -1) {
                    // Replace the entire section with the result from the API
                    updatedCourse.courseContent[sectionIndex] = result;

                    // Update the Redux store with the new course object
                    dispatch(setCourse(updatedCourse));
                } else {
                    toast.error("Could not find the section to update");
                }
            }
        } catch (error) {
            console.error("Error adding subsection:", error);
            toast.error("Failed to add lecture");
        } finally {
            setModalData(null);
            setLoading(false);
        }
    }

   return (
       <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
         <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
           {/* Modal Header */}
           <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
             <p className="text-xl font-semibold text-richblack-5">
               {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
             </p>
             <button onClick={() => (!loading ? setModalData(null) : {})}>
               <RxCross2 className="text-2xl text-richblack-5" />
             </button>
           </div>
           {/* Modal Form */}
           <form
             onSubmit={handleSubmit(onSubmit)}
             className="space-y-8 px-8 py-10"
           >
             {/* Lecture Video Upload */}
             <Upload
               name="lectureVideo"
               label="Lecture Video"
               register={register}
               setValue={setValue}
               errors={errors}
               video={true}
               viewData={view ? modalData.videoUrl : null}
               editData={edit ? modalData.videoUrl : null}
             />
             {/* Lecture Title */}
             <div className="flex flex-col space-y-2">
               <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                 Lecture Title {!view && <sup className="text-pink-200">*</sup>}
               </label>
               <input
                 disabled={view || loading}
                 id="lectureTitle"
                 placeholder="Enter Lecture Title"
                 {...register("lectureTitle", { required: true })}
                 className="form-style w-full"
               />
               {errors.lectureTitle && (
                 <span className="ml-2 text-xs tracking-wide text-pink-200">
                   Lecture title is required
                 </span>
               )}
             </div>
             {/* Lecture Description */}
             <div className="flex flex-col space-y-2">
               <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
                 Lecture Description{" "}
                 {!view && <sup className="text-pink-200">*</sup>}
               </label>
               <textarea
                 disabled={view || loading}
                 id="lectureDesc"
                 placeholder="Enter Lecture Description"
                 {...register("lectureDesc", { required: true })}
                 className="form-style resize-x-none min-h-[130px] w-full"
               />
               {errors.lectureDesc && (
                 <span className="ml-2 text-xs tracking-wide text-pink-200">
                   Lecture Description is required
                 </span>
               )}
             </div>
             {!view && (
               <div className="flex justify-end">
                 <IconBtn
                   disabled={loading}
                   text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
                 />
               </div>
             )}
           </form>
         </div>
       </div>
     )
}

export default SubSectionModal