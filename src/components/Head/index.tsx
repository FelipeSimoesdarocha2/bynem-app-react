import React, { useState } from 'react';

// Router
import { useHistory, useLocation } from "react-router-dom";

import Cookie from 'universal-cookie';

// MUI
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Divider,
  Avatar
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Styled Components
import { Search, SearchIconWrapper, StyledInputBase, MenuLink } from './styles'

// Hooks
import { useAuth } from "../../hooks/auth";
import { usePerfil } from "../../hooks/usePerfil"

// Context
import { useSearch } from '../../context/SearchContext'

const menuWithoutUser = [
  {
    title: 'Acessar',
    pathname: '/login'
  },
  {
    title: 'Criar Conta',
    pathname: '/criar-conta'
  }
]

const menuUser = [
  {
    title: 'Meu perfil',
    pathname: '/perfil'
  },
  {
    title: 'Favoritos',
    pathname: '/simulados-favoritos'
  },
  {
    title: 'Meus simulados',
    pathname: '/meus-simulados'
  },
  {
    title: 'Criar simulados',
    pathname: '/criar-simulados'
  }
]

export default function ButtonAppBar() {
  const { pathname } = useLocation();

  const history = useHistory();
  const { setUser } = useAuth()

  const user = JSON.parse(localStorage.getItem("user"))

  const { data: perfil } = usePerfil(user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { onChangeSearch, clearSearch } = useSearch();

  const isHome = pathname === '/';

  const isMySimulated = pathname === '/meus-simulados';

  // const isMyFavorites = pathname === '/simulados-favoritos';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    clearSearch();
  };

  const logout = () => {
    const cookie = new Cookie();

    cookie.remove("token_user");
    localStorage.removeItem("user");

    setUser({ logout: true });
    history.replace("/");
  }

  const goToPage = (pathname) => {
    history.push(pathname);
    handleClose();
  }

  const renderMenuItems = () => {
    if (user) {
      const menu = [
        ...menuUser.map((item) => <MenuItem onClick={() => goToPage(item.pathname)}>{item.title}</MenuItem>),
        <Divider />,
        <MenuItem onClick={() => logout()}>Sair</MenuItem>
      ]
      return menu;
    }

    return menuWithoutUser.map((item) => <MenuItem onClick={() => goToPage(item.pathname)}>{item.title}</MenuItem>);
  }

  const handleSearch = ({ target }) => {
    onChangeSearch(target.value);
  }

  return (
    <AppBar position="static" color='transparent' sx={{ color: '#E414B2', bgcolor: '#fff' }}>
      <Container>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <a href="/" >
              <img alt="logo" style={{ height: "40px", width: "100px" }} src='/bynem01.png' />
            </a>
            {!isHome && (
              <MenuLink sx={{ paddingLeft: 5 }} variant="h6" onClick={() => goToPage("/")}>
                Inicio
              </MenuLink>
            )}
          </Box>
          {(isHome || isMySimulated) && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar…"
                onChange={handleSearch}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}
          <div>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar alt="perfil" srcSet={perfil?.linkFileName} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {renderMenuItems()}
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
