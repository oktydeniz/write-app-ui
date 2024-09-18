import { BASE_URL, PUBLIC_URL, getToken, userLanguage } from "network/Constant";

export const fetchBookToRead = async (slug, creator) => {
  return baseFetch(`/read/${creator}/${slug}`, {
    method: "GET",
  });
};

export const editCopyrightData = (req) => {
  return baseFetch("/content/copyrights", {
    method: "POST",
    body: JSON.stringify(req),
  });
};

export const savePaperData = (req) => {
  return baseFetch("/papers", {
    method: "POST",
    body: JSON.stringify(req),
  });
};

export const fetchUserInfoRemote = () => {
  return baseFetch("/users/get-me", {
    method: "GET",
  });
}
export const updatePaperData = (req) => {
  return baseFetch("/papers", {
    method: "PUT",
    body: JSON.stringify(req),
  });
};

export const deletePaper = (id) => {
  return baseFetch(`/papers/${id}`, {
    method: "DELETE",
  });
};

export const getPageBySlug = (slug) => {
  return baseFetch(`/papers/${slug}`, { method: "GET" });
};

export const getPageByUser = (slug, user) => {
  return baseFetch(`/papers/find/${user}/${slug}`, { method: "GET" });
};

export const baseFetch = async (endpoint, options) => {
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

export const handleUploadNativeFile = async (
  file,
  saveContentCallback,
  setErrorCallback
) => {
  if (!file) {
    if (setErrorCallback && typeof setErrorCallback === "function") {
      setErrorCallback("You need to add a Cover Image");
    }
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(PUBLIC_URL + "/v1/files/upload-native", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    const filePath = data.filePath;

    await fetch(PUBLIC_URL + "/v1/files/saveFilePath", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (saveContentCallback && typeof saveContentCallback === "function") {
      saveContentCallback(filePath);
    }
  } catch (error) {
    console.error("Error:", error);
    if (setErrorCallback && typeof setErrorCallback === "function") {
      setErrorCallback("An error occurred during the upload");
    }
  }
};
