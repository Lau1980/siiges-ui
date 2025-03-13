import { Tabs, Tab, Box } from '@mui/material';
import { Context } from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import SolicitudBecasSection from './SolicitudBecasSection';
import AlumnosSection from './AlumnosSection';
import ButtonsBox from './ButtonsBox';
import {
  fetchProgramaPlantelData, handleSaveSolicitud, fetchSolicitudData, handleUpdateSolicitud,
} from '../utils';
import ButtonsReviewBox from './ButtonsReviewBox';

export default function SolicitudesBecasBox({ type }) {
  const EN_CAPTURA = 1;
  const DATOS_SOLICTUD = 0;
  const ALUMNOS = 1;
  const { setNoti, session, setLoading } = useContext(Context);
  const [tabIndex, setTabIndex] = useState(DATOS_SOLICTUD);
  const [data, setData] = useState({});
  const [solicitudId, setSolicitudId] = useState('');
  const [reqData, setReqData] = useState({});
  const [formData, setFormData] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const router = useRouter();
  const { programa, institucion, solicitudBecasId } = router.query;

  const validateData = {
    consultar: () => (!programa || !institucion) && router.back(),
    crear: () => (!programa || !institucion) && router.back(),
    editar: () => (!programa || !institucion || !solicitudBecasId) && router.back(),
  };

  useEffect(() => {
    validateData[type]();
    fetchProgramaPlantelData(setNoti, setLoading, setData, programa, institucion);

    if (solicitudBecasId && type !== 'crear') {
      setSolicitudId(solicitudBecasId);
      fetchSolicitudData(setNoti, setLoading, setFormData, solicitudBecasId);
    } else {
      setReqData({
        programaId: programa,
        estatusSolicitudBecaId: EN_CAPTURA,
        usuarioId: session.id,
      });
    }
    if (type === 'consultar') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [type]);

  const handleTabChange = (event, newValue) => {
    /* setIsSaved((prev) => !prev); */
    setTabIndex(newValue);
  };

  const hasValidProperties = (properties = []) => {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(properties)) return false;

    return properties.every((prop) => data[prop] && typeof data[prop] === 'object' && Object.keys(data[prop]).length > 0);
  };

  useEffect(() => {
    if (tabIndex === 1) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [tabIndex]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Datos de la Solicitud" />
          <Tab label="Alumnos" disabled={!solicitudId} />
        </Tabs>
      </Box>
      {tabIndex === DATOS_SOLICTUD && hasValidProperties(['programa', 'plantel']) && (
      <SolicitudBecasSection
        programa={data?.programa}
        plantel={data?.plantel}
        setReqData={setReqData}
        formData={formData}
        disabled={disabled}
      />
      )}
      {tabIndex === ALUMNOS && hasValidProperties(['programa', 'plantel']) && (
      <AlumnosSection
        programa={data?.programa}
        solicitudId={solicitudId}
        disabled={disabled}
      />
      )}
      {session.rol !== 'becas_sicyt' ? (
        <ButtonsBox
          cancel={() => router.push('/solicitudesBecas')}
          save={() => handleSaveSolicitud(
            setNoti,
            setLoading,
            setSolicitudId,
            reqData,
            setTabIndex,
          )}
          update={() => handleUpdateSolicitud(
            setNoti,
            setLoading,
            reqData,
            solicitudId,
          )}
          isSaved={isSaved}
          solicitudId={solicitudId}
          setIsSaved={setIsSaved}
          saveIsDisabled={disabled}
        />
      ) : <ButtonsReviewBox router={router} solicitudId={solicitudId} formData={formData} />}
    </Box>
  );
}

SolicitudesBecasBox.defaultProps = {
  type: null,
};

SolicitudesBecasBox.propTypes = {
  type: PropTypes.string,
};
