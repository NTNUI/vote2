import "./App.css";
import { StartPage } from "./pages/StartPage";
import { Route, Routes } from "react-router-dom";
import { ProtectRoutes } from "./utils/ProtectedRouter/protectedRoutes";
import { AssemblyLobby } from "./pages/AssemblyPage";
import { Assembly } from "./pages/AssemblyDashboard";
import { CheckIn } from "./pages/CheckIn";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MantineProvider, createTheme } from "@mantine/core";
import colors from "./utils/theme";
import { Login } from "./pages/LoginPage";
import axios from "axios";
import { HeaderAction } from "./components/Header";
import { Notifications } from "@mantine/notifications";
import { useState } from "react";
import { NotFound } from "./pages/NotFound";
import { checkedInState } from "./utils/Context";
import { FAQ } from "./pages/FAQ";
import { setupInterceptors } from "./services/axiosIntercept";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
  colors: colors,
  fontSizes: {
    xs: '0.625rem',
    sm: '0.75rem',
    md: '0.875rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  breakpoints: {
    xs: '31.25rem',
    sm: '50rem',
    md: '62.5rem',
    lg: '75rem',
    xl: '87.5rem',
  },
});

function App() {
  setupInterceptors();
  const [checkedIn, setCheckedIn] = useState(false);
  const [groupSlug, setGroupSlug] = useState("");
  const [groupName, setGroupName] = useState("");
  const value = {
    checkedIn,
    setCheckedIn,
    groupSlug,
    setGroupSlug,
    groupName,
    setGroupName,
  };

  return (
    <checkedInState.Provider value={value}>
      <MantineProvider 
        theme={theme} 
        defaultColorScheme="light"
      >
        <Notifications />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="*"
            element={
              <>
                <HeaderAction />
                <NotFound />
              </>
            }
          />
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
              path="/lobby/:groupSlug"
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
    </checkedInState.Provider>
  );
}

export default App;
