import { Box, Button, Drawer } from '@mui/material';

import {
  // Api,
  // Home,
  ListAltOutlined,
  // Map,
  // Settings,
  // ExpandMore,
  // ChevronRight,
} from '@mui/icons-material';

import * as React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

import { Link } from 'react-router-dom';
import { conf } from '../store';
import { useParams, useNavigate } from 'react-router-dom';
export interface IProps {
  drawerWidth: string;
}

const expandedInitial = [
  'Thing',
  'CreativeWork',
  // 'Article',
  'Web content',
  'Place',
  'Accommodation',
];
export default function Sidebar({ drawerWidth }: IProps) {
  // const { id, collection } = useParams();
  const [expanded, setExpanded] = React.useState<string[]>(expandedInitial);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };
  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? expandedInitial : [],
    );
  };

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    navigate(`/e/${nodeId}`, {});
  };

  let navigate = useNavigate();
  const renderTree = (nodes: RenderTree) =>
    typeof nodes === 'object' &&
    Object.entries(nodes)
      ?.sort((p, n) => (p < n ? -1 : 1))
      .map(([key, value], index) => {
        const label = conf.api.components.schemas[key]?.title || key;
        return (
          <TreeItem
            nodeId={key}
            label={label}
            // icon={<ListAltOutlined />}
            endIcon={<ListAltOutlined />}
          >
            {/*  */}
            {/* {JSON.stringify({ key, value, index, type: typeof value })} */}
            {typeof value === 'object' && renderTree(value)}
          </TreeItem>
        );
      });

  return (
    <Drawer
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          py: 1,
        },
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </Box>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        defaultExpanded={['Thing']}
        sx={{
          height: 240,
          flexGrow: 1,
          maxWidth: 400,
          overflowY: 'auto',
        }}
        expanded={expanded}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {renderTree(conf.api.paths)}
      </TreeView>
    </Drawer>
  );
}

/*
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
*/
