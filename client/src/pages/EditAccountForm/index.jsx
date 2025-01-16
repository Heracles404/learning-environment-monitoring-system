import { Box, Button, TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import { httpGetUser, httpUpdateUser } from "../../hooks/users.requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const { userName } = useParams(); // Extract the username from the URL
  const [initialValues, setInitialValues] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  console.log("Username from URL:", userName);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await httpGetUser(userName);
        console.log("Fetched User Data:", userData);
        setInitialValues({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          userName: userData.userName || "",
          role: userData.role || "",
          newPassword: "", // Leave confirmPassword blank for security
          confirmPassword: "", // Leave confirmPassword blank for security
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data.");
      }
    };

    if (userName) {
      fetchUserData();
    }
  }, [userName]);

  const handleSave = async (values) => {
    try {
      if (!values.newPassword) {
        const { firstName, lastName, role, userName } = values;
        await httpUpdateUser (userName, { firstName, lastName, role });
        alert("User  details updated successfully.");
        navigate(`/Accounts`);
      } else {
        if (values.newPassword !== values.confirmPassword) {
          alert("Passwords do not match.");
        } else {
          const { firstName, lastName, role, userName, newPassword } = values;
          await httpUpdateUser (userName, { firstName, lastName, role, password: newPassword });
          navigate(`/Accounts`);
        }
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setErrorMessage("Failed to update user data.");
    }
  };

  if (!initialValues) {
    return (
        <Box m="20px">
          <Header title="EDIT ACCOUNT" subtitle="Edit Existing Account Details" />
          <div>Loading...</div>
        </Box>
    );
  }

  return (
      <Box m="20px">
        <Header title="EDIT ACCOUNT" subtitle="Edit Existing Account Details" />
        <Formik
            onSubmit={handleSave}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            enableReinitialize // Allows the form to reinitialize when initialValues change
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
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 4"}}>
                  <AccountCircleOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                  <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userName}
                      name="userName"
                      error={!!touched.userName && !!errors.userName}
                      helperText={touched.userName && errors.userName}
                      sx={{ gridColumn: "span 4" }}
                      InputProps={{
                        readOnly: true
                      }}
                  />
                  </Box>
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2"}}>
                <BadgeOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                  <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={!!touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                  />
                  </Box>
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2"}}>
                <BadgeOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                  <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={!!touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                  />
                  </Box>
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 4" }}>
                  <AssignmentIndOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                  <FormControl fullWidth variant="outlined" sx={{ gridColumn: "span 4" }}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      value={values.role} // Updated value
                      onChange={handleChange} // Handles selection change
                      name="role" // Field name
                      onBlur={handleBlur}
                      error={!!touched.role && !!errors.role} // Error check
                    >
                      <MenuItem value="Principal">Principal</MenuItem>
                      <MenuItem value="Physical Facilitator Coordinator">Physical Facilitator Coordinator</MenuItem>
                      <MenuItem value="SDRRM Coordinator">SDRRM Coordinator</MenuItem>
                    </Select>
                    {touched.role && errors.role && (
                      <FormHelperText error>{errors.role}</FormHelperText> // Error text
                    )}
                  </FormControl>
                </Box>

                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2"}}>
                <LockOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                  <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      label="New Password (Optional)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.newPassword}
                      name="newPassword"
                      error={!!touched.newPassword && !!errors.newPassword}
                      helperText={touched.newPassword && errors.newPassword}
                      sx={{ gridColumn: "span 2" }}
                  />
                  </Box>
                  <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2"}}>
                <LockOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                  <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      label="Confirm New Password (Optional)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      error={!!touched.confirmPassword && !!errors.confirmPassword}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      sx={{ gridColumn: "span 2" }}
                  />
                  </Box>  
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Save Changes
                  </Button>
                </Box>
              </form>
          )}
        </Formik>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  userName: yup.string().required("required"),
  role: yup.string().required("required"),
});

export default Form;
