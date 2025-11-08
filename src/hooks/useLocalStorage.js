import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {

    //Load existing value or fallback
    const [value, setValue] = useState( ()=> {
        try{
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        }
        catch (err){
            console.error("Failed to read localStorage: ", err);
            return initialValue;
        }
    });

    //Save on every change
    useEffect( ()=> {
        try{
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (err){
            console.error("Failed to write localStorage: ", err);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;