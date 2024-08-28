import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateContentStatus, deleteContent } from "network/ContentService";
import { useNavigate} from "react-router-dom";

const ContentMoreOptions = ({ content }) => {
  const [isPublished, setIsPublished] = useState(content.isPublished);
  const navigate = useNavigate();

  const updateStatus = async () => {
    var data = {
      content: content.id,
      isPublished: !isPublished,
    };
    setIsPublished(!isPublished);
    try {
      const result = await updateContentStatus(data);
      if (result.success) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAction = async () => {
    var data = {
      id: content.id,
    };
    try {
      const result = await deleteContent(data);
      if (result.success) {
        navigate("/contents");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box sx={{ my: 2, width: "33%" }}>
        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={updateStatus}
              color="primary"
            />
          }
          label="Publish"
          labelPlacement="start"
          sx={{ justifyContent: "space-between", display: "flex" }}
        />
      </Box>
      <Box sx={{ my: 3, width: "100%" }}>
        <Button
          variant="contained"
          color="error"
          onClick={deleteAction}
          startIcon={<DeleteIcon />}
          sx={{ width: "100%" }}
        >
          Delete
        </Button>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, textAlign: "center" }}
        >
          This action cannot be undone.
        </Typography>
      </Box>
    </Box>
  );
};

export default ContentMoreOptions;
