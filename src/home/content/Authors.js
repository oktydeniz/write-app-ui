import { getUsers, handleInvite } from "network/UserService";
import React, { useState, useEffect } from "react";
import { List } from "@mui/material";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import { getUserId } from "network/Constant";
import { ArrowForwardIos } from "@mui/icons-material";
import { getAuthors } from "network/ContentService";

const Authors = ({ content }) => {
  const [query, setQuery] = useState("");
  const [authors, setAuthors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length >= 4) {
        setLoading(true);
        try {
          const response = await getUsers(query);
          setUsers(response);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
      }
    };
    fetchAuthors()
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(()=>{
    
  },[]);

  const fetchAuthors = async () => {
    try {
      const response = await getAuthors(content.id);
      setAuthors(response);
    } catch (error) {
      console.error("Error fetching Authors:", error);
    }
  };

  const handleInviteAction = async (userId) => {
    var data = {
      contentId: content.id,
      invitee: userId,
      inviter: getUserId(),
    };
    try {
      const result = await handleInvite(data);
      if (result.success) {
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
        {users.map((user) => (
          <AuthorListItem
            key={user.id}
            user={user}
            onInvite={handleInviteAction}
          />
        ))}
      </List>
      <div>
        <h4>Authors</h4>
        <AuthorList authors={authors} />
      </div>
    </div>
  );
};

export default Authors;

const AuthorListItem = ({ user, onInvite }) => {
  return (
    <ListItem
      secondaryAction={
        <Button
          variant="contained"
          color="primary"
          onClick={() => onInvite(user.id)}
        >
          Davet Et
        </Button>
      }
    >
      <ListItemAvatar>
        <Avatar alt={user.userName} src={user.avatarUrl} />
      </ListItemAvatar>
      <ListItemText primary={user.userName} secondary={user.userAppName} />
    </ListItem>
  );
};

const AuthorList = ({ authors }) => {
  const localUserId = Number(localStorage.getItem("userId"));
  const sortedAuthors = authors.sort((a, b) => a.role - b.role);
  return (
    <List>
      {sortedAuthors.map((author) => (
        <ListItem key={author.user.id}  sx={{
          backgroundColor: author.role === 'OWNER' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
          borderRadius: 1, 
        }}>
          <ListItemAvatar>
            <Avatar src={author.user.userAvatar} alt={author.user.userName} />
          </ListItemAvatar>
          <ListItemText
            primary={localUserId === author.user.id ? (author.role === 'WRITER' ? "My Profile" : `My Profile (OWNER)`) : (author.role === 'WRITER' ? author.user.userName : `${author.user.userName} (OWNER)`)}
            secondary={`@${author.user.userAppName}`}
          />
          <IconButton
            edge="end"
            onClick={() =>
              (window.location.href = `/author/${author.user.userAppName}`)
            }
            aria-label="Visit profile"
          >
            <ArrowForwardIos />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};
