import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import "assets/style/main.scss";
import Paragraph from "@editorjs/paragraph";
import { PUBLIC_URL } from "network/Constant";
import Checklist from "@editorjs/checklist";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { sendGETRequestWithToken } from "network/PublicService";
import {
  TextField,
  Dialog,
  Typography,
  IconButton,
  Slide,
  Toolbar,
  Input,
  AppBar,
  Button,
  Box,
} from "@mui/material";
import Quote from "@editorjs/quote";
import Select from "react-select";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import { getSubGenres } from "network/ContentService";
import { handleUploadNativeFile } from "network/AppService";
import { savePaperData } from "network/AppService";

const CreatePaper = ({ openPaper, handleClose, paper }) => {
  const [errorText, setErrorText] = useState(null);
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSubGenre, setSelectedSubGenre] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState();
  const [subGenres, setSubGenres] = useState([]);
  const [genres, setGenres] = useState("");
  const [publish, setPublish] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleChangePublish = (e) => {
    setPublish(e.target.value);
  }
  const handleAboutChange = (e) => {
    setDesc(e.target.value);
  };

  const handleChangeForGenre = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setSelectedGenre(selectedOption.value);
      fetchTagData(selectedOption.value);
    } else {
      setSelectedSubGenre([]);
      setSubGenres([]);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchTagData = async (genre) => {
    setSelectedSubGenre([]);
    setSubGenres([]);
    try {
      const result = await getSubGenres(genre);
      if (result.success) {
        setSubGenres(result.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeForSubGenre = (selectedOption) => {
    setSelectedSubGenre(selectedOption.map((item) => item.value));
  };

  useEffect(() => {
    const fetchGenre = async () => {
      setGenres([]);
      try {
        const result = await sendGETRequestWithToken("/v1/public/genres-type");
        if (result.success) {
          setGenres(result.response);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchGenre();
  }, []);

  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const editorInstance = new EditorJS({
      holder: "editorjs",
      // readOnly: true,
      tools: {
        header: Header,
        checklist: Checklist,
        quote: Quote,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${PUBLIC_URL}/v1/files/upload`,
              byUrl: `${PUBLIC_URL}/v1/files/fetchUrl`,
            },
          },
        },
        code: CodeTool,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        linkTool: LinkTool,
        warning: Warning,
        marker: Marker,
        embed: Embed,
        table: Table,
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
      },
      data: {
        time: new Date().getTime(),
        blocks: [
          {
            type: "header",
            data: {
              text: "Start to write us",
              level: 3,
            },
          },
          {
            type: "paragraph",
            data: {
              text: "...",
            },
          },
        ],
      },
    });

    editorRef.current = editorInstance;
    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []);

  const handleSave = async () => {
    if (editor) {
      try {
        const savedData = await editor.save();
        const jsonData = JSON.stringify(savedData);

        handleUploadNativeFile(
          file,
          (filePath) => {
            var data = {
              name: name,
              desc: desc,
              img:filePath,
              genre: selectedGenre,
              tags: selectedSubGenre,
              content: jsonData,
              publish:publish
            };
            savePage(data);
          },
          (error) => {
            setErrorText(error);
          }
        );
      } catch (error) {
        console.error("Saving failed:", error);
      }
    }
  };

  const savePage = async (page) => {
    try {
      const result = await savePaperData(page);
      if (result.success) {
          clearAll();
        handleClose();
      } else {
        setErrorText(result.message);
      }
    }catch (error) {
      console.log(error);
    }
  }

  const clearAll = () => {
    setName("");
    setDesc();
    setEditor(null);
    setErrorText("");
    setGenres([]);
    setSelectedGenre(null);
    setSelectedSubGenre([]);
    setSubGenres([]);
  }

  return (
    <Dialog
      fullScreen
      open={openPaper}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Create Personel Passage
          </Typography>
          <Button color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <div className="create-base-content">
      <div className={`create-content ${isCollapsed ? "collapsed" : ""}`}>
        <Box className="select-img-container" sx={{ padding: 2 }}>
          <Input
            accept="image/*"
            id="file-input"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {imageSrc && (
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "center",
                border: "1px solid #ddd",
                borderRadius: 1,
                overflow: "hidden",
                maxWidth: 250,
                borderRadius: "12px",
                maxHeight: 450,
              }}
            >
              <img
                src={imageSrc}
                alt="Selected"
                style={{ width: "100%", height: "250px" }}
              />
            </Box>
          )}
          <label htmlFor="file-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Select Image
            </Button>
          </label>
        </Box>
        {!isCollapsed && (
          <div className="content-names-container">
            {errorText != null && (
              <Typography
                variant="body2"
                color="red"
                sx={{ fontSize: "15px", margin: "10px" }}
              >
                {errorText}
              </Typography>
            )}
            <TextField
              className="name"
              onChange={handleNameChange}
              fullWidth
              required
              value={name}
              label="Name"
              id="name"
            />
            <TextField
              id="desc"
              label="Description"
              multiline
              fullWidth
              required
              value={desc}
              onChange={handleAboutChange}
              rows={6}
            />
          </div>
        )}
      </div>
      <div className={`selects ${isCollapsed ? "collapsed" : ""}`}>
        {!isCollapsed && (
          <>
            <div className="select-item">
              <div className="item-span">Category</div>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={{ value: -22, label: "Select" }}
                isSearchable={true}
                onChange={handleChangeForGenre}
                options={genres}
                name=".contents"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "55px",
                    minHeight: "55px",
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                  }),
                }}
              />
            </div>
            <br />
            {subGenres.length > 0 && (
              <div className="select-item">
                <div className="item-span">Tags</div>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable={true}
                  isMulti
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  onChange={handleChangeForSubGenre}
                  options={subGenres}
                  name="tags"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      height: "55px",
                      minHeight: "55px",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "55px",
                      display: "flex",
                      alignItems: "center",
                    }),
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="toggle-container">
        <div className="divider"></div>
        <Button onClick={toggleCollapse} className="toggle-button">
          {isCollapsed ? "↓" : "↑"}
        </Button>
      </div>
      <div id="editorjs" className={`${isCollapsed ? "full-width" : ""}`}></div>
    </div>
    </Dialog>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default CreatePaper;
