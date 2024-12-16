import React, { useState, useEffect, useContext } from 'react';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Button, Menu, MenuItem, Collapse, Dialog ,DialogActions, DialogTitle, DialogContent, Box, TextField, SnackbarContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InboxIcon from '@mui/icons-material/Inbox';
import AdjustIcon from '@mui/icons-material/Adjust';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { getUserIdFromToken, getUsernameFromToken } from '../utils/tokenUtils';
import { isAdmin } from '../utils/tokenUtils';

import userService from '../services/userService';

import logo from '../logo2.png';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios';
import { CustomAlert } from '../utils/alert';
// theme
import { ColorModeContext } from '../TemaProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Snackbar from '@mui/material/Snackbar';
import { ErrorSharp } from '@mui/icons-material';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor:'#004AAD',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Home = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [username, setUsername] = useState('');
  const [openSubMenu, setOpenSubMenu] = useState(null); // State for handling sub-menu open/close
  const navigate = useNavigate();
  //theme
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

  const [passwordNotValid, setPasswordNotValid] = useState(false);

  const [newPasswordNotValid, setNewPasswordNotValid] = useState(false);

  const [errorOccured, setErrorOccured] = useState(false);

  const [passwordChangedSuccess, setPasswordChangeSuccess] = useState(false);

  const [samePassword, setSamePassword] = useState(false);

  const handleOpenPasswordModal = () => {
    setPasswordNotMatch(false);
    setPasswordNotValid(false);
    setErrorOccured(false);
    setSamePassword(false);
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
  };

  const handlePasswordChange = async () =>{
    console.log(currentPassword, newPassword, newPasswordAgain, username)
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordNotMatch(false);
    setPasswordNotValid(false);
    setErrorOccured(false);
    setNewPasswordNotValid(false);

    if(newPassword !== newPasswordAgain){
      setPasswordNotMatch(true)
      return;
    }else if(!regexp.test(newPassword)){
      setNewPasswordNotValid(true);
      return
    }

    const id = getUserIdFromToken(localStorage.getItem('accessToken'));

      try{
        await axios.post(`http://localhost:9090/api/v1/users/change-password/${id}`, {
          oldPassword: currentPassword,
          newPassword: newPassword,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            "Content-Type": "application/json",
          }
        })

        setPasswordChangeSuccess(true)

      }catch (error){

        if(error.response.data.errors.error === "Mevcut sifrenizi dogru girmediniz. Lutfen kontrol edin ve tekrar girin."){
          setPasswordNotValid(true);
        }else if( error.response.data.errors.error === "Yeni sifreniz eskisiyle ayni olamaz.") {
          setSamePassword(true)
        }else{
          setErrorOccured(true);
        } 
      }
  };

  

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const user = getUsernameFromToken(token);
      setUsername(user);
    } else {
      console.error('Access token not found.');
      setUsername('Kullanıcı adı bulunamadı');
    }
  }, []);


  const today = new Date();
  const formattedDate = today.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenu(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };
  const LogoContainer = styled('div')({
    display: 'flex',
    alignItems: 'center', // Logoyu dikeyde ortalar
    justifyContent: 'center', // Logoyu yatayda ortalar
    padding: '10px', 
  });
  

  const getPageName = (pathname) => {
    switch (pathname) {
      // case '/home': return 'Anasayfa';
      case '/trade': return '>İşlemler >Döviz Al/Sat';
      case '/currencyExchange': return '>İşlemler >Döviz Fiyatları';
      case '/nakit': return '>İşlemler >Nakit İşlemleri';
      case '/employee': return '>Tanımlar >Personel Tanımlama';
      case '/customer': return '>Tanımlar >Müşteri Tanımlama';
      case '/portfolio': return '>Raporlar >Portföy Bilgisi';
      case '/stock': return '>Raporlar >Stok Bilgisi';
      case '/users' : return '>Kullanıcı Bilgilerini Göster'
      default: return '';
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
  color="inherit"
  aria-label="home"
  onClick={() => navigate('/home')}
  edge="start"
  sx={{ mr: 2, display: 'flex', alignItems: 'center' }}
>
  <Typography variant="h6" component="span" sx={{ fontSize: '1rem', color: 'inherit' }}>
    <HomeIcon sx={{ marginRight: '8px' }} />

    Anasayfa   {getPageName(window.location.pathname)}
  </Typography>
</IconButton>
{/* <Typography variant="h6" component="span" sx={{ fontSize: '1rem', color: 'inherit' }}>
<ArrowRightAltIcon sx={{  marginLeft:'-10px'}} />
</Typography> */}
{/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="span" sx={{ fontSize: '1rem', color: 'inherit', marginRight: '16px' }}>
              {getPageName(location.pathname)}
            </Typography>
            </div> */}
          {/* <IconButton
            color="inherit"
            aria-label="home"
            onClick={() => navigate('/home')}
            edge="start"
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton> */}
          {/* <Typography variant="h6" noWrap component="div">
            Infinexchange
          </Typography> */}
          {/* <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: 80, width: 80, margin: '0 auto', display: 'block' }} />
          </div>  */}
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <LogoContainer
                onClick={() => navigate('/home')}
                style={{ cursor: 'pointer', }} // Tıklanabilir olduğunu göstermek için cursor stilini değiştirdik
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    height: '75px', 
                    width: '100%', 
                    display: 'block',
                  }}
                />
              </LogoContainer>
          </div>
          {/* <IconButton
  color="inherit"
  aria-label="home"
  onClick={() => navigate('/home')}
  edge="start"
  sx={{ mr: 2, display: 'flex', alignItems: 'center' }}
>
  <HomeIcon sx={{ marginRight: '8px' }} />
  <Typography variant="h6" component="span" sx={{ fontSize: '1rem', color: 'inherit' }}>
    Anasayfa
  </Typography>
</IconButton> */}

