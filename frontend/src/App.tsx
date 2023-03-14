import "./App.css";
import { StartPage } from "./pages/StartPage";
import { Route, Routes } from "react-router-dom";
import { ProtectRoutes } from "./utils/ProtectedRouter/protectedRoutes";
import { AssemblyLobby } from "./pages/AssemblyPage";
import { Assembly } from "./pages/GenforsDashboard";
import { CheckIn } from "./pages/CheckIn";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MantineProvider, Text } from "@mantine/core";
import colors from "./utils/theme";
import { Login } from "./pages/LoginPage";
import axios from "axios";
import { HeaderAction } from "./components/Header";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;

  return (
    <MantineProvider
      theme={{
        fontFamily: "Poppins, sans-serif",
        colors: colors,
        fontSizes: {
          xs: 10,
          sm: 12,
          md: 14,
          lg: 20,
          xl: 24,
        },
        breakpoints: {
          xs: 500,
          sm: 800,
          md: 1000,
          lg: 1200,
          xl: 1400,
        },
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectRoutes />}>
          <Route
            path="/start"
            element={
              <>
                <HeaderAction />
                <StartPage />
              </>
            }
          />
          <Route
            path="/lobby"
            element={
              <>
                <HeaderAction />
                <AssemblyLobby />
              </>
            }
          />
          <Route
            path="/assembly"
            element={
              <>
                <HeaderAction />
                <Assembly />
              </>
            }
          />
          <Route
            path="/CheckIn"
            element={
              <>
                <HeaderAction />
                <CheckIn />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                <HeaderAction />
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
