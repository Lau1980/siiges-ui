import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, IconButton, TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, esES } from '@mui/x-data-grid';
import Button from '../Buttons/Button';

function DataTable({
  title,
  rows,
  columns,
  buttonAdd,
  buttonText,
  buttonDisabled = false,
  buttonClick,
  buttonType,
  initialState,
}) {
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10); // Default page size

  useEffect(() => {
    setLoading(false);
    setFilteredRows(rows);
  }, [rows]);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      const filteredData = rows.filter(
        (row) => Object.values(row || {}).some(
          (data) => data?.toString().toLowerCase().includes(value),
        ),
      );
      setFilteredRows(value ? filteredData : rows);
    }, 300),
    [rows],
  );

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    debouncedSearch(value);
  };

  const localeText = {
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    noRowsLabel: 'No hay registros',
    rowsPerPage: 'Filas por página:',
    footerRowSelected: (count) => (count !== 1 ? `${count.toLocaleString()} filas seleccionadas` : `${count.toLocaleString()} fila seleccionada`),
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={9} sx={{ mt: 2 }}>
          {buttonAdd ? (
            <Button
              onClick={buttonClick}
              disabled={buttonDisabled}
              text={buttonText}
              type={buttonType}
            />
          ) : (
            <Typography variant="h6">
              {title}
            </Typography>
          )}
        </Grid>
        <Grid item xs={3}>
          <TextField
            margin="normal"
            fullWidth
            id="filter"
            label="Filtrar"
            type="text"
            name="filter"
            autoComplete="filter"
            size="small"
            sx={{ mt: 2 }}
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%', marginTop: 15 }}>
        <DataGrid
          localeText={localeText}
          loading={loading}
          rows={filteredRows}
          columns={columns || []}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          initialState={initialState || { sorting: { sortModel: [{ field: 'id', sort: 'asc' }] } }}
        />
      </div>
    </>
  );
}

DataTable.defaultProps = {
  title: '',
  buttonAdd: false,
  buttonDisabled: false,
  buttonText: '',
  buttonType: '',
  initialState: { sorting: { sortModel: [{ field: 'id', sort: 'asc' }] } },
  buttonClick: () => {},
};

DataTable.propTypes = {
  initialState: PropTypes.shape({
    sorting: PropTypes.shape({
      sortModel: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string.isRequired,
          sort: PropTypes.oneOf(['desc', 'asc']),
        }),
      ),
    }),
  }),
  title: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.number,
    }),
  ).isRequired,
  buttonAdd: PropTypes.bool,
  buttonDisabled: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonType: PropTypes.string,
  buttonClick: PropTypes.func,
};

export default React.memo(DataTable);
