import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import dayjs from 'dayjs'; // Library for date formatting

const FilterModal = ({ open, onClose, onFilter }) => {
  const [customerId, setCustomerId] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [corporationName, setCorporationName] = useState('');
  const [taxNo, setTaxNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    const filters = {
      customerId: customerId ? parseInt(customerId) : undefined,
      customerFirstName: customerFirstName || undefined,
      customerLastName: customerLastName || undefined,
      tcNo: tcNo || undefined,
      corporationName: corporationName || undefined,
      taxNo: taxNo || undefined,
      startDate: startDate ? dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : undefined,
      endDate: endDate ? dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : undefined,
    };
    onFilter(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}
    PaperProps={{
      sx: {
        width: '50%', // Or any percentage you prefer
        maxWidth: '50%' // Ensures it does not exceed the percentage width
      }
    }}
    >
      <DialogTitle>Filtrele</DialogTitle>
      <DialogContent>
        <Box mb={4}>
          <TextField
            label="Müşteri ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="Müşteri Adı"
            value={customerFirstName}
            onChange={(e) => setCustomerFirstName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="Müşteri Soyadı"
            value={customerLastName}
            onChange={(e) => setCustomerLastName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="TC No"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="Şirket Adı"
            value={corporationName}
            onChange={(e) => setCorporationName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="Vergi No"
            value={taxNo}
            onChange={(e) => setTaxNo(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="Başlangıç Tarihi"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box mb={4}>
          <TextField
            label="Bitiş Tarihi"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">İptal</Button>
        <Button onClick={handleFilter} color="primary">Filtrele</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
