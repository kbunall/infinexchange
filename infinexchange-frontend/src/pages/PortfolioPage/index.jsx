import React, { useState, useEffect } from "react";
import Home from "../../components/Home";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import GenericTable from "../../CommonComponents/GenericTable";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import customerService from "../../services/customerService";
import { useParams } from "react-router-dom";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import CustomerSelection from "../../components/CustomerSelection";

// customer tablosu en baştaki
const customerColumns = [
  { field: "id", headerName: "PORTFÖY ID" },
  { field: "tcNo", headerName: "TC KİMLİK NUMARASI" },
  { field: "taxNo", headerName: "VERGİ NUMARASI" },
  { field: "firstName", headerName: "AD" },
  { field: "lastName", headerName: "SOYAD" },
  { field: "corporationName", headerName: "KURUM AD" },
  { field: "dateOfBirth", headerName: "DOĞUM TARİHİ" },
  { field: "phoneNumber", headerName: "TELEFON NUMARASI" },
  { field: "email", headerName: "E-MAİL" },
  { field: "balance", headerName: "BAKİYE (TRY)" },
  //   { field: "currencyType", headerName: "DANIŞMAN ADI SOYADI" },
  //   { field: "currencyType", headerName: "OLUŞTURMA TARİHİ" },
  { field: "type", headerName: "MÜŞTERİ TİPİ" },
];

// Portfolio
const customerPortfolioColumns = [
  { field: "currencyCode", headerName: "KIYMET TÜRÜ" },
  { field: "amount", headerName: "MİKTAR" },
];

// Nakit Geçmişi

const cashHistoryColumns = [
  { field: "accountTransactionType", headerName: "İŞLEM TİPİ" },
  { field: "amount", headerName: "TUTAR (TRY)", orderable:'true' },
  { field: "transactionDate", headerName: "İŞLEM TARİHİ", orderable:'true' },
  { field: "transactionTime", headerName: "İŞLEM ZAMANI"},
];


// Döviz Geçmişi
const currencyHistoryColumns = [
  { field: "currencyTransactionType", headerName: "İŞLEM TİPİ" },
  { field: "currencyCode", headerName: "DÖVİZ SATIŞ" },
  { field: "buyCurrencyCode", headerName: "DÖVİZ ALIŞ" },
  { field: "amount", headerName: "MİKTAR", orderable:'true' },
  { field: "exchangeRate", headerName: "BİRİM TUTARI"},
  { field: "toplamTutar", headerName: "TOPLAM TUTARI", orderable:'true'  },
  { field: "transactionDate", headerName: "İŞLEM TARİHİ", orderable:'true'  },
  { field: "transactionTime", headerName: "İŞLEM ZAMANI"},
];

const portfolioTotalColumns = [
  {field: "totalPortfolioValue", headerName: "Toplam Döviz Değeri"}
]

