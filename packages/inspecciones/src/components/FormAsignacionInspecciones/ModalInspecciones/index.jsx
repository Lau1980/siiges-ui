import Tooltip from '@mui/material/Tooltip';
import React, {
  useState, useEffect, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  ButtonsForm,
  Context,
  DefaultModal,
  Input,
  InputDate,
  getToken,
} from '@siiges-ui/shared';
import dayjs from 'dayjs';

const apikey = process.env.NEXT_PUBLIC_API_KEY;
const url = process.env.NEXT_PUBLIC_URL;

const fetchData = async ({
  path, dataBody, setNoti, setLoading, router,
}) => {
  try {
    const token = getToken();
    const response = await fetch(`${url}/api/v1/${path}`, {
      method: 'POST',
      headers: {
        api_key: apikey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: dataBody,
    });
    if (!response.ok) throw new Error('¡La respuesta de la red no fue correcta!');
    const { data } = await response.json();
    setLoading(false);
    setNoti({
      open: true,
      message: '¡Inspector asignado con éxito!',
      type: 'success',
    });
    router.back();
    return data;
  } catch (error) {
    setLoading(false);
    setNoti({
      open: true,
      message: `¡Error al asignar la inspección!: ${error.message}`,
      type: 'error',
    });
    return null;
  }
};

function ModalInspecciones({ params: { row }, solicitud }) {
  const { setNoti, setLoading } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [inspector, setInspector] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ fechaInspeccion: '', folio: '' });
  const router = useRouter();

  const openModal = useCallback(() => setOpen(true), []);
  const handleCancel = useCallback(() => {
    setOpen(false);
    setForm({ fechaInspeccion: '', folio: '' });
  }, []);

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevValues) => ({ ...prevValues, [name]: value }));
  }, []);

  const validations = useCallback(() => {
    const newErrors = {};
    if (!form.fechaInspeccion) {
      newErrors.fechaInspeccion = '¡La fecha de inspección no puede ser nula!';
    } else if (dayjs(form.fechaInspeccion).isBefore(dayjs(), 'day')) {
      newErrors.fechaInspeccion = '¡La fecha de inspección no puede ser anterior a la fecha actual!';
    }
    if (!form.folio) {
      newErrors.folio = '¡Por favor, ingrese un número de folio!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const createInspection = useCallback(async () => {
    if (validations()) {
      setLoading(true);
      const dataParams = {
        ...row,
        fechaInspeccion: form.fechaInspeccion,
        folio: form.folio,
      };

      const inspeccionData = JSON.stringify({
        programaId: dataParams.programaId,
        inspectorId: dataParams.id,
        estatusInspeccionId: 1,
        folio: dataParams.folio,
        fecha: new Date().toISOString(),
        fechaAsignada: dataParams.fechaInspeccion,
      });

      await fetchData({
        path: 'inspecciones/inspectores-programas',
        dataBody: inspeccionData,
        setNoti,
        setLoading,
        router,
      });
      setOpen(false);
      setForm({ fechaInspeccion: '', folio: '' });
    }
  }, [validations, form, row, setNoti, setLoading]);

  useEffect(() => {
    if (open) {
      setInspector(row);
      setIsLoading(false);
    }
  }, [open, row]);

  return (
    <>
      <Tooltip title="Consultar" placement="top">
        <IconButton aria-label="consultar" onClick={openModal}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
      <DefaultModal open={open} setOpen={setOpen} title="Confirmar inspector">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                  backgroundColor: 'rgb(71, 127, 158, 0.53)',
                  margin: 3,
                  padding: 3,
                }}
              >
                Está por asignar
                {' '}
                {solicitud.nombre}
                {' '}
                a Inspector
                {' '}
                {inspector.nombre}
                {' '}
                p/migrar RVOES
                SICYT para que realice la visita de inspección. ¿Está usted
                seguro?
              </Card>
            </Grid>
            <Grid item xs={6}>
              <InputDate
                id="fechaInspeccion"
                label="Fecha de inspección"
                name="fechaInspeccion"
                auto="fechaInspeccion"
                type="datetime"
                onChange={handleOnChange}
                errorMessage={errors.fechaInspeccion}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                id="folio"
                label="Folio"
                name="folio"
                auto="folio"
                onChange={handleOnChange}
                errorMessage={errors.folio}
                value={form.folio}
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonsForm confirm={createInspection} cancel={handleCancel} />
            </Grid>
          </Grid>
        )}
      </DefaultModal>
    </>
  );
}

ModalInspecciones.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      activas: PropTypes.string.isRequired,
      realizadas: PropTypes.string.isRequired,
      programaId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  solicitud: PropTypes.shape({
    nombre: PropTypes.string,
  }).isRequired,
};

export default ModalInspecciones;
