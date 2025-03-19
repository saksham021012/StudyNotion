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
        });
        return response;
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        throw error; // Ensure errors are caught in the calling function
    }
};
