import { BASE_URL, getToken, userLanguage } from "network/Constant";

export const fetchBookToRead = async(slug, creator) => {
    return baseFetch(`/read/${creator}/${slug}`, {
        method: 'GET',
    });
}

export const editCopyrightData = (req) => {
    return baseFetch("/content/copyrights", {
      method: "POST",
      body: JSON.stringify(req),
    });
};

const baseFetch = async (endpoint, options) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `${getToken()}`,
          "Content-Type": "application/json",
          "Accept-Language": userLanguage,
          ...options.headers,
        },
      });
  
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Request failed" };
      }
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };