import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Grid, FormControl, FormControlLabel, MenuItem, Paper, Radio, RadioGroup, TextField, } from '@mui/material';
import { Input, FormGroup, Label } from 'reactstrap';
import Home from './Home';
import CustomerSelection from './CustomerSelection';
import FilterModal from '../CommonComponents/FilterModal'
import customerService from '../services/customerService';
import GenericTable from '../CommonComponents/GenericTable';
import SearchIcon from '@mui/icons-material/Search';
import convert from '../convert.png'; 
import { CustomAlert } from '../utils/alert';
import Swal from 'sweetalert2';


const currencies = [
  'USD', 'TRY', 'EUR', 'AUD', 'DKK', 'GBP', 'CHF', 'SEK', 'CAD', 'KWD', 
  'NOK', 'SAR', 'JPY', 'BGN', 'RON', 'RUB', 'IRR', 'CNY', 'PKR', 'QAR', 
  'KRW', 'AZN', 'AED'
];

const columns = [
  { headerName: 'Müşteri Numarası', field: 'customerId', align: 'left' },
  { headerName: 'Müşteri Ad Soyad', field: 'customerNameSurname', align: 'left' },
  { headerName: 'Personel Kullanıcı Adı', field: 'userName', align: 'left' },
  { headerName: 'Alınan Döviz', field: 'buyCurrencyCode', align: 'left'},
  { headerName: 'Satılan Döviz', field: 'currencyCode', align: 'left'},
  { headerName: 'Miktar', field: 'amount', align: 'left' },
  { headerName: 'İşlem Tutarı', field: 'cost', align: 'left'},
  { headerName: 'Tarih', field: 'transactionDate', align: 'left' },
  { headerName: 'Saat', field: 'transactionTime', align: 'left'},
];

