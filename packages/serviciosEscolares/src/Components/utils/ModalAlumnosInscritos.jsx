import {
  ButtonSimple,
  ButtonsForm,
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
  alumnoInfo,
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
          setNoti({
            open: true,
            message:
              '¡Algo salió mal al inscribir el alumno, reintente más tarde!',
            type: 'error',
          });
        } else {
          setNoti({
            open: true,
            message: '¡Éxito al inscribir el alumno!',
            type: 'success',
          });
          setOpen(false);
        }
      });
    } else {
      setNoti({
        open: true,
        message:
          '¡Algo salió mal, el alumno debe estar inscrito en al menos una materia!',
        type: 'error',
      });
    }
  };

  return (
    <DefaultModal open={open} setOpen={setOpen} title={title}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <LabelData title="Alumno" subtitle={`${alumnoInfo?.persona?.nombre} ${alumnoInfo?.persona?.apellidoPaterno} ${alumnoInfo?.persona?.apellidoMaterno}`} />
        </Grid>
        <Grid item xs={6}>
          <LabelData title="Matrícula" subtitle={alumnoInfo?.matricula} />
        </Grid>
      </Grid>
      <DataTable
        title="Asignaturas"
        rows={asignaturas}
        columns={columnsAlumnosInscritos(
          handleCheckboxChange,
          selectedAsignaturas,
          title === 'Consultar Alumno',
        )}
      />
      <Grid container justifyContent="flex-end" marginTop={2}>
        {title === 'Consultar Alumno' ? (
          <Grid item xs={2}>
            <ButtonSimple
              text="Regresar"
              design="confirm"
              onClick={() => setOpen(false)}
            />
          </Grid>
        ) : (
          <ButtonsForm
            cancel={() => setOpen(false)}
            confirm={handleInscribirAlumno}
            confirmDisabled={selectedAsignaturas.length === 0}
            cancelText="Cancelar"
            confirmText="Guardar"
            justifyContent="flex-end"
          />
        )}
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
  alumnoInfo: PropTypes.shape({
    matricula: PropTypes.string.isRequired,
    persona: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellidoPaterno: PropTypes.string.isRequired,
      apellidoMaterno: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
