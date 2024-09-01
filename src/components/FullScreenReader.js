import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { fetchBookToRead } from "network/AppService";


const FullScreenReader = ({ open, content,creator, handleClose }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchBookToRead(content, creator);
        if (result.success) {
          console.log(result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleClose}
        aria-label="close"
        sx={{ position: "absolute", top: "15px", right: "15px", zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <div>{content}</div>
    </Dialog>
  );
};

export default FullScreenReader;
