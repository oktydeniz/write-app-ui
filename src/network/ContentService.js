import { BASE_URL, getToken, userLanguage } from "./Constant";

export const saveNewContentData = async (endoint, content) => {
  try {
    const response = await fetch(BASE_URL + endoint, {
      method: "POST",
      headers: {
        Authorization: `${getToken()}`,
        "Content-Type": "application/json",
        "Accept-Language": userLanguage,
      },
      body: JSON.stringify(content),
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

export const getMyContents = async () => {
  try {
    const response = await fetch(BASE_URL + "/content/contents", {
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
export const getContentBySlug = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/content/${slug}`, {
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

export const getNotes = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/content/notes/${slug}`, {
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

export const getAuthors = async (req) => {
  try {
    const response = await fetch(`${BASE_URL}/content/authors/${req}`, {
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

export const saveRequest = async (endoint, data) => {
  return saveNewContentData(endoint, data);
};
