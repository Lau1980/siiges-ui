import {
  Button, Context, DataTable, Input,
} from '@siiges-ui/shared';
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import {
  getAlumnoByMatricula,
  postAsignaturasAlumno,
} from '@siiges-ui/instituciones';
import columnsAsignaturas from '../../../Tables/inscripcionesTable';
import columnsAlumnosInscritos from '../../../Tables/alumnosInscritos';

export default function InscripcionesTable({
  asignaturas,
  programaId,
  grupoId,
}) {
  const { setNoti } = useContext(Context);
  const [matriculaValue, setMatriculaValue] = useState('');
  const [alumnoByMatricula, setAlumnoByMatricula] = useState();
  const [selectedAsignaturas, setSelectedAsignaturas] = useState([]);
  const [alumnosInscritos, setAlumnosInscritos] = useState([]);

  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setSelectedAsignaturas((prev) => [...prev, id]);
    } else {
      setSelectedAsignaturas((prev) => prev.filter((aId) => aId !== id));
    }
  };

  const handleBlurMatricula = () => {
    getAlumnoByMatricula(matriculaValue, programaId, (error, result) => {
      if (error) {
        console.error('Error fetching alumno:', error);
        setNoti({
          open: true,
          message: 'Algo salió mal al cargar al alumno, revisa la matrícula',
          type: 'error',
        });
        return;
      }
      setAlumnoByMatricula(result.alumnos);
    });
  };

  const handleInscribirAlumno = () => {
    if (alumnoByMatricula && selectedAsignaturas.length > 0) {
      const dataToSend = [
        {
          alumnoId: alumnoByMatricula.id,
          asignaturas: selectedAsignaturas,
        },
      ];

      postAsignaturasAlumno(dataToSend, grupoId, (error) => {
        if (error) {
          console.error('Failed to enroll the student:', error);
          setNoti({
            open: true,
            message:
              'Algo salió mal al inscribir el alumno, reintente más tarde',
            type: 'error',
          });
        } else {
          setNoti({
            open: true,
            message: '!Exito al inscribir el alumno!',
            type: 'success',
          });
          setAlumnosInscritos((prev) => [...prev, alumnoByMatricula]);
          setMatriculaValue('');
          setSelectedAsignaturas([]);
        }
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Input
          label="Matrícula"
          name="matricula"
          value={matriculaValue}
          onchange={(e) => setMatriculaValue(e.target.value)}
          onblur={handleBlurMatricula}
        />
      </Grid>
      <Grid item xs={12}>
        <DataTable
          rows={asignaturas}
          columns={columnsAsignaturas(
            handleCheckboxChange,
            selectedAsignaturas,
          )}
          title="Tabla de asignaturas"
        />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'right' }}>
        <Button
          text="Inscribir alumno"
          disabled={!alumnoByMatricula || selectedAsignaturas.length === 0}
          onClick={handleInscribirAlumno}
        />
      </Grid>
      <Grid item xs={12}>
        <DataTable
          rows={alumnosInscritos}
          columns={columnsAlumnosInscritos(asignaturas, grupoId)}
          title="Alumnos inscritos"
        />
      </Grid>
    </Grid>
  );
}

InscripcionesTable.defaultProps = {
  asignaturas: [],
};

InscripcionesTable.propTypes = {
  asignaturas: PropTypes.arrayOf(PropTypes.string),
  programaId: PropTypes.number.isRequired,
  grupoId: PropTypes.number.isRequired,
};
