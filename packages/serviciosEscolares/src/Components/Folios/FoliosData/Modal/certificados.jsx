import { Grid } from '@mui/material';
import {
  ButtonsForm,
  Context,
  DefaultModal,
  Input,
  InputDate,
  LabelData,
  createRecord,
  getData,
  updateRecord,
} from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

export default function ModalCertificado({
  open,
  setOpen,
  type,
  id,
  programaId,
  setAlumnoResponse,
  rowData,
  disabled,
  alumnosAgregados,
}) {
  const [form, setForm] = useState({});
  const [alumno, setAlumno] = useState(null);
  const [alumnoId, setAlumnoId] = useState(null);
  const [disabledButton, setDisabledButton] = useState(true);
  const { setNoti, setLoading } = useContext(Context);
  const [modalTitulo, setModalTitulo] = useState('Agregar Alumno');

  const validateForm = () => {
    const isValid = alumno && form.fechaTerminacion;
    setDisabledButton(!isValid || disabled);
  };

  useEffect(() => {
    validateForm();
  }, [form, alumno, disabled]);
  useEffect(() => {
    if (type !== 'create' && rowData) {
      setForm(rowData);
      if (rowData.alumno) {
        const fullName = `${rowData.alumno.persona.nombre} ${rowData.alumno.persona.apellidoPaterno} ${rowData.alumno.persona.apellidoMaterno}`;
        setAlumno(fullName);
      }
      setAlumnoId(rowData.alumnoId);
    } else {
      setAlumno(null);
      setAlumnoId(null);
    }
    if (type === 'edit') {
      setModalTitulo('Editar Alumno');
    } else if (type === 'consult') {
      setModalTitulo('Consultar Alumno');
    } else {
      setModalTitulo('Agregar Alumno');
    }
  }, [type, rowData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'matricula' && value) {
      setLoading(true);
      getData({
        endpoint: `/alumnos/programas/${programaId}?matricula=${value}`,
      })
        .then((response) => {
          if (response.data) {
            const alumnoEncontradoId = response.data.id;

            const alumnoYaAgregado = alumnosAgregados.some(
              (item) => item.alumnoId === alumnoEncontradoId,
            );

            if (alumnoYaAgregado) {
              setAlumno(null);
              setAlumnoId(null);

              setNoti({
                open: true,
                message: 'Este alumno ya fue agregado a la solicitud',
                type: 'warning',
              });

              return;
            }

            const fullName = `${response.data.persona.nombre} ${response.data.persona.apellidoPaterno} ${response.data.persona.apellidoMaterno}`;
            setAlumno(fullName);
            setAlumnoId(response.data.id);
          }
        })
        .catch(() => {
          setNoti({
            open: true,
            message: '¡No se encontró el Alumno!',
            type: 'error',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    const formattedForm = {
      matricula: form.matricula,
      fechaTerminacion: dayjs(form.fechaTerminacion).format('YYYY-MM-DDTHH:mm:ssZ'),
    };

    const endpoint = type === 'edit'
      ? `/solicitudesFolios/solicitudesFoliosAlumnos/${form.id}`
      : `/solicitudesFolios/${id}/alumnos/${alumnoId}`;

    const action = type === 'edit' ? updateRecord : createRecord;

    try {
      const response = await action({ data: formattedForm, endpoint });

      if (response.statusCode === 201 || response.statusCode === 200) {
        setNoti({
          open: true,
          message: type === 'edit'
            ? 'Registro actualizado exitosamente'
            : 'Registro creado exitosamente',
          type: 'success',
        });
        setAlumnoResponse(true);
        setOpen(false);
      } else if (response.statusCode === 409) {
        setNoti({
          open: true,
          message: '¡El alumno que intentó agregar aún no está validado!',
          type: 'error',
        });
      } else {
        setNoti({
          open: true,
          message: `¡Ocurrió un error inesperado! Código de error: ${response.statusCode}`,
          type: 'error',
        });
      }
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Ocurrió un error inesperado!: ${error.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setAlumno(null);
  };

  return (
    <DefaultModal title={modalTitulo} open={open} setOpen={setOpen}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="Matrícula"
            id="matricula"
            name="matricula"
            value={form.alumno?.matricula || ''}
            onblur={handleBlur}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        {alumno && (
          <Grid item xs={12}>
            <LabelData title="Alumno" subtitle={alumno} />
          </Grid>
        )}
        <Grid item xs={6}>
          <InputDate
            label="Fecha de elaboración de certificado"
            id="fechaExpedicion"
            name="fechaExpedicion"
            type="datetime"
            value={form.fechaExpedicion || ''}
            onChange={handleChange}
            required
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <InputDate
            label="Fecha de terminación plan de estudios"
            id="fechaTerminacion"
            name="fechaTerminacion"
            type="datetime"
            value={form.fechaTerminacion || ''}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonsForm
            confirm={handleConfirm}
            confirmDisabled={disabledButton}
            cancel={handleCancel}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

ModalCertificado.defaultProps = {
  id: null,
  programaId: null,
  rowData: {},
  disabled: false,
  alumnosAgregados: [],
};

ModalCertificado.propTypes = {
  open: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  setAlumnoResponse: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.number,
  programaId: PropTypes.number,
  alumnosAgregados: PropTypes.arrayOf(
    PropTypes.shape({
      alumnoId: PropTypes.number.isRequired,
    }),
  ),
  rowData: PropTypes.shape({
    alumno: PropTypes.shape({
      id: PropTypes.number,
      matricula: PropTypes.string,
      persona: PropTypes.shape({
        nombre: PropTypes.string,
        apellidoPaterno: PropTypes.string,
        apellidoMaterno: PropTypes.string,
      }),
    }),
    alumnoId: PropTypes.number,
    id: PropTypes.number,
    name: PropTypes.string,
    fechaInicio: PropTypes.string,
    fechaTerminacion: PropTypes.string,
    fechaExamenProfesional: PropTypes.string,
    fechaExencionExamenProfesional: PropTypes.string,
  }),
};
