import React, { useState, useEffect, useRef } from "react";
import "assets/style/home.scss";
import { useParams } from "react-router-dom";
import { fetchBook } from "network/LibraryService";
import { Box } from "@mui/material";

const BookDetail = () => {
  const { slug, user } = useParams();

  const [book, setBook] = useState(null);

  useEffect(() => {
    const getBook = async () => {
        const response = await fetchBook(slug, user);
        if(response.success){
            const book = response.book;
            setBook(book);
            console.log(book);
        }
    };
    getBook();
  }, []);

  return <Box></Box>;
};

export default BookDetail;
