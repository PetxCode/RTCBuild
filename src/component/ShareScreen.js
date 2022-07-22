import React, { useEffect, useRef } from "react";

const ShareScreen = () => {
  const screenShare = useRef();

  useEffect(() => {
    navigator.mediaDevices.getDisplayMedia();
  }, []);
  return (
    <div>
      <center>
        <div>ShareScreen</div>
      </center>
    </div>
  );
};

export default ShareScreen;
