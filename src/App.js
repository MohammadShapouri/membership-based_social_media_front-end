import React, { useContext, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from './Router';
import { UserProvider } from "./context/UserContext";

import './styles/index.css';
import 'emoji-mart/css/emoji-mart.css'

function App() {
  return (
    <UserProvider>
      <ToastContainer autoClose={2000} closeButton={false} />
      <Router />
    </UserProvider>
  );
}

export default App;
