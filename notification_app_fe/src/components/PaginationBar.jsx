import React from 'react';

import {
  Button,
  Stack
} from '@mui/material';

function PaginationBar({ page, setPage }) {

  return (

    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      sx={{ marginTop: 3 }}
    >

      <Button
        variant="contained"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>

      <Button
        variant="contained"
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>

    </Stack>
  );
}

export default PaginationBar;