import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Delete, RestoreFromTrash } from '@mui/icons-material';

import { headers } from '../store';

export default function TrashEntry({
  collection,
  entryId,
  onSuccess,
  restoreMode,
}) {
  async function TrashEntry() {
    const res = await axios.delete(
      `/v1/${collection}/${entryId}${restoreMode ? '?restore=true' : ''}`,
      { headers }
    );
    console.log(res);
    onSuccess();
  }
  return (
    <Button
      color={restoreMode ? 'success' : 'warning'}
      size="small"
      style={{ marginLeft: 16 }}
      onClick={TrashEntry}
    >
      {restoreMode ? <RestoreFromTrash /> : <Delete />}
    </Button>
  );
}
