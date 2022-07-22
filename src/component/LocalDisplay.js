import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const LocalDisplay = () => {
  const navigate = useNavigate();
  const id = uuidv4();
  const changeScreen = () => {
    navigate(`/display/${id}`);
  };
  return (
    <div>
      <center>
        <h1>Local Display</h1>
        <br />
        <br />
        <button onClick={changeScreen}>Create Conversiation</button>
      </center>
    </div>
  );
};

export default LocalDisplay;
