import '../App.css';
import React, { useState } from "react";
import AppRouter from './Router';

function App() {
  const[isLoggedIn, setIsloggedIn] = useState(false);
  return <AppRouter isLoggedIn={isLoggedIn}/>;
}

export default App;
