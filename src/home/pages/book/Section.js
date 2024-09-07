import { fetchSection } from "network/LibraryService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  Box,
  Typography,
  Menu,
  MenuItem
} from "@mui/material";

const Section = ({}) => {
  const { sectionId } = useParams();

  const [section, setSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  // 
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [highlights, setHighlights] = useState([]);

  const handleContextMenu = (event) => {
    event.preventDefault();

    const selection = window.getSelection().toString().trim(); // Get the selected text
    if (selection) {
      setSelectedText(selection);
      setAnchorEl(event.currentTarget); // Show context menu at the click location
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHighlight = (color) => {
    // Add the selected text to the highlights with the specified color
    setHighlights((prev) => [
      ...prev,
      { text: selectedText, color: color },
    ]);
    handleClose();
  };

  const handleComment = () => {
    // Handle adding a comment to the selected text
    alert(`Add a comment to: ${selectedText}`);
    handleClose();
  };

  const renderPassage = () => {
    //TODO boroken  
    let sanitizedPassage = DOMPurify.sanitize(section.passage);
  
    // Convert sanitized passage to an array of characters for manipulation
    let charArray = sanitizedPassage.split('');
  
    highlights.forEach(({ start, end, color }) => {
      // Wrap the selected text with a span for highlighting
      for (let i = start; i < end; i++) {
        charArray[i] = `<span style="background-color: ${color}">${charArray[i]}</span>`;
      }
    });
  
    // Join characters back to a string
    const highlightedPassage = charArray.join('');
  
    return highlightedPassage;
  };


//
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSection(sectionId);
        if (response.success) {
          const data = response.section;
          setSection(data.askedSection);
          setSections(data.section);
          setUserProgress(data.userProgress);
          setExpandedSection(data.askedSection.id || data.section[0].id);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const handleAccordionChange = (id) => {
    const selectedSection = sections.find((s) => s.id === id);
    if (selectedSection) {
      setSection(selectedSection);
      setExpandedSection(selectedSection.id);
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
    <Box display="flex" height="100vh">
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
        <Box mt={2} onContextMenu={handleContextMenu}>
      <Box
        className="section-content"
        dangerouslySetInnerHTML={{
          __html: renderPassage(),
        }}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleComment}>Add Comment</MenuItem>
        <MenuItem onClick={() => handleHighlight("yellow")}>
          Highlight Yellow
        </MenuItem>
        <MenuItem onClick={() => handleHighlight("green")}>
          Highlight Green
        </MenuItem>
        <MenuItem onClick={() => handleHighlight("blue")}>
          Highlight Blue
        </MenuItem>
        <MenuItem onClick={() => handleHighlight("red")}>
          Highlight Red
        </MenuItem>
      </Menu>
    </Box>
      </Box>
    </Box>
  );
};

export default Section;
