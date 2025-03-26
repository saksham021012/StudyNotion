import React from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogPageData = async (categoryId) => {
    console.log("Frontend - Sending categoryId:", categoryId)
    console.log("Frontend - CategoryId type:", typeof categoryId)
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
        console.log("Sending categoryId:", categoryId); // Add this line
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
            { categoryId: categoryId });

        console.log("Full API Response:", response);

        

        if (!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

        result = response?.data;

    } catch (error) {
        console.log("CATALOG PAGE DATA API ERROR...", error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;


}   
