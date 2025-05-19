import { Grid } from '@mui/material';
import {
  Input, InputDate, Select, Subtitle,
} from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const domain = process.env.NEXT_PUBLIC_URL;

const tipoSolicitudes = [
  { id: 1, nombre: 'Parcial' },
  { id: 2, nombre: 'Total' },
  { id: 3, nombre: 'Duplicado' },
];

const sexo = [
  { id: 1, nombre: 'Masculino' },
  { id: 2, nombre: 'Femenino' },
  { id: 3, nombre: 'Otro' },
];

export default function DatosSolicitante({
  form, handleOnChange, estados, disabled,
}) {
  const [municipios, setMunicipios] = useState([]);
  const [estadoId, setEstadoId] = useState('');
  const [municipiosDisabled, setMunicipiosDisabled] = useState(!estadoId);

  useEffect(() => {
    if (form.interesado?.persona?.domicilio?.estadoId) {
      setEstadoId(form.interesado.persona.domicilio.estadoId);
      setMunicipiosDisabled(false);
    }
  }, [form.interesado?.persona?.domicilio?.estadoId]);

  useEffect(() => {
    const fetchMunicipios = async () => {
      if (estadoId) {
        try {
          const response = await fetch(
            `${domain}/api/v1/public/municipios/?estadoId=${estadoId}`,
            {
              headers: {
                api_key: apiKey,
                'Content-Type': 'application/json',
              },
            },
          );
          const data = await response.json();
          setMunicipios(data.data);
        } catch (error) {
          console.error('¡Error al buscar municipios!:', error);
        }
      }
    };

    fetchMunicipios();
  }, [estadoId]);

  const handleEstadoChange = (event) => {
    const selectedEstadoId = event.target.value;
    setEstadoId(selectedEstadoId);
    setMunicipiosDisabled(!selectedEstadoId);
    handleOnChange(event, ['interesado', 'persona', 'domicilio']);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Trámite de Equivalencia</Subtitle>
      </Grid>
      <Grid item xs={3}>
        <Select
          title="Tipo de Solicitud"
          options={tipoSolicitudes}
          name="tipoTramiteId"
          value={form.tipoTramiteId || ''}
          onChange={(e) => handleOnChange(e, [])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <Subtitle>Datos del Solicitante</Subtitle>
      </Grid>
      <Grid item xs={3}>
        <Input
          id="curp"
          label="CURP"
          name="curp"
          value={form.interesado?.persona?.curp || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          id="nombre"
          label="Nombre"
          name="nombre"
          value={form.interesado?.persona?.nombre || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          id="apellidoPaterno"
          label="Primer Apellido"
          name="apellidoPaterno"
          value={form.interesado?.persona?.apellidoPaterno || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          id="apellidoMaterno"
          label="Segundo Apellido"
          name="apellidoMaterno"
          value={form.interesado?.persona?.apellidoMaterno || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          id="nacionalidad"
          label="Nacionalidad"
          name="nacionalidad"
          value={form.interesado?.persona?.nacionalidad || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Select
          id="sexo"
          title="Sexo"
          options={sexo}
          name="sexo"
          value={form.interesado?.persona?.sexo || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <InputDate
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="datetime"
          value={form.interesado?.persona?.fechaNacimiento || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <Subtitle>Dirección</Subtitle>
      </Grid>
      <Grid item xs={9}>
        <Input
          name="calle"
          id="calle"
          label="Calle"
          value={form.interesado?.persona?.domicilio?.calle || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona', 'domicilio'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          name="numeroExterior"
          id="numeroExterior"
          label="Número Exterior"
          value={form.interesado?.persona?.domicilio?.numeroExterior || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona', 'domicilio'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          name="colonia"
          id="colonia"
          label="Colonia"
          value={form.interesado?.persona?.domicilio?.colonia || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona', 'domicilio'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Select
          title="Estados"
          name="estadoId"
          options={estados}
          value={estadoId}
          onChange={handleEstadoChange}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Select
          title="Municipio"
          name="municipioId"
          options={municipios}
          value={form.interesado?.persona?.domicilio?.municipioId || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona', 'domicilio'])}
          disabled={disabled || municipiosDisabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          name="codigoPostal"
          id="codigoPostal"
          label="Código Postal"
          value={form.interesado?.persona?.domicilio?.codigoPostal || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona', 'domicilio'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <Subtitle>Contacto</Subtitle>
      </Grid>
      <Grid item xs={3}>
        <Input
          name="correoPrimario"
          id="correoPrimario"
          label="Correo de Contacto"
          value={form.interesado?.persona?.correoPrimario || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          name="telefono"
          id="telefono"
          label="Teléfono de Contacto"
          value={form.interesado?.persona?.telefono || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          name="celular"
          id="celular"
          label="Celular"
          value={form.interesado?.persona?.celular || ''}
          onChange={(e) => handleOnChange(e, ['interesado', 'persona'])}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
}

DatosSolicitante.defaultProps = {
  handleOnChange: () => {},
  disabled: false,
};

DatosSolicitante.propTypes = {
  disabled: PropTypes.bool,
  form: PropTypes.shape({
    tipoTramiteId: PropTypes.number,
    gradoAcademico: PropTypes.number,
    interesado: PropTypes.shape({
      persona: PropTypes.shape({
        curp: PropTypes.string,
        nombre: PropTypes.string,
        nacionalidad: PropTypes.string,
        sexo: PropTypes.string,
        apellidoPaterno: PropTypes.string,
        apellidoMaterno: PropTypes.string,
        fechaNacimiento: PropTypes.string,
        correoPrimario: PropTypes.string,
        telefono: PropTypes.string,
        celular: PropTypes.string,
        domicilio: PropTypes.shape({
          calle: PropTypes.string,
          numeroExterior: PropTypes.string,
          colonia: PropTypes.string,
          estadoId: PropTypes.string,
          municipioId: PropTypes.string,
          codigoPostal: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
  handleOnChange: PropTypes.func,
  estados: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
