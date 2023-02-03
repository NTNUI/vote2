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
import { Login } from "./pages/Login";
import axios from "axios";
import Header from "./components/Header";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  return (
    <MantineProvider
      theme={{
        fontFamily: "Poppins, sans-serif",
        colors: colors,
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectRoutes />}>
          <Route
            path="/start"
            element={
              <>
                <Header />
                <StartPage />
              </>
            }
          />
          <Route
            path="/vote"
            element={
              <>
                <Header />
                <Vote />
              </>
            }
          />
          <Route
            path="/QR"
            element={
              <>
                <Header />
                <QR />
              </>
            }
          />
          <Route
            path="/assembly"
            element={
              <>
                <Header />
                <Assembly />
              </>
            }
          />
          <Route
            path="/CheckIn"
            element={
              <>
                <Header />
                <CheckIn />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                <Header />
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
