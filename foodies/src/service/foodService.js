import axios from "axios";

const API_URL = 'http://localhost:8080/api/foods';

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.log('Error', error);
        throw error;
    }
};
// Fetch detailed information for a single food item by its ID
export const fetchFoodDetails = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/foods/${id}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error fetching food details from service:", error);
        throw error;
    }
};