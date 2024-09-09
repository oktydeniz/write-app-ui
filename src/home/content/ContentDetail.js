import {
  getContentBySlug,
  getNotes,
  changePublishSection,
  updateBookmarkInfo,
  bookmarkInfo,
} from "network/ContentService";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Chip, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import "assets/style/main.scss";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Box from "@mui/material/Box";
import DOMPurify from "dompurify";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddSection from "home/content/AddSection";
import Slide from "@mui/material/Slide";
import { saveNewSectionData } from "network/SectionService";
import FullScreenReader from "components/FullScreenReader";
import Notes from "./Notes";
import Authors from "./Authors";
import AddContent from "./AddContent";
import ContentMoreOptions from "./ContentMoreOptions";
import { truncateText } from "utils/StringUtil";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { getUserCurrentId } from "network/Constant";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ContentDetail = () => {
  const { contentSlug } = useParams();
  const [content, setContent] = useState();
  const [passages, setPassages] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openContentdialog, setContentDialog] = useState(false);
  const [value, setValue] = React.useState(0);
  const [switchStates, setSwitchStates] = useState({});
  const [notes, setNotes] = useState([]);
  const [editableSection, setEditableSection] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEditableSection(null);
    setOpen(false);
    fetchSectionData();
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleChangeSection = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fetchData = async () => {
    try {
      const result = await getContentBySlug(contentSlug);
      if (result.success) {
        setContent(result.response);
        getBookmarkInfo(result.response.id);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchSectionData();
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setNotes([]);
    try {
      const result = await getNotes(contentSlug);
      if (result.success) {
        setNotes(result.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBookmarkInfo = async (id) => {
    try {
      const response = await bookmarkInfo(id);
      if (response.success) {
        setIsBookmarked(response.response);
      } else {
        setIsBookmarked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefresh = () => {
    fetchNotes();
  };
  const fetchSectionData = async () => {
    setPassages([]);
    setSwitchStates([]);
    try {
      const result = await saveNewSectionData(contentSlug);
      if (result.success) {
        setPassages(result.response);
        const initialSwitchStates = result.response.reduce((acc, item) => {
          acc[item.id] = item.isPublished;
          return acc;
        }, {});
        setSwitchStates(initialSwitchStates);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked((isBookmarked) => !isBookmarked);
    sendBookmarkInfo();
  };

  const sendBookmarkInfo = async () => {
    var data = {
      id: content.id,
    };
    try {
      const response = await updateBookmarkInfo(data);
      if (response.success) {
        setIsBookmarked(response.response);
      } else {
        setIsBookmarked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwitchChange = async (event, id) => {
    const newState = !switchStates[id];
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [id]: newState,
    }));
    var data = {
      sectionId: id,
      state: newState,
    };
    try {
      const response = await changePublishSection(data);
      if (response) {
        fetchSectionData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = (item, idx) => {
    setEditableSection(item);
    handleClickOpen();
  };
  const handleClickOpenContent = () => {
    setContentDialog(true);
  };

  const handleCloseContent = () => {
    setContentDialog(false);
  };
  const actionHandler = () => {
    fetchData();
    handleCloseContent();
  };
  return (
    <div className="content-detail">
      {content ? (
        <>
          <Card sx={{ display: "flex", margin: "10px", position: "relative" }}>
            <CardMedia
              component="img"
              sx={{ width: 140 }}
              image={content.img}
              alt={content.name}
            />
            <Grid container>
              <Grid item={true} content="true" xs={12} sx={{ padding: 2 }}>
                <Grid container justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {`${content.genre.label} - ${content.clickedCount} clicks`}
                  </Typography>
                  {content.createdBy.id === getUserCurrentId() ? (
                    <Button
                      onClick={handleClickOpenContent}
                      variant="body2"
                      color="text.secondary"
                    >
                      Edit
                    </Button>
                  ) : (
                    <IconButton onClick={handleToggleBookmark}>
                      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  )}
                </Grid>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  variant="h6"
                  component="div"
                >
                  {content.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateText(content.description, 400)}
                </Typography>

                <Grid container spacing={1} sx={{ marginTop: 1 }}>
                  {content.tags.map((tag, index) => (
                    <Chip
                      sx={{ margin: "3px" }}
                      label={tag.label}
                      key={index}
                      size="small"
                    />
                  ))}
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{ marginTop: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {content.averageRating}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <AddContent
            open={openContentdialog}
            handleClose={handleCloseContent}
            actionHandler={actionHandler}
            content={content}
          />
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Sections" {...a11yProps(0)} />
                <Tab label="Notes" {...a11yProps(1)} />
                <Tab label="Authors" {...a11yProps(2)} />
                {/* <Tab label="Comments" {...a11yProps(3)} /> 
                
                {content.createdBy.id === getUserCurrentId() && (
                 {  <Tab label="More" {...a11yProps(4)} />}
                )}
                */ }
                
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {passages.length > 0 ? (
                <>
                  {passages.map((item, index) => (
                    <Accordion
                      key={index}
                      expanded={expanded === `panel${index}`}
                      onChange={handleChangeSection(`panel${index}`)}
                      sx={{
                        backgroundColor: item.isPublished
                          ? "transparent"
                          : "#f0f0f0",
                        opacity: item.isPublished ? 1 : 0.6,
                        marginBottom: "8px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <Typography sx={{ width: "50%", flexShrink: 0 }}>
                          {`${item.sectionName}`}
                          {item.user.id !== getUserCurrentId() && (
                            <>
                              {}
                              <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                              >
                                {` Writen by @${item.user.userAppName}`}
                              </Typography>
                            </>
                          )}
                        </Typography>
                        {item.sectionDesc ? (
                          <Typography sx={{ color: "text.secondary" }}>
                            {item.sectionDesc}
                          </Typography>
                        ) : null}
                      </AccordionSummary>
                      <AccordionDetails>
                        {(item.user.id === getUserCurrentId() ||
                          content.createdBy.id === getUserCurrentId()) && (
                          <Box className="section-options">
                            {content.contentMyRole != "VIEWER" && (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleEdit(item, index)}
                                sx={{ height: "30px", marginRight: "20px" }}
                              >
                                Edit
                              </Button>
                            )}

                            {content.createdBy.id === getUserCurrentId() && (
                              <FormControlLabel
                                sx={{ paddingTop: "6px" }}
                                control={
                                  <Switch
                                    checked={switchStates[item.id] || false}
                                    onChange={(e) =>
                                      handleSwitchChange(e, item.id)
                                    }
                                  />
                                }
                                label="Publish"
                              />
                            )}
                          </Box>
                        )}
                        <Typography
                          component="div"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(item.passage),
                          }}
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </>
              ) : (
                <p className="no-data-p">
                  You Have not created a section for {content.name}.{" "}
                  {content.contentMyRole != "VIEWER" && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={handleClickOpen}
                    >
                      Click Here or Plus Button to create new section
                    </span>
                  )}
                </p>
              )}
              {content.contentMyRole != "VIEWER" && (
                <Fab
                  className="floating-btn"
                  onClick={handleClickOpen}
                  size="small"
                  color="primary"
                  aria-label="add"
                >
                  <AddIcon />
                </Fab>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Notes notes={notes} content={content} trigger={handleRefresh} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Authors content={content} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}></CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <ContentMoreOptions content={content} />
            </CustomTabPanel>
          </Box>
          {open ? (
            <AddSection
              open={open}
              content={content}
              onClose={handleClose}
              editableSection={editableSection}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ContentDetail;
