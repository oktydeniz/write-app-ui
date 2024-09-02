import React, { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/MenuBook";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { styled, keyframes } from "@mui/material/styles";
import BlogIcon from "@mui/icons-material/Article";
import PulpIcon from "@mui/icons-material/LibraryBooks";
import { useNavigate } from "react-router-dom";
import CreateBook from "home/CreateBook";
import CreatePaper from "home/CreatePaper";

const riseUp = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0); 
    opacity: 1;
  }
`;

const FabContainer = styled("div")({
  position: "fixed",
  bottom: 16,
  right: 16,
  display: "flex",
  flexDirection: "column-reverse",
  alignItems: "center",
});
const StyledFab = styled(Fab)(({ theme, delay }) => ({
  margin: "8px 0",
  opacity: 0,
  transform: "translateY(20px)", 
  animation: `${riseUp} 0.2s ease forwards`,
  animationDelay: `${delay}s`,
}));

const FloatingButton = ({handleAction}) => {

  const [isOpen, setIsOpen] = useState(null);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const closePopups =() => {
    setOpenBook(null);
    setOpenPaper(null);
    if(handleAction){
        handleAction();
    }
  }

  /* Create book */
  const [openBook, setOpenBook] = useState(false);
  const startCreateBookFlow = () => {
    setOpenBook(true);
  }
  /* Create Paper (Blog..) */
  const [openPaper, setOpenPaper] = useState(false);

  const startCreatePaperFlow = () => {
    setOpenPaper(true);
  }

  
  return (
    <FabContainer>
      <Fab onClick={handleClickOpen} size="small" color="primary" aria-label="add">
        <AddIcon />
      </Fab>

      {isOpen && (
        <>
          <Tooltip title="Book" placement="left" TransitionComponent={Zoom}>
            <StyledFab
              size="small"
              color="secondary"
              aria-label="book"
              onClick={startCreateBookFlow}
              delay={0.1}
            >
              <BookIcon />
            </StyledFab>
          </Tooltip>
          <Tooltip title="Paper" placement="left" TransitionComponent={Zoom}>
            <StyledFab
              size="small"
              color="secondary"
              aria-label="blog"
              onClick={startCreatePaperFlow}
              delay={0.2}
            >
              <BlogIcon />
            </StyledFab>
          </Tooltip>
          <Tooltip title="Pulp" placement="left" TransitionComponent={Zoom}>
            <StyledFab
              size="small"
              color="secondary"
              aria-label="pulp"
              onClick={() => handleNavigate("/pulp")}
              delay={0.3}
            >
              <PulpIcon />
            </StyledFab>
          </Tooltip>
          <CreateBook createOpen={openBook} handleClose={closePopups}/>
          {
            openPaper &&<CreatePaper openPaper={openPaper} handleClose={closePopups}/>
          }
          
        </>
      )}
    </FabContainer>
  );
};


export default FloatingButton;