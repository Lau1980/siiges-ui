import { IconButton } from '@mui/material';
import { FoliosForm } from '@siiges-ui/serviciosescolares';
import { Context, DataTable, Layout } from '@siiges-ui/shared';
import React, { useState, useContext, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

const columns = (handleEdit) => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nombre', width: 610 },
  { field: 'folio', headerName: 'Folio', width: 150 },
  { field: 'date', headerName: 'Fecha', width: 150 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <IconButton onClick={() => handleEdit(params.row.id)}>
        <EditIcon />
      </IconButton>
    ),
  },
];

export default function solicitudesFolios() {
  const { setLoading, setNoti } = useContext(Context);
  const [tipoSolicitud, setTipoSolicitud] = useState();
  const [solicitudes, setSolicitudes] = useState();
  // eslint-disable-next-line no-unused-vars
  const [programa, setPrograma] = useState();
  const [loading, setLoadingPage] = useState(true);
  const router = useRouter();

  const handleCreate = () => {
    if (tipoSolicitud === 1) {
      router.push('/serviciosEscolares/solicitudesFolios/createFolio/titulos');
    } else if (tipoSolicitud === 2) {
      router.push(
        '/serviciosEscolares/solicitudesFolios/createFolio/certificados',
      );
    } else {
      setNoti({
        open: true,
        message:
          'Error, revise que todos los campos esten seleccionados correctamente',
        type: 'error',
      });
    }
  };

  const handleEdit = (id) => {
    if (tipoSolicitud === 1) {
      router.push(`/serviciosEscolares/solicitudesFolios/${id}/titulos`);
    } else if (tipoSolicitud === 2) {
      router.push(`/serviciosEscolares/solicitudesFolios/${id}/certificados`);
    } else {
      setNoti({
        open: true,
        message:
          'Error, revise que todos los campos esten seleccionados correctamente',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return (
    <Layout title="Solicitudes de Folios">
      <FoliosForm
        setTipoSolicitud={setTipoSolicitud}
        setSolicitudes={setSolicitudes}
        setPrograma={setPrograma}
        setLoading={setLoadingPage}
      />
      {tipoSolicitud === 1 && (
        <DataTable
          buttonAdd
          buttonClick={handleCreate}
          buttonText="Agregar Título"
          title="Solicitudes de Títulos"
          rows={solicitudes}
          columns={columns(handleEdit)}
        />
      )}
      {tipoSolicitud === 2 && (
        <DataTable
          buttonAdd
          buttonClick={handleCreate}
          buttonText="Agregar Certificado"
          title="Solicitudes de Certificados"
          rows={solicitudes}
          columns={columns(handleEdit)}
        />
      )}
    </Layout>
  );
}
