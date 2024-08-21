import { getContentBySlug, getMyContents } from 'network/ContentService';
import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { Grid, Chip } from '@mui/material';
import Typography from '@mui/material/Typography';
import 'assets/style/main.scss';
import { useNavigate,useParams } from 'react-router-dom';
const ContentDetail = () => {
    const { contentSlug } = useParams();
    const [content,setContent] = useState([]);
    const navigate = useNavigate();
 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await getContentBySlug(contentSlug);
            if (result.success) {
                setContent(result.response);
                console.log(result.response);
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, []);

    return (
        <div className="content-detail">
         <div>
      <h1>Content Detail for {contentSlug}</h1>
      {/* You can fetch and display more data based on the name */}
    </div>
        </div>
    );
  
}

export default ContentDetail;