const Trade = () => {
  const [amount, setAmount] = useState(0);
  const [firstAmount, setFirstAmount] = useState(0);
  const [secondAmount, setSecondAmount] = useState(0);
  const [cost, setCost] = useState(0);
  const [currencyList, setCurrencyList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [operation, setOperation] = useState('buy');
  const [firstBalance, setFirstBalance] = useState('0');
  const [secondBalance, setSecondBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerSurname, setCustomerSurname] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [personnelName, setPersonnelName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openCustomerSelection, setOpenCustomerSelection] = useState(false);

  const [firstCurrency, setFirstCurrency] = useState('USD');
  const [secondCurrency, setSecondCurrency] = useState('TRY');

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [openFilterModal, setOpenFilterModal] = useState(false);

  const [selectedOperation, setSelectedOperation] = useState('buy');

  const handleOperation = (event) => {
    setSelectedOperation(event.target.value);
  }

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const handleOpenCustomerSelection = () => {
    setOpenCustomerSelection(true);
  };

  const handleCloseCustomerSelection =  (customer) => {
    setOpenCustomerSelection(false);
    if (customer) {
      setSelectedCustomer(customer);

      console.log('Selected Customer in Transaction Page:', customer);
    } else {
      console.log('Seçilemedi');
    }
  };

  const handleFirstCurrencyChange = async (event) => {
    const newCurrency = event.target.value;
    setFirstCurrency(newCurrency);
    await handleCustomer(newCurrency, secondCurrency); 
  };
  
  const handleSecondCurrencyChange = async (event) => {
    const newCurrency = event.target.value;
    setSecondCurrency(newCurrency);
    await handleCustomer(firstCurrency, newCurrency); 
  };

  const handleCustomer = async (firstCurrency, secondCurrency) => {
    if(selectedCustomer == null)
        return;
    try {
      const customerData = await customerService.getCustomerById(selectedCustomer.id);

      const updateBalance = (currency) => {
        if (currency === 'TRY') return customerData.customerResponse.balance;
        const result = customerData.portfolio.find(item => item.currencyCode === currency);
        return result ? result.amount : 0;
      };
      setFirstBalance(updateBalance(firstCurrency));
      setSecondBalance(updateBalance(secondCurrency));
  
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };
  

  const handleTrade = async () => {
    if(selectedCustomer == null){
      CustomAlert(
        "İşlem Başarısız",
        "error",
        "Lütfen müşteri seçiniz!"
      );
        return
    }
    let firstAmountNormalized = parseFloat(firstAmount.toFixed(4));
    let secondAmountNormalized = parseFloat(secondAmount.toFixed(4));
    Swal.fire({
      title: "Bu işlemi onaylamak istediğinize emin misiniz?",
      icon: "warning",
      text: `Bu işlem sonucunda hesabınızdan ${selectedOperation === 'buy' ? secondAmountNormalized + " " + secondCurrency: firstAmountNormalized + " " + firstCurrency} eksilecek ve ${selectedOperation === 'buy' ? firstAmountNormalized + " " + firstCurrency: secondAmountNormalized + " " + secondCurrency} eklenecektir.`, 
      showCancelButton: true,
      confirmButtonText: "Evet, Onayla",
      cancelButtonText: "Hayır, İptal Et",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {        
          setFirstAmount(0);
          setSecondAmount(0);
          const token = localStorage.getItem('accessToken');
  
          const response = await axios.post(`http://localhost:9090/api/v1/currency-transactions/${selectedOperation}`, {
          'customerId': selectedCustomer.id,
          'currencyCode': selectedOperation === 'buy' ? secondCurrency : firstCurrency,
          'amount': firstAmount,
          'buyCurrencyCode': selectedOperation === 'buy' ? firstCurrency : secondCurrency,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        await handleCustomer(firstCurrency, secondCurrency);
        await handleTransactions();
        Swal.fire({
          title: "İşlem başarılı!",
          text: "İşleminiz başarıyla gerçekleştirildi.",
          icon: "success",
          confirmButtonText: "Tamam"
        });
  
      } catch (error) {
        console.error('Giriş başarısız:', error.response.data.errors.error);
        if(error.response.data.errors.error !== undefined){
          CustomAlert(
            "İşlem Başarısız",
            "error",
            "Bakiye yetersiz!"
          );
        }else if(error.response.data.errors.amount === "must be greater than 0"){
          CustomAlert(
            "İşlem Başarısız",
            "error",
            "Geçersiz miktar!"
          );
        }
  
      }
      }
  });
    
  };

  const getRates = (currency) => {
    const item = currencyList.find(item => item.code === currency);
    console.log(item)
    return item ? { buying: item.buying, selling: item.selling, unit: item.unit } : { buying: 1, selling: 1, unit: 1 };
  };

  const handleTransactions = async () =>{
    
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axios.get('http://localhost:9090/api/v1/currency-transactions/search', {
            params: {
              ...(customerID && { customerId: customerID }),
              ...(customerName && { customerFirstName: customerName }),
              ...(customerSurname && { customerLastName: customerSurname }),
              ...(corporateName && { customerCorporationName: corporateName }),
              ...(personnelName && { username: personnelName }),
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response)
    const processedData = response.data.filter(item => {
      const transactionDate = new Date(item.transactionDate);
      const isAfterStartDate = !startDate || transactionDate >= new Date(startDate + 'T00:00:00.000000');
      const isBeforeEndDate = !endDate || transactionDate <= new Date(endDate + 'T00:00:00.000000');
      return isAfterStartDate && isBeforeEndDate;
    }).sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)).map(item => {
        const customerNameSurname = item.customerFirstName + ' ' + item.customerLastName;
        const cost = item.amount * item.exchangeRate;
        return {
          ...item,
          customerNameSurname: (item.customerFirstName == null || item.customerFirstName === "") ? item.companyName: customerNameSurname,
          transactionDate: (new Date(item.transactionDate)).toLocaleDateString(),
          transactionTime: (new Date(item.transactionDate)).toLocaleTimeString(),
          cost: parseFloat(cost.toFixed(4)) + 'TRY',
        };
        
      });

    setTransactionList(processedData);

    } catch (error) {
    console.error('Error fetching customer data:', error);
    }
};

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/v1/currencies', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const processedData = response.data.map(item => {
          const dateTime = new Date(item.updatedDate);
          return {
            ...item,
            date: dateTime.toLocaleDateString(),
            time: dateTime.toLocaleTimeString(),
          };
        });
        setCurrencyList(processedData);
        setLoading(false);
        await handleCustomer(firstCurrency, secondCurrency);

      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [firstCurrency, secondCurrency, selectedCustomer]);

  useEffect(() => {
    firstConvertSecond()
  }, [amount, firstCurrency, secondCurrency, selectedOperation]);

  useEffect(() => {



    handleTransactions();
  }, [customerName, customerSurname, corporateName, personnelName, startDate, endDate]);

  const firstConvertSecond = () => {
    const firstCurrencyData = currencyList.find(item => item.code === firstCurrency);
    const secondCurrencyData = currencyList.find(item => item.code === secondCurrency);

    if (firstCurrencyData && secondCurrencyData) {
        if (selectedOperation === 'buy') {
            setSecondAmount((firstAmount * firstCurrencyData.selling / firstCurrencyData.unit) / (secondCurrencyData.buying / secondCurrencyData.unit));
        } else {
            setSecondAmount((firstAmount * firstCurrencyData.buying / firstCurrencyData.unit) / (secondCurrencyData.selling / secondCurrencyData.unit));
        }
    }
};

