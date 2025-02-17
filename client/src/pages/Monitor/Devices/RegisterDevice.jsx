import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { httpNewDevice } from "../../../hooks/devices.requests";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { httpGetAllDevices } from "../../../hooks/devices.requests"; // Added function import

const RegisterDevice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [existingDevices, setExistingDevices] = useState([]); // Store fetched devices

  const [checked, setChecked] = React.useState([false, false]);
  const [checkedSecond, setCheckedSecond] = React.useState([false, false]);

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await httpGetAllDevices(); // Fetch all devices
      setExistingDevices(devices);
    };
    fetchDevices();
  }, []);

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  const Register = async (values) => {
    // Check if classroom name already exists
    if (existingDevices.some(device => device.classroom === values.classroom)) {
      setAlertMessage("Duplicate room detected. Please use a different room name.");
      return;
    }

    const deviceData = {
      classroom: values.classroom,
      status: "inactive",
      bh1750: checked[0] ? "inactive" : "-",
      bme680: checked[1] ? "inactive" : "-",
      pms5003: checkedSecond[0] ? "inactive" : "-",
    };

    try {
      const response = await httpNewDevice(deviceData);
      const responseData = await response.json();

      if (response.ok) {
        navigate("/DeviceStatus");
      } else if (response.status === 409) {
        setAlertMessage(responseData.message || "Duplicate room detected. Please use a different room name.");
      } else {
        setErrorMessage(responseData.message || "Failed to register device. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="REGISTER NEW DEVICE" subtitle="Register a New Device" />

      <Formik onSubmit={Register} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(6, minmax(0, 1fr))"
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 6" } }}
            >
              <Box sx={{ gridColumn: "span 2" }}></Box>
              <Box mb={2} sx={{ display: "flex", alignItems: "center", gridColumn: "span 2" }}>
                <BadgeOutlinedIcon sx={{ fontSize: 38, color: "#70d8bd", mr: 1 }} />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Classroom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.classroom}
                  name="classroom"
                  error={!!touched.classroom && !!errors.classroom}
                  helperText={touched.classroom && errors.classroom}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box sx={{ gridColumn: "span 1" }}></Box>

              <Box sx={{ gridColumn: "span 2" }}></Box>
              <Box sx={{ gridColumn: "span 2" }}>
                <Box display="flex">
                  <LocationOnOutlinedIcon sx={{ fontSize: 19, color: "red", mr: .4 }} />
                  <Typography>Sensors</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                  <FormControlLabel
                    label="Light Sensor"
                    control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
                  />
                  <FormControlLabel
                    label="Air Quality, Heat Index Sensor"
                    control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
                  />
                </Box>
              </Box>
            </Box>

            <Box display="flex" justifyContent="center" mt="20px">
              <Button sx={{ backgroundColor: '#4cceac', height: '30px', borderRadius: '25px', fontWeight: 'bold' }}
                type="submit" variant="contained">
                Register Device
              </Button>
            </Box>
            {alertMessage && <Alert severity="warning" sx={{ mt: 2 }}>{alertMessage}</Alert>}
            {errorMessage && <Box color="red">{errorMessage}</Box>}
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  classroom: yup.string().required("Classroom Name is required"),
});

const initialValues = {
  classroom: "",
  status: "",
};

export default RegisterDevice;
