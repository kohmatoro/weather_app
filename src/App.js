import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Weather from "./pages/Weather.jsx";

export default function App() {
  return (
    <BrowserRouter basename="/">
      <header style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            marginRight: "12px",
            color: isActive ? "dodgerblue" : "black",
          })}
        >
          Weather
        </NavLink>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          {/* 기본경로에서도 Weather 렌더링 */}
          <Route path="/" element={<Weather />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="*" element={<p>404 - Page Not Found</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
