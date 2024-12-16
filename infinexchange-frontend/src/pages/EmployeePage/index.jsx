import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, Paper, Box } from "@mui/material";
import GenericTable from "../../CommonComponents/GenericTable";
import Home from "../../components/Home";
import EmployeeModalComponent from "../../CommonComponents/EmployeeModalComponent";
import employeeService from "../../services/employeeService";
import EditIcon from "@mui/icons-material/Edit";
import FilterModal from "../../CommonComponents/FilterModal";
import { isAdmin } from '../../utils/tokenUtils';
import SearchIcon from '@mui/icons-material/Search';
import UpdateModal from "../../components/UpdateModal";

const employeeColumns = [
  { field: "id", headerName: "ID" },
  { field: "username", headerName: "KULLANICI ADI" },
  { field: "firstName", headerName: "AD" },
  { field: "lastName", headerName: "SOYAD" },
  { field: "email", headerName: "E - MAİL" },
  { field: "role", headerName: "YETKİ TÜRÜ" },
  { field: "createdDate", headerName: "OLUŞTURMA TARİHİ" },
  {
    field: "actions",
    headerName: "GÜNCELLE",
    render: (row) => (
      <>
        <EditIcon
          color="inherit"
          style={{ cursor: "pointer" }}
          onClick={() => alert(row.username)}
        />
      </>
    ),
  },
];


// useEffect(() => {
//   const checkAdmin = () => {
//     if (!isAdmin()) {
//       navigate('/unauthorized'); 
//     }
//   };

//   checkAdmin();
// }, [navigate]);

const Index = () => {
  const [personelsData, setPersonelsData] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Bu satır eksikti

  const [filters, setFilters] = useState({});

  const handleOpenUpdateModal = (employee) => {
    setSelectedEmployee(employee);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedEmployee(null);
  };

  const employeeColumns = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "KULLANICI ADI" },
    { field: "firstName", headerName: "AD" },
    { field: "lastName", headerName: "SOYAD" },
    { field: "email", headerName: "E - MAİL" },
    { field: "role", headerName: "YETKİ TÜRÜ" },
    { field: "createdDate", headerName: "OLUŞTURMA TARİHİ" },
    {
      field: "actions",
      headerName: "GÜNCELLEME",
      render: (row) => (
        <>
          <EditIcon
            color="inherit"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenUpdateModal(row)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    employeeService
      .searchAllEmployee(filters.id, filters.userName, filters.firstName, filters.lastName)
      .then((response) => {
        const adjustedData = response.data.map(item => {
          return {
            ...item,
            createdDate: (new Date(item.createdDate)).toLocaleDateString(),
          };
        });

        setPersonelsData(adjustedData);
      })
      .catch((err) => {
        console.error("Bir hata oluştu:", err);
      });
  }, [filters]);

  return (
    <>
      <Home>

        <div style={{display: 'flex', flexDirection: 'row', margin: '20px', gap: '1rem'}}>
        <EmployeeModalComponent/>
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
                  marginTop: '16px'
                }}
                onClick={() => setFilterModalOpen(true)}
              >
                <SearchIcon style={{ marginRight: 8 }} />

                Filtrele
              </Button>
            </div>
        </div>



        <div className="marginTop">
          <GenericTable columns={employeeColumns} rows={personelsData} pagination={true}/>
        </div>
      </Home>

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onFilter={setFilters}
        fields={[
          { name: 'userName', label: 'Kullanıcı Adı', type: 'text' },
          { name: 'firstName', label: 'Ad', type: 'text' },
          { name: 'lastName', label: 'Soyad', type: 'text' },
          { name: 'id', label: 'Personel ID', type: 'text' },
        ]}
      />

      <UpdateModal
        open={updateModalOpen}
        onClose={handleCloseUpdateModal}
        employee={selectedEmployee}
      />
    </>
  );
};

export default Index;