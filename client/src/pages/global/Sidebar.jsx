import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery  } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isSmallScreen);

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
          display: { xs: isSidebarVisible ? "block" : "none", md: "block" }, // Hide sidebar on small screens unless toggled
          "& .pro-sidebar-inner": {
            background: `${colors.greenAccent[800]} !important`,
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
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              sx={{
                display: { xs: "block", md: "none" }, // Show button on small screens
              }}            
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="56px"
                >
                  {/* <Typography variant="h1" color={colors.grey[100]}>
                    ADMIN
                  </Typography> */}
                  {/* <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton> */}
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`../../assets/ESLIHS_Logo.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Rost
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    Principal
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
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Account
            </Typography>
            <Item
              title="Access"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Account"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Record
            </Typography>
            <Item
              title="Users"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Reports"
              to="/contacts"
              icon={<ReceiptLongIcon />}
              selected={selected}
              setSelected={setSelected}
            />


            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Monitor
            </Typography>

              <Item
                title="Heat Index"
                to="/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Air Quality"
                to="/line"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Lighting"
                to="/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Volcanic Smog"
                to="/line"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Head Count"
                to="/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            <Typography
              variant="h6"
              color={colors.grey[300]}
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
              icon={<PersonOutlinedIcon />}
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
