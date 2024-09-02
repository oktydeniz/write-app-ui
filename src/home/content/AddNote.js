import React, { useState, useEffect } from "react";
import "assets/style/main.scss";
import {
  CardMedia,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { PUBLIC_URL } from "network/Constant";
import { saveRequest, deleteNote } from "network/ContentService";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ImageUpload = styled(Box)({
  cursor: "pointer",
  margin: "10px",
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const AddNote = ({ edit, content, trigger, handleClose, open }) => {
  const [noteName, setNoteName] = useState(edit ? edit.noteName : "");
  const [isEdit, setIsEdit] = useState(edit ? true : false);
  const [noteContent, setNoteContent] = useState(edit ? edit.noteContent : "");
  const [isPrivate, setIsPrivate] = useState(edit ? edit.private : false);
  const [isPublished, setIsPublished] = useState(edit ? edit.published : false);
  const [imageUrl, setImageUrl] = useState(edit ? edit.imageUrl : "");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(edit ? edit.noteName : "Add Note");
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsEdit(false);
    setError(null);
    if (edit) {
      setNoteName(edit.noteName || "");
      setNoteContent(edit.noteContent || "");
      setIsPrivate(edit.private || false);
      setIsPublished(edit.published || false);
      setImageUrl(edit.imageUrl || "");
      setTitle(edit.noteName || "Add Note");
      setFile(null);
      setIsEdit(true);
    } else {
      setNoteName("");
      setNoteContent("");
      setTitle("Add Note");
      setIsPrivate(false);
      setIsPublished(false);
      setImageUrl("");
      setFile(null);
    }
  }, [edit]);

  const handleDelete = async () => {
    var data = {
      id: edit.id,
    };
    try {
      const result = await deleteNote(data);
      if (result.success) {
        handleClose();
        trigger();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    const noteData = {
      noteName: noteName || "",
      noteContent: noteContent || "",
      isPrivate: isPrivate || false,
      isPublished: isPublished || false,
      imageUrl: imageUrl || "",
      contentId: content.id,
    };

    if (isEdit && edit) {
      noteData.noteId = edit.id;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(PUBLIC_URL + "/v1/files/upload-native", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        const filePath = data.filePath;

        await fetch(PUBLIC_URL + "/v1/files/saveFilePath", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath: filePath }),
        });

        noteData.imageUrl = filePath;
      } catch (error) {
        console.error("Error:", error);
        setError("Image upload failed");
        return;
      }
    }

    try {
      const url = isEdit ? "/content/edit-note" : "/content/save-note";
      const result = await saveRequest(url, noteData);

      if (result.success) {
        setNoteName("");
        setNoteContent("");
        setIsPrivate(false);
        setIsPublished(false);
        setImageUrl("");
        setFile(null);
        setError(null);
        handleClose();
        trigger();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error(error);
      setError("Note saving failed");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 0,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ display: "flex", alignItems: "center" }} dividers>
          <ImageUpload sx={{ width: "150px" }}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none", cursor: "pointer" }}
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <CardMedia
                component="img"
                image={imageUrl || "https://via.placeholder.com/150"}
                alt="Note Image"
                sx={{
                  width: 150,
                  height: 200,
                  borderRadius: "8px",
                  cursor: "pointer;",
                }}
              />
            </label>
          </ImageUpload>
          <Box>
            {error && (
              <Typography sx={{ color: "red", fontSize: "14px" }}>
                {error}
              </Typography>
            )}
            <TextField
              label="Note Name"
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Note Content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={6}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              }
              label="Private"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
              }
              label="Publish with Readers"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {edit && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ marginTop: "-2px", height: "30px" }}
            >
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginTop: "-2px", height: "30px" }}
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};
export default AddNote;
