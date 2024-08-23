import { getUsers,handleInvite } from 'network/UserService';
import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import { getUserId } from 'network/Constant';


const Authors = ({content}) => {
  const [query, setQuery] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (query.length >= 4) {
        setLoading(true);
        try {
          const response = await getUsers(query);
          setAuthors(response);
        } catch (error) {
          console.error("Error fetching authors:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setAuthors([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchAuthors();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInviteAction = async (authorId) => {
    
    var data = {
        contentId:content.id,
        invitee:authorId,
        inviter:getUserId()
    }
    console.log(data);
    try {
        const result = await handleInvite(data);
        if (result.success) {
            console.log(result);
        }
      } catch (error) {
        console.error(error);
      }

  };


  return (
    <div>
      <input
        type="text"
        placeholder="Search for authors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <List>
          {authors.map((author) => (
            <AuthorListItem key={author.id} author={author} onInvite={handleInviteAction} />
          ))}
        </List>
    </div>
  );
};

export default Authors;


const AuthorListItem = ({ author, onInvite }) => {
    return (
      <ListItem
        secondaryAction={
          <Button variant="contained" color="primary" onClick={() => onInvite(author.id)}>
            Davet Et
          </Button>
        }
      >
        <ListItemAvatar>
          <Avatar alt={author.userName} src={author.avatarUrl} />
        </ListItemAvatar>
        <ListItemText primary={author.userName} secondary={author.userAppName} />
      </ListItem>
    );
  };
  