import React, { useState, useEffect } from "react";
import { Modal, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import customerService from "../services/customerService";

const UpdateCustomer = ({ open, onClose, customer }) => {
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    tcNo: "",
    taxNo: "",
    corporationName: "",
    email: "",
    address: "",
    phoneNumber: "",
    type: "", // Müşteri tipini ekleyin
    dateOfBirth: "" // Tarih için string kullanıyoruz
  });

  useEffect(() => {
    if (customer) {
      setCustomerData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        tcNo: customer.tcNo || "",
        taxNo: customer.taxNo || "",
        corporationName: customer.corporationName || "",
        email: customer.email || "",
        address: customer.address || "",
        phoneNumber: customer.phoneNumber || "",
        type: customer.type || "", // Müşteri tipini güncelleyin
        dateOfBirth: customer.dateOfBirth || "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleTypeChange = (e) => {
    setCustomerData({ ...customerData, type: e.target.value });
  };

  const handleUpdate = () => {
    if (!customer) return;

    // Boş değerleri kontrol etme
    const requiredFields = [
      "email",
      "address",
      "phoneNumber"
    ];

    if (customerData.type === "B") {
      requiredFields.push("firstName", "lastName", "tcNo");
    } else if (customerData.type === "K") {
      requiredFields.push("taxNo", "corporationName");
    }

    for (const field of requiredFields) {
      if (!customerData[field]) {
        alert(`${field} alanı boş olamaz.`);
        return;
      }
    }

    customerService.updateCustomer(customer.id, customerData)
      .then(() => {
        alert("Müşteri başarıyla güncellendi!");
        onClose(); // Modal'ı kapat
      })
      .catch((err) => {
        console.error("Güncelleme başarısız:", err);
        alert("Güncelleme sırasında bir hata oluştu.");
      });
  };

  // Müşteri tipine göre input alanlarını belirleme
  const isIndividual = customerData.type === "B";
  const isCorporate = customerData.type === "K";

  return (
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
        {/* <h2>Müşteri Bilgilerini Güncelle</h2>
        <FormControl fullWidth margin="normal">
          <InputLabel>Müşteri Tipi</InputLabel>
          <Select
            value={customerData.type}
            onChange={handleTypeChange}
            name="type"
            label="Müşteri Tipi"
          >
            <MenuItem value="B">Bireysel</MenuItem>
            <MenuItem value="K">Kurumsal</MenuItem>
          </Select>
        </FormControl> */}

        {isIndividual && (
          <>
            <TextField
              label="Ad"
              name="firstName"
              value={customerData.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Soyad"
              name="lastName"
              value={customerData.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="TC Kimlik No"
              name="tcNo"
              value={customerData.tcNo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            
        <TextField
          label="Doğum Günü"
          name="dateOfBirth"
        //   type="date"
          value={customerData.dateOfBirth}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }} // Etiketin doğru görünmesini sağlar
        />
          </>

        )}


        {isCorporate && (
          <>
            <TextField
              label="Vergi No"
              name="taxNo"
              value={customerData.taxNo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Kurum Adı"
              name="corporationName"
              value={customerData.corporationName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
        <TextField
          label="E-posta"
          name="email"
          value={customerData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Adres"
          name="address"
          value={customerData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Telefon Numarası"
          name="phoneNumber"
          value={customerData.phoneNumber}
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
  );
};

export default UpdateCustomer;
