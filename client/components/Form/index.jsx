import React, { useRef, useEffect, useState } from 'react';
import { MuiForm5 } from '@rjsf/material-ui';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { conf, headers } from '../../store';
import SubForm from './SubForm';

import RTE from './RTE';
import FileUploader from './FileUploader';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import { usePrompt } from '../../lib/react-router-use-prompt.js';

export default function FormComponent({ collection, entryId = null }) {
  const schemas = conf.api.components.schemas;
  const schemaFiltered = {
    $defs: { ...schemas },
    ...conf.api.components.schemas[collection],
  };
  // console.log({ schemaFiltered });

  // const [currentRevIndex, setCurrentRevIndex] = useState(0);
  // const handleRevChange = (event) => {
  //   setCurrentRevIndex(parseInt(event.target.value));
  //   fetchData();
  //   console.log(event.target.value);
  // };
  function fetchData() {
    axios
      .get(`/v1/${collection}/${entryId}?rev`, {
        headers,
      })
      .then(({ data }) => {
        setEntryData(data);
        console.log({ data });
      });
  }

  const [entryData, setEntryData] = useState([]);
  useEffect(() => {
    if (entryId === 'new') {
      setEntryData([]);
    } else {
      fetchData();
    }
  }, [entryId]);

  let navigate = useNavigate();

  async function submitForm(data) {
    setFormChanged(false);

    const res = await axios
      .post(`/v1/${collection}/${entryId}`, data.formData, { headers })
      .then(({ data }) => {
        console.log({ data });
        return data;
      })
      .catch((e) => console.log(e));

    // console.log({ d: res.reponse });

    // setCurrentRevIndex(0);
    if (entryId === 'new') {
      navigate(`/e/${collection}/${res?.response?.entryId}`, {});
    } else {
      fetchData();
    }
  }
  //
  const baseUiSchema = {
    'ui:submitButtonOptions': {
      submitText: entryId === 'new' ? 'Save' : 'Update',
      // render: false,
    },
  };

  let specificUiSchema = {};
  if (conf.uiSchemas[collection]) {
    specificUiSchema = conf.uiSchemas[collection].properties;
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

  const log = (type) => console.log.bind(console, type);

  function handleFormChange() {
    // console.log('SSSSSSSSSSS');
    // setTimeout(() => {
    // }, 100);
    setFormChanged(true);
  }

  const [formChanged, setFormChanged] = useState(false);
  // setFormChanged(false);

  // usePrompt('Leave screen?', formChanged);

  // const formRef = useRef(null);
  // const [savedState, setSaved] = useState(false);
  // function handleSave(event) {
  //   let charCode = String.fromCharCode(event.which).toLowerCase();
  //   if ((event.ctrlKey || event.metaKey) && charCode === 's') {
  //     event.preventDefault();
  //     // alert('CTRL+S Pressed');
  //     // console.log({ f: formRef.current });
  //     // formRef.current.formElement.submit();
  //     setSaved(true);
  //     submitForm(formRef.current.state);
  //   }
  //   // alert();
  // }
  //
  return (
    <div
    // onKeyDown={handleSave}
    >
      {/* <Snackbar
        open={savedState}
        autoHideDuration={2000}
        onClose={() => setSaved(false)}
        message="Saved!"
        // action={action}
      /> */}
      {/* <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden />
      </Button> */}
      {/* <input
        accept="image/*"
        className={classes.input}
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="raised" component="span" className={classes.button}>
          Upload
        </Button>
      </label> */}

      <MuiForm5
        schema={schemaFiltered}
        uiSchema={uiSchema}
        // widgets={widgets}
        // onChange={handleFormChange}
        // onFocus={handleFormChange}
        onSubmit={submitForm}
        onError={log('errors')}
        formData={entryData}
        // formData={entryData[currentRevIndex]}
        fields={fields}
        // ref={formRef}
        // ref={(f) => {
        //   form = f;
        // }}
      />

      {/* <FormControl>
        <InputLabel id="form-select-label">Revisions</InputLabel>
        <Select
          labelId="form-select-label"
          value={currentRevIndex}
          label="Current revision"
          onChange={handleRevChange}
        >
          {entryData?.map((e, key) => (
            <MenuItem key={key} value={key}>
              {e._meta.updated || `📍 ${e._meta.created}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      {/* <Button onClick={sub}>{entryId === 'new' ? 'Save' : 'Update'}</Button> */}
    </div>
  );
}
