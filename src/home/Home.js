import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { sendGETRequestWithToken } from 'network/PublicService';
import { Input, Box } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { PUBLIC_URL } from 'network/Constant';
import { Checkbox, ListItemText } from '@mui/material';
import { saveNewContentData } from 'network/ContentService';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {

  const navigate = useNavigate();
  const currencies = [
    {
      value: 0,
      label: 'USD - US Dollar - $',
    },
    {
      value: 2,
      label: 'EUR - Euro - €',
    },
    {
      value: 1,
      label: ' TRY - Turkish Lira - ₺',
    }
  ];

  const [contents, setContents] = useState([]); // Array to store fetched genres
  const [selectedValue, setSelectedValue] = useState(''); // State for the selected value in Select
  const [selectedTagValue, setSelectedTagValue] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const [priceInput, setPriceInput] = useState('');
  const [selectedCurrent, setSelectedCurrent] = useState(currencies[0].value);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleChangeTags = (event) => {
    setSelectedTags(event.target.value);
    handleTagChange(event);
  };

  const handlePriceInput = (event) => {
    setPriceInput(event.target.value);
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleAbout = (event) => {
    setAbout(event.target.value);
  }

  const handleCurrency = (event) => {
    setSelectedCurrent(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTagValue(event.target.value);
  };
  
  const handleName = (event) => {
    setName(event.target.value);
  }

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

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(PUBLIC_URL + '/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('File path:', data.filePath);
      var filePath = data.filePath;
      await fetch(PUBLIC_URL + '/v1/files/saveFilePath', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: data.filePath }),
      });
    } catch (error) {
      console.error('Error:', error);
    }
    saveContent(filePath);
  };

  const convertToNumber = (priceInput) => {
    // Replace commas with periods
    const normalizedInput = priceInput.replace(',', '.');
    // Convert to number
    const price = Number(normalizedInput);
    return isNaN(price) ? null : price;
  };

  const saveContent = async (file) => {
    var data = {
      name: name,
      coverUrl:file,
      about:about,
      price:convertToNumber(priceInput),
      currency:selectedCurrent,
      contentTypeId:selectedValue,
      tags:selectedTagValue,
      isFree:isChecked
    };
    try{
      const result = await saveNewContentData('/content', data);
      if (result.success){
        navigate('/contents');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await sendGETRequestWithToken('/v1/public/genres-type');
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
    const fetchTagData = async () => {
      try {
        const result = await sendGETRequestWithToken('/v1/public/genres-tags');
        if (result.success) {
          setTags(result.response);
         
          if (result.response.length > 0) {
            setSelectedTagValue(result.response[0].id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    fetchTagData();
  }, []);

  return (
    <div>
      <Fab className='floating-btn' onClick={handleClickOpen} size="small" color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
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
            <Button autoFocus color="inherit" onClick={handleClose}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <TextField onChange={handleName} fullWidth value={name} label="Name" id="name" />
        <FormGroup>
          <TextField
            id="outlined-multiline-static"
            label="About"
            multiline
            value={about}
            onChange={handleAbout}
            rows={4}
          />
          <Box sx={{
      display: 'flex',
      justifyContent: 'justify-start',
      padding: '10px',

    }}>
        <FormControlLabel control={<Switch checked={isChecked} onChange={handleSwitchChange} />} label="Free" />
          {!isChecked &&  <> <TextField onChange={handlePriceInput} value={priceInput} label="Price" variant="outlined" sx={{
            width:'200px'
          }}/>
          
          <FormControl>
          <InputLabel id="Currency-select-label">Currency</InputLabel>
          <Select
            labelId="Currency-select-label"
            id="currency-select"
            value={selectedCurrent}
            label="Content Type"
            onChange={handleCurrency}
          >
            {currencies.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </>
          }
        </Box>
      
        </FormGroup>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Content Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedValue}
            label="Content Type"
            onChange={handleChange}
          >
            {contents.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
      <InputLabel id="tags-select-label">Tag</InputLabel>
      <Select
        labelId="tags-select-label"
        id="tags-select"
        multiple
        value={selectedTags}
        onChange={handleChangeTags}
        renderValue={(selected) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {selected.map((value) => {
              const tag = tags.find(tag => tag.id === value);
              return tag ? <Box key={value}>{tag.name}</Box> : null;
            })}
          </Box>
        )}
        sx={{
          maxHeight: 300, // Adjust height of the dropdown
          overflowY: 'auto', // Enable scrolling if content overflows
        }}
      >
        {tags.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Checkbox checked={selectedTags.indexOf(item.id) > -1} />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
        <Box sx={{ padding: 2 }}>
      <Input
        accept="image/*"
        id="file-input"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          component="span"
          startIcon={<AttachFileIcon />}
        >
          Select Image
        </Button>
      </label>
      {imageSrc && (
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid #ddd',
            borderRadius: 1,
            overflow: 'hidden',
            maxWidth: 300,
            maxHeight: 450
          }}
        >
          <img
            src={imageSrc}
            alt="Selected"
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      )}
    </Box>
    <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginTop: 2 }}
      >
        Upload
      </Button>
      </Dialog>
    </div>
  );
};

export default Home;