import axios from "axios";

export const axiosInstance = axios.create();

export const apiConnector = async (method, url, bodyData = null, headers = {}, params = null) => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data: bodyData,
            headers,
            params,
            withCredentials: true, 
        });
        return response;
    } catch (error) {
        console.error("API Error:", {
            message: error.message,
            url,
            method,
            status: error.response?.status,
            response: error.response?.data,
        });
        
        throw error; // Ensure errors are caught in the calling function
    }
};
