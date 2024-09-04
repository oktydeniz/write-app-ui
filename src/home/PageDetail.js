import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Button, Box, TextField, Input } from "@mui/material";
import Typography from "@mui/material/Typography";
import { PUBLIC_URL, getUserLanguage } from "network/Constant";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "assets/style/main.scss";
import Select from "react-select";
import { getUserCurrentId } from "network/Constant";
import Checklist from "@editorjs/checklist";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import {
  deletePaper,
  getPageBySlug,
  handleUploadNativeFile,
  updatePaperData,
} from "network/AppService";
import Quote from "@editorjs/quote";
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
import { sendGETRequestWithToken } from "network/PublicService";
import { languages } from "utils/data";

const PageDetail = () => {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState(null);
  const [editor, setEditor] = useState(null);
  const { paperSlug } = useParams();
  const editorRef = useRef();
  const [paper, setPaper] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [publish, setPublish] = useState(false);
  const [tags, setTags] = useState([]);
  const [genre, setGenre] = useState();
  const [listGenres, setListGenres] = useState([]);
  const [listTags, setListTags] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [paperContent, setPaperContent] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleChangePublish = (e) => {
    setPublish(e.target.value);
  };

  const handleChangeForGenre = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setGenre(selectedOption);
      fetchTagData(selectedOption.value);
    } else {
      setListTags([]);
      setTags([]);
    }
  };

  const fetchGenre = async (paper) => {
    setListGenres([]);
    try {
      const result = await sendGETRequestWithToken("/v1/public/genres-type");
      if (result.success) {
        setListGenres(result.response);
        const selectedOption = result.response.find(
          (genre) => genre.value === paper.genre.value
        );
        setGenre(selectedOption);
        fetchTagData(paper.genre.value, paper.tags);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChangeForLanguage = (value) => {
    if (value) {
      setSelectedLanguage(value.value);
    } else {
      setSelectedLanguage("EN");
    }
  };
  const fetchTagData = async (genre, tags) => {
    setTags([]);
    setListTags([]);
    try {
      const result = await getSubGenres(genre);
      if (result.success) {
        setListTags(result.response);
        setTags(tags);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeForSubGenre = (selectedOption) => {
    setTags(selectedOption.map((item) => item.value));
  };

  function extractValues(tags) {
    if (Array.isArray(tags)) {
      // Eğer tags bir dizi ise
      if (tags.length > 0 && typeof tags[0] === 'object' && tags[0] !== null && 'value' in tags[0]) {
        // Dizi nesnelerden oluşuyorsa
        return tags.map(t => t.value);
      } else {
        // Dizi basit değerlerden oluşuyorsa
        return tags;
      }
    } else {
      // Eğer tags bir dizi değilse (bu durumda bir dizi bekleniyor ama yine de kontrol etmek iyi olabilir)
      return [];
    }
  }

  const handleEditForPaper = async () => {
    if (editor) {
      try {
        const savedData = await editor.save();
        const jsonData = JSON.stringify(savedData);

        var data = {
          name: name,
          id: paper.id,
          desc: desc,
          genre: genre.value,
          tags: extractValues(tags),
          content: jsonData,
          language: selectedLanguage.value ? selectedLanguage.value : selectedLanguage,
          publish: publish,
        };
        if (file) {
          handleUploadNativeFile(
            file,
            (filePath) => {
              data.img = filePath;
              savePage(data);
            },
            (error) => {
              setErrorText(error);
            }
          );
        } else {
          savePage(data);
        }
      } catch (error) {
        console.error("Saving failed:", error);
      }
    }
  };

  const savePage = async (page) => {
    try {
      const result = await updatePaperData(page);
      if (result.success) {
        navigate("/contents");
      } else {
        setErrorText(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForPaper = async () => {
    try {
      const response = await deletePaper(paper.id);
      if (response.success) {
        navigate("/contents");
      }
    } catch (e) {
      setErrorText(e);
    }
  };

  const fetchPage = async () => {
    setPaper(null);
    try {
      const response = await getPageBySlug(paperSlug);
      if (response.success) {
        const fetchedData = response.data;
        setPaper(fetchedData);
        setName(fetchedData.name);
        setPaperContent(fetchedData.content);
        const languageObject = languages.find(lang => lang.value === (fetchedData.language || getUserLanguage()));
        setSelectedLanguage(languageObject);
        setDesc(fetchedData.desc);
        setImageSrc(
          fetchedData.img ? fetchedData.img : "https://via.placeholder.com/150"
        );
        fetchGenre(fetchedData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [paperSlug]);

  useEffect(() => {
    if (paper && document.getElementById("editorjs")) {
      const editorInstance = new EditorJS({
        holder: "editorjs",
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
        data: JSON.parse(paper.content) || {
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
    }
  }, [paper]);

  if (!paper) {
    return (
      <p className="no-data-p">We could not find a paper named {paperSlug}</p>
    );
  }

  return (
    <div>
      <div className={`create-content ${isCollapsed ? "collapsed" : ""}`}>
        <Card
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            margin: "10px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            {imageSrc && (
              <Box>
                <CardMedia
                  component="img"
                  sx={{ width: 140, maxHeight: "200px" }}
                  image={imageSrc}
                  alt={paper.name}
                />
                <label htmlFor="file-input">
                  <Input
                    accept="image/*"
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    sx={{
                      height: "40px",
                      marginTop: "4px !important",
                      padding: "7px !important",
                    }}
                    startIcon={<AttachFileIcon />}
                  >
                    Select Image
                  </Button>
                </label>
              </Box>
            )}
            <Grid container>
              <Grid item={true} content="true" xs={12} sx={{ padding: 2 }}>
                {errorText != null && (
                  <Typography
                    variant="body2"
                    color="red"
                    sx={{ fontSize: "15px", margin: "10px" }}
                  >
                    {errorText}
                  </Typography>
                )}
                <Grid container justifyContent="space-between">
                  <TextField
                    sx={{
                      width: "50%",
                    }}
                    className="name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    label="Name"
                    id="name"
                  />
                  {paper.user.id === getUserCurrentId() ? (
                    <Box>
                      <Button
                        sx={{
                          color: "red",
                        }}
                        onClick={() => handleDeleteForPaper()}
                        variant="body2"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleEditForPaper()}
                        variant="body2"
                        color="text.secondary"
                      >
                        Save
                      </Button>
                    </Box>
                  ) : null}
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    className="desc"
                    multiline
                    rows={5}
                    sx={{
                      marginTop: "10px",
                    }}
                    fullWidth
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                    value={desc}
                    label="Description"
                    id="desc"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </div>
      {!isCollapsed && (
        <Box
          sx={{
            flexDirection: "row",
            justifyContent: "flex-start",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="select-item horizontal flex1">
            <div className="item-span">Category</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={genre}
              isSearchable={true}
              onChange={handleChangeForGenre}
              options={listGenres}
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
          {listTags.length > 0 && (
            <div className="select-item horizontal flex2">
              <div className="item-span">Tags</div>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isMulti
                defaultValue={tags}
                isSearchable={true}
                closeMenuOnSelect={false}
                onChange={handleChangeForSubGenre}
                options={listTags}
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
          <div className="select-item flex1">
            <div className="item-span">Language</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={selectedLanguage}
              isClearable={true}
              isSearchable={true}
              onChange={handleChangeForLanguage}
              options={languages}
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
        </Box>
      )}

      <div className="toggle-container">
        <div className="divider"></div>
        <Button onClick={toggleCollapse} className="toggle-button">
          {isCollapsed ? "↓" : "↑"}
        </Button>
      </div>
      <div id="editorjs" className={`${isCollapsed ? "full-width" : ""}`}></div>
    </div>
  );
};

export default PageDetail;
