import axios from 'axios';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Modal,
  Paper,
  Container,
  FormControl,
  Autocomplete,
  TextField,
  CardActions,
  Grid,
} from '@mui/material';
import { MuiForm5 } from '@rjsf/material-ui';
import { conf, headers } from '../../store';
import RTE from './RTE';
import FileUploader from './FileUploader';

export default function SubForm(props) {
  const pattern = props.schema.properties.$ref.pattern;
  const types = pattern.match(/\/\((.*)\)\/(.*)/)[1].split('|');
  console.log({ pattern, types });

  let refURI = props.formData?.$ref || '';
  console.log({ refURI });

  let [s, curType, currEntryId] = refURI?.match(/\/(.*)\/(.*)/) || [
    null,
    types[0],
    'new',
  ];

  const [currentEntryState, setCurrentEntry] = useState({
    type: curType,
    id: currEntryId,
  });

  const [modalState, setModalState] = useState(false);

  function toggleModal() {
    setModalState(!modalState);
  }
  function handleClose() {
    setModalState(false);
  }

  function newEntry(type) {
    setCurrentEntry({ type, id: 'new' });
    props.onChange({
      $ref: '',
    });
    toggleModal();
  }

  // // Todo: DEDOUBLE
  const schemas = conf.api.components.schemas;
  const schemaFiltered = {
    $defs: { ...schemas },
    ...conf.api.components.schemas[currentEntryState.type],
  };

  function fetchData() {
    axios.get(`/v1${refURI}`, { headers }).then(({ data }) => {
      setEntryData(data);
      console.log({ data });
    });
  }
  const [entryData, setEntryData] = useState([]);
  useEffect(() => {
    if (refURI === '') {
      setEntryData([]);
    } else {
      fetchData();
    }
  }, [refURI]);

  const [docsData, setDocsData] = useState([]);
  async function fetchDocsData() {
    const promises = [];
    const entries = [];
    types.forEach(async (type) => {
      const prom = axios.get(`/v1/${type}`, { headers }).then(({ data }) => {
        const filtered = data.map((e) => `/${type}/${e._id}`);
        entries.push(...filtered);
        console.log({ filtered });
      });
      promises.push(prom);
    });
    await Promise.all(promises);
    setDocsData(entries);
  }
  useEffect(() => {
    fetchDocsData();
  }, []);

  const log = (type) => console.log.bind(console, type);
  console.log(props);
  const baseUiSchema = {
    'ui:submitButtonOptions': {
      submitText: currentEntryState.id === 'new' ? 'Save' : 'Update',
    },
  };
  let specificUiSchema = {};
  if (conf.uiSchemas[currentEntryState.type]) {
    specificUiSchema = conf.uiSchemas[currentEntryState.type].properties;
  }
  const uiSchema = {
    ...baseUiSchema,
    ...specificUiSchema,
  };
  console.log({ uiSchema });

  const fields = {
    hyperlink: SubForm,
    fileUpload: FileUploader,
    richText: RTE,
  };
  async function submitForm(data) {
    const res = await axios.post(
      `/v1/${currentEntryState.type}/${currentEntryState.id}`,
      data.formData,
      { headers }
    );
    console.log(res.data);

    if (currentEntryState.id === 'new') {
      props.onChange({
        $ref: `/${currentEntryState.type}/${res?.data?.response?.entryId}`,
      });
    } else {
      fetchData();
    }
    toggleModal();
  }
  return (
    <Box>
      <Modal
        open={modalState}
        onClose={handleClose}
        sx={{ overflow: 'scroll' }}
      >
        <Container sx={{ pt: '2vh' }}>
          <Card>
            <CardContent>
              <Typography variant="h2">{currentEntryState.type}</Typography>
              <MuiForm5
                schema={schemaFiltered}
                uiSchema={uiSchema}
                // widgets={widgets}
                onChange={log('changed')}
                onSubmit={submitForm}
                onError={log('errors')}
                formData={entryData}
                fields={fields}
              />

              <CardActions>
                <Button onClick={toggleModal}>Close</Button>
              </CardActions>
            </CardContent>
          </Card>
        </Container>
      </Modal>

      <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>❖&nbsp;Ref.</Grid>

        <Grid item>
          <FormControl>
            <Autocomplete
              // disablePortal
              options={docsData}
              sx={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Document" />
              )}
              value={refURI}
              onChange={(event, newValue) => {
                props.onChange({ $ref: newValue });
              }}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            onClick={toggleModal}
            variant="contained"
            disabled={refURI === ''}
          >
            Edit
          </Button>
        </Grid>
        <Grid item>Or create new</Grid>
        {types.map((type, key) => {
          return (
            <Grid key={key} item>
              <Button onClick={() => newEntry(type)} variant="contained">
                {type}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <Divider />
      <Grid
        container
        spacing={4}
        alignItems="flex-start"
        justifyContent="space-around"
      >
        {Object.entries(entryData)?.map((item) => {
          if (['string', 'number'].includes(typeof item[1]))
            return (
              <Grid item>
                <Paper elevation={1} sx={{ mx: 1, my: 2, p: 2, width: 600 }}>
                  <Typography variant="h6">
                    {conf.api.components.schemas[currentEntryState.type]
                      ?.properties[item[0]]?.title || item[0]}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      mx: 1,
                      display: '-webkit-box',
                      '-webkit-line-clamp': '3',
                      '-webkit-box-orient': 'vertical',
                      overflow: 'hidden',
                    }}
                    dangerouslySetInnerHTML={{ __html: item[1] }}
                  ></Box>
                </Paper>
              </Grid>
            );
        })}
      </Grid>
    </Box>
  );
}
