const { baseFetch } = require("./AppService");

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

export const saveNewSubject = (req) => {
  return baseFetch(`/comment/subjects`, {
    method: "POST",
    body: JSON.stringify(req),
  })
}

export const getSubjects = (id) => {
  return baseFetch(`/comment/subjects/${id}`, {
    method: "GET",
  })
}

export const replySubject = (req) => {
  return baseFetch(`/comment/reply-subjects`, {
    method: "POST",
    body:JSON.stringify(req),
  })
}


export const deleteSubject = (id) => {
  return baseFetch(`/comment/subjects/${id}`, {
    method: "DELETE",
  })
}

export const pinComment = (id) => {
  return baseFetch(`/comment/pin-subjects/${id}`, {
    method: "PATCH",
  })
}


export const likeSubject = (id) => {
  return baseFetch(`/comment/like-subjects`, {
    method: "PATCH",
    body: JSON.stringify(id)
  })
}

export const editSubject = (req) => {
  return baseFetch(`/comment/edit-subjects`, {
    method: "PATCH",
    body: JSON.stringify(req)
  })
}
