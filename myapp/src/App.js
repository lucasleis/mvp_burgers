import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSection from "./components/HomeSection";
import OrderPage from "./components/OrderPage"; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


















/*
import React from "react";
// import HelloWorld from "./HelloWorld";
// import MainPage from "./MainPage";
import Header from "./components/Header";
import HomeSection from './components/HomeSection'
import Footer from "./components/Footer";

function App(){
  return (
    <div>
      <Header />
      <HomeSection />
      <Footer />
    </div>
  );

}



export default App;
*/