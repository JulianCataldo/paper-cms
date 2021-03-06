import React from 'react';

import { Box, Button, Container, Input, Typography } from '@mui/material';
import axios from 'axios';

export default function FileUploader(props) {
  async function uploadFile(event) {
    var formData = new FormData();
    const file = event.target.files[0];

    formData.append('media', file);
    console.log(file);
    const filePath = (
      await axios
        .post('/v1/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((e) => {
          console.log(e);
          return e;
        })
        .catch((e) => console.log(e))
    )?.data?.url;

    console.log({ filePath });

    props.onChange(filePath);
  }
  return (
    <>
      <Typography variant="h5">{props.schema.title}</Typography>
      <Box
        sx={{ display: 'flex', alignItems: 'center', p: 4, flexWrap: 'wrap' }}
      >
        {/* <div>Salut {props.formData}</div> */}
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
            objectFit: 'contain',
          }}
          src={props.formData || ''}
        />
        <Box sx={{ p: 4, flexGrow: 1 }}>
          <Input
            type="text"
            value={props.formData}
            fullWidth
            // onChange={props.onChange}
            // readOnly
          />
          <Box sx={{ p: 4 }}>
            <input
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              onChange={uploadFile}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
          </Box>
        </Box>
      </Box>
    </>
  );
}
