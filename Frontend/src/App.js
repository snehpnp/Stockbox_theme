import React, { useState, useEffect } from "react";
import Wrapper from "./App/components/Wrapper";
import Login from "./App/Layout/Auth/Login";

const App = () => {


  const Token = localStorage.getItem("Token");

  console.log(Token);
  return (
    <div className="App">
      {Token ? <Wrapper /> : <Login />}
      {/* <Wrapper /> */}
    </div>
  );
};

export default App;
