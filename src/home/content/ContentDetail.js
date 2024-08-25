import { getContentBySlug, getNotes } from "network/ContentService";
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
import Box from "@mui/material/Box";
import DOMPurify from "dompurify";
import Fab from "@mui/material/Fab";
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
  const [value, setValue] = React.useState(0);
  const [switchStates, setSwitchStates] = useState({});
  const [notes, setNotes] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [combinedPassages, setCombinedPassages] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchSectionData();
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleChangeSection = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContentBySlug(contentSlug);
        if (result.success) {
          setContent(result.response);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
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
  }

  const handleRefresh = () => {
    fetchNotes();
  }
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
        combinePassages(result.response);
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  const combinePassages = (passages) => {
    const combined = passages.map((passage, index) => {
      return `<h2>${passage.sectionName}</h2><p>${passage.passage}</p>`;
    }).join(""); 
  
    setCombinedPassages(combined);
  };

  const handleSwitchChange = (event, id) => {
    const newState = !switchStates[id];
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [id]: newState,
    }));
    console.log("Switch toggled for item with ID:", id, "New State:", newState);
  };
  const handleEdit = (index) => {
    console.log(`Edit section at index ${index}`);
  };
  const [showReader, setShowReader] = useState(false);

  const handleReadClick = () => {
    setShowReader(true);
  };

  const handleCloseReader = () => {
    setShowReader(false);
  };
  
  return (
    <div className="content-detail">
      {content ? (
        <>
          <Card sx={{ display: "flex", margin: "10px" }}>
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
                    {`${content.genre.name} - ${content.clickedCount} clicks`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {content.price
                      ? `${content.price} ${content.currency} `
                      : "Free"}
                  </Typography>
                </Grid>
                <Typography variant="h6" component="div">
                  {content.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {content.description}
                </Typography>

                <Grid container spacing={1} sx={{ marginTop: 1 }}>
                  {content.tags.map((tag, index) => (
                    <Chip
                      sx={{ margin: "3px" }}
                      label={tag.name}
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
                    {content.getAverageRating}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
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
                <Tab label="Comments" {...a11yProps(3)} />
                <Tab label="Detail" {...a11yProps(4)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {passages.length > 0 ? (
                <>
                <Button variant="contained" color="primary" onClick={handleReadClick}>
                  Read
                </Button>

                  <FullScreenReader
                    combinedPassages={combinedPassages}
                    open={showReader}
                    onClose={handleCloseReader}
                  />
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
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <Typography sx={{ width: "33%", flexShrink: 0 }}>
                          {item.sectionName}
                        </Typography>
                        {item.sectionDesc ? (
                          <Typography sx={{ color: "text.secondary" }}>
                            {item.sectionDesc}
                          </Typography>
                        ) : null}
                      </AccordionSummary>
                      <AccordionDetails>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEdit(item.id)} // Handle edit button click
                          sx={{ height: "25px", marginLeft: "10px" }}
                        >
                          Edit
                        </Button>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={switchStates[item.id] || false}
                              onChange={(e) => handleSwitchChange(e, item.id)}
                            />
                          }
                          label="Publish"
                        />
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
              ) : null}
              <Fab
                className="floating-btn"
                onClick={handleClickOpen}
                size="small"
                color="primary"
                aria-label="add"
              >
                <AddIcon />
              </Fab>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Notes notes={notes} content={content} trigger={handleRefresh}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Authors content={content}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}></CustomTabPanel>
            <CustomTabPanel value={value} index={4}></CustomTabPanel>
            <CustomTabPanel value={value} index={5}></CustomTabPanel>
          </Box>
          {open ? (
            <AddSection open={open} content={content} onClose={handleClose} />
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
