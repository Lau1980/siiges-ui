import { Grid } from '@mui/material';
import {
  ButtonsForm,
  DefaultModal,
  Input,
  InputDate,
  LabelData,
  createRecord,
} from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ModalCertificado({
  open, setOpen, type, id,
}) {
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

  const handleConfirm = () => {
    // Submit form
    createRecord({ data: form, endpoint: '/your-endpoint-here' });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <DefaultModal title="Folios certificados" open={open} setOpen={setOpen}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="Matrícula"
            id="matricula"
            name="matricula"
            value={form.matricula || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <LabelData title="Alumno" subtitle="Pedro Pedro Pedro" />
        </Grid>
        <Grid item xs={6}>
          <InputDate
            label="Fecha de elaboración de certificado"
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
        <Grid item xs={12}>
          <ButtonsForm confirm={handleConfirm} cancel={handleCancel} />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

ModalCertificado.defaultProps = {
  id: null,
};

ModalCertificado.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.number,
};
