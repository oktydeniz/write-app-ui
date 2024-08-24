import { BASE_URL, getToken, userLanguage } from "./Constant";


export const saveNewSectionData = async (slug) => {

    try {
        const response = await fetch(`${BASE_URL}/content/sections/${slug}`, {
          method: 'GET',
          headers: {
              'Authorization': `${getToken()}`,
              'Content-Type': 'application/json',
              'Accept-Language': userLanguage
          }
        });
        if (!response.ok) {
          throw new Error('Save failed');
        }
    
        const text = await response.text();
        const data = JSON.parse(text); 
        return data;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}