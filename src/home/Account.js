import { getUserCurrentId } from "network/Constant";
import {
  fetchUserInfo,
  updateUserInfo,
  deleteUserInfo,
  deleteUserProgress,
} from "network/UserService";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Switch,
  IconButton,
  Avatar,
  Typography,
  Input,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import "assets/style/profile.scss";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState, useEffect, useRef } from "react";
import { handleUploadNativeFile } from "network/AppService";

const Account = ({}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const fileInputRefBanner = useRef(null);
  const [isEnableMail, setIsEnableMail] = useState(false);
  const [isEnablePhone, setIsEnablePhone] = useState(false);
  const [errors, setErrors] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSrcBanner, setImageSrcBanner] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [formData, setFormData] = useState({
    appUserName: "",
    userName: "",
    mail: "",
    isEnableMail: false,
    isEnablePhone: false,
    avatarUrl: "",
    phoneNumber: "",
    isMessageActivated: false,
    isPrivateUser: false,
    bannerUrl: "",
    birthDate: null,
  });

  const handleAvatarChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBannerChange = () => {
    if (fileInputRefBanner.current) {
      fileInputRefBanner.current.click();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUserInfo();
      if (response.success) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteProgress = async () => {
    try {
      const response = await deleteUserProgress();
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleBannerFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerFile(file);
      setImageSrcBanner(URL.createObjectURL(file));
    }
  };

  const handleDateChange = (name, dateValue) => {
    setFormData({
      ...formData,
      [name]: dateValue ? dateValue.format("YYYY-MM-DD") : "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const val = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: val,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadFiles = async () => {
        const uploadAvatarPromise = avatarFile
          ? new Promise((resolve, reject) =>
              handleUploadNativeFile(avatarFile, resolve, reject)
            )
          : Promise.resolve(null);

        const uploadBannerPromise = bannerFile
          ? new Promise((resolve, reject) =>
              handleUploadNativeFile(bannerFile, resolve, reject)
            )
          : Promise.resolve(null);

        const [avatarUrl, bannerUrl] = await Promise.all([
          uploadAvatarPromise,
          uploadBannerPromise,
        ]);

        const request = {
          appUserName: formData.appUserName,
          userName: formData.userName,
          mail: formData.mail,
          phoneNumber: formData.phoneNumber,
          isMessageActivated: formData.isMessageActivated,
          isPrivateUser: formData.isPrivateUser,
          avatarNew: avatarUrl,
          bannerNew: bannerUrl,
          birthDate: dayjs(formData.birthDate).format("YYYY-MM-DD"),
        };
        sendUpdatedData(request);
      };

      uploadFiles().catch((error) => {
        console.error("Error during file upload or data submission: ", error);
      });
    } catch (error) {
      console.error("Unexpected error: ", error);
    }
  };

  const sendUpdatedData = async (data) => {
    try {
      const response = await updateUserInfo(data);
      if (response.success) {
      } else {
        setErrors("AppName is in Use please try another one!");
      }
    } catch (error) {
      setErrors(error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserInfo(getUserCurrentId());
        const user = response.user;
        const userDataFromBackend = {
          appUserName: user.appUserName,
          userName: user.userName,
          mail: user.mail,
          isEnableMail: user.isEnableMail,
          isEnablePhone: user.isEnablePhone,
          avatarUrl: user.avatarUrl || "https://placehold.jp/150x150.png",
          phoneNumber: user.phoneNumber || "",
          isMessageActivated: user.isMessageActivated,
          isPrivateUser: user.isPrivateUser,
          bannerUrl: user.bannerUrl || null,
          birthDate: user.birthDate,
        };
        setImageSrc(user.avatarUrl);
        setImageSrcBanner(user.bannerUrl);
        setFormData(userDataFromBackend);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box
    sx={{
      width: "100%",
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <Box
      sx={{
        width: "80%",
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box className="banner-area">
        <Box>
          <img
            src={imageSrcBanner}
            alt={formData.appUserName}
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "10px",
              objectFit: "fill",
            }}
          />
          <IconButton
            onClick={handleBannerChange}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <PhotoCameraIcon />
          </IconButton>
          <Input
            accept="image/*"
            type="file"
            inputRef={fileInputRefBanner}
            onChange={handleBannerFileChange}
            style={{ display: "none" }}
          />
        </Box>
        <Box
          sx={{ position: "relative", display: "inline-block" }}
          className="banner-avatar"
        >
          <Avatar src={imageSrc} alt="Avatar" sx={{ width: 82, height: 82 }} />
          <IconButton
            onClick={handleAvatarChange}
            sx={{
              position: "absolute",
              bottom: 4,
              zIndex: 111,
              left: 23,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <PhotoCameraIcon />
          </IconButton>
          <Input
            accept="image/*"
            type="file"
            inputRef={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Box>
      </Box>

      <p id="errors" className="errors">
        {errors ? errors : null}
      </p>
      <TextField
        onChange={handleChange}
        value={formData.userName}
        name="userName"
        label="Name"
        fullWidth
      />
      <br />
      <TextField
        onChange={handleChange}
        value={formData.appUserName}
        name="appUserName"
        label="App Username"
        fullWidth
      />
      <br />
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          onChange={handleChange}
          value={formData.phoneNumber}
          label="Phone Number"
          name="phoneNumber"
          fullWidth
        />
        {formData.isEnablePhone ? (
          <VerifiedUserIcon color="success" />
        ) : (
          <Button
            variant="outlined"
            onClick={() => console.log("Verify Phone")}
          >
            Verify
          </Button>
        )}
      </Stack>
      <br />
      <Stack
        direction="row"
        onChange={handleChange}
        spacing={1}
        alignItems="center"
      >
        <TextField
          value={formData.mail}
          name="mail"
          onChange={handleChange}
          label="Email"
          fullWidth
        />
        {formData.isEnableMail ? (
          <VerifiedUserIcon color="success" />
        ) : (
          <Button variant="outlined" onClick={() => console.log("Verify Mail")}>
            Verify
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          width: "100%",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              name="birthDate"
              label="Birthdate"
              onChange={(newValue) => handleDateChange("birthDate", newValue)}
              value={formData.birthDate ? dayjs(formData.birthDate) : null}
              sx={{ width: "250px" }}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            width: "50%",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            marginTop="15px"
            justifyContent="flex-end"
            width="100%"
          >
            <Typography>Private Account</Typography>
            <Switch
              checked={formData.isPrivateUser}
              name="isPrivateUser"
              onChange={handleChange}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
          >
            <Typography>Send Message</Typography>
            <Switch
              checked={formData.isMessageActivated}
              name="isMessageActivated"
              onChange={handleChange}
            />
          </Stack>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        className="account-btn"
        startIcon={<SaveIcon />}
        onClick={handleSubmit}
      >
        Save
      </Button>

      <Stack direction="column" spacing={1} width="100%">
        <Typography
          variant="body2"
          color="error"
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            textAlign: "center",
          }}
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Typography>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "blue",
            textAlign: "center",
          }}
          onClick={handleDeleteProgress}
        >
          Delete My Progress
        </Typography>
      </Stack>
    </Box>
    </Box>
  );
};

export default Account;
