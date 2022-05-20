import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Grid,
  TextareaAutosize,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RTE(props) {
  function handleChange(v) {
    console.log({ v });
    props.onChange(v);
    console.log(props.formData);
  }

  const [rawModeState, setRawMode] = useState(false);
  function handleRaw() {
    setRawMode(!rawModeState);
  }

  return (
    <Box sx={{ my: 2 }}>
      <Grid container>
        <Typography variant="h5" sx={{ mb: 2 }}>
          <Box component="span" sx={{ mr: 4 }}>
            {props.schema.title || props.name}
          </Box>
          <FormControlLabel
            control={<Switch checked={rawModeState} onChange={handleRaw} />}
            label="Raw"
          />
        </Typography>
      </Grid>

      <ReactQuill theme="snow" value={props.formData} onChange={handleChange} />
      {rawModeState && (
        <Paper sx={{}}>
          <TextareaAutosize
            style={{ padding: '0.4rem', width: '100%', border: 'none' }}
            value={props.formData}
          />
        </Paper>
      )}
    </Box>
  );
}
