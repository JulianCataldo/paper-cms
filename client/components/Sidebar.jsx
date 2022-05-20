import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Api, Home, ListAltOutlined, Map, Settings } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';
import { conf } from '../store';
// import { useParams, useNavigate } from 'react-router-dom';

export default function Sidebar({ drawerWidth }) {
  // const { id, collection } = useParams();
  return (
    <Drawer
      variant="permanent"
      // display: { xs: 'block', sm: 'none' },
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <List>
        <ListItem button component={Link} to={'/'}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItem>
        <Divider />
        {Object.entries(conf.api.paths).map((collectionG, key) => {
          return (
            <ListItemButton
              key={key}
              // selected={collection === collectionG[0]}
              component={Link}
              to={`/e/${collectionG[0]}`}
            >
              <ListItemIcon>
                <ListAltOutlined />
              </ListItemIcon>
              <ListItemText
                primary={
                  conf.api.components.schemas[collectionG[0]]?.title ||
                  collectionG[0]
                }
              />
            </ListItemButton>
          );
        })}
        <Divider />
        <ListItem button component={Link} to={'/definitions'}>
          <ListItemIcon>
            <Map />
          </ListItemIcon>
          <ListItemText primary={'Definitions'} />
        </ListItem>
        <ListItem button component={'a'} href={'/v1/ui'} target="blank">
          <ListItemIcon>
            <Api />
          </ListItemIcon>
          <ListItemText primary={'API Reference'} />
        </ListItem>
        <ListItem button component={Link} to={'/settings'}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary={'Settings'} />
        </ListItem>
      </List>
    </Drawer>
  );
}
