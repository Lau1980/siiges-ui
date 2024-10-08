import React from 'react';
import ButtonsAlumnosInscritos from '../Components/utils/ButtonsAlumnosInscritos';

const columnsAlumnosInscritos = (asignaturas, grupoId, fetchAlumnosInscritos, alumnosInscritos) => [
  { field: 'matricula', headerName: 'Matrícula', width: 170 },
  {
    field: 'apellidoPaterno',
    headerName: 'Primer Apellido',
    width: 260,
    valueGetter: (params) => params.row.persona.apellidoPaterno,
  },

  {
    field: 'apellidoMaterno',
    headerName: 'Segundo Apellido',
    width: 260,
    valueGetter: (params) => params.row.persona.apellidoMaterno,
  },

  {
    field: 'nombre',
    headerName: 'Nombre',
    width: 260,
    valueGetter: (params) => params.row.persona.nombre,
  },

  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => {
      const alumno = alumnosInscritos.find((a) => a.id === params.id);
      return (
        <ButtonsAlumnosInscritos
          id={params.id}
          grupoId={grupoId}
          asignaturas={asignaturas}
          fetchAlumnosInscritos={fetchAlumnosInscritos}
          alumnoInfo={alumno}
        />
      );
    },
    sortable: false,
    filterable: false,
  },
];

export default columnsAlumnosInscritos;