{/* theme */}
{ <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
  {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
</IconButton> }
  
<Typography variant="body1" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', marginRight: 2, fontSize: '1rem', color: 'inherit' }}>
  <DateRangeIcon sx={{ marginRight: 1 }} />
  {formattedDate}
</Typography>

<Typography variant="body1" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: '1rem', color: 'inherit' }}>
  <IconButton onClick={(event) => handleMenuClick(event, 'user')} sx={{ color: 'inherit' }}>
    <PersonIcon />
  </IconButton>

  <Typography onClick={(event) => handleMenuClick(event, 'user')} variant="body1" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', marginRight: 2, fontSize: '1rem', color: 'inherit' }}>
    {username ? username : 'Kullanıcı adı bulunamadı'}
  </Typography>
  
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl) && selectedMenu === 'user'}
    onClose={handleMenuClose}
  >
    <MenuItem onClick={() => { navigate('/users'); handleMenuClose(); }}>Kullanıcı Bilgileri Görüntüle</MenuItem>
    <MenuItem onClick={handleOpenPasswordModal}>Şifremi Değiştir</MenuItem>
    
    {openPasswordModal && (
    <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}
      PaperProps={{
        sx: {
          width: '30%',
          maxWidth: '30%',
        }
      }}
    >
      <DialogTitle>Şifremi Değiştir</DialogTitle>
      <DialogContent style={{padding: '20px'}}>
      <TextField
          fullWidth
          id="currentPassword"
          label="Mevcut şifre"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <TextField
          fullWidth
          id="newPassword"
          label="Yeni şifre"
          type='password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <TextField
          fullWidth
          id="newPasswordAgain"
          label="Yeni şifre tekrar"
          type='password'
          value={newPasswordAgain}
          onChange={e => setNewPasswordAgain(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <div style={{display: 'flex', width: '100%', flexDirection: 'column'}}>
        {passwordNotMatch && (
            <span style={{color: 'red'}}>Yeni şifreler eşleşmemekte.</span>
          )
        }
        {passwordNotValid && (
            <span style={{color: 'red'}}>Şifreniz yanlış.</span>
          )
        }
        {newPasswordNotValid && (
            <span style={{color: 'red'}}>Şifre en az 8 karakter uzunluğunda olmalı, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.</span>
          )
        }
        {errorOccured && (
            <span style={{color: 'red'}}>Bir hata oluştu.</span>
          )
        }
        {samePassword && (
          <span style={{color: 'red'}}>Yeni şifreniz eski şifrenizden farklı olmalıdır.</span>
        )}
        <Button style={{ backgroundColor: '#02224E', color: '#FFFFFF', width:'180px',height:'40px',borderRadius:'18px', marginTop: '20px'}}
          onClick={handlePasswordChange}
        >Şifremi Değiştir</Button>
          </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePasswordModal} color="primary">İptal</Button>
       
      </DialogActions>
    </Dialog>
    )}
  </Menu>
