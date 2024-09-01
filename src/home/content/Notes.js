import React, { useState } from "react";
import "assets/style/main.scss";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddNote from "home/content/AddNote";
import { truncateText } from "utils/StringUtil";
import { getUserId } from "network/Constant";


const Notes = ({ notes, content, trigger }) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);

  const handleClickOpen = () => {
    setIsEdit(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleNote = (note) => {
    setIsEdit(null);
    setIsEdit(note);
    setIsOpenNote(true);
  };
  const handleEdit = (note) => {
    handleCloseNote();
    setOpen(true);
  };

  const handleCloseNote = () => {
    setIsOpenNote(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {notes && notes.length > 0 ? (
        notes.map((note, index) => (
          <Card
            onClick={() => handleNote(note)}
            key={index}
            sx={{
              mt: "10px",
              flexDirection: "column",
              flexWrap: "wrap",
              width: "25%",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            {note.imageUrl && (
              <CardMedia
                component="img"
                image={note.imageUrl}
                alt="Note Image"
                sx={{
                  width: "100%",
                  height: 150,
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}
            <CardContent>
              <Typography variant="h6">{note.noteName}</Typography>
              <Typography variant="body1" sx={{ marginTop: "10px" }}>
                {truncateText(note.noteContent, 65)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="no-data-p">You do not have any notes yet</p>
      )}
      <Fab
        className="floating-btn"
        onClick={handleClickOpen}
        size="small"
        color="primary"
      >
        <AddIcon />
      </Fab>
      <AddNote
        open={open}
        handleClose={handleClose}
        content={content}
        edit={isEdit}
        trigger={trigger}
      />
      {
        isEdit && <ShowNote
        note={isEdit}
        handleEdit={handleEdit}
        handleClose={handleCloseNote}
        open={isOpenNote}
      />
      }
      
    </Box>
  );
};

export default Notes;

const ShowNote = ({ note, open, handleClose, handleEdit }) => {


  return (
    <Dialog
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "80%",
          minHeight: "150px",
        },
      }}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {note.noteName}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>{note.noteContent}</Typography>
      </DialogContent>
      {(note && note.appUser.id === Number(getUserId())) &&
        <DialogActions>
          <Button autoFocus onClick={() => handleEdit(note)}>
            Edit
          </Button>
        </DialogActions>
      }
    </Dialog>
  );
};
