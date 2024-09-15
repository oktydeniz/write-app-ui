import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  ThumbUp,
  ThumbUpOutlined,
  PushPin,
  PushPinOutlined,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  saveNewSubject,
  getSubjects,
  replySubject,
  deleteSubject,
  pinComment,
  likeSubject,
  editSubject,
} from "network/CommentService";

const CommunityPanel = ({ userId, book }) => {
  const [createSubject, setCreatedSubject] = useState("");

  const [subjects, setSubjects] = useState([]);

  const handlePinComment = async (commentId) => {
    try {
      await pinComment(commentId);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSubjects = async () => {
    setSubjects([]);
    setCreatedSubject("");

    try {
      const response = await getSubjects(book.id);
      if (response.success) {
        setSubjects(response.response);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleReplyToComment = async (commentId, replyContent) => {
    var data = {
      commentId,
      replyContent,
      bookId: book.id,
    };
    try {
      const response = await replySubject(data);
      if (response.success) {
        fetchSubjects();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLikeComment = async (commentId) => {
    var data = {
      id: commentId,
    };
    try {
      const response = await likeSubject(data);
      if (response.success) {
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveNewsubject = async () => {
    var data = {
      bookId: book.id,
      content: createSubject,
    };
    try {
      const response = await saveNewSubject(data);
      if (response.success) {
        fetchSubjects();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await deleteSubject(id);
      if (response.success) {
        fetchSubjects();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async (id, content) => {
    console.log(`Replying to comment ${id}: ${content}`);
    var data = {
      bookId: id,
      content,
    };
    try {
      const response = await editSubject(data);
      if (response.success) {
        fetchSubjects();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Card sx={{ mb: 2, pl: 4, pr: 4 }}>
        <br />
        <Box>
          <br />
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            label="Star a subject"
            value={createSubject}
            onChange={(e) => setCreatedSubject(e.target.value)}
          />
          <Button
            onClick={handleSaveNewsubject}
            sx={{
              height: "43px",
              width: "62px",
              margin: "12px",
              backgroundColor: "blue",
              color: "white",
              ":hover": {
                color: "black",
              },
            }}
          >
            Send
          </Button>
          <br />
        </Box>
        <br />
      </Card>
      <br />
      {subjects.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          userId={userId}
          user={comment.createdBy}
          bookAuthorId={book.createdBy.id}
          onPin={handlePinComment}
          onReply={handleReplyToComment}
          onLike={handleLikeComment}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </Box>
  );
};

export default CommunityPanel;

const Comment = ({
  comment,
  userId,
  bookAuthorId,
  onPin,
  onReply,
  onLike,
  user,
  onDelete,
  onEdit,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [pin, setPin] = useState(comment.pinned);
  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [like, setLike] = useState(
    !!comment.likes.find((l) => l.createdBy.id === userId)
  );
  const [editMode, setEditMode] = useState(null);

  const handleReply = () => {
    if (replyContent.trim() !== "") {
      onReply(comment.id, replyContent);
      setReplyContent("");
    }
  };

  const chanceLikeStatus = (id) => {
    if (like) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLike(!like);
    onLike(id);
  };

  const changePin = (id) => {
    setPin(!pin);
    onPin(id);
  };

  return (
    <Card sx={{ mb: 2, pl: comment.parentComment ? 4 : 0 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <ListItemAvatar>
              <Avatar alt={user.userName} src={user.avatarUrl} />
            </ListItemAvatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">{user.userName}</Typography>
              <Typography variant="body2" color="textSecondary">
                @{user.userAppName}
              </Typography>
            </Box>
          </Box>

          {userId === user.id && (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
              {comment.editable && (
                <IconButton onClick={() => setEditMode(comment.content)}>
                  <Edit />
                </IconButton>
              )}
              <IconButton onClick={() => onDelete(comment.id)}>
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>

        {editMode ? (
          <Box>
            <br />
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              label="Update Content..."
              value={editMode}
              onChange={(e) => setEditMode(e.target.value)}
            />
            <Button
              onClick={() => onEdit(comment.id, editMode)}
              sx={{
                height: "43px",
                width: "62px",
                margin: "12px",
                backgroundColor: "blue",
                color: "white",
                ":hover": {
                  color: "black",
                },
              }}
            >
              Update
            </Button>
            <br />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {comment.content}
          </Typography>
        )}

        {userId !== user.id && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <IconButton onClick={() => chanceLikeStatus(comment.id)}>
              {like ? <ThumbUp /> : <ThumbUpOutlined />}
            </IconButton>
            <Typography variant="body2">{likeCount} Likes</Typography>
            {userId === bookAuthorId && (
              <IconButton onClick={() => changePin(comment.id)}>
                {pin ? <PushPin /> : <PushPinOutlined />}
              </IconButton>
            )}
          </Box>
        )}

        {replyContent !== undefined && userId !== user.id && (
          <Box mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleReply}>
              Reply
            </Button>
          </Box>
        )}
      </CardContent>

      {comment.replies && comment.replies.length > 0 && (
        <List>
          {comment.replies.map((reply) => (
            <ListItem key={reply.id}>
              <ListItemText
                primary={
                  <Comment
                    comment={reply}
                    user={reply.createdBy}
                    userId={userId}
                    bookAuthorId={bookAuthorId}
                    onPin={onPin}
                    onReply={onReply}
                    onLike={onLike}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};
