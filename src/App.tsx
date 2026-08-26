import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./paginas/Inicio";
import Conta from "./paginas/Conta";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/conta" element={<Conta />} />
      </Routes>
    </BrowserRouter>
  );
}
