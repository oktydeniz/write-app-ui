import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Box,
  Slide,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { saveNewContentData, deleteSection } from "network/ContentService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddSection = ({ open, onClose, content, editableSection }) => {
  const [isChecked, setIsChecked] = useState(false);
  const quillRef = useRef(null);
  const handleSwitchChange = (event) => {
    setIsChecked(!isChecked);
  };
  const [section, setSection] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [value, setValue] = useState("");
  const modules = {
    toolbar: [
      [
        { header: "1" },
        { header: "2" },
        { header: "3" },
        { header: "4" },
        { font: [] },
      ],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      ["link"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "background",
    "bullet",
    "indent",
    "link",
  ];

  const setSectionChange = (e) => {
    setSection(e.target.value);
  };

  const setSectionDescChange = (e) => {
    setSectionDesc(e.target.value);
  };

  const deleteSectionAction = () => {
    deleteSectionRequest();
  }
  const deleteSectionRequest = async () => {
    var data = {
      id: editableSection ? editableSection.id : null,
    };
    try {
      const result = await deleteSection(data);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (editableSection != null) {
      setIsChecked(editableSection.isPublished);
      setSection(editableSection.sectionName);
      setSectionDesc(editableSection.sectionDesc);
      setValue(editableSection.passage);
    }
  }, [editableSection]);

  const onSave = async (name, desc, context) => {
    var data = {
      name: name,
      desc: desc,
      context: context,
      isChecked: isChecked,
      contentId: content.id,
    };
    if (editableSection) {
      data.sectionId = editableSection.id;
    }
    try {
      var url = editableSection ? "update-section" : "save-section";
      var method = editableSection ? "PUT" : "POST";
      const result = await saveNewContentData(`/content/${url}`, data, method);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {content.name}
          </Typography>
          {editableSection && (
            <IconButton onClick={() => deleteSectionAction()} aria-label="delete" size="large">
              <DeleteIcon sx={{ color: "white" }} fontSize="inherit" />
            </IconButton>
          )}
          <FormControlLabel
            sx={{ marginTop: "7px", marginRight: "20px" }}
            control={
              <Switch
                checked={isChecked}
                onChange={handleSwitchChange}
                color="primary"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "green",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "lightgreen",
                  },
                }}
              />
            }
            label="Publish when saved!"
          />
          <Button
            autoFocus
            color="inherit"
            onClick={() => {
              onSave(section, sectionDesc, value);
            }}
          >
            {editableSection === null ? "Save" : "Update"}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", padding: "10px", marginTop: "10px" }}>
        <TextField
          onChange={setSectionChange}
          fullWidth
          sx={{
            flex: "1",
            marginRight: "10px",
          }}
          value={section}
          label="Name"
          id="name"
        />
        <TextField
          onChange={setSectionDescChange}
          fullWidth
          sx={{
            flex: "2",
          }}
          value={sectionDesc}
          label="Description (Optional)"
          id="desc"
        />
      </Box>
      <Box
        sx={{
          margin: "10px",
        }}
      >
        <ReactQuill
          ref={quillRef}
          value={value}
          style={{ height: "70vh" }}
          onChange={setValue}
          modules={modules}
          formats={formats}
          theme="snow"
        />
      </Box>
    </Dialog>
  );
};

export default AddSection;
