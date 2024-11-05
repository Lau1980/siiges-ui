import React from 'react';
import { DataTable, getData } from '@siiges-ui/shared';
import { Grid, Button } from '@mui/material';
import PropTypes from 'prop-types';
import historialColumns from '../../../Tables/historialAlumnosTable';

const url = process.env.NEXT_PUBLIC_URL;

export default function HistorialTable({ alumno }) {
  const rows = alumno
    ?.sort((a, b) => a.asignaturaId - b.asignaturaId || a.tipo - b.tipo)
    .map((record) => ({
      id: record.id,
      ciclo: record.grupo.cicloEscolar.nombre,
      clave: record.asignatura.clave,
      seriacion: record.asignatura.seriacion || 'N/A',
      asignatura: record.asignatura.nombre,
      tipo: record.tipo === 1 ? 'Ordinario' : 'Extraordinario',
      calificacion: record.calificacion,
      fechaExamen: record.fechaExamen,
    })) || [];

  const downloadHistorialAcademico = async () => {
    try {
      const alumnoId = alumno?.alumnoId;
      const response = await getData({ endpoint: `/files/?tipoEntidad=ALUMNO&entidadId=${alumnoId}&tipoDocumento=HISTORIAL_ACADEMICO` });

      if (response && response.data) {
        const { ubicacion } = response.data;
        if (ubicacion && typeof ubicacion === 'string') {
          const finalUrl = url + ubicacion;
          window.open(finalUrl, '_blank');
        } else {
          console.error('¡Url no válido, intente de nuevo!');
        }
      } else {
        console.error('¡Error al descargar el archivo, intente de nuevo!');
      }
    } catch (error) {
      console.error('¡Error al descargar el archivo!');
    }
  };

  return (
    <Grid container sx={{ marginTop: 2 }}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadHistorialAcademico}
        >
          Descargar
        </Button>
      </Grid>
      <DataTable
        rows={rows}
        columns={historialColumns}
        title="Historial del Alumno"
      />
    </Grid>
  );
}

HistorialTable.propTypes = {
  alumno: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      alumnoId: PropTypes.number.isRequired,
      grupo: PropTypes.shape({
        cicloEscolar: PropTypes.shape({
          nombre: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      asignatura: PropTypes.shape({
        clave: PropTypes.string.isRequired,
        seriacion: PropTypes.string,
        nombre: PropTypes.string.isRequired,
      }).isRequired,
      tipo: PropTypes.number.isRequired,
      calificacion: PropTypes.string.isRequired,
      fechaExamen: PropTypes.string.isRequired,
    }),
  ).isRequired,
};