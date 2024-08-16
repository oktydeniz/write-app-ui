const BASE_URL = "http://localhost:8080/api"


export const login = async (identifier, password) => {
    const url = '/auth/login';
    const requestBody = {
      identifier: identifier,
      password: password
    };
  
    try {
      const response = await fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  };