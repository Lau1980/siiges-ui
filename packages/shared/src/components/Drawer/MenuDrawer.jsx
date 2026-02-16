import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import userRol from './utils/userRol';
import DropdownButton from '../Select/DropdownButton';

const drawerWidth = 320;

const openedMixin = (theme) => ({
  marginTop: '69px',
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  marginTop: '69px',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(0)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function MenuDrawer({
  open, openFunction, closeFunction, section, session,
}) {
  const [users, setUsers] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [users]);

  userRol(session, setUsers, section);

  return (
    <Box sx={{ display: 'flex', marginTop: isEmpty ? '67px' : 0 }}>
      <CssBaseline />
      {!isEmpty && (
        <Drawer variant="permanent" open={open}>
          <List onMouseOver={openFunction} onMouseLeave={closeFunction}>
            {users?.map((item) => (
              <ListItem key={item.key} disablePadding sx={{ display: 'block' }}>
                {item.type === 'dropdown' ? (
                  <Box sx={{ position: 'relative' }}>
                    <DropdownButton
                      icon={React.cloneElement(item.icon, {
                        sx: { color: 'action.active' },
                      })}
                      text={item.text}
                      options={item.options}
                    />
                    {open && (
                    <ArrowDropDownIcon
                      fontSize="small"
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />
                    )}
                  </Box>
                ) : (

                  <Link href={item.route}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </Link>
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </Box>
  );
}

MenuDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  session: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    rol: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  openFunction: PropTypes.func.isRequired,
  closeFunction: PropTypes.func.isRequired,
  section: PropTypes.number.isRequired,
};

export default MenuDrawer;
