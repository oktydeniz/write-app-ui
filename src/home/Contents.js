import { getMyContents } from "network/ContentService";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Chip, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import "assets/style/main.scss";
import { useNavigate } from "react-router-dom";
import { truncateText } from "utils/StringUtil";

const Contents = () => {
  const [contents, setContents] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMyContents();
        if (result.success) {
          setSharedWithMe(result.sharedWithMe);
          setContents(result.contents);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (name) => {
    navigate(`/content/${name}`);
  };
  const showAll = (type) => {
    var section = type === 0 ? "my-contents" : "shared-with-me";
    navigate(`/contents/${section}`);
  };

  return (
    <>
      <div className="contents-container">
        {contents.length > 0 ? (
          <>
            <span>My Contents</span>
            <span onClick={() => showAll(0)} className="show-all">
              Show All
            </span>
          </>
        ) : null}
        <Box className="contents-lists">
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
                      {item.price ? `${item.price} ${item.currency} ` : "Free"}
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
        </Box>
      </div>
      <br />
      <div className="contents-container">
        {sharedWithMe.length > 0 ? (
          <>
            <span>Shared With Me</span>
            <span onClick={() => showAll(1)} className="show-all">
              Show All
            </span>
          </>
        ) : null}
        <Box className="contents-lists">
          {sharedWithMe.map((item) => (
            <Card
              onClick={() => handleCardClick(item.slug)}
              key={item.slug}
              className="content-card"
              sx={{
                display: "flex",
                maxWidth: 450,
                margin: "10px",
                height: "250px;",
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
                      {`${item.genre.name} - ${item.clickedCount} clicks`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price ? `${item.price} ${item.currency} ` : "Free"}
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
        </Box>
      </div>
    </>
  );
};

export default Contents;
