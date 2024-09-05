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
