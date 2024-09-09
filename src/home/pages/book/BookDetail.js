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
  TextField,
  Button,
  Tabs,
  Chip,
  IconButton,
  Tab,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { updateBookmarkInfo } from "network/ContentService";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";
import {
  fetchBookComments,
  updateBookComment,
  deleteBookSection,
  saveBookSections,
} from "network/CommentService";
import { getUserCurrentId } from "network/Constant";

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
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [openForEdit, setOpenForEdit] = useState(false);
  const [openedCommentForEdit, setOpenedCommentForEdit] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onClickedSectionItem = (currentSection) => {
    navigate(
      `/home/${book.createdBy.userAppName}/${book.slug}/${currentSection.id}`
    );
  };

  const handleDelete = async (item) => {
    try {
      const response = await deleteBookSection(item.id);
      if (response) {
        fetchComments(book.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = (currentComment) => {
    setOpenForEdit(true);
    setRating(currentComment.rating);
    setComment(currentComment.comment);
    setOpenedCommentForEdit(currentComment.id);  
  };

  const fetchComments = async (id) => {
    setRating(0);
    setComment("");
    setOpenForEdit(false);
    try {
      const data = await fetchBookComments(id);
      if (data.success) {
        setComments(data.comments);
        setUserComment(data.userComment);
        setRating(data.userComment.rating);
        setComment(data.userComment.comment);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useState(() => {
    fetchComments(book.id);
  }, []);

  const handleSubmitComment = async () => {
    if (comment.trim()) {
      setComment("");
    }

    if (!openForEdit) {
      var data = {
        comment: comment,
        section: book.id,
        rating: rating,
      };
      try {
        const result = await saveBookSections(data);
        if (result) {
          fetchComments(book.id);

        }
      } catch (e) {
        console.error(e);
      }
    } else {
      var data = {
        commentId: openedCommentForEdit,
        rating: rating,
        comment: comment,
        section: book.id,
      };
      try {
        const response = await updateBookComment(data);
        if (response) {
          fetchComments(book.id);
        
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", margin: "10px" }}>
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="tabs for">
          <Tab label="Sections" {...a11yProps(0)} />
          <Tab label="Commneds" {...a11yProps(1)} />
          <Tab label="Comminity" {...a11yProps(1)} />
          {/*<Tab label="Detail" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {book.sections.map((section, index) => (
          <SectionItem
            key={section.id}
            section={section}
            onClickedAction={onClickedSectionItem}
            index={index}
            userProgresses={book.userProgresses}
          />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {((book.createdBy.id != getUserCurrentId() && userComment === null) || openForEdit)&& (
          <Box mt={4}>
            {" "}
            <Rating
              sx={{ marginTop: "2px" }}
              name="section-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <Box mt={1}>
              <TextField
                label="Yorumunuzu yazın"
                fullWidth
                multiline
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmitComment}
              >
                Yorum Yap
              </Button>
            </Box>
          </Box>
        )}
        <Box mt={4}></Box>
        <CommentSection
          comments={comments}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
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
const SectionItem = ({ section, index, userProgresses, onClickedAction }) => {
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
      onClick={() => onClickedAction(section)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        marginTop: "10px",
        backgroundColor: sectionStyle.backgroundColor,
        borderRadius: "8px",
        color: sectionStyle.color,
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
        opacity: sectionStyle.opacity,
      }}
    >
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
