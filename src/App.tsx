import { Navigate, Route, Routes } from "react-router-dom";
import Ranking from "./pages/ranking";

function App() {
  return (
    <Routes>
      <Route element={<Ranking />} path="/" />
      <Route element={<Ranking />} path="/ranking" />
      <Route element={<Navigate replace to="/ranking" />} path="*" />
    </Routes>
  );
}

export default App;
