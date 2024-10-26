import Profile from "home/Profile";
import { getAuthorDetail, followRequest } from "network/UserService";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "assets/style/profile.scss";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Tabs,
  Chip,
  Avatar,
  IconButton,
  Stack,
  Tab,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { getUserCurrentId } from "network/Constant";

const AuthDetail = ({}) => {
  const { user } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [followBtn, setFollowBtn] = useState(false);

  useEffect(() => {
    getAuthor();
  }, []);

  const getAuthor = async () => {
    try {
      const data = await getAuthorDetail(user);
      setUserDetail(data);
      setFollowBtn(data.showFollowBtn)
    } catch (e) {
      console.error(e);
    }
  };

  const sendToFollowRequest = async () => {
    try {
      const type = followBtn ? "unfollow" : "follow";
      setFollowBtn(!followBtn);
      await followRequest(userDetail.author.id, type);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      {userDetail && (
        <Box className="content-author">
          <Box className="imgs-author">
            <img src={userDetail.author.bannerUrl} className="img-banner" />
            <Avatar
              className="author-avatar"
              src={userDetail.author.avatarUrl}
              alt="Avatar"
              sx={{ width: 82, height: 82 }}
            />
          </Box>
          <Box className="author-info">
            <Box>
              <Typography
                sx={{ width: "auto", flexShrink: 0, fontWeight: "bold" }}
              >
                {`${userDetail.author.userName}`}
              </Typography>
              <Typography sx={{ fontSize: "0.875rem" }}>
                {`@${userDetail.author.userAppName}`}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ marginTop: "10px" }}>
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {`${userDetail.followers} Followers`}
                </Typography>
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {`${userDetail.following} Following`}
                </Typography>
              </Stack>
              {userDetail.author.about && (
                <Typography sx={{ fontSize: "0.8rem", marginTop: "10px" }}>
                  {`${userDetail.author.about}`}
                </Typography>
              )}
            </Box>
            {userDetail.author.id !== getUserCurrentId() && (
              <Box
                sx={{
                  marginRight: "10px",
                }}
              >
                <Stack direction="row" spacing={2}>
                  {userDetail.author.isMessageActive && (
                    <IconButton color="primary" aria-label="Mesaj At">
                      <MailOutlineIcon />
                    </IconButton>
                  )}

                  <Button
                    variant="contained"
                    color={followBtn ? "secondary" : "primary"}
                    startIcon={
                        followBtn ? (
                        <PersonRemoveIcon />
                      ) : (
                        <PersonAddIcon />
                      )
                    }
                    onClick={() => sendToFollowRequest()}
                  >
                    {followBtn ? "Unfollow" : "Follow"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default AuthDetail;
