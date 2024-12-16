import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button,
  IconButton, Grid, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import customerService from '../services/customerService';
import GenericTable from '../CommonComponents/GenericTable';
import FilterModal from '../CommonComponents/FilterModal'; // Assuming you have a FilterModal component

const CustomerSelection = ({ open, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    id: '',
    portfolioId: '',
    firstName: '',
    lastName: '',
    tcNo: '',
    corporationName: '',
    taxNo: '',
  });

  useEffect(() => {
    if (open) {
      fetchAllCustomers();
    }
  }, [open]);

  const fetchAllCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredCustomers = async (filters) => {
    setLoading(true);
    try {
      const data = await customerService.searchCustomers(filters);
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    setSearchParams(filters);
    fetchFilteredCustomers(filters);
    setFilterModalOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'Müşteri ID' },
    { field: 'tcNo', headerName: 'TC No' },
    { field: 'taxNo', headerName: 'Vergi No' },
    { field: 'firstName', headerName: 'Müşteri Adı' },
    { field: 'lastName', headerName: 'Müşteri Soyadı' },
    { field: 'corporationName', headerName: 'Kuruluş Adı' },
    { field: 'phoneNumber', headerName: 'Telefon Numarası' },
    { field: 'email', headerName: 'Email' },
    {
      field: 'actions', headerName: '', render: (row) => (
        <Button
          variant="contained"
          style={{ backgroundColor: '#02224E', color: '#FFFFFF', width: '180px', height: '40px', borderRadius: '18px' }}
          onClick={() => onClose(row)}
        >
          Müşteriyi Seç
        </Button>
      )
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={() => onClose(null)}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: {
          width: '80vw',
          height: '80vh',
          maxWidth: 'none',
        },
      }}
    >
      <DialogTitle style={{ backgroundColor: '#004AAD', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Müşteri Seçme Ekranı</span>
          <IconButton onClick={() => onClose(null)} style={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent style={{ marginTop: '20px' }}>
        <Box display="flex" justifyContent="left" style={{margin: '20px'}}>
          <Button
            variant="contained"
            style={{  backgroundColor: '#02224E', color: '#FFFFFF', width: '180px', height: '40px', borderRadius: '18px' }}
            color="primary"
            onClick={() => setFilterModalOpen(true)} // Open the filter modal
          >
            <SearchIcon style={{ marginRight: 8 }} />
            Filtrele
          </Button>
        </Box>
        <DialogContent>
          <GenericTable columns={columns} rows={customers} pagination />
        </DialogContent>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(null)} color="primary">Kapat</Button>
      </DialogActions>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onFilter={handleSearch}
        fields={[
          { name: 'id', label: 'Müşteri ID', type: 'text' },
          { name: 'portfolioId', label: 'Portföy ID', type: 'text' },
          { name: 'firstName', label: 'Müşteri Adı', type: 'text' },
          { name: 'lastName', label: 'Müşteri Soyadı', type: 'text' },
          { name: 'corporationName', label: 'Kurum Adı', type: 'text' },
          // { name: 'tcNo', label: 'TC', type: 'text' },
          
          { name: 'tcNo', label: 'TC', type: 'text' },
          { name: 'taxNo', label: 'Vergi No', type: 'text' },
        ]}
      />
    </Dialog>
  );
};

export default CustomerSelection;
