import React, { useState, useEffect, useRef } from "react";
import "assets/style/home.scss";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchBook } from "network/LibraryService";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Typography,
  Rating,
  Tabs,
  Chip,
  IconButton,
  Tab,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { updateBookmarkInfo } from "network/ContentService";
import CheckIcon from "@mui/icons-material/Check";

const BookDetail = () => {
  const { slug, user } = useParams();
  const [book, setBook] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const getBook = async () => {
      const response = await fetchBook(slug, user);
      if (response.success) {
        const book = response.book;
        setBook(book);
        setIsBookmarked(book.bookmarked);
        console.log(book);
      }
    };
    getBook();
  }, []);

  const handleToggleBookmark = () => {
    setIsBookmarked((isBookmarked) => !isBookmarked);
    sendBookmarkInfo();
  };

  const sendBookmarkInfo = async () => {
    var data = {
      id: book.id,
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

  if (!book) {
    return <p>Something is broken</p>;
  }
  return (
    <Box className="home-conteiner">
      <Box className="home-section">
        <Box className="home-cover">
          <img className="home-img" src={book.img} />
        </Box>
        <Box className="home-detail">
          <Box>
            <div className="book-tags">
              <div>{`${book.contentGenre.label} / `}</div>
              <div>
                {book.tags.map((tag, index) => (
                  <Chip
                    sx={{ margin: "3px" }}
                    label={tag.label}
                    key={index}
                    size="small"
                  />
                ))}
              </div>
              <IconButton onClick={handleToggleBookmark}>
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </div>
            <Typography sx={{ marginBottom: "0px" }} variant="h4" gutterBottom>
              {book.name}{" "}
              <a href={`${book.createdBy.userAppName}`} className="author-link">
                /by @{book.createdBy.userAppName}
              </a>
            </Typography>
            <Box className="rating-area">
              <Rating
                name="size-medium"
                defaultValue={book.ratings}
                precision={0.5}
                readOnly
              />
              <Typography
                variant="button"
                sx={{ marginBottom: "0px", marginTop: "1px" }}
                gutterBottom
              >
                {`(${book.ratingCount})`}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontSize: "0.96rem" }}
              gutterBottom
            >
              {book.description}
            </Typography>
          </Box>
        </Box>
      </Box>
      <BasicTabs book={book} />
    </Box>
  );
};

export default BookDetail;

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

function BasicTabs({ book }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", margin:'10px' }}>
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="tabs for">
          <Tab label="Sections" {...a11yProps(0)} />
          <Tab label="Commneds" {...a11yProps(1)} />
          <Tab label="Comminity" {...a11yProps(1)} />
          <Tab label="Detail" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {book.sections.map((section, index) => (
          <SectionItem
            key={section.id}
            section={section}
            index={index}
            userProgresses={book.userProgresses}
          />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Item 4
      </CustomTabPanel>
    </Box>
  );
}
const SectionItem = ({ section, index, userProgresses }) => {
  const status = getSectionStatus(section.id, userProgresses);

  const sectionStyle = {
    backgroundColor:
      status === "completed"
        ? "#f0fff0"
        : status === "inProgress"
        ? "#e0f7fa"
        : "#f0f0f0",
    color: status === "completed" ? "gray" : "black",
    opacity: status === "completed" ? 0.6 : 0.8,
  };

  return (
    <Box
      className="section-item"
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        marginTop:"10px",
        backgroundColor: sectionStyle.backgroundColor,
        borderRadius: "8px",
        color: sectionStyle.color,
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
        opacity: sectionStyle.opacity,
      }}
    >
      {/* Sol taraf: Section ismi ve yazar */}
      <Box sx={{ display: "flex", alignItems: "center", width: "80%" }}>
        <Typography sx={{ width: "auto", flexShrink: 0, fontWeight: "bold" }}>
          {`${section.sectionName}`}
        </Typography>
        {section.sectionDesc && (
          <Typography
            sx={{ fontSize: "0.875rem", color: "gray", marginLeft: "8px" }}
          >
            {`${section.sectionDesc}`}
          </Typography>
        )}

        <Typography
          sx={{ fontSize: "0.875rem", color: "gray", marginLeft: "8px" }}
        >
          {`Written by @${section.user.userAppName}`}
        </Typography>
      </Box>

      {/* Sağ taraf: Duruma göre ikon */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {status === "completed" ? <CheckIcon /> : <ChevronRightIcon />}
      </Box>
    </Box>
  );
};

function getSectionStatus(sectionId, userProgresses) {
  const progress = userProgresses.find(
    (progress) => progress.section.id === sectionId
  );
  if (progress) {
    if (progress.isCompleted) {
      return "completed";
    } else {
      return "inProgress";
    }
  } else {
    return "notStarted";
  }
}
