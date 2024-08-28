import React, { useState, useEffect } from "react";
import "assets/style/main.scss";
import FormGroup from "@mui/material/FormGroup";
import {
  Card,
  CardContent,
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
import { saveRequest } from "network/ContentService";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ImageUpload = styled(Box)({
  cursor: "pointer",
  margin:'10px'
});


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));


const AddNote = ({ edit, content, trigger, handleClose, open }) => {
  const [noteName, setNoteName] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [shareWithAnotherAuth, setShareWithAnotherAuth] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async (imageUrl) => {
    const noteData = {
      noteName,
      noteContent,
      isPrivate,
      shareWithAnotherAuth,
      imageUrl,
      contentId: content.id,
    };
    console.log(noteData);
    try {
      const result = await saveRequest("/content/save-note", noteData);
      if (result.success) {
        setNoteContent(null);
        setNoteName(null);
        setIsPrivate(false);
        setImageUrl("");
        setError(null);
        setFile(null);
        setShareWithAnotherAuth(false);
        handleClose();
        trigger();
      }else{
        setError(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if(file){
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          const response = await fetch(PUBLIC_URL + "/v1/files/upload", {
            method: "POST",
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error("Upload failed");
          }
    
          const data = await response.json();
          var filePath = data.filePath;
          await fetch(PUBLIC_URL + "/v1/files/saveFilePath", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filePath: data.filePath }),
          });
        } catch (error) {
          console.error("Error:", error);
        }
        handleSave(filePath)
    }
    
    handleSave("");
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
         {edit ? edit.name : "Add Note"}
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
        <DialogContent sx={{display:'flex', alignItems:'center'}} dividers>
            <ImageUpload sx={{width:'150px'}}>
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
                {
                    error &&
                    <Typography sx={{color:'red', fontSize:'14px'}}>{error}</Typography>
                }
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
                    checked={shareWithAnotherAuth}
                    onChange={(e) => setShareWithAnotherAuth(e.target.checked)}
                  />
                }
                label="Publish with Readers"
              />
              </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
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
