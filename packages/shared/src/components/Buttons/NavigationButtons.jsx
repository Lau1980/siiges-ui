import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, IconButton, Divider, Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled } from '@mui/system';

const CircularIconButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  padding: '6px',
  transition:
    'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    color: '#fff',
    backgroundColor: `${theme.palette.primary.main}`,
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 8px 15px',
    transform: 'translateY(-2px)',
  },
}));

export default function NavigationButtons({
  currentPosition,
  totalPositions,
  onNext,
  onPrevious,
}) {
  return (
    <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
      {currentPosition > 1 && (
      <>
        <Grid item>
          <Typography align="center">Anterior</Typography>
        </Grid>
        <Grid item>
          <CircularIconButton
            onClick={onPrevious}
            aria-label="Anterior"
            sx={{
              transform: 'rotate(180deg)',
              '&:hover': {
                transform: 'rotate(180deg) translateY(2px)',
              },
            }}
          >
            <NavigateNextIcon />
          </CircularIconButton>
        </Grid>
      </>
      )}

      {currentPosition > 1 && currentPosition < totalPositions && (
        <Grid item>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ height: '2rem', mx: 4 }}
          />
        </Grid>
      )}

      {currentPosition < totalPositions && (
      <>
        <Grid item>
          <Typography align="center">Siguiente</Typography>
        </Grid>
        <Grid item>
          <CircularIconButton onClick={onNext} aria-label="Siguiente">
            <NavigateNextIcon />
          </CircularIconButton>
        </Grid>
      </>
      )}
    </Grid>
  );
}

NavigationButtons.propTypes = {
  currentPosition: PropTypes.number.isRequired,
  totalPositions: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
