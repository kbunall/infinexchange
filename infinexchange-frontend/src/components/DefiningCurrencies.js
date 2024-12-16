import React, { Component, useState, useEffect} from 'react'
import axios from 'axios';
import {Button, Form} from 'reactstrap';
import DataTable from './DataTable';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Home from './Home';
import GenericTable from '../CommonComponents/GenericTable';

const columns = [
    { headerName: 'Döviz Kodu', field: 'code', align: 'left' },
    { headerName: 'Döviz Cinsi', field: 'currencyName', align: 'left' },
  ];
  

const DefiningCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  const search = () => {
      const filteredCurrencies = currencies.filter(currency => {
        const codeMatches = !code || currency.code.toLowerCase().includes(code.toLowerCase());
        const typeMatches = !type || currency.currencyName.toLowerCase().includes(type.toLowerCase());
        return codeMatches && typeMatches;
      });

      setFiltered(filteredCurrencies);
  }
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
          return {
            ...item,
            date: dateTime.toLocaleDateString(),
            time: dateTime.toLocaleTimeString(),
          };
        });
        setFiltered(processedData);
        setCurrencies(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);
        return(
            <Home>

            <div style={{ display: 'grid', gridTemplateRows: '30% 70%', height: '100vh' }}>
                <div style={{ minHeight: '30%', width: '100%', display: 'flex', alignItems: 'flex-end', marginBottom: '30px'}}>
                <table style={{
                    border: 'none',
                    fontFamily: 'Outfit',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '20px',
                    lineHeight: '25px',
                    textAlign: 'center',
                    color: '#02224E',
                    
                    maxWidth: '70%',
                    borderCollapse: 'separate', // Ensure spacing is respected
                    paddingLeft: '5%'
                }}>
                    <thead style={{textAlign: 'center',backgroundColor:'white'}}>
                        <tr>
                            <th style={{width: '12.5%',backgroundColor:'white',color:'#02224E'}}>Kıymet</th>
                            <th style={{width: '12.5%',backgroundColor:'white',color:'#02224E'}}>Döviz</th>
                        </tr>
                        <tr>
                            <th  style={{width: '12.5%',backgroundColor:'white',color:'#02224E'}}>Kodu</th>
                            <th  style={{width: '12.5%',backgroundColor:'white',color:'#02224E'}}>Cinsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{border: '2px solid #004AAD', padding: '10px'}}><input style={{border: 'none'}} id='code' type='text' value={code} onChange={(e) => setCode(e.target.value)}></input></td>
                            <td style={{border: '2px solid #004AAD', padding: '10px'}}><input style={{border: 'none'}} id='currencytype' type='text' value={type} onChange={(e) => setType(e.target.value)}></input></td>
                            <td><Button style={{
                                backgroundColor: '#02224E',
                                color: '#FFFFFF',
                            }} onClick={search}>Listele</Button></td>
                        </tr>
                    </tbody>
                </table>


                </div>
                <div style={{minHeight: '60%', minWidth: '100%', display: 'flex', flexDirection: 'row', paddingTop: '2%'}}>
                    
                    <GenericTable
                        columns={columns}
                        rows={filtered}
                        pagination={true}>
                    </GenericTable>
                </div>
        </div>
    </Home>
    )
                        
        
}

export default DefiningCurrencies;