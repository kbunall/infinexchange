import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CheckboxInput from './CheckboxInput'
import {Input, FormGroup, Label} from 'reactstrap';
import DataTable from './DataTable';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../CommonComponents/GenericTable';
import { Box, Button, Grid, FormControl, FormControlLabel, FormLabel, MenuItem, Paper, Radio, RadioGroup, TextField, } from '@mui/material';


const currencies = [
    'USD',
    'TL',
    'EUR',
    'AUD',
    'DKK',
    'GBP',
    'CHF',
    'SEK',
    'CAD',
    'KWD',
    'NOK',
    'SAR',
    'JPY',
    'BGN',
    'RON',
    'RUB',
    'IRR',
    'CNY',
    'PKR',
    'QAR',
    'KRW',
    'AZN',
    'AED'
]

const columns = [
    { headerName: 'Döviz Kodu', field: 'code', align: 'left' },
    { headerName: 'TL Alış', field: 'buying', align: 'left' },
    { headerName: 'TL Satış', field: 'selling', align: 'left' },
    { headerName: 'Artış/Azalış Yüzdesi', field: 'priceChangePercentage', align: 'left', colorful: 'true'},
  ];
  

const MainPage = () => {
    const [amount, setAmount] = useState(0);
    const [cost, setCost] = useState(0);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [firstCurrency, setFirstCurrency] = useState('USD');
    const [secondCurrency, setSecondCurrency] = useState('TL');
    const [selectedItem, setSelectedItem] = useState(null);

    const navigate = useNavigate();

    const handleCheckbox = (index) => {
        console.log(index)
      const value = index;
      setSelectedItem(value);
    };
    const handleFirstCurrency = (event) => {
        setFirstCurrency(event.target.value);
    };
    const handleSecondCurrency = (event) => {
    setSecondCurrency(event.target.value);
    };

    useEffect(() => {
        const fetchCurrencies = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:9090/api/v1/currencies', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const processedData = response.data.map(item => {
              const dateTime = new Date(item.updatedDate);
              const priceChangePercentage = item.priceChangePercentage;
              return {
                ...item,
                date: dateTime.toLocaleDateString(),
                time: dateTime.toLocaleTimeString(),
              };
            });
            setRows(processedData);
            setLoading(false);
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };
    
        fetchCurrencies();
    }, []);
    const handleConversion =() => {
        console.log(firstCurrency, secondCurrency)
        let buyingFirst, buyingSecond, sellingFirst, sellingSecond;
        if(firstCurrency === 'TL'){
            buyingFirst = 1;
            sellingFirst = 1;
        }
        else{
            const item = rows.find(item => item.code === firstCurrency);

            if(item){
                buyingFirst = item.buying;
                sellingFirst = item.selling;
            }
        }
        if(secondCurrency === 'TL'){
            buyingSecond = 1;
            sellingSecond = 1;
        }else{
            const item = rows.find(item => item.code === secondCurrency);

            if(item){
                buyingSecond = item.buying;
                sellingSecond = item.selling;
            }
        }
        if(selectedItem === 1){
            setCost((buyingFirst * amount/sellingSecond).toFixed(3));
        }else{
            setCost((sellingFirst * amount/buyingSecond).toFixed(3));
        }

        console.log(buyingFirst, sellingFirst, buyingSecond, sellingSecond);
        
    }

    const handleTradeClick = (address) => {
        navigate(address); // Navigate to the trade page
    };
    return (
    <div>
        <Paper elevation={12}>
            <Box p={3} style={{marginTop: '20px'}}>
                <Box sx={{ flexGrow: 1 }} my={0} >
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <div style={{display: 'flex', width: '100%', height: '40%', justifyContent: 'center', backgroundColor: '#004aad',}}>
                            <h3 style={{color: 'white', marginTop: '10px'}}>KUR ÇEVİRİCİ</h3>
                            </div>
                            <div style={{ display: 'flex', width: '50%', height: '100%'}}>
                                <CheckboxInput
                                    id="buying"
                                    labels={['Alış', 'Satış']}
                                    onSelectionChange={handleCheckbox}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    gap: '1rem',
                                }}
                            >
                                <FormGroup floating style={{ width: '25%' }}>
                                    <Input
                                        type="number"
                                        id="buyAmount"
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => { setAmount(Number(e.target.value) >= 0 ? Number(e.target.value) : 0);}}
                                        required
                                        style={{
                                            width: '100%',
                                            height: '5%',
                                            gap: '0px',
                                            borderRadius: '4px',
                                            backgroundColor: '#C0DBEA',
                                        }}
                                    />
                                    <Label for="buyAmount">Miktar</Label>
                                </FormGroup>
                                <TextField
                                    id="firstCurrency"
                                    select
                                    label="Para Birimi"
                                    value={firstCurrency}
                                    onChange={handleFirstCurrency}
                                    style={{ width: '25%', height: '5%' }}
                                >
                                    {currencies.map((code, index) => (
                                        <MenuItem key={index} value={code}>
                                            {code}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Button
                                    sx={{ my: 1 }}
                                    variant="outlined"
                                    size="big"
                                    onClick={handleConversion}
                                    style={{ height: '5%' }}
                                >
                                    {'>>'}
                                </Button>
                                <FormGroup floating style={{ width: '25%' }}>
                                    <Input
                                        type="number"
                                        id="cost"
                                        placeholder="Cost"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            height: '5%',
                                            gap: '0px',
                                            borderRadius: '4px',
                                            backgroundColor: '#C0DBEA',
                                        }}
                                    />
                                    <Label for="cost">Maaliyet</Label>
                                </FormGroup>
                                <TextField
                                    id="secondCurrency"
                                    select
                                    label="Para Birimi"
                                    value={secondCurrency}
                                    onChange={handleSecondCurrency}
                                    style={{ width: '25%', height: '5%' }}
                                >
                                    {currencies.map((code, index) => (
                                        <MenuItem key={index} value={code}>
                                            {code}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </Grid>

                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => handleTradeClick('/trade')}>Döviz Al / Sat</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
        <div style={{
            display: 'flex',
            width: '100%',
            marginTop: '20px',  
            justifyContent: 'center',
            flexDirection: 'column'}}>
                <GenericTable
                    columns={columns}
                    rows={rows.slice(0, 5)}
                    pagination={false}
                >
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                        <Button onClick={() => handleTradeClick('/currencyExchange')}>Tüm Fiyatları Gör</Button>

                    </Grid>
                    
                </GenericTable>
        </div>
        <div style={{
            display: 'flex',
            width: '50%',
            gap: '1rem', 
            margin: '20px',  
            justifyContent: 'right'
        }}>

        </div>
    </div>
    )
}

export default MainPage;
