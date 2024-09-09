import React from "react";
import { Star, Edit, Delete } from "@mui/icons-material";
import { Box, Typography, Grid, IconButton, Avatar } from "@mui/material";
import { getUserCurrentId } from "network/Constant";

const CommentSection = ({ comments, handleEdit,handleDelete }) => {
  if (comments.length < 1) {
    return <>No Comment Found</>;
  }

  return (
    <Box mt={1}>
      <Typography variant="h5">Yorumlar</Typography>
      {comments.map((c, index) => (
        <Box
          key={index}
          mb={2}
          p={2}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            position: "relative",
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                src={c.user.avatarUrl || "/default-avatar.png"}
                alt={c.user.userName}
                sx={{ width: 48, height: 48 }}
              />
            </Grid>

            <Grid item xs>
              <Typography variant="body1" fontWeight="bold">
                {c.user.userName} ({c.user.userAppName})
              </Typography>

              {c.comment && (
                <Typography variant="body2" color="textSecondary" mt={0.5}>
                  {c.comment}
                </Typography>
              )}

              {c.rating && (
                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" color="textSecondary">
                    Rating:
                  </Typography>
                  <Box ml={1} display="flex" alignItems="center">
                    {Array.from({ length: c.rating }).map((_, i) => (
                      <Star key={i} sx={{ color: "#ffc107" }} />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>

          {c.user.id === getUserCurrentId() && (
            <Box sx={{ display: 'flex', position: 'absolute', top: 8, right: 8 }}>
              <IconButton
                sx={{ marginRight: 1 }}
                onClick={() => handleEdit(c)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                sx={{ color: 'red' }} // Set color to red
                onClick={() => handleDelete(c)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CommentSection;
