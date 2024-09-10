import { fetchSection } from "network/LibraryService";
import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Rating,
  Button,
} from "@mui/material";
import {
  saveCommentSections,
  getSectionComment,
  updateSectionComment,
  deleteCommentSection,
  updateSectionProgress
} from "network/CommentService";
import { getUserCurrentId } from "network/Constant";
import CommentSection from "./CommentSection";

const Section = ({}) => {
  const sectionTitleRef = useRef(null);
  const { sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [userComment, setUserComments] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [openForEdit, setOpenForEdit] = useState(false);
  const [openedCommentForEdit, setOpenedCommentForEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSection(sectionId);
        if (response.success) {
          const data = response.section;
          setSection(data.askedSection);
          setSections(data.section.reverse());
          setUserProgress(data.userProgress);
          setExpandedSection(data.askedSection.id || data.section[0].id);
          setIsOwner(data.askedSection.user.id === getUserCurrentId());
          getSectionCommends(data.askedSection.id);
          setOpenForEdit(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const handleNextSection = () => {
    
    const currentIndex = sections.findIndex((s) => s.id === section.id);
    if (currentIndex !== -1 && currentIndex + 1 < sections.length) {
      const nextSection = sections[currentIndex + 1];
      handleAccordionChange(nextSection.id);
      saveProgress(sections[currentIndex]);
      setTimeout(() => {

        sectionTitleRef.current.scrollTo(0, 0)
      }, 100);
    }
  };

  const saveProgress = async (section) => {
    var data = {
      section: section.id,
      isCompleted:true,
      progressPercentage:100,
    }
    updateSectionProgress(data);
  }
  
  const handlePreviousSection = () => {
    const currentIndex = sections.findIndex((s) => s.id === section.id);
    if (currentIndex > 0) {
      const previousSection = sections[currentIndex - 1];
      handleAccordionChange(previousSection.id);
      setTimeout(() => {
        sectionTitleRef.current.scrollTo(0, 0)
      }, 100); 
    }
  };

  const handleAccordionChange = (id) => {
    setOpenForEdit(false);
    const selectedSection = sections.find((s) => s.id === id);
    if (selectedSection) {
      setSection(selectedSection);
      setExpandedSection(selectedSection.id);
      setComment("");
      setRating(0);
      getSectionCommends(selectedSection.id);
      setIsOwner(selectedSection.user.id === getUserCurrentId());
    }
  };

  const handleSubmitComment = async () => {
    if (comment.trim()) {
      setComment("");
    }
    if (!openForEdit) {
      var data = {
        comment: comment,
        section: section.id,
        rating: rating,
      };
      try {
        const result = await saveCommentSections(data);
        if (result) {
          getSectionCommends(section.id);

        }
      } catch (e) {
        console.error(e);
      }
    } else {
      var data = {
        commentId: openedCommentForEdit,
        rating: rating,
        comment: comment,
        section: section.id,
      };
      try {
        const response = await updateSectionComment(data);
        if (response) {
          getSectionCommends(section.id);
        
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getSectionCommends = async (id) => {
    setComments([]);
    setUserComments(null);
    setComment("");
    setRating(0);
    setOpenForEdit(false);
    try {
      const data = await getSectionComment(id);
      if (data.success) {
        setComments(data.comments);
        setUserComments(data.userComment);
        if (data.userComment) {
          setRating(data.userComment.rating);
          setComment(data.userComment.comment);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (currentComment) => {
    setOpenForEdit(true);
    setRating(currentComment.rating);
    setComment(currentComment.comment);
    setOpenedCommentForEdit(currentComment.id);        
  };

  const handleDelete = async (currentComment) => {
    try {
      const response = await deleteCommentSection(currentComment.id);
      if(response) {
        getSectionCommends(section.id);
      }
    }catch(e) {
      console.log(e);
    }
  };
  
  const isComplete = (id) => {
    const progress = userProgress.find((p) => p.section.id === id);
    return progress ? progress.isCompleted : false;
  };

  const renderAccordionBgColor = (id) => {
    if (expandedSection === id) {
      return "#f0fff0";
    } else if (isComplete(id)) {
      return "#e0f7fa";
    } else {
      return "#f0f0f0";
    }
  };

  if (!section) {
    return <>No Found</>;
  }

  return (
    <Box display="flex" height="100vh" >
      <Box
        width="20%"
        sx={{ overflowY: "auto", borderRight: "1px solid #ddd" }}
      >
        {sections.map((s, i) => (
          <Box
            key={i}
            onClick={() => handleAccordionChange(s.id)}
            sx={{
              padding: "10px",
              marginBottom: "10px",
              marginRight: "10px",
              backgroundColor: renderAccordionBgColor(s.id),
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              opacity: "0.8",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">
              {s.sectionName}
              {s.sectionDesc && (
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ marginLeft: "8px", opacity: 0.7 }}
                >
                  ({s.sectionDesc})
                </Typography>
              )}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box width="80%" p={3} sx={{ overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{section.sectionName}</Typography>
          {section.sectionDesc && (
            <Typography variant="body2" color="textSecondary">
              {section.sectionDesc}
            </Typography>
          )}
        </Box>
        <Box
        ref={sectionTitleRef}
          className="section-content"
          dangerouslySetInnerHTML={{
            __html: section.passage,
          }}
        />
        {((!isOwner && userComment === null) || openForEdit) && (
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

        <CommentSection comments={comments} handleEdit={handleEdit} handleDelete={handleDelete} />
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePreviousSection}
            disabled={sections.findIndex((s) => s.id === section.id) === 0}
          >
            Önceki Bölüme Git
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleNextSection}
            disabled={
              sections.findIndex((s) => s.id === section.id) ===
              sections.length - 1
            }
          >
            Sonraki Bölüme Geç
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Section;
