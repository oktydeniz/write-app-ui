import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Button, Box, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { PUBLIC_URL } from "network/Constant";
import "assets/style/main.scss";
import Select from "react-select";
import { getUserCurrentId } from "network/Constant";
import Checklist from "@editorjs/checklist";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import { getPageBySlug } from "network/AppService";
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

const PageDetail = () => {
  const [editor, setEditor] = useState(null);
  const { paperSlug } = useParams();
  const editorRef = useRef();
  const [paper, setPaper] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");

  const [tags, setTags] = useState([]);
  const [genre, setGenre] = useState();
  const [listGenres, setListGenres] = useState([]);
  const [listTags, setListTags] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChangeForGenre = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setGenre(selectedOption.value);
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
          fetchTagData(paper.genre.value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchTagData = async (genre) => {
    setTags([]);
    setListTags([]);
    try {
      const result = await getSubGenres(genre);
      if (result.success) {
        setListTags(result.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeForSubGenre = (selectedOption) => {
    setTags(selectedOption.map((item) => item.value));
  };

  const handleEditForPaper = async () => {
    if (editor) {
      try {
        const savedData = await editor.save();
        const jsonData = JSON.stringify(savedData);
        console.log(jsonData);
      } catch (error) {
        console.error("Saving failed:", error);
      }
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
        setDesc(fetchedData.desc);
        setImg(fetchedData.img);
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
            {paper.img && (
              <CardMedia
                component="img"
                sx={{ width: 140, maxHeight: "200px" }}
                image={paper.img}
                alt={paper.name}
              />
            )}
            <Grid container>
              <Grid item={true} content="true" xs={12} sx={{ padding: 2 }}>
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
                    <Button
                      onClick={() => handleEditForPaper()}
                      variant="body2"
                      color="text.secondary"
                    >
                      Edit
                    </Button>
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
          }}
        >
          <div className="select-item horizontal">
            <div className="item-span">Category</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={genre}
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
            <div className="select-item horizontal">
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
