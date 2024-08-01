import React from 'react'

// MUI
import { Container } from '@mui/material';

// Components
import Head from "../Head";
import Footer from "../Footer";

// Context
import SearchProvider from '../../context/SearchContext'

const WrapperMenu = ({children}) => (
  <SearchProvider>
    <Head />
    <Container sx={{ bgcolor: '#fff', marginY: '48px', borderRadius: '8px', paddingY: '18px' }}>
      {children}
    </Container>
    <Container>
      <Footer bottom={true} />
    </Container>
  </SearchProvider>
)

export default WrapperMenu;