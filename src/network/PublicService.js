import { PUBLIC_URL, getToken, userLanguage } from "./Constant";

export const sendGETRequestWithToken = async (endpoint) => {
    try {
      const response = await fetch(PUBLIC_URL + endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `${getToken()}`,
          'Content-Type': 'application/json',
          'Accept-Language': userLanguage
        }
      });
  
      if (!response.ok) {
        throw new Error('Fetch Error');
      }
  
      return await response.json();
    } catch (error) {
      console.error("URL : " + endpoint + " Error : ", error);
      throw error;
    }
};