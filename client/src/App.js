import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import Team from "./pages/team";
import Invoices from "./pages/invoices";
import Contacts from "./pages/contacts";
import Bar from "./pages/bar";
import Form from "./pages/form";
import Line from "./pages/line";
import Pie from "./pages/pie";
import FAQ from "./pages/faq";
import Geography from "./pages/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./pages/calendar/calendar";
import Login from "./pages/Login";
import LoginPage from "./pages/Login/Login";

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
              path="/team"
              element={
                <PrivateRoute>
                  <Team />
                </PrivateRoute>
              }
            />
            {/* Reference: Initial team code
            <Route path="/team" element={<Team />} /> */}

            <Route
              path="/contacts"
              element={
                <PrivateRoute>
                  <Contacts />
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
              path="/form"
              element={
                <PrivateRoute>
                  <Form />
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
              path="/geography"
              element={
                <PrivateRoute>
                  <Geography />
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