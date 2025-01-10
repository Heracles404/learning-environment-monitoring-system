import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import Team from "./pages/team";
import Invoices from "./pages/invoices";
import Bar from "./pages/bar";
import Form from "./pages/EditAccountForm";
import Line from "./pages/line";

import CarbonDioxide from "./pages/Monitor/AirQuality";
import HeatIndex from "./pages/Monitor/HeatIndex";
import Lighting from "./pages/Monitor/Lighting";
import Oxygen from "./pages/Monitor/Oxygen";
import VolSmog from "./pages/Monitor/VolSmog";

import Device1 from "./pages/Monitor/Devices/Device1";
import Device2 from "./pages/Monitor/Devices/Device2";

import Pie from "./pages/pie";
import FAQ from "./pages/faq";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./pages/calendar/calendar";
import LoginPage from "./pages/Login/Login";

import Accounts from "./pages/Accounts";
import Records from "./pages/Records";
import NewAccountForm from "./pages/CreateNewAccount";
import PreviewAccounts from "./pages/Accounts/PreviewAccount";
import VOGRecords from "./pages/Records/vog_record";
import CreateDevice from "./pages/Monitor/Devices/CreateDevice";

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
            {/* <Route 
              path="/" 
              element={<Login />} 
            /> */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
           {/* one line: element={<PrivateRoute><Dashboard/></PrivateRoute>}/> */}
                               
            <Route
              path="/Accounts"
              element={
                <PrivateRoute>
                  <Accounts />
                </PrivateRoute>
              }
            />
            <Route
              path="/Members"
              element={
                <PrivateRoute>
                  <PreviewAccounts />
                </PrivateRoute>
              }
            />
            <Route
              path="/team"
              element={
                <PrivateRoute>
                  <Team />
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
              path="/invoices"
              element={
                <PrivateRoute>
                  <Invoices />
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
              path="/bar"
              element={
                <PrivateRoute>
                  <Bar />
                </PrivateRoute>
              }
            />
            <Route
              path="/pie"
              element={
                <PrivateRoute>
                  <Pie />
                </PrivateRoute>
              }
            />
            <Route
              path="/line"
              element={
                <PrivateRoute>
                  <Line />
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
              path="/Oxygen"
              element={
                <PrivateRoute>
                  <Oxygen />
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
              path="/calendar"
              element={
                <PrivateRoute>
                  <Calendar />
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
              path="/Device1"
              element={
                <PrivateRoute>
                  <Device1 />
                </PrivateRoute>
              }
            />
            <Route
              path="/CreateDevice"
              element={
                <PrivateRoute>
                  <CreateDevice />
                </PrivateRoute>
              }
            />
            <Route
              path="/Device2"
              element={
                <PrivateRoute>
                  <Device2 />
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
