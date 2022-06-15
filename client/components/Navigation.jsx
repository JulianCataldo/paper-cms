import React from 'react';

import { AppBar, Toolbar, Button, aA } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Add, ArrowBack, ContentCopy, Logout } from '@mui/icons-material';

import { conf } from '../store';
import TrashEntry from './TrashEntry';

export default function Navigation({ drawerWidth }) {
  let { id, collection } = useParams();

  let singularLabel = false;
  if (id) singularLabel = true;

  let navigate = useNavigate();
  function logout() {
    localStorage.removeItem('jwt');
    location.href = '/login';
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(
      [collection, id].filter((e) => e !== undefined).join('/'),
    );
  }

  return (
    <AppBar
      position="static"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth})` },
        ml: { sm: `${drawerWidth}` },
      }}
    >
      <Toolbar sx={{ d: 'flex', justifyContent: 'space-between' }}>
        <>
          {id && (
            <Button
              component={Link}
              variant="contained"
              to={`/e/${collection}`}
              sx={{ mx: 1 }}
              // color="secondary"
            >
              <ArrowBack />
            </Button>
          )}
          {id !== 'new' && (
            <>
              <Button
                variant="contained"
                component={Link}
                to={`/e/${collection}/new`}
                sx={{ mx: 1 }}
                color="info"
              >
                <Add />
                New {singularLabel}
              </Button>
              {id && (
                <TrashEntry
                  collection={collection}
                  entryId={id}
                  // onSuccess={getTableData}
                />
              )}
            </>
          )}
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            onClick={() => copyToClipboard()}
          >
            <ContentCopy />
            Copy path
          </Button>
          {localStorage.getItem('jwt') && !collection && (
            <Button
              variant="contained"
              sx={{ mx: 1 }}
              color="warning"
              onClick={() => logout()}
            >
              <Logout />
              Logout
            </Button>
          )}
        </>
      </Toolbar>
    </AppBar>
  );
}
