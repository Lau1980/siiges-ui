import Tooltip from '@mui/material/Tooltip';
import { IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';

export default function ButtonsProgramas({ id, url }) {
  return (
    <Stack direction="row" spacing={1}>
      {id && (
        <Link href={url}>
          <Tooltip title="Editar" placement="top">
            <IconButton aria-label="Planteles">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
      )}
    </Stack>
  );
}

ButtonsProgramas.propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
};
