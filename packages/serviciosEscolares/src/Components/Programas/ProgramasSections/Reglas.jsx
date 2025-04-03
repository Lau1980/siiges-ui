import React, { useState, useContext, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Grid,
  Typography,
  FormHelperText,
} from '@mui/material';
import {
  ButtonSimple, Context, getData, updateRecord,
} from '@siiges-ui/shared';
import { useRouter } from 'next/router';

export default function Reglas() {
  const { setNoti, setLoading } = useContext(Context);
  const [idSolicitud, setIdSolicitud] = useState();
  const router = useRouter();
  const { query } = router;

  const [form, setForm] = useState({
    id: query.id || '',
    calificacionMinima: '',
    calificacionMaxima: '',
    calificacionAprobatoria: '',
    calificacionDecimal: '',
  });

  const [errors, setErrors] = useState({
    calificacionMinima: false,
    calificacionMaxima: false,
    calificacionAprobatoria: false,
    calificacionDecimal: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    calificacionMinima: '',
    calificacionMaxima: '',
    calificacionAprobatoria: '',
    calificacionDecimal: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getData({ endpoint: `/solicitudes/${query.id}` });

      if (response.statusCode === 200) {
        const { data } = response || {};
        setIdSolicitud(data.id);
        setForm({
          id: query.id || '',
          calificacionMinima: data.programa.calificacionMinima || '',
          calificacionMaxima: data.programa.calificacionMaxima || '',
          calificacionAprobatoria: data.programa.calificacionAprobatoria || '',
          calificacionDecimal: data.programa.calificacionDecimal ? '1' : '2',
        });
      } else {
        setNoti({
          open: true,
          message: response.errorMessage,
          type: 'error',
        });
      }
      setLoading(false);
    };

    if (query.id) {
      fetchData();
    }
  }, [query.id, setLoading, setNoti]);

  const validateField = (name, value) => {
    let isValid = true;
    let message = '';

    if (!value && value !== 0) {
      isValid = false;
      message = 'Este campo es requerido';
    } else if (name !== 'calificacionDecimal' && Number.isNaN(value)) {
      isValid = false;
      message = 'Debe ser un número válido';
    }

    setErrors((prev) => ({ ...prev, [name]: !isValid }));
    setErrorMessages((prev) => ({ ...prev, [name]: message }));
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    const newErrorMessages = { ...errorMessages };

    // Validate all fields except the disabled ID field
    const fieldsToValidate = ['calificacionMinima', 'calificacionMaxima', 'calificacionAprobatoria', 'calificacionDecimal'];

    fieldsToValidate.forEach((field) => {
      if (!form[field] && form[field] !== 0) {
        newErrors[field] = true;
        newErrorMessages[field] = 'Este campo es requerido';
        isValid = false;
      }
    });

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const formatToDecimal = (value) => parseFloat(value).toFixed(1);

  const handleSubmit = async () => {
    if (!validateForm()) {
      setNoti({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    const dataBody = {
      programa: {
        calificacionMinima: form.calificacionDecimal === '1' ? formatToDecimal(form.calificacionMinima) : form.calificacionMinima,
        calificacionMaxima: form.calificacionDecimal === '1' ? formatToDecimal(form.calificacionMaxima) : form.calificacionMaxima,
        calificacionAprobatoria: form.calificacionDecimal === '1' ? formatToDecimal(form.calificacionAprobatoria) : form.calificacionAprobatoria,
        calificacionDecimal: form.calificacionDecimal === '1',
      },
    };

    try {
      await updateRecord({
        data: dataBody,
        endpoint: `/solicitudes/${idSolicitud}`,
      });

      setLoading(false);
      setNoti({
        open: true,
        message: '¡Reglas actualizadas con éxito!',
        type: 'success',
      });
    } catch (error) {
      setLoading(false);
      setNoti({
        open: true,
        message: `¡Error al actualizar las reglas!: ${error.message}`,
        type: 'error',
      });
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Reglas</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="ID"
            name="id"
            value={form.id}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Calificación Mínima"
            name="calificacionMinima"
            type="number"
            value={form.calificacionMinima}
            onChange={handleInputChange}
            error={errors.calificacionMinima}
            fullWidth
            required
          />
          {errors.calificacionMinima && (
            <FormHelperText error>{errorMessages.calificacionMinima}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Calificación Máxima"
            name="calificacionMaxima"
            type="number"
            value={form.calificacionMaxima}
            onChange={handleInputChange}
            error={errors.calificacionMaxima}
            fullWidth
            required
          />
          {errors.calificacionMaxima && (
            <FormHelperText error>{errorMessages.calificacionMaxima}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Calificación Aprobatoria"
            name="calificacionAprobatoria"
            type="number"
            value={form.calificacionAprobatoria}
            onChange={handleInputChange}
            error={errors.calificacionAprobatoria}
            fullWidth
            required
          />
          {errors.calificacionAprobatoria && (
            <FormHelperText error>{errorMessages.calificacionAprobatoria}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Calificaciones Decimales"
            name="calificacionDecimal"
            value={form.calificacionDecimal}
            onChange={handleInputChange}
            error={errors.calificacionDecimal}
            fullWidth
            required
          >
            <MenuItem value="1">Si</MenuItem>
            <MenuItem value="2">No</MenuItem>
          </TextField>
          {errors.calificacionDecimal && (
            <FormHelperText error>{errorMessages.calificacionDecimal}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <ButtonSimple onClick={handleSubmit} align="right">
            Guardar
          </ButtonSimple>
        </Grid>
      </Grid>
    </div>
  );
}
