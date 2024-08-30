import React, { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { sendGETRequestWithToken } from "network/PublicService";
import { Input, Box } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { PUBLIC_URL } from "network/Constant";
import { getSubGenres, saveNewContentData } from "network/ContentService";
import { useNavigate } from "react-router-dom";
import { convertToNumber } from "utils/StringUtil";
import { currencies, languages } from "utils/data";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [priceInput, setPriceInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedCurrent, setSelectedCurrent] = useState(currencies[0].value);
  const [errorText, setErrorText] = useState(null);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handlePriceInput = (event) => {
    setPriceInput(event.target.value);
  };

  const handleAbout = (event) => {
    setAbout(event.target.value);
  };

  const handleCurrency = (data) => {
    setSelectedCurrent(data.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorText("You need to add a Cover İmage");
      return;
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(PUBLIC_URL + "/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      var filePath = data.filePath;
      await fetch(PUBLIC_URL + "/v1/files/saveFilePath", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: data.filePath }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
    saveContent(filePath);
  };

  const saveContent = async (file) => {
    setErrorText(null);
    var data = {
      name: name,
      coverUrl: file,
      about: about,
      price: convertToNumber(priceInput),
      currency: selectedCurrent,
      contentTypeId: selectedValue,
      tags: selectedTags,
      isFree: isChecked,
      language: selectedLanguage,
    };
    try {
      const result = await saveNewContentData("/content", data);
      if (result.success) {
        setOpen(false);
        navigate("/contents");
      } else {
        setErrorText(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await sendGETRequestWithToken("/v1/public/genres-type");
        if (result.success) {
          setContents(result.response);
          if (result.response.length > 0) {
            setSelectedValue(result.response[0].id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const fetchTagData = async (id) => {
    setTags([]);
    setSelectedTags([]);
    try {
      const result = await getSubGenres(id);
      if (result.success) {
        setTags(result.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeForGenre = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    fetchTagData(selectedOption.value);
  };
  const handleChangeForTags = (selectedOption) => {
    setSelectedTags(selectedOption.map((item) => item.value));
  };

  const handleChangeForLanguage = (value) => {
    if(value){
      setSelectedLanguage(value.value);
    }else {
      setSelectedLanguage("EN");
    }
  };

  return (
    <div>
      <Fab
        className="floating-btn"
        onClick={handleClickOpen}
        size="small"
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Context Cover
            </Typography>
            <Button autoFocus color="inherit" onClick={handleUpload}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <div className="create-content">
          <Box className="select-img-container" sx={{ padding: 2 }}>
            <Input
              accept="image/*"
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {imageSrc && (
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  overflow: "hidden",
                  maxWidth: 250,
                  borderRadius: "12px",
                  maxHeight: 450,
                }}
              >
                <img
                  src={imageSrc}
                  alt="Selected"
                  style={{ width: "100%", height: "250px" }}
                />
              </Box>
            )}
            <label htmlFor="file-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<AttachFileIcon />}
              >
                Select Image
              </Button>
            </label>
          </Box>
          <div className="content-names-container">
            {errorText != null && (
              <Typography variant="body2" color="red" sx={{fontSize:'15px', margin:'10px'}}>
                {errorText}
              </Typography>
            )}
            <TextField
              className="name"
              onChange={handleName}
              fullWidth
              value={name}
              label="Name"
              id="name"
            />
            <TextField
              id="about"
              label="About"
              multiline
              fullWidth
              value={about}
              onChange={handleAbout}
              rows={6}
            />
            <FormGroup>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "justify-start",
                  padding: "10px",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch checked={isChecked} onChange={handleSwitchChange} />
                  }
                  label="Free"
                />
                {!isChecked && (
                  <>
                    <TextField
                      onChange={handlePriceInput}
                      value={priceInput}
                      label="Price"
                      variant="outlined"
                      sx={{
                        width: "200px",
                        marginRight: "10px",
                      }}
                    />
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={currencies[0]}
                      isClearable={true}
                      isSearchable={true}
                      onChange={handleCurrency}
                      options={currencies}
                      name="currency"
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
                  </>
                )}
              </Box>
            </FormGroup>
          </div>
        </div>
        <div className="selects">
          <div className="select-item">
            <div className="item-span">Category</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={contents[0]}
              isClearable={true}
              isSearchable={true}
              onChange={handleChangeForGenre}
              options={contents}
              name=".contents"
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
          </div>
          <br />
          {tags.length > 0 && (
            <div className="select-item">
              <div className="item-span">Tags</div>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isMulti
                isSearchable={true}
                closeMenuOnSelect={false}
                onChange={handleChangeForTags}
                options={tags}
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
            </div>
          )}
          <br />
          <div className="select-item">
            <div className="item-span">Language</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={languages[0]}
              isClearable={true}
              isSearchable={true}
              onChange={handleChangeForLanguage}
              options={languages}
              name=".contents"
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
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Home;
