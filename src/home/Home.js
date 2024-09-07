import React, {  } from "react";
import { Box } from "@mui/material";
import "assets/style/main.scss";
import Library from "home/pages/Library";
import Bookshelf from "home/pages/Bookshelf";
import Paper from "home/pages/Paper";
import "assets/style/home.scss";
import FloatingButton from "components/FloatingButton";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Home = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="home-container">
      <Box sx={{ bgcolor: "background.paper", width: 400 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            TabIndicatorProps={{
              style: { display: "none" },
            }}
          >
            <Tab
              label="Library"
              {...a11yProps(0)}
              sx={{
                backgroundColor: "gray",
                borderRadius: "16px",
                mx: 1,
                color: "white",
                height: "30px",
                minHeight: "30px",
                "&.Mui-selected": {
                  backgroundColor: "blue",
                  color: "white",
                },
              }}
            />
            <Tab
              label="Paper"
              {...a11yProps(1)}
              sx={{
                backgroundColor: "gray",
                borderRadius: "16px",
                mx: 1,
                height: "30px",
                minHeight: "30px",
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "blue",
                  color: "white",
                },
              }}
            />
            <Tab
              label="Bookshelf"
              {...a11yProps(2)}
              sx={{
                backgroundColor: "gray",
                borderRadius: "16px",
                height: "30px",
                mx: 1,
                minHeight: "30px",
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "blue",
                  color: "white",
                },
              }}
            />
          </Tabs>
        </AppBar>
      </Box>
      <Box sx={{ width: "100%", padding: "0px" }}>
        <TabPanel
          sx={{ padding: "0px" }}
          value={value}
          index={0}
          dir={theme.direction}
        >
          <Library />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Paper />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Bookshelf />
        </TabPanel>
      </Box>
      <FloatingButton />
    </div>
  );
};

export default Home;