// Component
const Index = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [currencyTransactionsData, setCurrencyTransactions] = useState([]);
  const [accountTransactionData, setAccountTransactionData] = useState([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState([]);
  const [piedata, setPieData] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const TOTAL = piedata.map((item) => item.value).reduce((a, b) => a + b, 0);

  const [openCustomerSelection, setOpenCustomerSelection] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);


  const handleOpenCustomerSelection = () => {
    setOpenCustomerSelection(true);
  };

  const handleCloseCustomerSelection =  (customer) => {
    setOpenCustomerSelection(false);
    if (customer) {
      setSelectedCustomer(customer);
      
      id = customer.id;
      handleCustomer()
      console.log("id", id)
      console.log('Selected Customer in Transaction Page:', customer);
    } else {
      console.log('Seçilemedi');
    }
  };


  const getArcLabel = (params) => {
    const percent = (params.value / TOTAL) * 100;
    return `${percent.toFixed(0)}%`;
  };
  let { id } = useParams(); // URL'deki id parametresini yakalar


  const handleCustomer = () => {
    customerService
      .getCustomerById(id)
      .then(async (data) => {
        setCustomerData([data.customerResponse]);
        setPortfolioData(data.portfolio);

        try {
          const response = await axios.get('http://localhost:9090/api/v1/currencies', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }).then(response => {
            setCurrencyList(response.data);
          
            let totalBalance = 0;

            const getRates = (currency) => {
              const item = response.data.find(item => item.code === currency);
              return item ? { buying: item.buying, selling: item.selling } : { buying: 1, selling: 1 };
            };
          
            data.portfolio.forEach(item => {
              const rate = getRates(item.currencyCode).selling;
              totalBalance += rate * item.amount;
              console.log(rate * item.amount);
            });
          
            setTotalPortfolioValue([{ totalPortfolioValue: `${parseFloat(totalBalance.toFixed(4))} TRY` }]);
          })
  
        } catch (error) {
          console.log(error)
        }
        

        const formattedAccountTransactionData = data.accountTransactions.map(item => ({
          ...item,
          accountTransactionType: item.accountTransactionType === "DEPOSIT" ? "YATIRIM" : "ÇEKME",
          transactionDate: (new Date(item.transactionDate)).toLocaleDateString(),
          transactionTime: (new Date(item.transactionDate)).toLocaleTimeString(), 
        }))
        setAccountTransactionData(formattedAccountTransactionData);
        const formattedPCurrencyData = data.currencyTransactions.map(
          (item, _) => ({
            ...item,
            toplamTutar: parseFloat((item.exchangeRate * item.amount).toFixed(3)),
            currencyTransactionType: item.currencyTransactionType === "BUY" ? "ALIM" : "SATIM",

            transactionDate: (new Date(item.transactionDate)).toLocaleDateString(),
            transactionTime: (new Date(item.transactionDate)).toLocaleTimeString(), 
          })
        );
        setCurrencyTransactions(formattedPCurrencyData);
        const formattedPieData = data.portfolio.map((item, index) => ({
          id: index, // index, her item için benzersiz bir id oluşturmak için kullanılıyor
          value: item.percentage, // value, percentage değeri olarak ayarlandı
          label: item.currencyCode, // label, currencyCode değeri olarak ayarlandı
        }));
        console.log(formattedPieData);
        setPieData(formattedPieData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    console.log(id)
    handleCustomer();
  }, []);

  const renderTable = () => {
    if (selectedTable === "portfolio") {
      return (
        <GenericTable columns={customerPortfolioColumns} rows={portfolioData} pagination={true}
        />
      );
    } else if (selectedTable === "cashHistory") {
      return (
        <GenericTable
          columns={currencyHistoryColumns}
          rows={currencyTransactionsData}
          pagination={true}
        />
      );
    } else if (selectedTable === "currencyHistory") {
      return (
        <GenericTable
          columns={cashHistoryColumns}
          rows={accountTransactionData}
          pagination={true}
        />
      );
    }
  };

  return (
    <Home>
      <Box>
        <div style={{display: 'flex', margin: '20px'}}>
        <CustomerSelection
          open={openCustomerSelection}
          onClose={handleCloseCustomerSelection}
          />
      <Button
            variant="contained"
            onClick={handleOpenCustomerSelection}
            style={{ backgroundColor: '#02224E',color: "#FFFFFF", width:'180px',height:'40px',borderRadius:'18px'  }}
          >
            <SearchIcon style={{ marginRight: 8 }} />
            Müşteri Seç
          </Button>
          </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <GenericTable columns={customerColumns} rows={customerData} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  padding: 2,
                }}
              >
                <GenericTable columns={portfolioTotalColumns} rows={totalPortfolioValue}></GenericTable>
                <PieChart
                  series={[
                    {
                      data: piedata,
                      arcLabel: getArcLabel,
                      innerRadius: 30,
                      outerRadius: 130,
                      paddingAngle: 1,
                      cornerRadius: 5,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontSize: 14,
                    },
                  }}
                  width={500}
                  height={300}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              </Box>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setSelectedTable("portfolio")}
            >
              Müşteri Portföy Detayları
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setSelectedTable("currencyHistory")}
            >
              Müşteri Nakit Geçmişi
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setSelectedTable("cashHistory")}
            >
              Müşteri Döviz Geçmişi
            </Button>
          </Grid>
        </Grid>
        {<Box mt={4}>{renderTable()}</Box>}
      </Box>
    </Home>
  );
};

export default Index;
