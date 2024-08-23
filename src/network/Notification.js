import { BASE_URL, getToken, userLanguage } from "./Constant";

export const getInvitations = async () => {

    try {
        const response = await fetch(BASE_URL + '/notification/invitations', {
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
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }

}