import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { httpGetDeviceById, httpUpdateDevice } from "../../../hooks/devices.requests"; // Import the update function
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
const UpdateDevice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Hook for navigation
  const { id } = useParams(); // Get the device ID from the URL
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({ classroom: "", status: "" });

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const deviceData = await httpGetDeviceById(id); // Fetch device data by ID
        setInitialValues({
          classroom: deviceData.classroom,
          status: deviceData.status,
        });
      } catch (error) {
        console.error("Error fetching device data:", error);
        setErrorMessage("Failed to fetch device data. Please try again.");
      }
    };

    fetchDeviceData();
  }, [id]);
// State for first checkbox logic
  const [checked, setChecked] = React.useState([true, false]);

  // State for second checkbox logic
  const [checkedSecond, setCheckedSecond] = React.useState([false, false]);

  // Handlers for first checkbox state updates
  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
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
  };

  const handleSecondChange2 = (event) => {
    setCheckedSecond([event.target.checked, checkedSecond[1]]);
  };

  const handleSecondChange3 = (event) => {
    setCheckedSecond([checkedSecond[0], event.target.checked]);
  };
  const handleUpdate = async (values) => {
    const deviceData = {
      status: values.status,
      classroom: values.classroom
    };

    try {
      const response = await httpUpdateDevice(id, deviceData); // Update the device
      if (response.ok) {
        console.log("Device updated successfully");
        navigate("/Device1");
      } else {
        setErrorMessage("Failed to update device. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
      <Box m="20px">
        <Header title="UPDATE DEVICE" subtitle="Update Device Information" />

        <Formik
            onSubmit={handleUpdate}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            enableReinitialize // This allows the form to reinitialize when initialValues change
        >
          {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
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
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2" }}>
                    <BadgeOutlinedIcon sx={{ fontSize: 38, color: 'action.active', mr: 1 }} />
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

                  {/* First Indeterminate Checkbox Component */}
                  <Box sx={{ gridColumn: "span 2" }}></Box>
                  <Box sx={{ gridColumn: "span 1" }}>
                  <Typography>
                    Sensor
                  </Typography>
                    <FormControlLabel
                      label="Indoor"
                      control={
                        <Checkbox
                          checked={checked[0] && checked[1]}
                          indeterminate={checked[0] !== checked[1]}
                          onChange={handleChange1}
                        />
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                      <FormControlLabel
                        label="BH1750"
                        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
                      />
                      <FormControlLabel
                        label="BME680"
                        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
                      />
                    </Box>
                  </Box>

                  {/* Second Indeterminate Checkbox Component */}
                  <Box sx={{ gridColumn: "span 1" }}>
                  <Typography>
                    Sensor
                  </Typography>
                    <FormControlLabel
                      label="Outdoor"
                      control={
                        <Checkbox
                          checked={checkedSecond[0] && checkedSecond[1]}
                          indeterminate={checkedSecond[0] !== checkedSecond[1]}
                          onChange={handleSecondChange1}
                        />
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                      <FormControlLabel
                        label="PMS5003"
                        control={<Checkbox checked={checkedSecond[0]} onChange={handleSecondChange2} />}
                      />
                      
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="center" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Update Device
                  </Button>
                </Box>
                {errorMessage && <Box color="red">{errorMessage}</Box>}
              </form>
          )}
        </Formik>
      </Box>
  );
};

const checkoutSchema = yup.object().shape({
  classroom: yup.string().required("Classroom is required"),
  status: yup.string().required("Status is required"),
});

export default UpdateDevice;