import { Navigate, Route, Routes } from "react-router-dom";
import HeaderOperatore from "./pages/common/HeaderOperatore";
import TaskOperatore from "./pages/operatore/taskOperatore";
import TurniFuturi from "./pages/operatore/turniFuturi";
import Rendicontazione from "./pages/operatore/rendicontazione";

if (!localStorage.getItem('token')) localStorage.setItem('token', 'detelder-preview-demo-token');
if (!localStorage.getItem('idOperatore')) localStorage.setItem('idOperatore', '999999');
localStorage.setItem('ruolo', 'OPERATORE');
if (!localStorage.getItem('operatoreLoggato')) localStorage.setItem('operatoreLoggato', 'Operatore Demo');

export default function App() {
  return (
    <>
      <HeaderOperatore />
      <Routes>
        <Route path="/operator" element={<TaskOperatore />} />
        <Route path="/operator/turniFuturi" element={<TurniFuturi />} />
        <Route path="/operator/rendicontazione" element={<Rendicontazione />} />
        <Route path="*" element={<Navigate to="/operator" replace />} />
      </Routes>
    </>
  );
}
