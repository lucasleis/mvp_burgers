import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSection from "./components/HomeSection";
import OrderPage from "./components/OrderPage"; 
import OrderConfirmationPage from "./components/OrderConfirmationPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/confirmar" element={<OrderConfirmationPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

