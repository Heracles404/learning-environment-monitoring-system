import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { httpGetDeviceById, httpUpdateDevice } from "../../../hooks/devices.requests"; // Import the update function
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

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
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
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
                        sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2" }}>
                    <BadgeOutlinedIcon sx={{ fontSize: 38, color: 'action.active', mr: 1 }} />
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Status"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.status}
                        name="status"
                        error={!!touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
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