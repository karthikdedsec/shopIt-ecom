import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
