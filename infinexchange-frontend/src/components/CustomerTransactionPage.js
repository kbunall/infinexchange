import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import Home from './Home';
import CustomerSelection from './CustomerSelection';
import customerService from '../services/customerService';
import transactionService from '../services/accountTransactionService';
import FilterModal from '../CommonComponents/FilterModal';
import SearchIcon from '@mui/icons-material/Search';
import GenericTable from '../CommonComponents/GenericTable';
import Swal from 'sweetalert2';

const CustomerTransactionPage = () => {
  const [openCustomerSelection, setOpenCustomerSelection] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const handleFilterTransactions = (filters) => {
    handleListTransactions(filters);
  };

  const handleOpenCustomerSelection = () => {
    setOpenCustomerSelection(true);
  };

  const handleCloseCustomerSelection = async (customer) => {
    setOpenCustomerSelection(false);
    if (customer) {
      setSelectedCustomer(customer);
      await handleListTransactions();
    }
  };

  const handleListTransactions = async (filters = {}) => {
    try {
      const { startDate, endDate, ...filteredFilters } = filters;

      const data = await transactionService.searchTransactions(filteredFilters);

      console.log(data)

      const processedData = data.filter(item => {
        const transactionDate = new Date(item.transactionDate);
        const isAfterStartDate = !filters.startDate || transactionDate >= new Date(filters.startDate + 'T00:00:00.000000');
        const isBeforeEndDate = !filters.endDate || transactionDate <= new Date(filters.endDate + 'T00:00:00.000000');
        return isAfterStartDate && isBeforeEndDate;
      })
      console.log(processedData);
  
      // Her bir işlem için tarih ve saati ayırıyoruz
      const transactionsWithFormattedDate = processedData.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)).map(item => {
        return {
          ...item,
        };

      }).map(transaction => {
        const date = new Date(transaction.transactionDate);
        return {
          ...transaction,
          formattedDate: date.toLocaleDateString('tr-TR'),
          formattedTime: date.toLocaleTimeString('tr-TR'),
          accountTransactionType: transaction.accountTransactionType === 'DEPOSIT' ? 'Yatırım' : 'Çekim',
          tcNo: transaction.tcNo !== "" ? transaction.tcNo : transaction.taxNo,
        };
      });


  
      setTransactions(transactionsWithFormattedDate);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleTransaction = async () => {
    if (selectedCustomer) {
      const transactionRequest = {
        customerId: selectedCustomer.id,
        amount: parseFloat(amount)
      };
      try {
        if (transactionType === 'deposit') {
          await transactionService.deposit(transactionRequest);
        } else if (transactionType === 'withdraw') {
          await transactionService.withdraw(transactionRequest);
        }
        setAmount('');
        await handleListTransactions();
        const updatedCustomer = await customerService.getCustomerById(selectedCustomer.id);
        setSelectedCustomer(updatedCustomer.customerResponse);
      } catch (error) {
        console.error('Error processing transaction:', error);
        console.log(error.response.data.errors.error);
        if(error.response.data.errors.error === "Insufficient balance."){
          Swal.fire({
            title: "Hata!",
            text: "Bakiyeniz yetersiz.",
            icon: "error",
            confirmButtonText: "Tamam"
          });
          return -1;
        }
      }
    } else {
      console.error('No customer selected');
    }
  };

  const handleConfirmTransaction = async () => {

    if (!selectedCustomer) {
      Swal.fire({
        title: "Hata!",
        text: "Bir müşteri seçmelisiniz.",
        icon: "error",
        confirmButtonText: "Tamam"
      });
      return;
    }

    if (!amount) {
      setAmountError('İşlem tutarı boş bırakılamaz!');
      return;
    }

    setAmountError('');

    if(await handleTransaction() === -1)
      return;
    Swal.fire({
      title: "İşlem başarılı!",
      text: "İşleminiz başarıyla gerçekleştirildi.",
      icon: "success",
      confirmButtonText: "Tamam"
    });

  };

  const handleOpenDialog = () => {
    if (!amount) {
      setAmountError('İşlem tutarı boş bırakılamaz!');
      return;
    }
    if (amount < 0) {
      setAmountError('Negatif bir değer giremezsiniz!');
      return;
    }

    setAmountError('');

    Swal.fire({
      title: "Bu işlemi onaylamak istediğinize emin misiniz?",
      icon: "warning",
      text: transactionType === 'deposit' ? `Hesabınıza ${amount} TRY yatırılacaktır.` : `Hesabınızdan ${amount} TRY çekilecektir.`,
      showCancelButton: true,
      confirmButtonText: "Evet, Onayla",
      cancelButtonText: "Hayır, İptal Et",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmTransaction();
      }
    });
  };

  // Update amount state and reset error when amount changes
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (amountError) {
      setAmountError('');
    }
  };

  useEffect(() => {
    handleListTransactions();
  }, []);

  // Define columns for the table
  const columns = [
    { field: 'customerId', headerName: 'Müşteri Numarası' },
    { field: 'tcNo', headerName: 'TC No / Vergi No' },
   // { field: 'taxNo', headerName: 'Vergi Numarası' },
    { field: 'customerFirstName', headerName: 'Müşteri Adı' },
    { field: 'customerLastName', headerName: 'Müşteri Soyadı' },
    { field: 'corporationName', headerName: 'Kuruluş Adı' },
    { field: 'accountTransactionType', headerName: 'İşlem Tipi (Yatırma - Çekme)',  orderable: 'true' },
    { field: 'amount', headerName: 'Miktar',  orderable: 'true' },
    { field: 'formattedDate', headerName: 'Tarih',  orderable: 'true' },
    { field: 'formattedTime', headerName: 'Saat' }
  ];
  
  return (
    <div>
      <Home>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
          <div style={{
            width: '100%',
            padding: 20,
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: 8,
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'left', marginBottom: 20 }}>
              <Button
                variant="contained"
                onClick={handleOpenCustomerSelection}
                style={{ backgroundColor: '#02224E', color: '#FFFFFF', width:'180px',height:'40px',borderRadius:'18px'  }}
              >
                <SearchIcon style={{ marginRight: 8 }} />
                Müşteri Seç
              </Button>
              <CustomerSelection
                open={openCustomerSelection}
                onClose={handleCloseCustomerSelection}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              {selectedCustomer && (
                <div style={{
                  padding: 10,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  textAlign: 'center'
                }}>
                  <h3>Müşteri Bilgileri</h3>
                  <p><strong>Adı:</strong> {selectedCustomer.firstName || selectedCustomer.corporationName}</p>
                  <p><strong>Soyadı:</strong> {selectedCustomer.lastName}</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <RadioGroup row value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <FormControlLabel value="deposit" control={<Radio />} label="Para Yatırma" />
                <FormControlLabel value="withdraw" control={<Radio />} label="Para Çekme" />
              </RadioGroup>
              <TextField
                label="İşlem Tutarı"
                variant="outlined"
                value={amount}
                onChange={handleAmountChange}
                type="number"
                fullWidth
                error={!!amountError}
                helperText={amountError}
              />
              <Button
                variant="contained"
                style={{ backgroundColor: '#02224E', color: '#FFFFFF', marginLeft: 10, width:'140px', height:'40px', borderRadius:'18px',marginTop: 6 }}
                onClick={handleOpenDialog}
              >
                Onayla
              </Button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <TextField
                label="Bakiye"
                value={selectedCustomer && selectedCustomer.balance !== undefined ? `${selectedCustomer.balance} TL` : 'Bakiye yok'}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
          <div style={{display: 'flex', width: '100%', justifyContent: 'left', margin: '20px'}}> 
        <Button
          variant="contained"
          style={{ backgroundColor: '#02224E', color: '#FFFFFF', width: '180px', height: '40px', borderRadius: '18px' }}
          onClick={handleOpenFilterModal}
        >
          <SearchIcon style={{ marginRight: 8 }} />
          Filtrele
        </Button>
      </div>

          
          <div style={{
            width: '100%',
          }}>
            <GenericTable
              columns={columns}
              rows={transactions}
              pagination={true}
            />
          </div>

        </div>

        {openCustomerSelection && (
          <CustomerSelection
            open={openCustomerSelection}
            onClose={handleCloseCustomerSelection}
          />
        )}

          {openFilterModal && (
                    <FilterModal
                      open={openFilterModal}
                      onClose={handleCloseFilterModal}
                      fields = {[
                        { label: 'Müşteri Numarası', name: 'customerId'},
                        { label: 'Müşteri Ad', name: 'customerFirstName' },
                        { label: 'Müşteri Soyad', name: 'customerLastName' },
                        { label: 'TC Numarası', name: 'tcNo'},
                        { label: 'Kurum Ad', name: 'corporationName'},
                        { label: 'Vergi Numarası', name: 'taxNo'},
                        { label: 'Başlangıç Tarihi', name: 'startDate', type: 'date'},
                        { label: 'Bitiş Tarihi', name: 'endDate', type: 'date'},
                      ]}
                      onFilter={(filters) => {
                        handleFilterTransactions(filters)
                        }}
                    />
                  )}

      </Home>
    </div>
  );
};

export default CustomerTransactionPage;
