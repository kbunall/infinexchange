import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CheckboxInput from "./CheckboxInput";
import TextareaInput from "./TextareaInput";
import { CustomAlert } from "../utils/alert";
import { CreateCustomerSchema } from "../Schema/CreateCustomerSchema";
import { useFormik } from "formik";

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
  maxHeight: "80vh",
  overflowY: "auto",
  overflowX: "hidden",
};

const CustomerModalComponent = () => {
  const [customerType, setCustomerType] = useState(0);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    taxNo: "",
    type: "B",
    corporationName: "",
    tcNo: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: "",
    balance: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value === "Bireysel" ? 0 : 1;
    setCustomerType(newType);
    setCustomerData((prevState) => ({
      ...prevState,
      type: newType === 0 ? "B" : "K",
    }));
    if (newType === 1) {
      setCustomerData((prevState) => ({
        ...prevState,
        taxNo: "",
        corporationName: "",
      }));
    } else {
      setCustomerData((prevState) => ({
        ...prevState,
        tcNo: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
      }));
    }
  };





  const handleSubmit = async (event) => {
    const token = localStorage.getItem("accessToken");
    try {
      const request = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        corporationName: formik.values.corporationName,
        type: customerType === 0 ? 'B' : 'K',
        tcNo: formik.values.tcNo,
        taxNo: formik.values.taxNo,
        address: formik.values.address,
        dateOfBirth: formik.values.dateOfBirth,
        phoneNumber: formik.values.phoneNumber,
        email: formik.values.email,
        balance: 0,
      };

      console.log(request);
      const response = await axios.post(
        "http://localhost:9090/api/v1/customers",
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (response.status === 201) {
        CustomAlert("Müşteri Başarıyla Kaydedildi!", "success");
        handleClose();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setOpen(false);
        CustomAlert("Giriş Başarısız", "error", "Login olun!");
      } else if (error.response.status === 400) {
        let message = "";
        Object.entries(error.response.data.errors).forEach(([fieldName, errorMessage], index) => {
          if (errorMessage) {
            message += fieldName + ": " + errorMessage + "\n";
          } else {
            console.log(`${index}: Hata mesajı formatı geçersiz: ${fieldName}`);
          }
        });
        setOpen(false);
        CustomAlert("Giriş Başarısız", "error", message);
      } else {
        console.log(error.response);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      tcNo: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      address: "",
      taxNo: "",
      corporationName: "",
    },
    onSubmit: handleSubmit,
    validationSchema: CreateCustomerSchema(customerType),
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        Yeni Müşteri Tanımla
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-customer-title"
        aria-describedby="modal-modal-customer-description"
      >
        <Box sx={style}>
          <h2 style={{ textAlign: "center" }}>Yeni Müşteri Tanımlama Formu</h2>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ marginBottom: 2.5 }}>
                <InputLabel id="customer-type-label">Müşteri Türü</InputLabel>
                <Select
                  labelId="customer-type-label"
                  id="customer-type"
                  value={customerType === 0 ? "Bireysel" : "Kurumsal"}
                  onChange={handleTypeChange}
                  label="Müşteri Türü"
                >
                  <MenuItem value="Bireysel">Bireysel</MenuItem>
                  <MenuItem value="Kurumsal">Kurumsal</MenuItem>
                </Select>
              </FormControl>
              {customerType === 0 ? (
                <>
                  <TextField
                    fullWidth
                    id="tc"
                    label="TC Kimlik"
                    name="tcNo"
                    value={formik.values.tcNo}
                    onChange={formik.handleChange}
                    error={
                      formik.touched && formik.errors.tcNo ? true : false
                    }
                    helperText={(formik.touched && formik.errors.tcNo) ?? ""}
                    style={{ marginBottom: 20 }}
                  />
                  <TextField
                    fullWidth
                    id="ad"
                    label="Ad"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched && formik.errors.firstName ? true : false
                    }
                    helperText={(formik.touched && formik.errors.firstName) ?? ""}
                    style={{ marginBottom: 20 }}
                  />
                  <TextField
                    fullWidth
                    id="soyad"
                    label="Soyad"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched && formik.errors.lastName ? true : false
                    }
                    helperText={(formik.touched && formik.errors.lastName) ?? ""}
                    style={{ marginBottom: 20 }}

                  />
                  <TextField
                    fullWidth
                    id="dogum-tarihi"
                    label="Doğum Tarihi"
                    name="dateOfBirth"
                    type="date"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    error={
                      formik.touched && formik.errors.dateOfBirth ? true : false
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={(formik.touched && formik.errors.dateOfBirth) ?? ""}
                    style={{ marginBottom: 20 }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    id="vergi-numarasi"
                    label="Vergi Numarası"
                    name="taxNo"
                    value={formik.values.taxNo}
                    onChange={formik.handleChange}
                    error={
                      formik.touched && formik.errors.taxNo ? true : false
                    }
                    helperText={(formik.touched && formik.errors.taxNo) ?? ""}
                    style={{ marginBottom: 20 }}  
                  />
                  <TextField
                    fullWidth
                    id="kurum-adi"
                    label="Kurum Adı"
                    name="corporationName"
                    value={formik.values.corporationName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched && formik.errors.corporationName ? true : false
                    }
                    helperText={(formik.touched && formik.errors.corporationName) ?? ""}
                    style={{ marginBottom: 20 }}
                  />
                </>
              )}
              <TextField
                fullWidth
                id="telefon"
                label="Telefon"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched && formik.errors.phoneNumber ? true : false
                }
                helperText={(formik.touched && formik.errors.phoneNumber) ?? ""}
                style={{ marginBottom: 20 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="e-mail"
                label="E-Mail"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={
                  formik.touched && formik.errors.email ? true : false
                }
                helperText={(formik.touched && formik.errors.email) ?? ""}
                style={{ marginBottom: 20 }}
              />
              <TextareaInput
                fullWidth
                id="adres"
                label="Adres"
                name="address"
                rows={4}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={
                  formik.touched && formik.errors.address ? true : false
                }
                helperText={(formik.touched && formik.errors.address) ?? ""}
                style={{ marginBottom: 20 }}
              />
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
                // onClick={handleSubmit}
                // style={{ textTransform: "none", width: "200px" }}
                onClick={formik.handleSubmit}
              >
                Kaydet
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default CustomerModalComponent;
