import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { getInstitucionUsuario } from '@siiges-ui/instituciones';
import { Context } from '@siiges-ui/shared';
import PropTypes from 'prop-types';
import SectionLayout from '../../SectionLayout';
import pagination from '../../../events/pagination';
import DatosPlantel from '../../Sections/DatosPlantel';
import DescripcionPlantel from '../../Sections/DescripcionPlantel';
import HigienePlantel from '../../Sections/HigienePlantel';
import InstitucionesAledanas from '../../Sections/InstitucionesAledanas';
import Infraestructura from '../../Sections/Infraestructura';
import RatificacionNombre from '../../Sections/RatificacionNombre';
import NombresPropuestos from '../../Sections/NombresPropuestos';
import { PlantelProvider } from '../../utils/Context/plantelContext';
import Observaciones from '../../Sections/Observaciones';

export default function Plantel({
  nextModule,
  id,
  programaId,
  type,
  solicitud,
}) {
  const [disabled, setDisabled] = useState(true);
  const { session } = useContext(Context);
  const institucion = getInstitucionUsuario(session, solicitud?.usuarioId);
  const [ratificacion, setRatificacion] = useState(<RatificacionNombre disabled={disabled} />);
  const [plantelesData, setPlantelesData] = useState({});
  const [selectedPlantel, setSelectedPlantel] = useState();
  const isDisabled = type === 'consultar' || disabled;

  useEffect(() => {
    setDisabled(!id);
  }, [id]);

  useEffect(() => {
    if (institucion) {
      if (
        !institucion.ratificacionNombre
        || (Array.isArray(institucion.ratificacionNombre)
          && institucion.ratificacionNombre.some(
            (item) => !item.esNombreAutorizado,
          ))
      ) {
        setRatificacion(
          <NombresPropuestos
            disabled={isDisabled}
            id={institucion.id}
            institucion={institucion}
          />,
        );
      } else {
        setRatificacion(<RatificacionNombre disabled={isDisabled} />);
      }
    }
  }, [id, institucion]);

  useEffect(() => {
    if (solicitud.programa) {
      setSelectedPlantel(solicitud.programa.plantelId);
    }
  }, [solicitud, id]);

  const {
    next, prev, section, position, porcentaje,
  } = pagination(useState, 6);

  const renderSection6 = () => (section === 6 ? ratificacion : null);

  if (!institucion) {
    return null;
  }

  return (
    <Card sx={{ mt: 3, mb: 3 }}>
      <CardContent>
        <PlantelProvider
          selectedPlantel={selectedPlantel}
          institucion={institucion}
        >
          <SectionLayout
            type={type}
            sectionTitle="Plantel"
            sections={section}
            position={position}
            total="6"
            porcentaje={porcentaje}
            nextModule={nextModule}
            next={next}
            prev={prev}
            id={id}
          >
            {section === 1 && (
              <DatosPlantel
                disabled={isDisabled}
                plantelesData={plantelesData}
                setPlantelesData={setPlantelesData}
                usuarioId={solicitud?.usuarioId}
                type={type}
              />
            )}
            {section === 2 && (
              <DescripcionPlantel
                disabled={isDisabled}
                plantelesData={plantelesData}
                setPlantelesData={setPlantelesData}
                type={type}
              />
            )}
            {section === 3 && (
              <HigienePlantel
                disabled={isDisabled}
                plantelId={plantelesData?.id}
                type={type}
              />
            )}
            {section === 4 && (
              <InstitucionesAledanas disabled={isDisabled} programaId={programaId} type={type} />
            )}
            {section === 5 && (
              <Infraestructura disabled={isDisabled} programaId={programaId} type={type} />
            )}
            {renderSection6()}
            <Observaciones
              id={id}
              section={section + 13}
              type={type}
            />
          </SectionLayout>
        </PlantelProvider>
      </CardContent>
    </Card>
  );
}

Plantel.defaultProps = {
  id: null,
  programaId: null,
  type: '',
  solicitud: {},
};

Plantel.propTypes = {
  nextModule: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  programaId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.string,
  solicitud: PropTypes.shape({
    id: PropTypes.number,
    usuarioId: PropTypes.number,
    programa: PropTypes.shape({
      plantelId: PropTypes.number,
      plantel: PropTypes.shape({
        institucion: PropTypes.shape({
          id: PropTypes.number,
        }),
      }),
    }),
  }),
};