</Typography>

          <Logout />
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#004AAD',
            color: '#FFFFFF',
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#FFFFFF' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: '#FFFFFF' }} />
        <List>
          {['İşlemler', 'Tanımlar', 'Raporlar'].map((text) => (
            <React.Fragment key={text}>
              <ListItem button onClick={() => handleSubMenuToggle(text)} >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                  {text === 'İşlemler' ? <InboxIcon /> : text === 'Tanımlar' ? <AdjustIcon /> : <AssessmentIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
                {openSubMenu === text ? <ArrowDropUpIcon sx={{ color: '#FFFFFF' }} /> : <ArrowDropDownIcon sx={{ color: '#FFFFFF' }} />}
              </ListItem>
              <Collapse in={openSubMenu === text}>
                <List component="div" disablePadding>
                  {text === 'İşlemler' && [
                    <ListItem button key="doviz-alsat" onClick={() => handleNavigation('/trade')}>
                      <ListItemText primary="Döviz Al/Sat" sx={{ paddingLeft: 4 }} />
                    </ListItem>,
                    <ListItem button key="doviz-fiyatlari" onClick={() => handleNavigation('/currencyExchange')}>
                      <ListItemText primary="Döviz Fiyatları" sx={{ paddingLeft: 4 }} />
                    </ListItem>,
                    <ListItem button key="nakit-islemleri" onClick={() => handleNavigation('/nakit')}>
                      <ListItemText primary="Nakit İşlemleri" sx={{ paddingLeft: 4 }} />
                    </ListItem>
                  ]}
                  {text === 'Tanımlar' && [
                    isAdmin() && (
                      <ListItem button key="personel-tanimlama" onClick={() => handleNavigation('/employee')}>
                        <ListItemText primary="Personel Tanımlama" sx={{ paddingLeft: 4 }} />
                      </ListItem>
                    ),
                    ,
                    <ListItem button key="musteri-tanimlama" onClick={() => handleNavigation('/customer')}>
                      <ListItemText primary="Müşteri Tanımlama" sx={{ paddingLeft: 4 }} />
                    </ListItem>,
                  ]}
                  {text === 'Raporlar' && [
                    <ListItem button key="portfoy-bilgisi" onClick={() => handleNavigation('/portfolio')}>
                      <ListItemText primary="Portföy Bilgisi" sx={{ paddingLeft: 4 }} />
                    </ListItem>,
                     <ListItem button key="stok-bilgisi" onClick={() => handleNavigation('/stock')}>
                      <ListItemText primary="Stok  Bilgisi" sx={{ paddingLeft: 4 }} />
                    </ListItem>
                    
                  ]}
                  {text === 'Stok Bilgileri'}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
      <Snackbar
        open={passwordChangedSuccess}
        autoHideDuration={3000}
        onClose={() => {setPasswordChangeSuccess(false); handleClosePasswordModal()}}
        
        
      >
        <SnackbarContent
          message="Şifreniz başarıyla değiştirildi."
          style={{ backgroundColor: '#004aad' }} // Arka plan rengini mavi yapar
        />
      </Snackbar>
    </div>
  );
};



export default Home;
