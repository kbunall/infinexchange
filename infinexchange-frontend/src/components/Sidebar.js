// src/components/Sidebar.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Menu, MenuItem } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const DrawerStyled = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

const Sidebar = ({ open, toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <DrawerStyled
      variant="persistent"
      anchor="left"
      open={open}
    >
      <List>
        {['Müşteri Yönetimi', 'Geçmiş İşlemler', 'Döviz listesi', 'Operasyonel İşlemler'].map((text, index) => (
          <React.Fragment key={text}>
            {text === 'Müşteri Yönetimi' ? (
              <>
                <ListItem button onClick={handleClick}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => handleNavigation('/bireysel-musteri')}>Bireysel Müşteri</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/kurumsal-musteri')}>Kurumsal Müşteri</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/personel-tanimlama')}>Personel Tanımlama</MenuItem>
                </Menu>
              </>
            ) : (
              <ListItem button onClick={() => handleNavigation(
                text === 'Geçmiş İşlemler' ? '/gecmis-islemler' :
                text === 'Döviz listesi' ? '/dashboard' :
                text === 'Operasyonel İşlemler' ? '/operasyonel-islemler' : '/dashboard'
              )}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </DrawerStyled>
  );
};

export default Sidebar;
