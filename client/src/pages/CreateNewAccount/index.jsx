import { Box, Button, TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import {httpAddNewUser} from "../../hooks/users.requests";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import BasicAlerts from "../global/BasicAlerts";
const NewAccountForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Hook for navigation
  const [alertMessage, setAlertMessage] = useState(null);

  const handleCreate = async (values) => {

    const userData = {
      userName: values.userName,
      password: values.password,
      confirmPassword: values.confirmPassword,
      role: values.role,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    if (userData.password !== userData.confirmPassword){
      setAlertMessage({ severity: 'error', message: 'Passwords do not match' });
    }
    else  {
      try {
        const response = await httpAddNewUser(userData);
        if(response.status === 400){
          setAlertMessage({ severity: 'warning', message: 'Username already exists.' });
        }else if(response.ok) {
          // Optionally, you can handle the success response here
          setAlertMessage({ severity: 'warning', message: 'Username already exists.' });
          navigate("/accounts");
        } else {
          // Handle error response
          setAlertMessage({ severity: 'error', message: 'Failed to create user. Please try again.' });
        }
      } catch (error) {
        // Catch any unexpected errors
        setAlertMessage({ severity: 'error', message: 'An error occurred. Please try again.' });

        setAlertMessage({ severity: 'error', message: 'Error creating user.' });

      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE NEW USER" subtitle="Create a New User Profile" />

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
              <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2"}}>
                <AccountCircleOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
              <TextField
                  fullWidth
                  // variant="outlined"
                  variant="outlined"
                  type="text"
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName} // Updated value
                  name="userName" // Updated name
                  error={!!touched.userName && !!errors.userName} // Updated error check
                  helperText={touched.userName && errors.userName} // Updated helper text
                  sx={{ gridColumn: "span 2" }}
              />
              </Box>
              <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2" }}>
              <AssignmentIndOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
              <FormControl fullWidth variant="outlined" sx={{ gridColumn: "span 2" }}>
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
                    type="password" // Changed to password type
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password} // Updated value
                    name="password" // Updated name
                    error={!!touched.password && !!errors.password} // Updated error check
                    helperText={touched.password && errors.password} // Updated helper text
                    sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box mb={2} sx={{ display: 'flex', alignItems: 'center', gridColumn: "span 2"}}>
                <LockOutlinedIcon sx={{ fontSize: 38, color: '#70d8bd', mr: 1 }} />
                <TextField
                    fullWidth
                    variant="outlined"
                    type="password" // Changed to password type
                    label="Confirm Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword} // Updated value
                    name="confirmPassword" // Updated name
                    error={!!touched.confirmPassword && !!errors.confirmPassword} // Updated error check
                    helperText={touched.confirmPassword && errors.confirmPassword} // Updated helper text
                    sx={{ gridColumn: "span 2" }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>

          </form>
        )}
      </Formik>
      <BasicAlerts sx={{mt:"50px"}}alertMessage={alertMessage} /> {/* Pass the alertMessage state */}

    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  userName: yup.string().required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup.string().required("required"),
  role: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  confirmPassword: "",
  role: "",
};

export default NewAccountForm;