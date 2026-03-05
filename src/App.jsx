import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Programme from "./pages/Programme";
import Speakers from "./pages/Speakers";
import Sponsors from "./pages/Sponsors";
import Tickets from "./pages/Tickets";
import Resources from "./pages/Resources";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./components/AboutUs";
import AuthSuccess from "./pages/AuthSuccess";

import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programme" element={<Programme />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/on-demand" element={<Resources />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
