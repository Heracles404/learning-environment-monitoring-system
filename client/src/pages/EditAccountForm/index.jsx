import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import {httpAddNewUser} from "../../hooks/users.requests";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Hook for navigation
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (values) => {

    const userData = {
      userName: values.userName,
      password: values.password,
      confirmPassword: values.confirmPassword,
      role: values.role,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    if (userData.password !== userData.confirmPassword){
      alert('Passwords do not match')
    }
    else  {
      try {
        const response = await httpAddNewUser(userData);
        if(response.status === 400){
          alert ('Username already exists.')
        }else if(response.ok) {
          // Optionally, you can handle the success response here
          console.log("User  created successfully");
          navigate("/accounts");
        } else {
          // Handle error response
          setErrorMessage("Failed to create user. Please try again.");
        }
      } catch (error) {
        // Catch any unexpected errors
        setErrorMessage("An error occurred. Please try again.");
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT ACCOUNT" subtitle="Edit Existing Account Details" />

      <Formik
        onSubmit={handleSave}
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
              <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 3" }}
              />
              <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 1" }}
              />
              <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Role"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role} // Updated value
                  name="role" // Updated name
                  error={!!touched.role && !!errors.role} // Updated error check
                  helperText={touched.role && errors.role} // Updated helper text
                  sx={{ gridColumn: "span 4" }}
              />
              <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName} // Updated value
                  name="userName" // Updated name
                  error={!!touched.userName && !!errors.userName} // Updated error check
                  helperText={touched.userName && errors.userName} // Updated helper text
                  sx={{ gridColumn: "span 4" }}
              />
              <TextField
                  fullWidth
                  variant="filled"
                  type="password" // Changed to password type
                  label="Old Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password} // Updated value
                  name="password" // Updated name
                  error={!!touched.password && !!errors.password} // Updated error check
                  helperText={touched.password && errors.password} // Updated helper text
                  sx={{ gridColumn: "span 2" }}
              />
              <TextField
                  fullWidth
                  variant="filled"
                  type="password" // Changed to password type
                  label="New Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword} // Updated value
                  name="confirmPassword" // Updated name
                  error={!!touched.confirmPassword && !!errors.confirmPassword} // Updated error check
                  helperText={touched.confirmPassword && errors.confirmPassword} // Updated helper text
                  sx={{ gridColumn: "span 2" }}
              />
              

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Save Changes
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  userName: yup.string().required("required"),
  password: yup.string().required("required"),
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

export default Form;