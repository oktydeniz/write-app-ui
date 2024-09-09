import { getUserContentsByType } from "network/ContentService";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Chip } from "@mui/material";
import Typography from "@mui/material/Typography";
import "assets/style/main.scss";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { truncateText } from "utils/StringUtil";

const ContentsByTypes = () => {
  const { contentType } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setContents([]);
      try {
        const response = await getUserContentsByType(contentType);
        setContents(response.contents);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contentType]);

  const handleCardClick = (name) => {
    navigate(`/content/${name}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>
        {contentType === "shared-with-me" ? "Shared with me" : "My Contents"}
      </h3>
      <ul>
        {contents.length>0 ? <Box className="contents-lists">
              {contents.map((item) => (
                <Card
                  onClick={() => handleCardClick(item.slug)}
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
                        <Typography variant="body2" color="text.secondary">
                          {item.price
                            ? `${item.price} ${item.currency} `
                            : "Free"}
                        </Typography>
                      </Grid>
                      <Typography variant="h6" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {truncateText(item.description, 255)}
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
            </Box> :<p className="no-data-p">You Dont have any Content yet.</p> }
      </ul>
    </div>
  );
};

export default ContentsByTypes;
