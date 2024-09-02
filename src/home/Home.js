import React, {  } from "react";
import Slide from "@mui/material/Slide";
import FloatingButton from "components/FloatingButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
  return (
    <div>
      <FloatingButton />
    </div>
  );
};

export default Home;
