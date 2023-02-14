import "./App.css";
import { StartPage } from "./pages/StartPage";
import { Route, Routes } from "react-router-dom";
import { ProtectRoutes } from "./utils/ProtectedRouter/protectedRoutes";
import { Vote } from "./pages/VotePage";
import { QR } from "./pages/QRpage";
import { Assembly } from "./pages/GenforsDashboard";
import { CheckIn } from "./pages/CheckIn";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MantineProvider, Text } from "@mantine/core";
import colors from "./utils/theme";
import { Login } from "./pages/LoginPage";
import axios from "axios";
import {HeaderAction} from "./components/Header";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const links = [
    { "link": "/about", "label": "Features" },
    {
      "link": "#1",
      "label": "Learn",
      "links": [
        { "link": "/docs", "label": "Documentation" },
        { "link": "/resources", "label": "Resources" },
        { "link": "/community", "label": "Community" },
        { "link": "/blog", "label": "Blog" }
      ]
    },
    { "link": "/about", "label": "About" },
    { "link": "/pricing", "label": "Pricing" },
    {
      "link": "#2",
      "label": "Support",
      "links": [
        { "link": "/faq", "label": "FAQ" },
        { "link": "/demo", "label": "Book a demo" },
        { "link": "/forums", "label": "Forums" }
      ]
    }
  ]


  return (
    <MantineProvider
      theme={{
        fontFamily: "Poppins, sans-serif",
        colors: colors,
      }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectRoutes />}>
          <Route
            path="/start"
            element={
              <>
                <HeaderAction/>
                <StartPage />
              </>
            }
          />
          <Route
            path="/vote"
            element={
              <>
                <HeaderAction/>
                <Vote />
              </>
            }
          />
          <Route
            path="/QR"
            element={
              <>
                <HeaderAction/>
                <QR />
              </>
            }
          />
          <Route
            path="/assembly"
            element={
              <>
                <HeaderAction/>
                <Assembly />
              </>
            }
          />
          <Route
            path="/CheckIn"
            element={
              <>
                <HeaderAction/>
                <CheckIn />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                <HeaderAction/>
                <AdminDashboard />
              </>
            }
          />
        </Route>
      </Routes>
    </MantineProvider>
  );
}

export default App;
