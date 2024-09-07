import { fetchPapers } from "network/LibraryService";
import React, { useEffect, useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Chip, Box } from "@mui/material";
import "assets/style/main.scss";
import { truncateText } from "utils/StringUtil";
import "assets/style/home.scss";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import { PUBLIC_URL, getUserLanguage } from "network/Constant";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import EditorJS from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { contextType } from "react-quill";
import { formattedDate } from "utils/TimeUtil";

const Paper = ({}) => {
  // - my last readed books,  my bookmarks , my reading lists, recomended for me , explore, my-books
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const allData = await fetchPapers();
      if (allData.success) {
        const data = allData.papers;
        setPapers(data);
      }
    };
    fetchData();
  }, []);

  function showAllAction(type) {
    console.log(type);
  }

  return (
    <Box>
      {papers.length > 0 && (
        <BookCardItem contents={papers} showAllAction={showAllAction} />
      )}
    </Box>
  );
};

export default Paper;

const BookCardItem = ({ contents, showAllAction }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState();

  function handleClose() {
    setOpen(false);
  }

  function cardClicedAction(item) {
    setSelected(item);
    setOpen(true);
  }

  return (
    <div className="contents-container">
      {contents.length > 0 ? (
        <>
          <span>My Contents</span>
          <span onClick={() => showAllAction(0)} className="show-all">
            Show All
          </span>
        </>
      ) : null}
      <Box className="contents-lists">
        {contents.map((item) => (
          <Card
            onClick={() => cardClicedAction(item)}
            key={item.slug}
            className="content-card"
            sx={{
              display: "flex",
              maxWidth: 450,
              margin: "10px",
              height: "250px",
              alignItems: "center;",
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 140, height: "200px;", borderRadius: "10px;" }}
              image={item.img}
              alt={item.name}
            />
            <Grid container>
              <Grid item xs={12} sx={{ padding: 2 }}>
                <Grid container justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {`${item.genre.label} - ${item.clickedCount} clicks`}
                  </Typography>
                </Grid>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateText(item.desc, 255)}
                </Typography>

                <Grid container spacing={1} sx={{ marginTop: 1 }}>
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      sx={{ margin: "3px" }}
                      label={tag.label}
                      key={index}
                      size="small"
                    />
                  ))}
                  {item.tags.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      ...
                    </Typography>
                  )}
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{ marginTop: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.getAverageRating}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  ></Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
      {open && selected && (
        <FullScreenDialog
          handleClose={handleClose}
          isOpened={open}
          content={selected}
        />
      )}
    </div>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenDialog({ isOpened, content, handleClose }) {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    const editorInstance = new EditorJS({
      holder: "editorjs",
      readOnly: true,
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
      data: JSON.parse(content.content) || {
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        fullScreen
        open={isOpened}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Typography sx={{ flex: 1 }} variant="h1" component="div">
            {content.name}
          </Typography>
          <Typography sx={{ flex: 1 }} variant="h5" component="div">
            {content.desc}
          </Typography>
          <Box
            sx={{
              width: "80%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ marginRight: "8px" }}>|</Typography>
            <Typography>{formattedDate(content.createdTime)}</Typography>
          </Box>

          <div id="editorjs"></div>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
