import React, { useState, useEffect } from 'react';
import { Button, Grid, Box, CircularProgress } from '@mui/material';
import GenericTable from '../CommonComponents/GenericTable'; // Doğru import yolu
import StockFilterModal from './StockFilterModal'; // Doğru import yolu
import { getAll } from '../services/portfolyoServices'; // Doğru import yolu
import Home from './Home'; // Doğru import yolu
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { field: 'taxNo', headerName: 'Vergi Numarası' },
  { field: 'tcNo', headerName: 'TC Kimlik No' },
  { field: 'customerName', headerName: 'Müşteri Adı', },
  { field: 'currencyCode', headerName: 'Döviz Kodu' },
  { field: 'amount', headerName: 'Miktar', color: 'blue', orderable: 'true' }, // Örneğin renkli bir gösterim için
];

const StockPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const handleFilter = (filters) => {
    const formattedFilters = {
      ...filters,
      amount: filters.amount ? filters.amount.toString() : "" // amount'ı string olarak gönder
    };
    setFilters(formattedFilters);
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const response = await getAll(filters.taxNo, filters.tcNo, filters.corporationName, filters.firstName, filters.lastName, filters.currencyCode, filters.amount);
        console.log(response); // API yanıtını kontrol edin
        console.log(response.data); // API yanıtını
        
        const processedData = response.data.map(item => {
          const customerName = item.corporationName == null || item.corporationName === "" ? item.firsName + " " +  item.lastName : item.corporationName;
          return {
            ...item,
            customerName: customerName
          };
        });
        setRows(processedData || []);

        console.log(processedData)

      } catch (error) {
        console.error('API çağrısında bir hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPortfolios();
  }, [filters]);

  return (
      <Home>
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
      <div style={{width: '100%', height: '100%'}}>

        <GenericTable columns={columns} rows={rows} pagination />
      </div>
      
      <StockFilterModal
        open={openFilterModal}
        onClose={handleCloseFilterModal}
        onFilter={handleFilter}
      /></Home>
  );
};

export default StockPage;
