import React from 'react';
import DiligenciasButtons from '../../../utils/Components/DiligenciasButtons';

const columns = () => [
  { field: 'nombre', headerName: 'Nombre', width: 270 },
  { field: 'tituloCargo', headerName: 'Cargo', width: 100 },
  { field: 'telefono', headerName: 'Teléfono', width: 130 },
  { field: 'celular', headerName: 'Celular', width: 130 },
  { field: 'correoPrimario', headerName: 'Correo', width: 230 },
  { field: 'schedule', headerName: 'Horario', width: 150 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => <DiligenciasButtons id={params.id} />,
    sortable: false,
    filterable: false,
  },
];

export default columns;
