import Tooltip from '@mui/material/Tooltip';
import { Grid, IconButton } from '@mui/material';
import {
  ButtonSimple, Context, DataTable, getData, Layout,
} from '@siiges-ui/shared';
import React, { useContext, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { ModalCertificado } from '@siiges-ui/serviciosescolares';
import dayjs from 'dayjs';

const columns = (handleEdit) => [
  {
    field: 'id',
    headerName: 'ID',
    hide: true,
  },
  { field: 'name', headerName: 'Nombre', width: 250 },
  { field: 'folio', headerName: 'Folio', width: 150 },
  {
    field: 'fechaTerminacion',
    headerName: 'Fecha de terminación de plan de estudios',
    width: 350,
  },
  {
    field: 'fechaExpedicion',
    headerName: 'Fecha de expedición de título',
    width: 350,
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <Tooltip title="Editar" placement="top">
        <IconButton onClick={() => handleEdit(params.row.id)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    ),
  },
];

export default function AlumnosTitulo() {
  const { setNoti, setLoading } = useContext(Context);
  const router = useRouter();
  const { id, programa, tipoSolicitud } = router.query;
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('create');
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      getData({ endpoint: `/solicitudesFolios/${id}/alumnos` })
        .then((response) => {
          if (response.data) {
            const mappedRows = response.data.map((alumnos) => ({
              id: alumnos.id,
              name: `${alumnos.alumno.persona.nombre} ${alumnos.alumno.persona.apellidoPaterno} ${alumnos.alumno.persona.apellidoMaterno}`,
              fechaTerminacion: dayjs(alumnos.fechaTerminacion).format('DD/MM/YYYY'),
              fechaExpedicion: dayjs(alumnos.fechaExpedicion).format(
                'DD/MM/YYYY',
              ),
            }));
            setRows(mappedRows);
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
          setLoading(false);
        });
    }
  }, [id]);

  const handleEdit = (value) => {
    const data = rows.find((row) => row.id === value);
    setRowData(data);
    setOpen(true);
    setType('edit');
  };

  const handleClick = () => {
    setOpen(true);
    setType('create');
  };

  const handleRegresar = () => {
    router.push(
      `/serviciosEscolares/solicitudesFolios/${id}/titulos?tipoDocumento=1&tipoSolicitud=${tipoSolicitud}&programa=${programa}`,
    );
  };

  return (
    <Layout title="Agregar Solicitud de Folios">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DataTable
            buttonAdd
            buttonClick={handleClick}
            buttonText="Agregar Alumnos"
            rows={rows}
            columns={columns(handleEdit)}
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonSimple
            text="Regresar"
            align="left"
            design="enviar"
            onClick={handleRegresar}
          />
        </Grid>
      </Grid>
      <ModalCertificado
        open={open}
        setOpen={setOpen}
        type={type}
        id={id}
        programaId={programa}
        setRows={setRows}
        rowData={rowData}
        title="Agregar Alumno"
      />
    </Layout>
  );
}
