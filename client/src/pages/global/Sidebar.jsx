import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery  } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

import AirIcon from '@mui/icons-material/Air';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import VolcanoOutlinedIcon from '@mui/icons-material/VolcanoOutlined';
import WbIncandescentOutlinedIcon from '@mui/icons-material/WbIncandescentOutlined';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';

import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';

import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.greenAccent[100],
      }}
      onClick={() => {
        setSelected(title);
        if (onClick) onClick(); // Call onClick if provided (for logout)
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isSmallScreen);

  const username = localStorage.getItem("username");
  const name = localStorage.getItem("firstname");
  const role = localStorage.getItem("role");


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/"); 
  };

  return (
    
    <Box>
            <IconButton
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        sx={{
          display: { xs: "block", md: "none" }, // Show button on small screens
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1300,
        }}
      >
        <MenuOutlinedIcon />
      </IconButton>
      <Box
        sx={{
          height: "100%",
          display: { xs: isSidebarVisible ? "block" : "none", md: "block" }, // Hide sidebar on small screens unless toggled
          "& .pro-sidebar-inner": {
            background: `${colors.greenAccent[700]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: `${colors.greenAccent[500]} !important`,
          },
          "& .pro-menu-item.active": {
            color: `${colors.greenAccent[500]} !important`,
          },
          "& .pro-item-content": {
            color: `${colors.grey[100]} `,
          },
          "& .pro-icon": {
            color: `${colors.greenAccent[400]} `,
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
            <MenuItem
              sx={{
                display: { xs: "block", md: "none" }, // Show button on small screens
              }}            
              // onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.greenAccent[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="56px"
                >
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="140px"
                    height="140px"
                    src={`../../assets/ESLIHS_Logo.png`}
                    style={{ 
                      // cursor: "pointer", 
                      borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h1"
                    color={colors.greenAccent[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                      {`${name}`}
                  </Typography>
                  <Typography variant="h4" color={colors.greenAccent[500]}>
                      {`${role}`}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "8%"}>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              
              <Typography
              variant="h6"
              color={colors.greenAccent[400]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Account Control
            </Typography>

                <SubMenu
                    title="Accounts"
                    icon={<PersonOutlinedIcon />}
                    style={{ color: colors.greenAccent[100] }}
                >
                    {(role.toUpperCase() === "PRINCIPAL" || role.toUpperCase() === "ADMIN") && (
                        <>
                            <Item
                                title="Users"
                                to="/Accounts"
                                icon={<PersonSearchOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title="Create New Account"
                                to="/CreateNewAccount"
                                icon={<PersonAddAltOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </>
                    )}
                    <Item
                        title="Edit Account"
                        to={`/EditAccount/${username}`} // Use backticks for template literals
                        icon={<ManageAccountsOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </SubMenu>


                <Typography
              variant="h6"
              color={colors.greenAccent[400]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Information
            </Typography>
            <SubMenu
              title="Record"
              icon={<LibraryBooksOutlinedIcon />}
              style={{ color: colors.greenAccent[100] }}
            >
            {/* <Item
              title="Members"
              to="/Members"
              icon={<PersonSearchOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Parameters"
              to="/records"
              icon={<DeviceHubOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="VOG"
              to="/VOG_records"
              icon={<VolcanoOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            </SubMenu>
            <SubMenu
              title="Devices"
              icon={<DevicesOutlinedIcon />}
              style={{ color: colors.greenAccent[100] }}
            >
              <Item
                title="Status"
                to="/DeviceStatus"
                icon={<DevicesOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
                {(role.toUpperCase() === "PRINCIPAL" || role.toUpperCase() === "ADMIN") && (
                    <Item
                        // to="/CreateDevice"
                        title="Register Device"
                        to="/RegisterDevice"
                        icon={<DevicesOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}
              {/* <Item
                title="Device 2"
                to="/Device2"
                icon={<DevicesIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              </SubMenu>


            <Typography
              variant="h6"
              color={colors.greenAccent[400]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Monitor
            </Typography>
            <SubMenu
              title="Parameters"
              icon={<DeviceHubOutlinedIcon />}
              style={{ color: colors.greenAccent[100] }}
            >

              <Item
                title="Air Quality"
                to="/AirQuality"
                icon={<AirIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Lighting"
                to="/Lighting"
                icon={<WbIncandescentOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Volcanic Smog"
                to="/VolSmog"
                icon={<VolcanoOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Heat Index"
                to="/HeatIndex"
                icon={<DeviceThermostatIcon />}
                selected={selected}
                setSelected={setSelected}
              />              
              </SubMenu>
  
            
            <Typography
              variant="h6"
              color={colors.greenAccent[400]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Other
            </Typography>
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />            
            <Item
              title="Sign Out"
              to="/"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={handleLogout}
            />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </Box>
  );
};

export default Sidebar;
