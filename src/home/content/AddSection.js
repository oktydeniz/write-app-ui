import React, { useState, useRef } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Slide,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { saveNewContentData } from "network/ContentService";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddSection = ({ open, onClose, content }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (event) => {
    setIsChecked(!isChecked);
  };
  const [section, setSection] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [value, setValue] = useState("");
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
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
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  const setSectionChange = (e) => {
    setSection(e.target.value);
  };

  const setSectionDescChange = (e) => {
    setSectionDesc(e.target.value);
  };

  const onSave = async (name, desc, context) => {
    var data = {
      name: name,
      desc: desc,
      context: context,
      isChecked: isChecked,
      contentId: content.id,
    };
    try {
      const result = await saveNewContentData("/content/save-section", data);
      if (result.success) {
        onClose()
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
          <Button
            autoFocus
            color="inherit"
            onClick={() => {
              onSave(section, sectionDesc, value);
            }}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <TextField
        onChange={setSectionChange}
        fullWidth
        value={section}
        label="Name"
        id="name"
      />
      <TextField
        onChange={setSectionDescChange}
        fullWidth
        value={sectionDesc}
        label="Description (Optional)"
        id="desc"
      />
      <FormControlLabel
        control={<Switch checked={isChecked} onChange={handleSwitchChange} />}
        label="Publish when saved!"
      />
      <div>
        <ReactQuill
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          theme="snow"
        />
      </div>
    </Dialog>
  );
};

export default AddSection;
