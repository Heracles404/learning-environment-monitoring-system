import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { httpNewDevice } from "../../../hooks/devices.requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
const RegisterDevice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Hook for navigation
  const [errorMessage, setErrorMessage] = useState("");

  // State for first checkbox logic
  const [checked, setChecked] = React.useState([true, false]);

  // State for second checkbox logic
  const [checkedSecond, setCheckedSecond] = React.useState([false, false]);

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
    if (event.target.checked) {
      setCheckedSecond([false, false]); // Uncheck Outdoor
    }
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  // Handlers for second checkbox state updates
  const handleSecondChange1 = (event) => {
    setCheckedSecond([event.target.checked, event.target.checked]);
    if (event.target.checked) {
      setChecked([false, false]); // Uncheck Indoor
    }
  };

  const handleSecondChange2 = (event) => {
    setCheckedSecond([event.target.checked, checkedSecond[1]]);
  };

  const handleSecondChange3 = (event) => {
    setCheckedSecond([checkedSecond[0], event.target.checked]);
  };

  const Register = async (values) => {
    const deviceData = {
      classroom: values.classroom,
      status: "inactive",
      bh1750: checked[0] ? "inactive" : "-",
      bme680: checked[1] ? "inactive" : "-",
      pms5003: checkedSecond[0] ? "inactive" : "-",
    };

    try {
      const response = await httpNewDevice(deviceData);
      if (response.ok) {
        console.log("Device added successfully");
        navigate("/Device1");
      } else {
        setErrorMessage("Failed to register device. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };


  return (
      <Box m="20px">
        <Header title="REGISTER NEW DEVICE" subtitle="Register a New Device" />

        <Formik
            onSubmit={Register}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
        >
          {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(6, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 6" },
                    }}
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


                  {/* First Checkbox - Indoor */}
                  <Box sx={{ gridColumn: "span 2" }}></Box>
                  <Box sx={{ gridColumn: "span 1" }}>
                    <Box display="flex">
                    <LocationOnOutlinedIcon sx={{ fontSize: 19, color: "red", mr: .4 }} />
                    <Typography>Location</Typography>
                    </Box>
                    <FormControlLabel
                        label="Indoor"
                        control={
                          <Checkbox
                              checked={checked[0] && checked[1]}
                              indeterminate={checked[0] !== checked[1]}
                              onChange={(event) => {
                                handleChange1(event);
                                setFieldValue("selection", event.target.checked || checkedSecond[0]);
                              }}
                          />
                        }
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                      <FormControlLabel
                          label="BH1750"
                          control={
                            <Checkbox
                                checked={checked[0]}
                                onChange={handleChange2}
                                disabled={checkedSecond[0]}
                            />
                          }
                      />
                      <FormControlLabel
                          label="BME680"
                          control={
                            <Checkbox
                                checked={checked[1]}
                                onChange={handleChange3}
                                disabled={checkedSecond[0]}
                            />
                          }
                      />
                    </Box>
                  </Box>

                  {/* Second Checkbox - Outdoor */}
                  {/* Second Checkbox - Outdoor */}
                  <Box sx={{ gridColumn: "span 1" }}>
                    <Box display="flex">
                      <LocationOnOutlinedIcon sx={{ fontSize: 19, color: "red", mr: .4 }} />
                      <Typography>Location</Typography>
                    </Box>
                    <FormControlLabel
                        label="Outdoor"
                        control={
                          <Checkbox
                              checked={checkedSecond[0] && checkedSecond[1]}
                              indeterminate={checkedSecond[0] !== checkedSecond[1]}
                              onChange={(event) => {
                                handleSecondChange1(event);
                                setFieldValue("selection", event.target.checked || checked[0]);
                              }}
                          />
                        }
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                      <FormControlLabel
                          label="PMS5003"
                          control={
                            <Checkbox
                                checked={checkedSecond[0]}
                                onChange={handleSecondChange2}
                                disabled={checked[0] || checked[1]} // Disable if either BH1750 or BME680 is checked
                            />
                          }
                      />
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="center" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Register Device
                  </Button>
                </Box>
                {touched.selection && errors.selection && (
                    <Box color="red" mt="10px">
                      {errors.selection}
                    </Box>
                )}
                {errorMessage && <Box color="red">{errorMessage}</Box>} {/* Display error message */}
              </form>
          )}
        </Formik>

      </Box>
  );
};

const checkoutSchema = yup.object().shape({
  classroom: yup.string().required("Classroom is required"),
  selection: yup
      .boolean()
      .oneOf([true], "Please select either Indoor or Outdoor"),
});


const initialValues = {
  classroom: "",
  status: "",
  selection: false, // New field to track selection
};


export default RegisterDevice;