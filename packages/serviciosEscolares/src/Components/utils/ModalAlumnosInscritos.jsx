import {
  ButtonStyled,
  Context,
  DataTable,
  DefaultModal,
  LabelData,
} from '@siiges-ui/shared';
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { postAsignaturasAlumno } from '@siiges-ui/instituciones';
import columnsAlumnosInscritos from '../../Tables/columnsAlumnosInscritos';

export default function ModalAlumnosInscritos({
  open,
  setOpen,
  asignaturas,
  title,
  alumnoAsignaturas,
  alumnoId,
  grupoId,
}) {
  const { setNoti } = useContext(Context);
  const transformToAsignaturaIds = (arr) => arr.map((item) => item.asignaturaId);

  const [selectedAsignaturas, setSelectedAsignaturas] = useState(
    () => (Array.isArray(alumnoAsignaturas)
      ? transformToAsignaturaIds(alumnoAsignaturas)
      : []),
  );

  useEffect(() => {
    setSelectedAsignaturas(
      Array.isArray(alumnoAsignaturas)
        ? transformToAsignaturaIds(alumnoAsignaturas)
        : [],
    );
  }, [alumnoAsignaturas]);

  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setSelectedAsignaturas((prev) => [...prev, id]);
    } else {
      setSelectedAsignaturas((prev) => prev.filter((aId) => aId !== id));
    }
  };

  const handleInscribirAlumno = () => {
    if (selectedAsignaturas.length > 0) {
      const dataToSend = [
        {
          alumnoId,
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
          setOpen(false);
        }
      });
    } else {
      setNoti({
        open: true,
        message:
          'Algo salió mal, el alumno debe estar inscrito en almenos una materia',
        type: 'error',
      });
    }
  };

  return (
    <DefaultModal open={open} setOpen={setOpen} title={title}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <LabelData title="Alumno" subtitle="Pedro Perez" />
        </Grid>
        <Grid item xs={6}>
          <LabelData title="Matricula" subtitle="PSC101" />
        </Grid>
      </Grid>
      <DataTable
        title="Asignaturas"
        rows={asignaturas}
        columns={columnsAlumnosInscritos(
          handleCheckboxChange,
          selectedAsignaturas,
        )}
      />
      <Grid container justifyContent="flex-end" marginTop={2}>
        <Grid item xs={2}>
          <ButtonStyled
            text="Cancelar"
            alt="Cancelar"
            design="error"
            onclick={() => setOpen(false)}
          />
        </Grid>
        <Grid item xs={2}>
          <ButtonStyled
            text="Confirmar"
            alt="Confirmar"
            onclick={handleInscribirAlumno}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

ModalAlumnosInscritos.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  alumnoId: PropTypes.func.isRequired,
  grupoId: PropTypes.func.isRequired,
  asignaturas: PropTypes.arrayOf(PropTypes.string).isRequired,
  alumnoAsignaturas: PropTypes.arrayOf(PropTypes.string).isRequired,
};
