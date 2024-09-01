import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  updateContentStatus,
  deleteContent,
  getCopyrights,
} from "network/ContentService";
import { useNavigate } from "react-router-dom";
import { getCopyrightDesc } from "utils/data";
import Select from "react-select";
import { editCopyrightData } from "network/AppService";

const ContentMoreOptions = ({ content }) => {
  const [isPublished, setIsPublished] = useState(content.isPublished);
  const [copyright, setCopyright] = useState();
  const [copyrightDesc, setCopyrightDesc] = useState();
  const [copyrightList, setCopyrightList] = useState();

  const navigate = useNavigate();

  const updateStatus = async () => {
    var data = {
      content: content.id,
      isPublished: !isPublished,
    };
    setIsPublished(!isPublished);
    try {
      const result = await updateContentStatus(data);
      if (result.success) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCopyright();
  }, []);

  const deleteAction = async () => {
    var data = {
      id: content.id,
    };
    try {
      const result = await deleteContent(data);
      if (result.success) {
        navigate("/contents");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCopyright = async () => {
    try {
      const result = await getCopyrights();
      if (result.success) {
        setCopyrightList(result.copyrights);
        const selectedCopyright = result.copyrights.find(
          (copyright) => content.copyright.value === copyright.value
        );
        setCopyright(selectedCopyright);
        setCopyrightDesc(getCopyrightDesc(selectedCopyright.value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeCopyright =async (selectedOption) => {
    setCopyright(selectedOption);
    setCopyrightDesc(getCopyrightDesc(selectedOption.value));
    var data = {
      content:content.id,
      value: selectedOption.value,
    }
    try {
      const result = await editCopyrightData(data);
      if(result.success){

      }else {

      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box sx={{ my: 2, width: "33%" }}>
        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={updateStatus}
              color="primary"
            />
          }
          label="Publish"
          labelPlacement="start"
          sx={{ justifyContent: "space-between", display: "flex" }}
        />
      </Box>
      <div className="select-item">
        <div className="item-span">Copyright</div>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isSearchable={true}
          value={copyright}
          onChange={handleChangeCopyright}
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
      <Box sx={{ my: 3, width: "100%" }}>
        <Button
          variant="contained"
          color="error"
          onClick={deleteAction}
          startIcon={<DeleteIcon />}
          sx={{ width: "100%" }}
        >
          Delete
        </Button>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, textAlign: "center" }}
        >
          This action cannot be undone.
        </Typography>
      </Box>
    </Box>
  );
};

export default ContentMoreOptions;
