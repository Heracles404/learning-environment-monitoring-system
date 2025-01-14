import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { httpNewDevice } from "../../../hooks/devices.requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const CreateDevice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Hook for navigation
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreate = async (values) => {
    const deviceData = {
      status: values.status,
      classroom: values.classroom
    };

    try {
      const response = await httpNewDevice(deviceData);
      if (response.ok) {
        console.log("Device added successfully");
        navigate("/Device1");
      } else {
        // Handle error response
        setErrorMessage("Failed to create device. Please try again.");
      }
    } catch (error) {
      // Catch any unexpected errors
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
      <Box m="20px">
        <Header title="CREATE NEW DEVICE" subtitle="Create a New Device" />

        <Formik
            onSubmit={handleCreate}
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
                        value={values.classroom} // Updated value
                        name="classroom" // Updated name
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
                        value={values.status} // Updated value
                        name="status" // Updated name
                        error={!!touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Create New Device
                  </Button>
                </Box>
                {errorMessage && <Box color="red">{errorMessage}</Box>} {/* Display error message */}
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

const initialValues = {
  classroom : "",
  status: "",
};

export default CreateDevice;