import React, { useState, useEffect } from "react";
import { Modal, Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import employeeService from "../services/employeeService";

const UpdateModal = ({ open, onClose, employee }) => {
  const [employeeData, setEmployeeData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (employee) {
      setEmployeeData({
        username: employee.username || "",
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        role: employee.role || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (!employee) return;
    employeeService.updateUser(employee.id, employeeData)
      .then(() => {
        setSnackbarMessage("Güncelleme başarılı!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          onClose();
        }, 1500); // Snackbar süresi kadar bekle
      })
      .catch((err) => {
        setSnackbarMessage("Güncelleme başarısız!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
          }}
        >
          <h2>Kullanıcı Bilgilerini Güncelle</h2>
          <TextField
            label="Kullanıcı Adı"
            name="username"
            value={employeeData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ad"
            name="firstName"
            value={employeeData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Soyad"
            name="lastName"
            value={employeeData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="E-posta"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Yetki Türü"
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            fullWidth
          >
            Güncelle
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateModal;
