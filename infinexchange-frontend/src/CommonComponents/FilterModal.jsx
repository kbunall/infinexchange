import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

const FilterModal = ({ open, onClose, onFilter, fields }) => {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});

  const [filters, setFilters] = useState(initialState);

  const handleChange = (e, name) => {
    setFilters({
      ...filters,
      [name]: e.target.value,
    });
  };

  const handleFilter = () => {
    onFilter(Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== '')));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}
      PaperProps={{
        sx: {
          width: '50%',
          maxWidth: '50%',
        }
      }}
    >
      <DialogTitle>Filtrele</DialogTitle>
      <DialogContent style={{padding: '20px'}}>
        {fields.map((field) => (
          <Box mb={4} key={field.name}>
            <TextField
              label={field.label}
              value={filters[field.name]}
              type = {field.type}

              onChange={(e) => handleChange(e, field.name)}
              fullWidth
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">İptal</Button>
        <Button onClick={handleFilter} color="primary">Filtrele</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
