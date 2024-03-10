import React from "react";
import Maincomponent from "./Component/Maincomponent";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Maincomponent />
    </BrowserRouter>
  );
};

export default App;
