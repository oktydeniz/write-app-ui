export const BASE_URL = "http://localhost:8080/api"

export const PUBLIC_URL = "http://localhost:8080"
export const getToken = () => {
    return localStorage.getItem("accessToken");
} 

export const userLanguage = navigator.language || navigator.userLanguage;
