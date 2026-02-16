import { Grid } from '@mui/material';
import {
  BinarySelect,
  ButtonsSections,
  Context,
  DefaultModal,
  Input,
  InputDate,
  LabelData,
  Select,
  createRecord,
  getData,
  updateRecord,
} from '@siiges-ui/shared';
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const modalidadTitulacion = [
  { id: 1, nombre: 'Por Tesis' },
  { id: 2, nombre: 'Por Promedio' },
  { id: 3, nombre: 'Por Estudios de Posgrados' },
  { id: 4, nombre: 'Por Experiencia Laboral' },
  { id: 5, nombre: 'Por Ceneval' },
  { id: 6, nombre: 'Otro' },
];

const cumplioServicioSocial = [
  { id: 0, nombre: 'No' },
  { id: 1, nombre: 'Si' },
];

const fundamentoLegal = [
  { id: 1, nombre: 'ART. 52 LRART. 5 CONST' },
  { id: 2, nombre: 'ART. 55 LRART. 5 CONST' },
  { id: 3, nombre: 'ART. 91 LRART. 5 CONST' },
  {
    id: 4,
    nombre:
      'ART. 10 REGLAMENTO PARA LA PRESTACIÓN DEL SERVICIO SOCIAL DE LOS ESTUDIANTES DE LAS INSTITUCIONES DE EDUCACIÓN SUPERIOR EN LA REPÚBLICA MEXICANA',
  },
  { id: 5, nombre: 'NO APLICA' },
];

export default function ModalTitulo({
  open,
  setOpen,
  type,
  id,
  rowData,
  programaId,
  setAlumnoResponse,
  disabled,
  alumnosAgregados = [],
}) {
  const [position, setPosition] = useState('first');
  const [modalTitulo, setModalTitulo] = useState('Agregar Alumno');
  const [form, setForm] = useState({});
  const [alumno, setAlumno] = useState(null);
  const [alumnoId, setAlumnoId] = useState(null);
  const { setNoti, setLoading } = useContext(Context);
  const getEmptyForm = () => ({
    matricula: '',
    fechaInicio: '',
    fechaTerminacion: '',
    fechaExamenProfesional: '',
    modalidadTitulacionId: '',
    cumplioServicioSocial: '',
    fundamentoServicioSocialId: '',
    fechaExpedicion: '',
  });

  useEffect(() => {
    if (type !== 'create' && rowData) {
      setForm(rowData);
      if (rowData.alumno) {
        const fullName = `${rowData.alumno.persona.nombre} ${rowData.alumno.persona.apellidoPaterno} ${rowData.alumno.persona.apellidoMaterno}`;
        setAlumno(fullName);
      }
      setAlumnoId(rowData.alumnoId);
    } else {
      setForm(getEmptyForm());
      setAlumno(null);
      setAlumnoId(null);
    }

    if (type === 'edit') setModalTitulo('Editar Alumno');
    else if (type === 'consult') setModalTitulo('Consultar Alumno');
    else setModalTitulo('Agregar Alumno');
  }, [type, rowData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSelectChange = (name) => (event) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: event.target.value,
    }));
  };

  const handleConfirm = () => {
    setLoading(true);

    const formattedForm = {
      ...form,
      fechaInicio: form.fechaInicio
        ? dayjs(form.fechaInicio).format('YYYY-MM-DDTHH:mm:ssZ')
        : null,
      fechaTerminacion: form.fechaTerminacion
        ? dayjs(form.fechaTerminacion).format('YYYY-MM-DDTHH:mm:ssZ')
        : null,
      fechaExpedicion: form.fechaExpedicion
        ? dayjs(form.fechaExpedicion).format('YYYY-MM-DDTHH:mm:ssZ')
        : null,
      fechaExamenProfesional: form.fechaExamenProfesional
        ? dayjs(form.fechaExamenProfesional).format('YYYY-MM-DDTHH:mm:ssZ')
        : null,
    };

    const endpoint = type === 'edit'
      ? `/solicitudesFolios/solicitudesFoliosAlumnos/${form.id}`
      : `/solicitudesFolios/${id}/alumnos/${alumnoId}`;

    const action = type === 'edit' ? updateRecord : createRecord;

    action({ data: formattedForm, endpoint })
      .then((data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          setNoti({
            open: true,
            message:
              type === 'edit'
                ? 'Registro actualizado exitosamente'
                : 'Registro creado exitosamente',
            type: 'success',
          });
          setForm(getEmptyForm());
          setAlumno(null);
          setAlumnoId(null);
          setPosition('first');
          setAlumnoResponse(true);
          setOpen(false);
        } else {
          setNoti({
            open: true,
            message: 'El alumno registrado no esta validado',
            type: 'warning',
          });
        }
      })
      .catch((error) => {
        setNoti({
          open: true,
          message: `¡Ocurrió un error inesperado!: ${error}`,
          type: 'error',
        });
      })
      .finally(() => {
        setPosition('first');
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setPosition('first');
    setOpen(false);
    setAlumno(null);
  };

  const handlePrev = () => {
    if (position === 'last') setPosition('first');
  };

  const alumnoYaAgregado = (idAlumno) => alumnosAgregados.some(
    (item) => item.alumnoId === idAlumno,
  );

  const handleNext = () => {
    if (!alumnoId) return;

    if (type === 'create' && alumnoYaAgregado(alumnoId)) {
      setNoti({
        open: true,
        message: 'Este alumno ya fue agregado a la solicitud',
        type: 'warning',
      });
      return;
    }

    if (position === 'first') setPosition('last');
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'matricula' && value) {
      setLoading(true);
      getData({ endpoint: `/alumnos/programas/${programaId}?matricula=${value}` })
        .then((response) => {
          if (response.data) {
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

  return (
    <DefaultModal title={modalTitulo} open={open} setOpen={setOpen}>
      <Grid container spacing={2}>
        {position === 'first' && (
          <>
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
                label="Fecha de inicio plan de estudios"
                id="fechaInicio"
                name="fechaInicio"
                type="datetime"
                value={form.fechaInicio || ''}
                onChange={handleChange}
                disabled={disabled}
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
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de expedición de título"
                id="fechaExpedicion"
                name="fechaExpedicion"
                value={form.fechaExpedicion || ''}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Modalidad de titulación"
                options={modalidadTitulacion}
                name="modalidadTitulacionId"
                value={form.modalidadTitulacionId || ''}
                onChange={handleSelectChange('modalidadTitulacionId')}
                disabled={disabled}
              />
            </Grid>
          </>
        )}
        {position === 'last' && (
          <>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de examen profesional"
                id="fechaExamenProfesional"
                name="fechaExamenProfesional"
                value={form.fechaExamenProfesional || ''}
                onChange={handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <BinarySelect
                title="Cumplió servicio social"
                options={cumplioServicioSocial}
                name="cumplioServicioSocial"
                value={form.cumplioServicioSocial || ''}
                onChange={handleSelectChange('cumplioServicioSocial')}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Fundamento legal de servicio social"
                options={fundamentoLegal}
                name="fundamentoServicioSocialId"
                value={form.fundamentoServicioSocialId || ''}
                onChange={handleSelectChange('fundamentoServicioSocialId')}
                disabled={disabled}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <ButtonsSections
            prev={handlePrev}
            next={handleNext}
            confirm={handleConfirm}
            confirmDisabled={disabled}
            cancel={handleCancel}
            position={position}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

ModalTitulo.defaultProps = {
  alumnosAgregados: [],
  id: null,
  rowData: {},
  programaId: null,
};

ModalTitulo.propTypes = {
  open: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
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
  }),
};
