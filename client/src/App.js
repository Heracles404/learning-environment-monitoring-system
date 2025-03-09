import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import Form from "./pages/EditAccountForm";

import CarbonDioxide from "./pages/Monitor/AirQuality";
import HeatIndex from "./pages/Monitor/HeatIndex";
import Lighting from "./pages/Monitor/Lighting";
import VolSmog from "./pages/Monitor/VolSmog";

import Device1 from "./pages/Monitor/Devices/Device1";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginPage from "./pages/Login/Login";
import FAQ from "./pages/faq";

import Accounts from "./pages/Accounts";
import Records from "./pages/Records";
import NewAccountForm from "./pages/CreateNewAccount";
import VOGRecords from "./pages/Records/vog_record";
import RegisterDevice from "./pages/Monitor/Devices/RegisterDevice";
import UpdateDevice from "./pages/Monitor/Devices/UpdateDevice";
import RoomLayout from "./pages/Monitor/RoomLayout";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const PrivateRoute = ({ children }) => {
    return localStorage.getItem("auth") ? (
      <>
        <Sidebar isSidebar={isSidebar} />
        <main className="content">
          <Topbar setIsSidebar={setIsSidebar} />
          {children}
        </main>
      </>
    ) : (
      <Navigate to="/" />
    );
  };
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route 
              path="/" 
              element={<LoginPage />} 
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/RoomLayout"
              element={
                <PrivateRoute>
                  <RoomLayout />
                </PrivateRoute>
              }
            />
            <Route
              path="/Accounts"
              element={
                <PrivateRoute>
                  <Accounts />
                </PrivateRoute>
              }
            />         
            <Route
              path="/records"
              element={
                <PrivateRoute>
                  <Records />
                </PrivateRoute>
              }
            />
            <Route
              path="/EditAccount/:userName"
              element={
                <PrivateRoute>
                  <Form />
                </PrivateRoute>
              }
            />
            <Route
              path="/CreateNewAccount"
              element={
                <PrivateRoute>
                  <NewAccountForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/AirQuality"
              element={
                <PrivateRoute>
                  <CarbonDioxide />
                </PrivateRoute>
              }
            />
            <Route
              path="/HeatIndex"
              element={
                <PrivateRoute>
                  <HeatIndex />
                </PrivateRoute>
              }
            />
            <Route
              path="/Lighting"
              element={
                <PrivateRoute>
                  <Lighting />
                </PrivateRoute>
              }
            />
            <Route
              path="/VolSmog"
              element={
                <PrivateRoute>
                  <VolSmog />
                </PrivateRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <PrivateRoute>
                  <FAQ />
                </PrivateRoute>
              }
            />
            <Route
              path="/VOG_records"
              element={
                <PrivateRoute>
                  <VOGRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/DeviceStatus"
              element={
                <PrivateRoute>
                  <Device1 />
                </PrivateRoute>
              }
            />
            <Route
              path="/RegisterDevice"
              element={
                <PrivateRoute>
                  <RegisterDevice />
                </PrivateRoute>
              }
            />
              <Route
                  path="/UpdateDevice/:id"
                  element={
                      <PrivateRoute>
                          <UpdateDevice />
                      </PrivateRoute>
                  }
              />
            
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
