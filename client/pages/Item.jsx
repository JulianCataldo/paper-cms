import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import Base from '../layouts/Default';
import { conf } from '../store';
import FormComponent from '../components/Form';

export default function ItemPage() {
  let { id, collection } = useParams();

  return (
    <Base>
      <Helmet>
        <title>{collection + ' | ' + (id === 'new' ? 'New' : 'Edit')}</title>
      </Helmet>

      <Typography variant="h2" component="h2" sx={{ pt: '2rem', pl: '2rem' }}>
        {id === 'new' ? 'New ' : 'Edit '}

        {conf.api.components.schemas[collection]?.title || collection}
      </Typography>

      <Box sx={{ p: '4rem', pt: '1rem' }}>
        <FormComponent collection={collection} entryId={id} />
      </Box>
    </Base>
  );
}
