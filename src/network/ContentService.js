import { BASE_URL, getToken, PUBLIC_URL, userLanguage } from "./Constant";

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
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Save failed" };
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const editNewContentData = async (content) => {
  try {
    const response = await fetch(`${BASE_URL}/content/edit`, {
      method: "POST",
      headers: {
        Authorization: `${getToken()}`,
        "Content-Type": "application/json",
        "Accept-Language": userLanguage,
      },
      body: JSON.stringify(content),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Edit failed" };
    }
    return data;
  } catch (error) {
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

export const getSubGenres = async (id) => {
  try {
    const response = await fetch(`${PUBLIC_URL}/v1/public/genres-subs/${id}`, {
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

export const updateContentStatus = async (req) => {
  try {
    const response = await fetch(`${BASE_URL}/content/publish`, {
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

export const getUserContentsByType = async (contentType) => {
  try {
    const response = await fetch(
      `${BASE_URL}/content/find?type=${contentType}`,
      {
        method: "GET",
        headers: {
          Authorization: `${getToken()}`,
          "Content-Type": "application/json",
          "Accept-Language": userLanguage,
        },
      }
    );
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

export const deleteContent = async (req) => {
  try {
    const response = await fetch(`${BASE_URL}/content`, {
      method: "DELETE",
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

export const deleteNote = async (req) => {
  try {
    const response = await fetch(`${BASE_URL}/content/note`, {
      method: "DELETE",
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
