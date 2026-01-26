import Tooltip from '@mui/material/Tooltip';
import {
  Grid, Tabs, Tab, List,
  IconButton, Typography,
} from '@mui/material';
import {
  Context,
  DataTable,
  getData,
  Input,
  InputFile,
  Layout,
  ListSubtitle,
  ListTitle,
  GetFile,
  createRecord,
  deleteRecord,
  DefaultModal,
  ButtonsForm,
} from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { ModalCertificado, ModalTitulo, ButtonsFoliosAdmin } from '@siiges-ui/serviciosescolares';
import dayjs from 'dayjs';
import Divider from '@mui/material/Divider';

export default function Folios() {
  const { setNoti, setLoading } = useContext(Context);

  const [url, setUrl] = useState(null);
  const [etiquetas, setEtiquetas] = useState({
    tipoDocumento: '',
    tipoSolicitudFolio: '',
    acuerdoRvoe: '',
    planEstudios: '',
    gradoAcademico: '',
    nombreAlumno: '',
    matriculaAlumno: '',
    claveCentroTrabajo: '',
    modalidades: '',
    periodos: '',
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [estatus, setEstatus] = useState();
  const [alumnosRows, setAlumnosRows] = useState([]);
  const [alumnoData, setAlumnoData] = useState({});
  const [alumnoResponse, setAlumnoResponse] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [alumnoToDelete, setAlumnoToDelete] = useState(null);
  const [rowData, setRowData] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState();
  const [formData, setFormData] = useState({
    folioPago: '',
  });
  const selectedAlumno = alumnosRows.find(
    (row) => row.id === alumnoToDelete,
  );

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && alumnoResponse) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await getData({
            endpoint: `/solicitudesFolios/${id}`,
          });
          const { data } = response;
          setObservaciones(data.observaciones || '');
          setEtiquetas({
            tipoDocumento: data.tipoDocumento?.nombre || '',
            tipoSolicitudFolio: data.tipoSolicitudFolio?.nombre || '',
            acuerdoRvoe: data.programa?.acuerdoRvoe || '',
            planEstudios: data.programa?.nombre || '',
            gradoAcademico: data.programa?.nivelId || '',
            nombreAlumno: data.alumno ? data.alumno.nombre : '',
            matriculaAlumno: data.alumno ? data.alumno.matricula : '',
            institucion: data.programa?.plantel?.institucion?.nombre || '',
            claveCentroTrabajo: data.programa?.plantel?.claveCentroTrabajo || '',
            modalidades: data.programa?.modalidadId || '',
            periodos: data.programa?.cicloId || '',
          });
          setEstatus(data.estatusSolicitudFolioId);
          setTipoDocumento(data.tipoDocumentoId);
          setFormData({
            folioPago: data.folioPago || '',
          });

          GetFile(
            {
              entidadId: id,
              tipoEntidad: 'SOLICITUD_FOLIO',
              tipoDocumento: 'COMPROBANTE_PAGO_FOLIOS',
            },
            setUrl,
          );

          const alumnosResponse = await getData({
            endpoint: `/solicitudesFolios/${id}/alumnos`,
          });
          if (alumnosResponse.data) {
            const mappedAlumnos = alumnosResponse.data.map((res) => ({
              id: res.id,
              consecutivo: res.consecutivo,
              nombre: `${res.alumno.persona.nombre} ${res.alumno.persona.apellidoPaterno} ${res.alumno.persona.apellidoMaterno}`,
              numeroFolioActa: res.folioActa || '',
              matricula: res.alumno.matricula,
              folio: res.folioDocumentoAlumno?.folioDocumento,
              foja: res.folioDocumentoAlumno?.foja?.nombre,
              libro: res.folioDocumentoAlumno?.libro?.nombre,
              envio: res.folioDocumentoAlumno?.envioExitoso ? 'Enviado' : 'Pendiente',
              fechaExpedicion: dayjs(res.fechaExpedicion).format('DD/MM/YYYY'),
              fechaTerminacion: dayjs(res.fechaTerminacion).format('DD/MM/YYYY'),
            }));
            setAlumnosRows(mappedAlumnos);
            setAlumnoData(alumnosResponse.data);
            setAlumnoResponse(false);
          }
        } catch (error) {
          setNoti({
            open: true,
            message: `¡Error al cargar la solicitud!: ${error.message}`,
            type: 'error',
          });
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      };
      fetchData();
    }
  }, [id, alumnoResponse]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleObservacionesChange = (event) => {
    setObservaciones(event.target.value);
  };

  const handleObservacionesSubmit = async () => {
    if (id && observaciones) {
      setLoading(true);
      try {
        const response = await createRecord({
          data: { observaciones },
          endpoint: `/solicitudesFolios/${id}/observaciones`,
        });

        if (response.statusCode === 201) {
          setNoti({
            open: true,
            message: '¡Observaciones actualizadas con éxito!',
            type: 'success',
          });

          router.back();
        } else {
          throw new Error(response.message || '¡Error al actualizar las observaciones!');
        }
      } catch (error) {
        setNoti({
          open: true,
          message: ` ${error.message}`,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFoliosSubmit = async () => {
    if (id) {
      setLoading(true);
      try {
        const endpoint = estatus === 3
          ? `/solicitudesFolios/${id}/envioTitulacion`
          : `/solicitudesFolios/${id}/asignacionFolios`;

        const response = await createRecord({
          data: {},
          endpoint,
        });

        if (response.statusCode === 201) {
          setNoti({
            open: true,
            message: '¡Folios asignados con éxito!',
            type: 'success',
          });
          router.back();
        } else {
          throw new Error(response.message || '¡Error al asignar los folios!');
        }
      } catch (error) {
        setNoti({
          open: true,
          message: ` ${error.message}`,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleConsult = async (value) => {
    try {
      const alumno = alumnoData.find((row) => row.id === value);
      setRowData(alumno);
      setDisabled(true);
      setOpen(true);
    } catch (error) {
      setNoti({
        open: true,
        message: `¡Error al cargar los datos!: ${error.message}`,
        type: 'error',
      });
    }
  };
  const handleDeleteAlumno = (alumnoId) => {
    setAlumnoToDelete(alumnoId);
    setOpenDeleteModal(true);
  };
  const confirmDeleteAlumno = async () => {
    if (!alumnoToDelete) return;

    setLoading(true);
    try {
      const response = await deleteRecord({
        endpoint: `/solicitudesFolios/solicitudesFoliosAlumnos/${alumnoToDelete}`,
      });

      if (response.statusCode === 200) {
        setNoti({
          open: true,
          message: `Alumno ${selectedAlumno?.nombre} eliminado correctamente`,
          type: 'success',
        });

        setAlumnoResponse(true);
      }
    } catch (error) {
      setNoti({
        open: true,
        message: 'Error al eliminar el alumno',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
      setAlumnoToDelete(null);
    }
  };
  const alumnosColumns = [
    {
      field: 'id', headerName: 'ID', width: 100, hide: true,
    },
    {
      field: 'consecutivo',
      headerName: 'Consecutivo',
      width: 150,
    },
    { field: 'nombre', headerName: 'Nombre', width: 320 },
    { field: 'numeroFolioActa', headerName: 'Folio Acta', width: 150 },
    { field: 'matricula', headerName: 'Matrícula', width: 150 },
    { field: 'folio', headerName: 'Folio', width: 200 },
    { field: 'envio', headerName: 'Estatus de envio', width: 200 },
    { field: 'foja', headerName: 'Foja', width: 200 },
    { field: 'libro', headerName: 'Libro', width: 200 },
    {
      field: 'fechaExpedicion',
      headerName: 'Fecha de Expedición de certificado',
      width: 300,
    },
    { field: 'fechaTerminacion', headerName: 'Fecha de Término', width: 300 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Consultar" placement="top">
            <IconButton onClick={() => handleConsult(params.row.id)}>
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>

          {estatus === 2 && (
            <Tooltip title="Eliminar alumno" placement="top">
              <IconButton
                onClick={() => handleDeleteAlumno(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const accion = typeof window !== 'undefined'
    ? sessionStorage.getItem('foliosAccion')
    : null;
  let title = '';

  if (estatus === 2) {
    title = accion === 'revisar'
      ? 'Revisar Solicitud'
      : 'Consultar Solicitud';
  } else if (estatus === 3) {
    title = accion === 'envio'
      ? `Envío de Solicitud a ${etiquetas.tipoDocumento}`
      : 'Consultar Envio de Solicitud a Titulación';
  } else if (estatus === 4) {
    title = 'Atender Observaciones de Solicitud';
  }

  const PERIODOS = {
    1: 'Semestral',
    2: 'Cuatrimestral',
    3: 'Anual',
    4: 'Semestral curriculum flexible',
    5: 'Cuatrimestral curriculum flexible',
  };

  const MODALIDADES = {
    1: 'Escolarizada',
    2: 'No Escolarizada',
    3: 'Mixta',
    4: 'Dual',
  };

  const NIVEL = {
    1: 'Bachillerato',
    2: 'Licenciatura',
    3: 'Técnico Superior Universitario',
    4: 'Especialidad',
    5: 'Maestría ',
    6: 'Doctorado',
    7: 'Profesional Asociado',
    8: 'Educación Continua',
  };

  return (
    <Layout title={title}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="Tabs for Instituciones and Alumnos"
            >
              <Tab label="Instituciones" />
              <Tab label="Alumnos" />
            </Tabs>
          </Grid>
        </Grid>

        {tabIndex === 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom component="div">
                Información de la Solicitud
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid container xs={6}>
                  <Grid item xs>
                    <List>
                      <ListTitle text="Institucion" />
                      <ListTitle text="CCT" />
                      <ListTitle text="Acuerdo RVOE" />
                      <ListTitle text="Nivel" />
                      <ListTitle text="Nombre del Programa" />
                    </List>
                  </Grid>
                  <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
                  <Grid item xs>
                    <List>
                      <ListSubtitle text={etiquetas.institucion || 'N/A'} />
                      <ListSubtitle text={etiquetas.claveCentroTrabajo || 'N/A'} />
                      <ListSubtitle text={etiquetas.acuerdoRvoe || 'N/A'} />
                      <ListSubtitle text={NIVEL[etiquetas.gradoAcademico] || 'N/A'} />
                      <ListSubtitle text={etiquetas.planEstudios || 'N/A'} />
                    </List>
                  </Grid>
                </Grid>
                <Grid container xs={5}>
                  <Grid item xs>
                    <List>
                      <ListTitle text="Modalidad" />
                      <ListTitle text="Periodo" />
                      <ListTitle text="Tipo de Documento" />
                      <ListTitle text="Tipo de Solicitud" />
                      <ListTitle text="Alumnos" />

                    </List>
                  </Grid>
                  <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
                  <Grid item xs>
                    <List>
                      <ListSubtitle text={MODALIDADES[etiquetas.modalidades] || 'N/A'} />
                      <ListSubtitle text={PERIODOS[etiquetas.periodos] || 'N/A'} />
                      <ListSubtitle text={etiquetas.tipoDocumento || 'N/A'} />
                      <ListSubtitle text={etiquetas.tipoSolicitudFolio || 'N/A'} />
                      <ListSubtitle
                        text={Array.isArray(alumnosRows) ? alumnosRows.length : 0}
                      />
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Input
                label="Número de recibo de pago oficial"
                id="folioPago"
                name="folioPago"
                value={formData.folioPago}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <InputFile
                label="Recibo de Pago"
                id={id}
                tipoDocumento="COMPROBANTE_PAGO_FOLIOS"
                tipoEntidad="SOLICITUD_FOLIO"
                url={url}
                setUrl={setUrl}
                disabled
              />
            </Grid>
          </>
        )}

        {tabIndex === 1 && (
          <>
            <Grid item xs={12}>
              <DataTable
                title="Alumnos"
                rows={alumnosRows}
                columns={alumnosColumns}
                initialState={{
                  sorting: { sortModel: [{ field: 'consecutivo', sort: 'asc' }] },
                }}
              />
            </Grid>
            {tipoDocumento === 1 ? (
              <ModalTitulo
                open={open}
                setOpen={setOpen}
                type="consult"
                id={id}
                rowData={rowData}
                setAlumnoResponse={setAlumnoResponse}
                disabled={disabled}
              />
            ) : (
              <ModalCertificado
                open={open}
                setOpen={setOpen}
                type="consult"
                id={id}
                rowData={rowData}
                title="Agregar Alumno"
                setAlumnoResponse={setAlumnoResponse}
                disabled={disabled}
              />
            )}
          </>
        )}

        {estatus !== 3 && (
          <Grid item xs={12}>
            <Input
              id="observaciones"
              name="observaciones"
              label="Observaciones"
              multiline
              rows={4}
              value={observaciones}
              onChange={handleObservacionesChange}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <ButtonsFoliosAdmin
            tipoDocumento={etiquetas.tipoDocumento}
            observaciones={handleObservacionesSubmit}
            folios={handleFoliosSubmit}
            estatus={estatus}
          />
          <DefaultModal
            title="Eliminar alumno"
            open={openDeleteModal}
            setOpen={setOpenDeleteModal}
          >
            <Typography>
              Está a punto de eliminar al alumno con matrícula:
              {' '}
              <strong>{selectedAlumno?.matricula}</strong>
              {' '}
              de esta solicitud.
              <br />
              Esta acción no se puede deshacer.
              <br />
              ¿Desea continuar?
            </Typography>

            <ButtonsForm
              cancel={() => setOpenDeleteModal(false)}
              confirm={confirmDeleteAlumno}
              confirmText="Confirmar"
            />
          </DefaultModal>
        </Grid>
      </Grid>
    </Layout>
  );
}
