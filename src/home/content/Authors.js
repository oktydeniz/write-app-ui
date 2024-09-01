import { getUsers, handleInvite } from "network/UserService";
import React, { useState, useEffect } from "react";
import { List } from "@mui/material";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import Select from "react-select";
import { getUserId } from "network/Constant";
import { ArrowForwardIos, Delete } from "@mui/icons-material";
import {
  getAuthors,
  changeAuthorPerm,
  deleteAuthorPerm,
} from "network/ContentService";
import { selectOptionsForAuthorType } from "utils/data";

const localUserId = Number(localStorage.getItem("userId"));

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
    fetchAuthors();
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const isAdmin = () => {
    return content.createdBy.id === localUserId;
  };

  const fetchAuthors = async () => {
    try {
      const response = await getAuthors(content.id);
      setAuthors(response);
    } catch (error) {
      console.error("Error fetching Authors:", error);
    }
  };

  const handleDelete = async (id) => {
    var data = {
      userId: id,
      content: content.id,
    };
    try {
      const result = await deleteAuthorPerm(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeForAuthorPerm = async (selectedOption, id) => {
    var data = {
      userId: id,
      permissionLevel: selectedOption.value,
      content: content.id,
    };

    try {
      const result = await changeAuthorPerm(data);
    } catch (error) {
      console.error(error);
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
      setQuery("");
      setUsers([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {Number(getUserId()) === content.createdBy.id && (
        <Box>
          <input
            className="searc-input"
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
        </Box>
      )}
      <h4>Authors</h4>
      <div className="author-list">
        <AuthorList
          authors={authors}
          handleDelete={handleDelete}
          isAdmin={isAdmin()}
          handleChangeForAuthorPerm={handleChangeForAuthorPerm}
        />
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
      <ListItemText
        primary={user.userName}
        secondary={`@${user.userAppName}`}
      />
    </ListItem>
  );
};

const AuthorList = ({
  authors,
  handleDelete,
  isAdmin,
  handleChangeForAuthorPerm,
}) => {
  const sortedAuthors = authors.sort((a, b) => a.role - b.role);

  return (
    <List>
      {sortedAuthors.map((author) => (
        <ListItem
          key={author.user.id}
          sx={{
            backgroundColor:
              author.role === "OWNER" ? "rgba(0, 0, 0, 0.1)" : "inherit",
            borderRadius: 1,
          }}
        >
          {isAdmin && localUserId != author.user.id && (
            <ListItemIcon
              sx={{
                justifyContent: "center",
                minWidth: "auto",
                marginRight: 2,
              }}
            >
              <IconButton
                edge="start"
                aria-label="delete"
                onClick={() => handleDelete(author.user.id)}
              >
                <Delete />
              </IconButton>
            </ListItemIcon>
          )}

          <ListItemAvatar>
            <Avatar src={author.user.userAvatar} alt={author.user.userName} />
          </ListItemAvatar>
          <ListItemText
            primary={
              localUserId === author.user.id
                ? author.role === "WRITER" || author.role === "VIEWER"
                  ? "My Profile"
                  : `My Profile (OWNER)`
                : author.role === "WRITER" || author.role === "VIEWER"
                ? author.user.userName
                : `${author.user.userName} (OWNER)`
            }
            secondary={`@${author.user.userAppName}`}
          />
          {isAdmin && localUserId != author.user.id && (
            <Select
              className="basic-single"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              onChange={(selectedOption) =>
                handleChangeForAuthorPerm(selectedOption, author.user.id)
              }
              defaultValue={selectOptionsForAuthorType.find(
                (type) => type.role === author.role
              )}
              options={selectOptionsForAuthorType}
              name="tags"
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: "55px",
                  minHeight: "55px",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  height: "55px",
                  display: "flex",
                  alignItems: "center",
                }),
              }}
            />
          )}

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
