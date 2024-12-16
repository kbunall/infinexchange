import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button} from '@mui/material';
import GenericTable from '../CommonComponents/GenericTable';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';

const getCountryCode = (currencyCode) => {
  console.log(`Currency Code: ${currencyCode}`);
  switch (currencyCode) {
    case 'USD': return 'US';
    case 'EUR': return 'EU';
    case 'DKK': return 'DK';
    case 'AUD': return 'AU';
    case 'GBP': return 'GB';
    case 'CHF': return 'CH';
    case 'SEK': return 'SE';
    case 'CAD': return 'CA';
    case 'KWD': return 'KW';
    case 'NOK': return 'NO';
    case 'SAR': return 'SA';
    case 'JPY': return 'JP';
    case 'BGN': return 'BG';
    case 'RON': return 'RO';
    case 'RUB': return 'RU';
    case 'IRR': return 'IR';
    case 'CNY': return 'CN';
    case 'PKR': return 'PK';
    case 'QAR': return 'QA';
    case 'KRW': return 'KR';
    case 'AZN': return 'AZ';
    case 'AED': return 'AE';
    default: return 'TR'; // Varsayılan olarak Türk bayrağını göster.
  }
  
};
const CurrencyList = () => {
  const [currencies, setCurrencies] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
            priceChangePercentage: item.priceChangePercentage != null ? item.priceChangePercentage : 0,
          };
        });
        setRows(processedData);
        console.log(rows)
        setCurrencies(processedData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  const columns = [
    { headerName: 'Döviz Kodu', field: 'code', align: 'left', filterable: 'true' },
    // {
    //   headerName: 'Döviz Kodu',
    //   field: 'code',
    //   align: 'left',
    //   render: (row) => {
    //     const value = row.code; // Döviz kodu field'ını row'dan çekiyoruz.
    //     const countryCode = getCountryCode(value);
    //     return (
    //       <div style={{ display: 'flex', alignItems: 'center' }}>
    //         <Flag country={countryCode} style={{ width: '24px', height: '16px', marginRight: '8px' }} />
    //         <span>{value}</span>
    //       </div>
    //     );
    //   },
    // },
    {
      headerName: 'Döviz Cinsi',
      field: 'currencyName',
      align: 'left',
       filterable: 'true',
      render: (row) => {
        const value = row.code; // Döviz kodu field'ını row'dan çekiyoruz.
        const currencyName = row.currencyName;
        const countryCode = getCountryCode(value);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Flag country={countryCode} style={{ width: '24px', height: '16px', marginRight: '8px' }} />
            <span>{currencyName}</span>
          </div>
        );
      },
    },
    // { headerName: 'Döviz Cinsi', field: 'currencyName', align: 'left', filterable: 'true' },
    { headerName: 'Birim', field: 'unit', align: 'left', orderable: 'true'},
    { headerName: 'TL Alış', field: 'buying', align: 'left', orderable: 'true' },
    { headerName: 'TL Satış', field: 'selling', align: 'left', orderable: 'true' },
    { headerName: 'Artış/Azalış Yüzdesi', field: 'priceChangePercentage', align: 'left', colorful: 'true', orderable: 'true'},
    { headerName: 'Tarih', field: 'date', align: 'left' },
    {
      field: "actions",
      headerName: "",
      render: (row) => (
        <Button onClick={() => {
            navigate('/trade');
        }} style={{backgroundColor: '#02224E', color: 'white'}}>Al/Sat</Button>
      ),
    },
  ];

  return (
    <Home>
      <div style={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <div style={{
          width: '100%',
          height: 'auto',
        }}>
          <GenericTable
            columns={columns}
            rows= {currencies}
            pagination={false}
          ></GenericTable>
        </div>
      </div>
    </Home>
  );
};

export default CurrencyList;
