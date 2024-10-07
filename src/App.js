import logo from './logo.svg';
import './App.css';
import React from 'react';
import Layout from './components/layout/Layout';
import { Box } from '@mui/material';
import FloatingActionButtons from "./components/classroom/fab";

function App() {
  return (
      <Box>
        <Layout children={FloatingActionButtons}/>
      </Box>
  );
}

export default App;
