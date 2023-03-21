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
import { NotFound } from "./pages/NotFound";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;
  const [checkedIn, setCheckedIn] = useState(false);

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
      <NotificationsProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="*"
            element={
              <>
                <HeaderAction checkedIn={checkedIn} />
                <NotFound />
              </>
            }
          />
          <Route element={<ProtectRoutes />}>
            <Route
              path="/start"
              element={
                <>
                  <HeaderAction checkedIn={checkedIn} />
                  <StartPage />
                </>
              }
            />
            <Route
              path="/lobby"
              element={
                <>
                  <HeaderAction checkedIn={checkedIn} />
                  <AssemblyLobby
                    checkedIn={checkedIn}
                    setCheckedIn={(checkin) => setCheckedIn(checkin)}
                  />
                </>
              }
            />
            <Route
              path="/assembly"
              element={
                <>
                  <HeaderAction checkedIn={checkedIn} />
                  <Assembly />
                </>
              }
            />
            <Route
              path="/CheckIn"
              element={
                <>
                  <HeaderAction checkedIn={checkedIn} />
                  <CheckIn />
                </>
              }
            />
            <Route
              path="/admin"
              element={
                <>
                  <HeaderAction checkedIn={checkedIn} />
                  <AdminDashboard />
                </>
              }
            />
          </Route>
        </Routes>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
