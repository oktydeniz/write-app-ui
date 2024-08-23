import { BASE_URL, getToken, userLanguage, getUserId } from "./Constant";

export const getUsers = async (q) => {

    try {
      const response = await fetch(`${BASE_URL}/users/search/${q}`, {
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


export const handleInvite = async (request) => {

  try {
    const response = await fetch(`${BASE_URL}/content/invite-user`, {
      method: 'POST',
      headers: {
          'Authorization': `${getToken()}`,
          'Content-Type': 'application/json',
          'Accept-Language': userLanguage
      },
      body: JSON.stringify(request)
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