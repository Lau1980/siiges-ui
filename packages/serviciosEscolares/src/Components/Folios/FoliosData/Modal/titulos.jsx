import { Grid } from '@mui/material';
import {
  ButtonsSections,
  DefaultModal,
  Input,
  InputDate,
  Select,
  createRecord,
} from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ModalTitulo({
  open, setOpen, type, id,
}) {
  const [position, setPosition] = useState('first');
  const [form, setForm] = useState({});

  useEffect(() => {
    if (type === 'edit' && id) {
      console.log('pending fetch function with id:', id);
      // Fetch the existing data and set it in the form state
      // Example: fetchDataById(id).then(data => setForm(data));
    }
  }, [type, id]);

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
    // Submit form
    createRecord({ data: form, endpoint: '/your-endpoint-here' });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    setPosition((prevPosition) => {
      if (prevPosition === 'last') return 'middle';
      if (prevPosition === 'middle') return 'first';
      return 'first';
    });
  };

  const handleNext = () => {
    setPosition((prevPosition) => {
      if (prevPosition === 'first') return 'middle';
      if (prevPosition === 'middle') return 'last';
      return 'last';
    });
  };

  return (
    <DefaultModal title="Folios título" open={open} setOpen={setOpen}>
      <Grid container spacing={2}>
        {position === 'first' && (
          <>
            <Grid item xs={6}>
              <Input
                label="Número de folio de acta de titulación"
                id="numeroFolio"
                name="numeroFolio"
                value={form.numeroFolio || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Clave de institución ante DGP"
                id="claveInstitucion"
                name="claveInstitucion"
                value={form.claveInstitucion || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Clave de carrera ante DGP"
                id="claveCarrera"
                name="claveCarrera"
                value={form.claveCarrera || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                label="Correo del alumno"
                id="correoAlumno"
                name="correoAlumno"
                value={form.correoAlumno || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                label="CURP del alumno"
                id="curpAlumno"
                name="curpAlumno"
                value={form.curpAlumno || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de inicio plan de estudios"
                id="fechaInicio"
                name="fechaInicio"
                type="datetime"
                value={form.fechaInicio || ''}
                onChange={handleChange}
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
              />
            </Grid>
          </>
        )}
        {position === 'middle' && (
          <>
            <Grid item xs={6}>
              <Input
                label="Institución de procedencia"
                id="institucionProcedencia"
                name="institucionProcedencia"
                value={form.institucionProcedencia || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Nivel de estudio de antecedente"
                options={[]} // Add your options here
                name="nivelEstudios"
                value={form.nivelEstudios || ''}
                onChange={handleSelectChange('nivelEstudios')}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Estado de antecedente"
                options={[]} // Add your options here
                name="estadoAntecedente"
                value={form.estadoAntecedente || ''}
                onChange={handleSelectChange('estadoAntecedente')}
              />
            </Grid>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de inicio de antecedente"
                id="fechaInicioAntecedente"
                name="fechaInicioAntecedente"
                value={form.fechaInicioAntecedente || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de terminación de antecedente"
                id="fechaTerminacionAntecedente"
                name="fechaTerminacionAntecedente"
                value={form.fechaTerminacionAntecedente || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Número de cédula"
                id="numeroCedula"
                name="numeroCedula"
                value={form.numeroCedula || ''}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}
        {position === 'last' && (
          <>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de expedición de título"
                id="fechaExpedicion"
                name="fechaExpedicion"
                value={form.fechaExpedicion || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Modalidad de titulación"
                options={[]} // Add your options here
                name="modalidadTitulacion"
                value={form.modalidadTitulacion || ''}
                onChange={handleSelectChange('modalidadTitulacion')}
              />
            </Grid>
            <Grid item xs={6}>
              <InputDate
                label="Fecha de examen profesional"
                id="fechaExamenProfesional"
                name="fechaExamenProfesional"
                value={form.fechaExamenProfesional || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Cumplió servicio social"
                options={[]} // Add your options here
                name="cumplioServicioSocial"
                value={form.cumplioServicioSocial || ''}
                onChange={handleSelectChange('cumplioServicioSocial')}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Fundamento legal de servicio social"
                options={[]} // Add your options here
                name="fundamentoLegal"
                value={form.fundamentoLegal || ''}
                onChange={handleSelectChange('fundamentoLegal')}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                title="Estados"
                options={[]} // Add your options here
                name="estados"
                value={form.estados || ''}
                onChange={handleSelectChange('estados')}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <ButtonsSections
            prev={handlePrev}
            next={handleNext}
            confirm={handleConfirm}
            cancel={handleCancel}
            position={position}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

ModalTitulo.defaultProps = {
  id: null,
};

ModalTitulo.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.number,
};
