import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';

const SubSectionModal = ({
    modalData, 
    setModalData,
    add = false,
    view = false,
    edit = false
}) => {


    const{
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        getValues,
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const {course} = useSelector((state)=> state.course);
    const {token} = useSelector((state)=> state.auth);

    useEffect(() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, []);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl) {
                return true
            }
        else{
            return false
        }
    }

    const handleEditSubSection = async (data) => {

        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle)
        }

        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc)
        }

        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("video", currentValues.lectureVideo)
        }

        setLoading(true);

        //api call

        const result = await updateSubSection(formData, token);
        if(result){
            //todo: check extra
            dispatch(setCourse(result));

        }
        setModalData(null);
        setLoading(false);

    }

    const onSubmit = async (data) => {
        if(view){
            return;
        }
        if(edit){
            if(!isFormUpdated){
                toast.error("No changes made to the form")
            }
            else{
                //edit in store
                handleEditSubSection();
            }
            return
        }
        //for ADD

        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.description);
        formData.append("video", data.lectureVideo);
        setLoading(true);

        //api call
        const result = await createSubSection(formData, token);

        if(result){
            //todo: chec for updation
            dispatch(setCourse(result));
        }
        setModalData(null);
        setLoading(false);
    }

  return (
    <div>SubSectionModal</div>
  )
}

export default SubSectionModal