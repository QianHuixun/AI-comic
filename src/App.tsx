import {Navigate, Route, Routes } from "react-router-dom";
import Ranking from "./pages/ranking";
import Home from "./pages/home";
import Category from "./pages/category";

function App() {
  return (
    <Routes>
      <Route element={<Home/>} path="/home"></Route>
      <Route element={<Category/>} path="/category"></Route>
      <Route element={<Ranking />} path="/" />
      <Route element={<Ranking />} path="/ranking" />
      <Route element={<Navigate replace to="/ranking" />} path="*" />
    </Routes>
  );
}

export default App;
