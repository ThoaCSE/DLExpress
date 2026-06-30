import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

// ADDED 'export': Support named export to fix the main.jsx integration crash
export const StoreContextProvider = (props) => {
    const [foodList, setFoodList] = useState([]);

    const fetchFoodList = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/foods");

            console.log(response.data[0]);

            setFoodList(response.data);

            if (response.data) {
                setFoodList(response.data);
            }
        } catch (error) {
            console.error("Error fetching food list in context:", error);
        }
    };

    useEffect(() => {
        fetchFoodList();
    }, []);

    const contextValue = {
        foodList
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;