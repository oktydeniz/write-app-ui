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

const NoteCard = styled(Card)({
  display: "flex",
});

const NoteContent = styled(CardContent)({
  
});

const ImageUpload = styled(Box)({
    marginTop: '30px',
  cursor: "pointer",
});

const Notes = ({ notes, content, trigger }) => {
  const [noteName, setNoteName] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [shareWithAnotherAuth, setShareWithAnotherAuth] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

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
    handleSave(filePath);
  };

  const handleSave = async (imageUrl) => {
    
    const noteData = {
      noteName,
      noteContent,
      isPrivate,
      shareWithAnotherAuth,
      imageUrl,
      contentId:content.id
    };
    try {
        const result = await saveRequest("/content/save-note", noteData);
        if (result.success) {
          trigger();
        }
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <div>
      <NoteCard>
        <ImageUpload>
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
              sx={{ width: 200, height: 250, borderRadius: "8px", cursor:'pointer;' }}
            />
          </label>
        </ImageUpload>
        <NoteContent>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{ marginTop: "0px" }}
          >
            Save
          </Button>
        </NoteContent>
      </NoteCard>
      {notes && notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <div>
          <p>You do not have any note yet</p>
        </div>
      )}
    </div>
  );
};

export default Notes;



const NoteList = ({ notes }) => {
    return (
      <div>
        {notes.map((note, index) => (
          <NoteCard key={index}>
            <CardMedia
              component="img"
              image={note.imageUrl}
              alt="Note Image"
              sx={{ width: 150, height: 150, borderRadius: '8px', marginRight: '20px' }}
            />
            <NoteContent>
              <Typography variant="h6">{note.noteName}</Typography>
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                {note.noteContent}
              </Typography>
            </NoteContent>
          </NoteCard>
        ))}
      </div>
    );
  };
  