import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LocalDisplay from "./component/LocalDisplay";
import RemoteDisplay from "./component/RemoteDisplay";
import ShareScreen from "./component/ShareScreen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LocalDisplay />} />
        <Route path="/share" element={<ShareScreen />} />
        <Route path="/display/:roomID" element={<RemoteDisplay />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
