const { baseFetch } = require("./AppService");

export const fetchBooks = async () => {
  return baseFetch(`/home`, {
    method: "GET",
  });
};

export const fetchBook = (slug, user) => {
  return baseFetch(`/home/${user}/${slug}`, {
    method: "GET",
  });
};

export const fetchPapers = () => {
  return baseFetch(`/home/papers`, {
    method: "GET",
  })
}

export const fetchSection= (section) => {
  return baseFetch(`/home/sections/${section}`, {
    method: "GET",
  })
}