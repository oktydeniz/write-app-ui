const { baseFetch } = require("./AppService");
const { BASE_URL } = require("./Constant");

export const saveCommentSections = (req) => {
  return baseFetch(`/comment/section`, {
    method: "POST",
    body: JSON.stringify(req),
  });
};


export const getSectionComment = (id) => {
    return baseFetch(`/comment/section/${id}`, {
      method: "GET",
    });
};

export const updateSectionComment = (req) => {
  return baseFetch(`/comment/section`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}


export const deleteCommentSection = (id) => {
  return baseFetch(`/comment/section/${id}`, {
    method: "DELETE",
  })
}

export const fetchBookComments = (id) => {
  return baseFetch(`/comment/book/${id}`, {
    method: "GET",
  })
}


export const updateBookComment = (req) => {
  return baseFetch(`/comment/book`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

export const saveBookSections = (req) => {
  return baseFetch(`/comment/book`, {
    method: "POST",
    body: JSON.stringify(req),
  });
};


export const deleteBookSection = (id) => {
  return baseFetch(`/comment/book/${id}`, {
    method: "DELETE",
  })
}

export const updateSectionProgress = (req) => {
  return baseFetch(`/content/progress-section`, {
    method: "POST",
    body: JSON.stringify(req),
  });
}