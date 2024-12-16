import React, { useEffect, useState } from "react";
import Home from "../../components/Home";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import "./customer-page.css";
import CustomerModalComponent from "../../CommonComponents/CustomerModalComponent";
import GenericTable from "../../CommonComponents/GenericTable";
import customerService from "../../services/customerService"; // Import customerService
import { useNavigate } from "react-router-dom";
import FilterModal from "../../CommonComponents/FilterModal";
import SearchIcon from "@mui/icons-material/Search";
import UpdateCustomer from "../../components/UpdateCustomer"; // UpdateCustomer import
const Index = () => {
  const customerColumns = [
    { field: "id", headerName: "ID" },
    { field: "tcNo", headerName: "TC KİMLİK NUMARASI" },
    { field: "taxNo", headerName: "VERGİ NUMARASI" },
    { field: "firstName", headerName: "AD" },
    { field: "lastName", headerName: "SOYAD" },
    { field: "corporationName", headerName: "KURUM AD" },
    { field: "dateOfBirth", headerName: "DOĞUM TARİHİ" },
    { field: "phoneNumber", headerName: "TELEFON NUMARASI" },
    { field: "email", headerName: "E - MAİL" },
    { field: "address", headerName: "ADRES" },
    { field: "type", headerName: "MÜŞTERİ TİPİ" },
    { field: "balance", headerName: "TOPLAM BAKİYE" },
    {
      field: "actions",
      headerName: "PORTFÖY GÖRÜNTÜLE",
      render: (row) => (
        <Button onClick={() => navigate(`/portfolio/${row.id}`)}>
          Görüntüle
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "GÜNCELLEME",
      render: (row) => (
        <EditIcon
          color="inherit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedCustomer(row);
            setUpdateCustomerModalOpen(true);
          }}
        />
      ),
    },
  ];
  const navigate = useNavigate();

  const [personelsData, setCustomersData] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updateCustomerModalOpen, setUpdateCustomerModalOpen] = useState(false);
  const fields = [
    { name: "id", label: "ID", type: "text" },
    { name: "tcNo", label: "TC Kimlik", type: "text" },
    { name: "firstName", label: "Müşteri Adı", type: "text" },
    { name: "lastName", label: "Müşteri Soyadı", type: "text" },
    { name: "corporationName", label: "Kurum Adı", type: "text" },
    { name: "type", label: "Müşteri Tipi", type: "text" },
    { name: "taxNo", label: "Vergi Numarası", type: "text" },
  ];

  useEffect(() => {
    customerService
      .searchAllCustomer(
        filters.id,
        filters.tcNo,
        filters.firstName,
        filters.lastName,
        filters.corporationName,
        filters.type,
        filters.taxNo
      )
      .then((response) => {
        const adjustedData = response.data.map((item) => {
          return {
            ...item,
            createdDate: new Date(item.createdDate).toLocaleDateString(),
          };
        });
        setCustomersData(adjustedData);
      })
      .catch((err) => {
        console.error("Bir hata oluştu:", err);
      });
  }, [filters]);
  // const [searchParams, setSearchParams] = useState({
  //   id: "",
  //   firstName: "",
  //   lastName: "",
  //   corporationName: "",
  //   type: "",
  //   tcNo: "",
  //   address: "",
  //   taxNo: "",
  //   dateOfBirth: "",
  //   phoneNumber: "",
  //   email: "",
  //   balance: "",
  // });

  // const handleCUstomerList = () => {
  //   const {
  //     id,
  //     firstName,
  //     lastName,
  //     corporationName,
  //     type,
  //     tcNo,
  //     address,
  //     taxNo,
  //     dateOfBirth,
  //     phoneNumber,
  //     email,
  //     balance,
  //   } = searchParams;

  //   customerService
  //     .searchAllCustomer(
  //       id,
  //       firstName,
  //       lastName,
  //       corporationName,
  //       type,
  //       tcNo,
  //       address,
  //       taxNo,
  //       dateOfBirth,
  //       phoneNumber,
  //       email,
  //       balance
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //       setData(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const handleInputChange = (event) => {
  //   const { id, value } = event.target;
  //   setSearchParams((prevParams) => ({
  //     ...prevParams,
  //     [id]: value,
  //   }));
  // };

  return (
    <Home>
      <div style={{display: 'flex', flexDirection: 'row', margin: '20px', gap: '1rem'}}>

          <CustomerModalComponent />
          <div style={{width: '100%', verticalAlign: 'center'}}>

            <Button
              variant="contained"
              style={{
                backgroundColor: "#02224E",
                color: "#FFFFFF",
                width: "180px",
                height: "40px",
                borderRadius: "18px",
                textTransform: "none",
                marginTop: "16px",
              }}
              onClick={() => setFilterModalOpen(true)}
            >
              <SearchIcon style={{ marginRight: 8 }} />
              Filtrele
            </Button>
          </div>

        </div>
      {/* <div className="marginTop">
        <Paper elevation={12}>
          <Box p={3}>
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="id"
                  label="ID"
                  value={searchParams.id}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <TextField
                  fullWidth
                  id="tcNo"
                  label="TC Kimlik"
                  value={searchParams.tcNo}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <TextField
                  fullWidth
                  id="firstName"
                  label="Müşteri Adı"
                  value={searchParams.firstName}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <TextField
                  fullWidth
                  id="lastName"
                  label="Müşteri Soyadı"
                  value={searchParams.lastName}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <TextField
                  fullWidth
                  id="type"
                  label="Müşteri Tipi"
                  value={searchParams.type}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="taxNo"
                  label="Vergi Numarası"
                  value={searchParams.taxNo}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <TextField
                  fullWidth
                  id="corporationName"
                  label="Kurum Adı"
                  value={searchParams.corporationName}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <TextField
                  fullWidth
                  id="balance"
                  label="Toplam Bakiye"
                  value={searchParams.balance}
                  onChange={handleInputChange}
                  style={{ marginBottom: 20 }}
                />
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#02224E",
                    color: "#FFFFFF",
                    width: "180px",
                    height: "40px",
                    borderRadius: "18px",
                    textTransform: "none",
                  }}
                  onClick={handleCUstomerList}
                >
                  Müşteri Listesi
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </div> */}
      <div className="marginTop">
        <GenericTable
          columns={customerColumns}
          rows={personelsData}
          pagination={true}
        />
      </div>
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onFilter={setFilters}
        fields={fields}
      />
      <UpdateCustomer
        open={updateCustomerModalOpen}
        onClose={() => setUpdateCustomerModalOpen(false)}
        customer={selectedCustomer}
        onSave={(updatedCustomer) => {
          setCustomersData((prevData) =>
            prevData.map((customer) =>
              customer.id === updatedCustomer.id ? updatedCustomer : customer
            )
          );
          setUpdateCustomerModalOpen(false);
        }}
      />
    </Home>
  );
};

export default Index;
