import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const FullScreenReader = ({ open, onClose, combinedPassages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageContainerRef = useRef(null);
  const pageHeight = window.innerHeight;

  useEffect(() => {
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTo(0, currentPage * pageHeight);
    }
  }, [currentPage, pageHeight]);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const pages = combinedPassages.split(/(?=<h2>)/g); // <h2> etiketine göre sayfaları ayır

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <IconButton
        edge="start"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        sx={{ position: "absolute", top: "15px", right: "15px", zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <div ref={pageContainerRef} style={{ height: "100vh", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflowY: "scroll" }}>
          {pages.map((page, index) => (
            <div
              key={index}
              className="page"
              style={{
                minHeight: "100vh",
                transform: `translateY(${currentPage * -100}%)`,
                transition: "transform 0.5s ease-in-out",
                padding: "20px",
                boxSizing: "border-box",
              }}
            >
              <div className="page-content" dangerouslySetInnerHTML={{ __html: page }} />
            </div>
          ))}
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Button onClick={handlePrev} disabled={currentPage === 0}>
            <ArrowBack /> Previous
          </Button>
          <Button onClick={handleNext} disabled={currentPage === pages.length - 1}>
            Next <ArrowForward />
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default FullScreenReader;
