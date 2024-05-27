import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import {
  DefaultModal,
  ButtonStyled,
  validateField,
  Context,
} from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import Input from '@siiges-ui/shared/src/components/Input';
import errorDatosAsignaturas from '../../sections/errors/errorDatosAsignaturas';
import handleCreate from '../../submitNewAsignaturas';
import { TablesPlanEstudiosContext } from '../../Context/tablesPlanEstudiosProviderContext';
import { area, grados } from '../../Mocks/mockAsignaturas';
import SolicitudContext from '../../Context/solicitudContext';

export default function AsignaturasCreateModal({ open, hideModal, title }) {
  const {
    asignaturasList,
    setAsignaturasList,
    formAsignaturas,
    setFormAsignaturas,
    error,
    setError,
    setInitialValues,
    setNoti,
  } = useContext(TablesPlanEstudiosContext);
  const { setLoading } = useContext(Context);
  const { form } = useContext(SolicitudContext);
  const [selectedGrade, setSelectedGrade] = useState(grados.semestral);

  useEffect(() => {
    if (form) {
      switch (form[1].programa.cicloId) {
        case 1:
          setSelectedGrade(grados.semestral);
          break;
        case 2:
          setSelectedGrade(grados.cuatrimestral);
          break;
        case 3:
          setSelectedGrade(grados.flexibleSemestral);
          break;
        case 4:
          setSelectedGrade(grados.flexibleCuatrimestral);
          break;
        case 5:
          setSelectedGrade(grados.optativa);
          break;
        default:
          setSelectedGrade(grados.semestral);
          break;
      }
    }
  }, [form]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormAsignaturas((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnBlur = (e) => {
    const { name } = e.target;
    validateField(formAsignaturas, name, setError, errorDatosAsignaturas);
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setInitialValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleOnSubmit = async () => {
    const matchingGrade = selectedGrade.find(
      (grade) => grade.id === formAsignaturas.gradoId,
    );
    const updatedFormAsignaturas = matchingGrade
      ? { ...formAsignaturas, grado: matchingGrade.nombre }
      : { ...formAsignaturas };

    try {
      await handleCreate(
        updatedFormAsignaturas,
        setFormAsignaturas,
        setInitialValues,
        setAsignaturasList,
        hideModal,
        setNoti,
        1,
        setLoading,
      );
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <DefaultModal open={open} setOpen={hideModal} title={title}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <BasicSelect
            title="Grado"
            name="gradoId"
            value=""
            options={selectedGrade}
            onchange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.gradoId}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <BasicSelect
            title="Area"
            name="areaId"
            value=""
            options={area}
            onchange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.areaId}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="nombre"
            label="Nombre(s)"
            name="nombre"
            auto="nombre"
            onchange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.nombre}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="clave"
            label="Clave"
            name="clave"
            auto="clave"
            onchange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.clave}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            id="creditos"
            label="Creditos"
            name="creditos"
            auto="creditos"
            onchange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.creditos}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            id="academia"
            label="Academia"
            name="academia"
            auto="academia"
            onchange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.academia}
          />
        </Grid>
        <Grid item xs={12}>
          <BasicSelect
            title="Seriacion"
            name="seriacion"
            value=""
            options={asignaturasList || []}
            onchange={handleOnChange}
            textValue
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasDocente"
            label="Horas docente"
            name="horasDocente"
            auto="horasDocente"
            onchange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.horasDocente}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            id="horasIndependiente"
            label="Horas independiente"
            name="horasIndependiente"
            auto="horasIndependiente"
            onchange={handleOnChange}
            onblur={handleOnBlur}
            onfocus={handleInputFocus}
            required
            errorMessage={error.horasIndependiente}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" marginTop={2}>
        <Grid item xs={2}>
          <ButtonStyled
            text="Cancelar"
            alt="Cancelar"
            design="error"
            onclick={hideModal}
          />
        </Grid>
        <Grid item xs={2}>
          <ButtonStyled
            text="Confirmar"
            alt="Confirmar"
            onclick={handleOnSubmit}
          />
        </Grid>
      </Grid>
    </DefaultModal>
  );
}

AsignaturasCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};
