import { Navigate, Route, Routes } from "react-router-dom";
import  AICreation  from "./pages/ai-creation";

function App() {
  return (
    <Routes>
      <Route element={<AICreation />} path="/" />
      <Route element={<AICreation />} path="/aiCreate" />
      <Route element={<Navigate replace to="/ai-creation" />} path="*" />
    </Routes>
  );
}

export default App;
