import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { CustomAlert } from "../utils/alert";
import { useFormik } from "formik";
import { CreatePersonelSchema } from "../Schema/CreatePersonelSchema";
import employeeService from "../services/employeeService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "800px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh", // Set a maximum height for the modal
  overflowY: "auto", // Enable vertical scrolling
  overflowX: "hidden", // Prevent horizontal scrolling
};

const EmployeeModalComponent = () => {
  // const [customerType, setCustomerType] = useState("");

  const onSubmit = async (values, actions) => {
    try {
      //backend
      const response = await employeeService.createEmployee(values);
      if (response.status == 200) {
        setOpen(false);
        CustomAlert("Personel Başarıyla Kaydedildi!", "success");
      }
      // alert(JSON.stringify(values, null, 2));
      // setOpen(false);
      // CustomAlert("Personel Başarıyla Kaydedildi!", "success");
    } catch (error) {
      //console.error(error);
      if (error.response.status === 401) {
        setOpen(false);
        CustomAlert("Giriş Başarısız", "error", "Login olun!");
      } else if (error.response.status === 400) {
        let message = "";
        error.response.data.errors.forEach((error, index) => {
          const [fieldName, errorMessage] = error.split(": ");
          if (errorMessage) {
            message += fieldName + ": " + errorMessage + "\n";
          } else {
            console.log(`${index}: Hata mesajı formatı geçersiz: ${error}`);
          }
        });
        setOpen(false);
        CustomAlert("Giriş Başarısız", "error", message);
      } else {
        console.log(error.response);
      }
    } finally {
      actions.resetForm();
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      role: "",
    },
    onSubmit,
    validationSchema: CreatePersonelSchema,
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="marginTop">
      <Button
        size="x-large"
        variant="contained"
        style={{
          backgroundColor: "#02224E",
          color: "#FFFFFF",
          width: "180px",
          height: "40px",
          borderRadius: "18px",
          textTransform: "none",

        }}
        onClick={handleOpen}
      >
        Yeni Personel Tanımla
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-customer-title"
        aria-describedby="modal-modal-customer-description"
      >
        <Box sx={style}>
          <h2 style={{ textAlign: "center" }}>Yeni Personel Tanımlama Formu</h2>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="Adınız"
                  multiline
                  maxRows={4}
                  style={{ marginBottom: 20 }}
                  //Eklenen
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  name="firstName"
                  error={
                    formik.touched && formik.errors.firstName ? true : false
                  }
                  onBlur={formik.handleBlur}
                  helperText={(formik.touched && formik.errors.firstName) ?? ""}
                />
                <TextField
                  fullWidth
                  id="lastName"
                  label="Soyadınız"
                  multiline
                  maxRows={4}
                  style={{ marginBottom: 20 }}
                  //Eklenen
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  name="lastName"
                  error={
                    formik.touched && formik.errors.lastName ? true : false
                  }
                  onBlur={formik.handleBlur}
                  helperText={(formik.touched && formik.errors.lastName) ?? ""}
                />

                <TextField
                  fullWidth
                  id="kullanici-adi"
                  label="Kullanıcı Adı"
                  multiline
                  maxRows={4}
                  style={{ marginBottom: 20 }}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  name="username"
                  error={
                    formik.touched && formik.errors.username ? true : false
                  }
                  onBlur={formik.handleBlur}
                  helperText={(formik.touched && formik.errors.username) ?? ""}
                />
                <TextField
                  fullWidth
                  id="sifre"
                  label="Şifre"
                  type="password"
                  style={{ marginBottom: 20 }}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  name="password"
                  error={
                    formik.touched && formik.errors.password ? true : false
                  }
                  onBlur={formik.handleBlur}
                  helperText={(formik.touched && formik.errors.password) ?? ""}
                />
                <TextField
                  fullWidth
                  id="e-mail"
                  label="E-Mail"
                  multiline
                  maxRows={4}
                  style={{ marginBottom: 20 }}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  name="email"
                  error={formik.touched && formik.errors.email ? true : false}
                  onBlur={formik.handleBlur}
                  helperText={(formik.touched && formik.errors.email) ?? ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="risk-profile-label">Yetki Türü</InputLabel>
                  <Select
                    labelId="risk-profile-label"
                    id="risk-profile"
                    // value={customerType}
                    // onChange={handleChange}
                    label="Yetki Türü"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                    name="role"
                    error={formik.touched && formik.errors.role ? true : false}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                  </Select>
                  <p className="text-danger">
                    {(formik.touched && formik.errors.role) ?? ""}
                  </p>
                </FormControl>
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                  size="large"
                  variant="contained"
                  style={{
                    backgroundColor: "#02224E",
                    color: "#FFFFFF",
                    width: "180px",
                    height: "40px",
                    borderRadius: "18px",
                    textTransform: "none",
                    width: "200px",
                  }}
                  // onClick={handleClose}
                  type="submit"
                >
                  Kaydet
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EmployeeModalComponent;
