import React, { useState } from "react";
import "assets/style/main.scss";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddNote from "home/content/AddNote";

const Notes = ({ notes, content, trigger }) => {

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Box>
    {notes && notes.length > 0 ? (
      notes.map((note, index) => (
        <Card key={index} sx={{mt:'10px', flexDirection:'column',flexWrap:'wrap', width:'30%'}}>
        {
          note.imageUrl && <CardMedia
          component="img"
          image={note.imageUrl}
          alt="Note Image"
          sx={{ width: '100%', height: 150, borderRadius: '8px', marginTop: '10px' }}
        />
        }
        <CardContent>
          <Typography variant="h6">{note.noteName}</Typography>
          <Typography variant="body1" sx={{ marginTop: '10px' }}>
            {note.noteContent}
          </Typography>
        </CardContent>
      </Card>
      ))
    ) : (
      <Typography variant="body1">You do not have any notes yet</Typography>
    )}
    <Fab
        className="floating-btn"
        onClick={handleClickOpen}
        size="small"
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <AddNote open={open} handleClose={handleClose} content={content} isEdit={isEdit} trigger={trigger}/>
  </Box>
  );
};

export default Notes;
