import Tooltip from '@mui/material/Tooltip';
import { IconButton, Stack } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import DeleteAsignatura from '@siiges-ui/solicitudes/src/components/utils/Components/AsignaturasModales/DeleteAsignatura';
import AsignaturasEditModal from './AsignaturasEditModal';

export default function AsignaturasButtons({
  id, programaId, asignaturasList, setAsignaturasList, setNoti, setLoading, cicloId, rol,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const rowItem = asignaturasList.find((item) => item.id === id);

  const handleModalOpen = (editMode) => {
    setIsEdit(editMode);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const permissions = {
    canEdit: ['admin', 'sicyt_editar'],
    canDelete: ['admin'],
  };

  const canEdit = permissions.canEdit.includes(rol);
  const canDelete = permissions.canDelete.includes(rol);

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Consultar" placement="top">
        <IconButton aria-label="consultar" onClick={() => handleModalOpen(false)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
      {canEdit && (
      <Tooltip title="Editar" placement="top">
        <IconButton aria-label="editar" onClick={() => handleModalOpen(true)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      )}

      {canDelete && (
      <Tooltip title="Eliminar" placement="top">
        <IconButton aria-label="eliminar" onClick={handleDeleteDialogOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      )}

      {modalOpen && (
        <AsignaturasEditModal
          hideModal={handleModalClose}
          rowItem={rowItem}
          open={modalOpen}
          edit={isEdit ? 'Modificar Asignatura' : 'Consultar Asignatura'}
          programaId={programaId}
          asignaturasList={asignaturasList}
          setAsignaturasList={setAsignaturasList}
          setNoti={setNoti}
          setLoading={setLoading}
          cicloId={cicloId}
        />
      )}

      {deleteDialogOpen && (
        <DeleteAsignatura
          modal={deleteDialogOpen}
          hideModal={handleDeleteDialogClose}
          id={rowItem.id}
          setAsignaturasList={setAsignaturasList}
        />
      )}
    </Stack>
  );
}

AsignaturasButtons.propTypes = {
  id: PropTypes.number.isRequired,
  programaId: PropTypes.number.isRequired,
  asignaturasList: PropTypes.arrayOf(PropTypes.string).isRequired,
  setAsignaturasList: PropTypes.func.isRequired,
  setNoti: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  cicloId: PropTypes.number.isRequired,
  rol: PropTypes.string.isRequired,
};
