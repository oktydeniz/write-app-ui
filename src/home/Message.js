import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Send, EmojiEmotions, AttachFile } from "@mui/icons-material";
import {
  getUserConversation,
  createNewConversation,
  findConversations,
  getMessageByConversation,
} from "network/MessageService";
import EmojiPicker from "emoji-picker-react";
import { getUsersByMessageStatus } from "network/UserService";
import { getUserId } from "network/Constant";

const Message = () => {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(Number(getUserId()));
  const [prevMessageCount, setPrevMessageCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getConversation = async () => {
    try {
      const result = await getUserConversation();
      if (result.success) {
        setConversation(result.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length >= 4) {
        try {
          const response = await getUsersByMessageStatus(query);
          setUsers(response);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    getConversation();
  }, []);

  /*
  useEffect(() => {
    let intervalId;

    if (selectedConversation != null) {
      intervalId = setInterval(() => {
        selectedConversationHandler(selectedConversation);
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [selectedConversation]);

  
  useEffect(() => {
    if (messages.length > prevMessageCount) {
     // scrollToBottom();
    }
    setPrevMessageCount(messages.length);
  }, [messages]);
  */
  useEffect(() => {
   scrollToBottom();
  }, [messages]);

  const handleSelectUser = (user) => {
    createConversation(user.id);
  };

  const handleSendMessage = async () => {
    var data = {
      textContent: newMessage,
      conversation: selectedConversation,
    };
    try {
      const result = await getMessageByConversation(data);
      if (result.success) {
        setMessages(result.response);
      }
    } catch (e) {
      console.error(e);
    }
    if (newMessage || file) {
      setNewMessage("");
      setFile(null);
    }
  };

  const createConversation = async (user) => {
    var data = {
      me: getUserId(),
      userId: user,
      name: "",
    };
    try {
      const result = await createNewConversation(data);
      if (result.success) {
        setSelectedConversation(result.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const selectedConversationHandler = async (id) => {
    var selected = id ? id : selectedConversation;
    setMessages([]);
    try {
      const result = await findConversations(selected);
      if (result.success) {
        setSelectedConversation(selected);
        setMessages(result.response);
        scrollToBottom();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box display="flex" height="calc(100vh - 100px);">
      <Box
        width="30%"
        borderRight="1px solid #ddd"
        padding="16px"
        display="flex"
        flexDirection="column"
      >
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          variant="outlined"
          fullWidth
        />
        {users.length > 0 && (
          <List>
            {users.map((user) => (
              <ListItem
                button
                key={user.id}
                onClick={() => handleSelectUser(user)}
              >
                <ListItemText primary={user.userName} />
              </ListItem>
            ))}
          </List>
        )}
        {conversation.length > 0 ? (
          <List>
            {conversation.map((item) => (
              <ListItem
                button
                key={item.id}
                onClick={() => {
                  setSelectedConversation(item);
                  selectedConversationHandler(item.id);
                }}
                sx={{
                  backgroundColor:
                    selectedConversation === item.id
                      ? "#f0f0f0"
                      : "transparent",
                }}
              >
                <ListItemText
                  primary={item.conversationName || item.user2.userName}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box>No conversations available</Box>
        )}
      </Box>
      {selectedConversation ? (
        <Box flexGrow="1" display="flex" flexDirection="column" padding="16px">
          <Box flexGrow="1" overflow="auto">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => {
                const isCurrentUser = message.sender.id === currentUser;
                return (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection={isCurrentUser ? "row-reverse" : "row"}
                    alignItems="center"
                    marginBottom="8px"
                  >
                    {!isCurrentUser && (
                      <Avatar
                        src={message.sender.avatarUrl}
                        alt={message.sender.userName}
                        style={{ marginRight: isCurrentUser ? "0" : "8px" }}
                      />
                    )}
                    <Box
                      padding="10px"
                      borderRadius="10px"
                      backgroundColor={isCurrentUser ? "#DCF8C6" : "#E5E5EA"}
                      maxWidth="60%"
                    >
                      <Typography variant="body2" color="textSecondary">
                        {message.sender.userName}
                      </Typography>
                      <Typography variant="body1">{message.content}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(message.createdTime).toLocaleString()}
                      </Typography>
                      {message.isRead && isCurrentUser && (
                        <CheckIcon
                          style={{ marginLeft: "5px", color: "blue" }}
                        />
                      )}
                    </Box>
                    <div ref={messagesEndRef} />
                  </Box>
                );
              })
            ) : (
              <Box>Start New Conversation!</Box>
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            borderTop="1px solid #ddd"
            padding="8px"
          >
            <IconButton component="label">
              <AttachFile />
              <input type="file" hidden onChange={handleFileChange} />
            </IconButton>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              variant="outlined"
              fullWidth
            />
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotions />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <Box position="absolute" bottom="80px" left="16px">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default Message;
