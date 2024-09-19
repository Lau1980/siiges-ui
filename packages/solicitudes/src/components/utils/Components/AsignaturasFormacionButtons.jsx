import { IconButton, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useContext } from 'react';
import { TablesPlanEstudiosContext } from '../Context/tablesPlanEstudiosProviderContext';
import AsignaturasFormacionEditModal from './AsignaturasFormacionModales/AsignaturasFormacionEditModal';
import DeleteAsignatura from './AsignaturasModales/DeleteAsignatura';

export default function AsignaturasFormacionButtons({ id, isDisabled, type }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const {
    setFormAsignaturasFormacion,
    setAsignaturasFormacionList,
    asignaturasFormacionList,
    programaId,
  } = useContext(TablesPlanEstudiosContext);
  const rowItem = asignaturasFormacionList.find((item) => item.id === id);

  const handleModalOpen = (editMode) => {
    setIsEdit(editMode);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormAsignaturasFormacion(() => ({ programaId, tipo: 1, areaId: 4 }));
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setFormAsignaturasFormacion(() => ({ programaId, tipo: 1, areaId: 4 }));
  };
  if (type === 'consultar') {
    return null;
  }
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="consultar" onClick={() => handleModalOpen(false)}>
        <DescriptionIcon />
      </IconButton>
      {!isDisabled && (
        <>
          <IconButton aria-label="editar" onClick={() => handleModalOpen(true)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="eliminar" onClick={handleDeleteDialogOpen}>
            <DeleteIcon />
          </IconButton>
        </>
      )}

      {modalOpen && (
        <AsignaturasFormacionEditModal
          hideModal={handleModalClose}
          rowItem={rowItem}
          open={modalOpen}
          edit={isEdit ? 'Modificar Asignatura' : 'Consultar Asignatura'}
        />
      )}

      {deleteDialogOpen && (
        <DeleteAsignatura
          modal={deleteDialogOpen}
          hideModal={handleDeleteDialogClose}
          id={rowItem.id}
          setAsignaturasList={setAsignaturasFormacionList}
        />
      )}
    </Stack>
  );
}

AsignaturasFormacionButtons.propTypes = {
  id: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};
