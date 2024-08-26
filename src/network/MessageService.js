import { BASE_URL, getToken, userLanguage } from "./Constant";

export const getUserConversation = async () => {
  try {
    const response = await fetch(`${BASE_URL}/conversation`, {
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

export const createNewConversation = async (req) => {
  try {
    const response = await fetch(`${BASE_URL}/conversation`, {
      method: "POST",
      headers: {
        Authorization: `${getToken()}`,
        "Content-Type": "application/json",
        "Accept-Language": userLanguage,
      },
      body: JSON.stringify(req),
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

export const findConversations = async (id) => {

    try {
        const response = await fetch(`${BASE_URL}/conversation/${id}`, {
          method: "GET",
          headers: {
            Authorization: `${getToken()}`,
            "Content-Type": "application/json",
            "Accept-Language": userLanguage,
          }
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
}

export const getMessageByConversation = async (req) => {
    try {
        const response = await fetch(`${BASE_URL}/conversation/send`, {
          method: "POST",
          headers: {
            Authorization: `${getToken()}`,
            "Content-Type": "application/json",
            "Accept-Language": userLanguage,
          }, body:JSON.stringify(req),
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
}