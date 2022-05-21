import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import { conf, headers } from '../store';
import Base from '../layouts/Default';
import TrashEntry from '../components/TrashEntry';

export default function CollectionPage({}) {
  let { collection } = useParams();

  const collectionURI = `/v1/${collection}`;

  const [showDeletedState, setShowDeleted] = useState(false);
  function handleShowDeleted() {
    setShowDeleted(!showDeletedState);

    getTableData();
  }

  function getTableData() {
    return axios.get(collectionURI, { headers }).then(({ data }) => {
      let dataFiltered = data.map((e) => {
        e._created = e._meta.created;
        e._updated = e._meta.updated;
        e._deleted = e._meta.deleted;
        e._private = e._meta.private;
        return e;
      });
      // if (!showDeletedState) {
      //   dataFiltered = dataFiltered.filter((e) => !e._meta?.deleted);
      // }
      setTableData(dataFiltered);
      console.log({ dataFiltered });
    });
  }

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getTableData();
  }, [collection]);

  const specificColumns = [];
  for (const fieldKey in tableData[0]) {
    const field = tableData[0][fieldKey];
    if (
      ['string', 'number'].includes(typeof field) &&
      !fieldKey.startsWith('_')
    ) {
      const title =
        conf.api.components.schemas[collection].properties[fieldKey]?.title;
      specificColumns.push({
        field: fieldKey,
        headerName: title || fieldKey,
        flex: 0.3,
        minWidth: 50,
      });
    }
    // else if (Array.isArray(field)) {
    //   specificColumns.push({
    //     field: fieldKey,
    //     headerName: fieldKey,
    //     width: 250,
    //   });
    // }
    console.log({ fieldKey, field });
  }

  const columns = [
    {
      field: 'edit',
      headerName: 'Actions',
      // flex: 0.3,
      width: 320,
      // minWidth: 50,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            component={Link}
            to={`/e/${collection}/${params.id}`}
          >
            Edit
          </Button>
          <TrashEntry
            collection={collection}
            entryId={params.id}
            onSuccess={getTableData}
            restoreMode={params.row._meta?.deleted ? true : false}
          />
        </>
      ),
    },
    ...specificColumns,
    { field: '_id', headerName: 'ID', flex: 0.1, minWidth: 100 },
    { field: '_created', headerName: 'Created', flex: 0.1, minWidth: 150 },
    { field: '_updated', headerName: 'Updated', flex: 0.1, minWidth: 150 },
    { field: '_deleted', headerName: 'Deleted', flex: 0.1, minWidth: 150 },
    { field: '_private', headerName: 'Private', flex: 0.1, minWidth: 50 },
  ];

  // let navigate = useNavigate();
  // function openEntry(params) {
  //   navigate(`/e/${collection}/${params.id}`, {});
  // }

  // console.log(tableData);

  return (
    <Base>
      <Helmet>{/* <title>{current?.pluralLabel}</title> */}</Helmet>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          pt: '2rem',
          px: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {conf.api.components.schemas[collection]?.title || collection}{' '}
        collection
        <FormControlLabel
          control={
            <Switch checked={showDeletedState} onChange={handleShowDeleted} />
          }
          label="Show deleted"
        />
      </Typography>
      <Box sx={{ margin: '2rem', mb: '8rem' }}>
        <DataGrid
          // autoPageSize
          autoHeight
          rows={tableData}
          columns={columns}
          // isCellEditable={true}
          getRowId={(row) => row._id}
          // checkboxSelection
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: '_created', sort: 'desc' }],
            },
          }}
          // onRowClick={openEntry}
          // components={{
          //   ColumnMenu: MyCustomColumnMenu,
          // }}
          // componentsProps={{
          //   columnMenu: { background: 'red', counter: rows.length },
          // }}
          sx={{
            '& .MuiDataGrid-row': {
              '[data-field="edit"] .MuiButton-root': {
                opacity: 0.5,
              },
              '&:hover [data-field="edit"] .MuiButton-root': {
                opacity: 1,
              },
            },
          }}
        />
      </Box>
    </Base>
  );
}
