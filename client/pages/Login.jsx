import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Zoom,
} from '@mui/material';
import React, { useState } from 'react';

import axios from 'axios';
import { MuiForm5 } from '@rjsf/material-ui';
import Theme from '../components/Theme';

export default function LoginPage({}) {
  const [loginState, setLoginState] = useState('init');

  async function login(data) {
    // e.preventDefault();

    const formData = data.formData;
    console.log({ formData });
    const result = await axios.post('/v1/login', formData).catch(() => {
      setLoginState('error');
    });
    if (result?.data) {
      const token = result.data;
      console.log({ token });

      localStorage.setItem('jwt', token);
      location.href = '/';

      console.log({ store: localStorage.getItem('jwt') });
    }
  }

  const schema = {
    type: 'object',
    properties: {
      userName: {
        title: 'User name',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
        format: 'password',
      },
    },
    additionalProperties: false,
    required: ['userName', 'password'],
  };
  const uiSchema = {
    'ui:title': 'Please enter your credentials',
    // 'ui:description': 'Description',
    userName: {
      // 'ui:title': 'User name',
      //   'ui:description': 'Password',
      'ui:autofocus': true,
    },
    // password: {
    //   // 'ui:title': 'Password',
    // },
  };

  return (
    <Theme>
      <Box
        sx={{ pt: '25vh', height: '100vh', backgroundColor: 'primary.dark' }}
      >
        <Container maxWidth="sm">
          <Zoom in={true}>
            <Card sx={{ boxShadow: 15 }}>
              <CardContent
                sx={{
                  '& .MuiBox-root:last-of-type': {
                    textAlign: 'right',
                  },
                }}
              >
                <MuiForm5
                  schema={schema}
                  uiSchema={uiSchema}
                  onSubmit={login}
                />
                {loginState === 'error' && (
                  <Typography textAlign="center" color="warning.main">
                    <strong>Unauthorized.</strong> Please try again.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Zoom>
        </Container>
      </Box>
    </Theme>
  );
}
