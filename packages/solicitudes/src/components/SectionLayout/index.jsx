import React from 'react';
import { LoadCircle, Title } from '@siiges-ui/shared';
import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ButtonSection from './ButtonSection';

export default function SectionLayout({
  type,
  id,
  children,
  sections,
  position,
  total,
  porcentaje,
  sectionTitle,
  next,
  prev,
}) {
  return (
    <>
      <Title title={sectionTitle} />
      <Grid container sx={{ mt: 3 }}>
        <Grid
          item
          xs={8}
          justifyContent="end"
          alignItems="center"
          sx={{ textAlign: 'left' }}
        >
          <Box
            alignItems="center"
            display="flex"
            sx={{
              backgroundColor: 'darkGray',
              width: 230,
              ml: 55,
              py: 1,
              px: 1,
              borderRadius: 20,
            }}
          >
            <LoadCircle state={porcentaje} />
            <Typography
              alignItems="center"
              variant="p"
              sx={{
                color: 'white',
                ml: 3,
              }}
            >
              {sections}
              {' '}
              de
              {' '}
              {total}
              {' '}
              completado
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <ButtonSection
            type={type}
            id={id}
            sections={sections}
            position={position}
            next={next}
            prev={prev}
            sectionTitle={sectionTitle}
          />
        </Grid>
        {children}
        <Grid item xs={8} />
        <Grid item xs={4}>
          <ButtonSection
            type={type}
            id={id}
            sections={sections}
            position={position}
            next={next}
            prev={prev}
            sectionTitle={sectionTitle}
          />
        </Grid>
      </Grid>
    </>
  );
}

SectionLayout.defaultProps = {
  type: null,
  id: null,
};

SectionLayout.propTypes = {
  type: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  sections: PropTypes.number.isRequired,
  sectionTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  porcentaje: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};
