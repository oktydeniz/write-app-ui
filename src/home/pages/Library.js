import { fetchBooks } from "network/LibraryService";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Chip, Box } from "@mui/material";
import "assets/style/main.scss";
import { truncateText } from "utils/StringUtil";
import "assets/style/home.scss";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";


const Library = ({}) => {
    // - my last readed books,  my bookmarks , my reading lists, recomended for me , explore, my-books
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(()=> {
        const fetchData = async() =>{
            const allData = await fetchBooks();
            if(allData.success){
                const data = allData.books;
                setBooks(data);
            }
        }
        fetchData();
    },[])

    function showAllAction(type) {
        console.log(type);
    }

    function cardClicedAction(slug, user){
        navigate(`/home/${user}/${slug}`);
    }

  return <Box>

    {
        books.length>0 && <BookCardItem contents={books} showAllAction={showAllAction} cardClicedAction={cardClicedAction}/>
    }
  </Box>;
}

export default Library;

const BookCardItem = ({ contents, showAllAction, cardClicedAction }) => {
  
  return (
    <div className="contents-container">
      <Box className="contents-lists">
        {contents.map((item) => (
          <Card
            onClick={() => cardClicedAction(item.slug, item.createdBy.userAppName)}
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
  );
};
