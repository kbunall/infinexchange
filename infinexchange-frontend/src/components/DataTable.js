import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FaTrash, FaEdit } from 'react-icons/fa'; // npm install react-icons
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

const DataTable = ({ columns, rows, field, edit, deleteCurrency, updateCurrency }) => {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editCurrency, setEditCurrency] = useState(null);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);

  const setBackgroundColor = (value) => {
    if (value > 0) return '#C5FF98';
    else if (value < 0) return '#FFAAAA';
    return 'white';
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCurrency({ ...editCurrency, [name]: value });
  };

  const handleUpdate = () => {
    if (editCurrency) {
      updateCurrency(editCurrency);
      setEditModal(false);
    }
  };

  const handleDelete = () => {
    if (currencyToDelete) {
      deleteCurrency(currencyToDelete);
      setDeleteModal(false);
    }
  };
  
  return (
    <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <TableContainer component={Paper} style={{ width: '100%' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#004AAD' }}>
              {columns.map((column, index) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{
                    border: index === 0 ? '1px solid #004AAD' : '1px solid white',
                    borderRight: index === columns.length - 1 ? '1px solid #004AAD' : '1px solid white',
                    color: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => {
                  const cellValue = row[column.field];
                  const cellStyle = !column.field.localeCompare(field)
                    ? { backgroundColor: setBackgroundColor(cellValue) }
                    : {};
                  return (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                      style={cellStyle}
                      sx={{ border: '1px solid #004AAD', color: '#004AAD', boxSizing: 'border-box' }}
                    >
                      {cellValue}
                    </TableCell>
                  );
                })}
            
                {edit && (
                  <FaEdit
                    style={{
                      cursor: 'pointer',
                      margin: '5px',
                      top: '50%',
                      transform: 'translateY(50%)'
                    }}
                    onClick={() => {
                      setEditCurrency(row);
                      setEditModal(true);
                    }}
                  />
                )}
                {edit && (
                  <FaTrash
                    style={{
                      cursor: 'pointer',
                      margin: '5px',
                      top: '50%',
                      transform: 'translateY(50%)'
                    }}
                    onClick={() => {
                      setCurrencyToDelete(row);
                      setDeleteModal(true);
                    }}
                  />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>Update Currency</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name="buying"
            value={editCurrency?.buying || ''}
            onChange={handleEditChange}
            placeholder="Buying Price"
          />
          <Input
            type="text"
            name="selling"
            value={editCurrency?.selling || ''}
            onChange={handleEditChange}
            placeholder="Selling Price"
            style={{ marginTop: '10px' }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>Update</Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete {currencyToDelete?.currencyName}?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DataTable;
