import { BASE_URL, getToken, userLanguage, getUserId } from "./Constant";
const { baseFetch } = require("./AppService");

export const fetchUserInfo = (user) => {
  return baseFetch(`/users/${user}`, { 
    method: 'GET',
  })
}
export const updateUserInfo = (req) => {
  return baseFetch(`/users/update`, { 
    method: 'POST',
    body: JSON.stringify(req)
  })
}


export const deleteUserInfo = () => {
  return baseFetch(`/users/delete`, { 
    method: 'DELETE',
  })
}

export const getUsers = async (q) => {
  try {
    const response = await fetch(`${BASE_URL}/users/search/${q}`, {
      method: "GET",
      headers: {
        Authorization: `${getToken()}`,
        "Content-Type": "application/json",
        "Accept-Language": userLanguage,
      },
    });

    if (!response.ok) {
      throw new Error("Save failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

export const getUsersByMessageStatus = async (q) => {
  try {
    const response = await fetch(`${BASE_URL}/users/find/search/${q}`, {
      method: "GET",
      headers: {
        Authorization: `${getToken()}`,
        "Content-Type": "application/json",
        "Accept-Language": userLanguage,
      },
    });

    if (!response.ok) {
      throw new Error("Save failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

export const handleInvite = async (request) => {
  try {
    const response = await fetch(`${BASE_URL}/content/invite-user`, {
      method: "POST",
      headers: {
        Authorization: `${getToken()}`,
        "Content-Type": "application/json",
        "Accept-Language": userLanguage,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Save failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};
