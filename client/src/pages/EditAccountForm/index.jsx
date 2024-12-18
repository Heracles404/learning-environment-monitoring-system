import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import { httpGetUser, httpUpdateUser } from "../../hooks/users.requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

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
          password: "", // Leave password blank for security
          confirmPassword: "", // Leave confirmPassword blank for security
          role: userData.role || "",
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
    const userData = {
      userName: values.userName,
      password: values.password,
      confirmPassword: values.confirmPassword,
      role: values.role,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match");
    } else {
      try {
        const response = await httpUpdateUser(userData);
        if (response.status === 400) {
          alert("Username already exists.");
        } else if (response.ok) {
          console.log("User updated successfully");
          navigate("/accounts");
        } else {
          setErrorMessage("Failed to update user. Please try again.");
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
        console.error("Error updating user:", error);
      }
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
                      value={values.role}
                      name="role"
                      error={!!touched.role && !!errors.role}
                      helperText={touched.role && errors.role}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userName}
                      name="userName"
                      error={!!touched.userName && !!errors.userName}
                      helperText={touched.userName && errors.userName}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="password"
                      label="Old Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="password"
                      label="New Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      error={!!touched.confirmPassword && !!errors.confirmPassword}
                      helperText={touched.confirmPassword && errors.confirmPassword}
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
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  userName: yup.string().required("required"),
  password: yup.string().required("required"),
  role: yup.string().required("required"),
});

export default Form;
