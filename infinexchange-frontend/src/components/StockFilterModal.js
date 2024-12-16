import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

const StockFilterModal = ({ open, onClose, onFilter }) => {
  const [taxNo, setTaxNo] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [corporationName, setCorporationName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [amount, setAmount] = useState('');

  const handleFilter = () => {
    const filters = {
      taxNo: taxNo || undefined,
      tcNo: tcNo || undefined,
      corporationName: corporationName || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      currencyCode: currencyCode || undefined,
      amount: amount ? parseFloat(amount) : undefined,
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
        <Box mb={2}>

        </Box>
        <Box mb={2}>
          <TextField
            label="Vergi Numarası"
            value={taxNo}
            onChange={(e) => setTaxNo(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Kimlik Numarası"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Kurum Adı"
            value={corporationName}
            onChange={(e) => setCorporationName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Müşteri Adı"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Müşteri Soyadı"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Döviz Kodu"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Miktar"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
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

export default StockFilterModal;
