import React, { useState, useEffect } from "react";
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
import {
  getSubGenres,
  saveNewContentData,
  getCopyrights,
} from "network/ContentService";
import { useNavigate } from "react-router-dom";
import { convertToNumber } from "utils/StringUtil";
import { currencies, languages, getCopyrightDesc } from "utils/data";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateBook = ({ createOpen, handleClose }) => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [about, setAbout] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [priceInput, setPriceInput] = useState("");
  const [copyright, setCopyright] = useState();
  const [copyrightDesc, setCopyrightDesc] = useState();
  const [copyrightList, setCopyrightList] = useState();
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
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(PUBLIC_URL + "/v1/files/upload-native", {
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
      //isFree: isChecked,
      isFree: true,
      language: selectedLanguage,
      copyright: copyright,
    };
    setErrorText(null);
    if (name === "" || name == null) {
      setErrorText("Please Check Name İnput");
      return;
    } else if (selectedValue == null) {
      setErrorText("Please Check Category İnput");
      return;
    } else if (copyright === "Select") {
      setErrorText("Please Chose a Copyrigth");
      return;
    } else if (copyright === "Select") {
      setErrorText("Please Chose a Copyrigth");
      return;
    } else if (tags.length < 1) {
      setErrorText("Please Chose Tags");
      return;
    } else if (selectedLanguage == null || selectedLanguage.value === "NULL") {
      setErrorText("Please Chose a Language");
      return;
    } else if (about === "" || about == null) {
      setErrorText("Please Check About İnput");
      return;
    }

    try {
      const result = await saveNewContentData("/content", data);
      if (result.success) {
        handleClose();
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
        const result = await sendGETRequestWithToken(
          "/v1/public/genres-type/books"
        );
        if (result.success) {
          setContents(result.response);
          if (result.response.length > 0) {
            setSelectedValue(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    getCopyright();
  }, []);

  const getCopyright = async () => {
    setCopyright([]);
    try {
      const result = await getCopyrights();
      if (result.success) {
        setCopyrightList(result.copyrights);
        setCopyright("Select");
        setCopyrightDesc(null);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChangeForCopyright = (selectedOption) => {
    setCopyright(selectedOption.value);
    setCopyrightDesc(getCopyrightDesc(selectedOption.value));
  };
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
    if (selectedOption && selectedOption.value) {
      setSelectedValue(selectedOption.value);
      fetchTagData(selectedOption.value);
    } else {
      setSelectedTags([]);
      setTags([]);
    }
  };

  const handleChangeForTags = (selectedOption) => {
    setSelectedTags(selectedOption.map((item) => item.value));
  };

  const handleChangeForLanguage = (value) => {
    if (value) {
      setSelectedLanguage(value.value);
    } else {
      setSelectedLanguage("EN");
    }
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={createOpen}
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
              <Typography
                variant="body2"
                color="red"
                sx={{ fontSize: "15px", margin: "10px" }}
              >
                {errorText}
              </Typography>
            )}
            <TextField
              className="name"
              onChange={handleName}
              fullWidth
              required
              value={name}
              label="Name"
              id="name"
            />
            <TextField
              id="about"
              label="About"
              multiline
              fullWidth
              required
              value={about}
              onChange={handleAbout}
              rows={6}
            />
            {
              /*
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
               */
            }
          </div>
        </div>
        <div className="selects">
          <div className="select-item">
            <div className="item-span">Category</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={{ value: -22, label: "Select" }}
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
          <br />
          <div className="select-item">
            <div className="item-span">Copyright</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={copyright}
              isSearchable={true}
              onChange={handleChangeForCopyright}
              options={copyrightList}
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
          {copyrightDesc && (
            <div className="item-span desc-text"> {copyrightDesc}</div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CreateBook;
