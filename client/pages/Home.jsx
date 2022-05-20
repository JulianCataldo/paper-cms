import { Helmet } from 'react-helmet';
import { Typography } from '@mui/material';
import React from 'react';
import Base from '../layouts/Default';
import { conf } from '../store';

export default function HomePage({}) {
  console.log({ confHome: conf });
  return (
    <Base>
      <Helmet>
        <title>HOME</title>
      </Helmet>
      <Typography variant="h2" component="h2" sx={{ pt: '2rem', pl: '2rem' }}>
        HOME
      </Typography>
    </Base>
  );
}
