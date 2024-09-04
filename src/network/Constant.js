import { languages } from "utils/data";

export const BASE_URL = "http://localhost:8080/api"

export const PUBLIC_URL = "http://localhost:8080"
export const getToken = () => {
    return localStorage.getItem("accessToken");
} 

export const getUserId = () => {
    return localStorage.getItem("userId");
} 

export const getUserCurrentId = () => {
    return Number(localStorage.getItem("userId"));
} 
export const userLanguage = navigator.language || navigator.userLanguage;

export const getUserLanguage = () => {
   return languages.find((l) => userLanguage === l.tag);
}