const secondConvertFirst = () => {
    const firstCurrencyData = currencyList.find(item => item.code === firstCurrency);
    const secondCurrencyData = currencyList.find(item => item.code === secondCurrency);

    if (firstCurrencyData && secondCurrencyData) {
        if (selectedOperation === 'buy') {
            setFirstAmount((secondAmount * secondCurrencyData.buying / secondCurrencyData.unit) / (firstCurrencyData.selling / firstCurrencyData.unit));
        } else {
            setFirstAmount((secondAmount * secondCurrencyData.selling / secondCurrencyData.unit) / (firstCurrencyData.buying / firstCurrencyData.unit));
        }
    }
};

    useEffect(() => {
        if (firstAmount >= 0) firstConvertSecond();
    }, [firstAmount]);

    useEffect(() => {
        if (secondAmount >= 0) secondConvertFirst();
    }, [secondAmount]);

    useEffect(() => {
      firstConvertSecond();
    }, [selectedOperation])
  return (
    <Home>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{display: 'flex', flexDirection: 'row', margin: '20px'}}>
          <Button
            variant="contained"
            onClick={handleOpenCustomerSelection}
            style={{ backgroundColor: '#02224E',color: "#FFFFFF", width:'180px',height:'40px',borderRadius:'18px'  }}
          >
            <SearchIcon style={{ marginRight: 8 }} />
            Müşteri Seç
          </Button>
          

          <Input disabled style={{width: '180px', marginLeft: '20px', backgroundColor: selectedCustomer ? '#C5FF98' : '#FFAAAA'}} value={selectedCustomer ? selectedCustomer.id + " " + (selectedCustomer.firstName !== undefined && selectedCustomer.firstName !== "" ? selectedCustomer.firstName + " " + selectedCustomer.lastName: selectedCustomer.corporationName) : "Müşteri Seçilmedi"}></Input>
        </div>
        <Paper elevation={12}>
          <Box p={3}>
            <Box sx={{ flexGrow: 1 }} my={0}>
              <Grid container spacing={2}>
        <div style={{width: '100%', height: '35%', display: 'flex', flexDirection: 'row'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem', 
            marginBottom: '10px',  
            width: '100%',
            flexDirection: 'column'
        }}>
            <FormControl style={{width: '100%', alignItems: 'center'}}>
              <RadioGroup style={{ gap: '9rem'}} row value={selectedOperation} onChange={handleOperation}>
                <Box display="flex" alignItems="center">
                  <FormControlLabel value="buy" control={<Radio />} label="Alış" />
                  <TextField
                    variant="outlined"
                    size="small"
                    sx={{ margin: 1, pointerEvents: 'none'}}
                    value={parseFloat(((getRates(firstCurrency).selling/getRates(firstCurrency).unit) / (getRates(secondCurrency).buying /getRates(secondCurrency).unit)).toFixed(4)) + " " + secondCurrency}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  <FormControlLabel value="sell" control={<Radio />} label="Satış" />
                  <TextField
                    variant="outlined"
                    size="small"
                    sx={{ margin: 1, pointerEvents: 'none'}}
                    value={parseFloat(((getRates(firstCurrency).buying/getRates(firstCurrency).unit) / (getRates(secondCurrency).selling /getRates(secondCurrency).unit)).toFixed(4)) + " " + secondCurrency}
                  />
                </Box>
              </RadioGroup>
            </FormControl>

            <div style={{display: 'flex', flexDirection: 'column'}}>
            
            <div style={{
                display: 'flex',
                width: '100%',
                gap: '1rem', 
                verticalAlign :'center', 
                flexDirection: 'row',
                placeContent: 'center'
            }}> 
                <FormGroup floating style={{ minWidth: "20%", border: '1px solid #004AAD', boxSizing: 'border-box'}}>
                  <Input
                      type='number'
                      id='cost'
                      placeholder="Cost"
                      value={parseFloat(firstAmount.toFixed(4))}
                      onChange={(e) => { setFirstAmount(Number(e.target.value) >= 0 ? Number(e.target.value) : 0); }}
                      required
                      style={{
                          width: '100%',
                          height: '5%',
                          gap: '0px',
                          borderRadius: '4px',
                          backgroundColor: '#C0DBEA',
                          textAlign: 'center',
                          fontSize: '20px'
                      }}
                  />
                  <Label for='cost'>Miktar</Label>
                  <span style={{display: 'inline-block', width: '100%', textAlign: 'center', marginTop: '5px', fontWeight: 1000,}} >Bakiye = {firstBalance + ' ' + firstCurrency}</span>
                </FormGroup>
                <TextField
                    id="firstCurrency"
                    select
                    label= {selectedOperation == 'buy' ? "Alınacak Kıymet Türü" : "Satılacak Kıymet Türü"}
                    value={firstCurrency}
                    onChange={handleFirstCurrencyChange}
                    style={{ minWidth: "20%", height: '5%', fontSize:'20px'}}
                >
                    {currencies.map((code, index) => (
                        (code != secondCurrency && 
                        <MenuItem key={index} value={code}>{code}</MenuItem>
                      )
                    ))}
                </TextField>
                <div style={{width: '3%', height: '100%', display: 'flex', verticalAlign: 'middle'}}>
                  <img className='logo' src={convert} style={{width: '100%', height: '50%'}}></img>
                </div>

                <FormGroup floating style={{ minWidth: "20%", border: '1px solid #004AAD', boxSizing: 'border-box'}}>
                  <Input
                      type='number'
                      id='cost'
                      placeholder="Cost"
                      value={parseFloat(secondAmount.toFixed(4))}
                      onChange={(e) => { setSecondAmount(Number(e.target.value) >= 0 ? Number(e.target.value) : 0); }}
                      required
                      style={{
                          width: '100%',
                          height: '5%',
                          gap: '0px',
                          borderRadius: '4px',
                          backgroundColor: '#C0DBEA',
                          textAlign: 'center',
                          fontSize: '20px'
                      }}
                  />
                  <Label for='cost'>Miktar</Label>
                  <span style={{display: 'inline-block', width: '100%', textAlign: 'center', marginTop: '5px', fontWeight: 1000,}} >Bakiye = {secondBalance + ' ' + secondCurrency}</span>
                </FormGroup>
                <TextField
                    id="secondCurrency"
                    select
                    label= {selectedOperation != 'buy' ? "Alınacak Kıymet Türü" : "Satılacak Kıymet Türü"}
                    value={secondCurrency}
                    onChange={handleSecondCurrencyChange}
                    style={{ minWidth: "20%", height: '5%', fontSize:'20px'}}

                >
                    {currencies.map((code, index) => (
                        (code != firstCurrency && 
                          <MenuItem key={index} value={code}>{code}</MenuItem>
                        )
                    ))}
                </TextField>
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'right', alignContent: 'center', marginTop: '10px', marginBottom: '10px'}}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#02224E',color: "#FFFFFF", width:'180px',height:'40px',borderRadius:'18px'  }}
                  onClick={handleTrade}
                >
                  Onayla
                </Button>
                </div>
        </div>
        </div>
        </div>
        </Grid>
        </Box>
      </Box>
    </Paper>
        <div style={{
            width: '100%',
            height: '60%',
        }}>
          
  <CustomerSelection
  open={openCustomerSelection}
  onClose={handleCloseCustomerSelection}
  />
  <div style={{display: 'flex', width: '100%', justifyContent: 'left', margin: '20px'}}>
          <Button
            variant="contained"
            style={{backgroundColor: '#02224E',color: "#FFFFFF", width:'180px',height:'40px',borderRadius:'18px' }}
            onClick={handleOpenFilterModal}
          >
            <SearchIcon style={{ marginRight: 8 }} />
            Filtrele
          </Button>
  </div>
          {openFilterModal && (
          <FilterModal
            open={openFilterModal}
            onClose={handleCloseFilterModal}
            fields = {[
              { label: 'Müşteri Numarası', name: 'customerId'},
              { label: 'Müşteri Ad', name: 'customerName' },
              { label: 'Müşteri Soyad', name: 'customerSurname' },
              { label: 'Kurum Adı', name: 'corporateName'},
              { label: 'Personel Adı', name: 'personnelName'},
              { label: 'Başlangıç Tarihi', name: 'startDate', type: 'date'},
              { label: 'Bitiş Tarihi', name: 'endDate', type: 'date'},
            ]}
            onFilter={(filters) => {
              setCustomerName(filters.customerName || '');
              setCustomerSurname(filters.customerSurname || '');
              setCorporateName(filters.corporateName || '');
              setPersonnelName(filters.personnelName || '');
              setStartDate(filters.startDate || '');
              setEndDate(filters.endDate || '');
              }}
          />
        )}

        <GenericTable
          rows = {transactionList}
          columns={columns}
          pagination={true}
        ></GenericTable>
          </div>
        </div>
    </Home>
  );
}

export default Trade;