import { FoliosData } from '@siiges-ui/serviciosescolares';
import { Layout } from '@siiges-ui/shared';
import React from 'react';

export default function EditFoliosTitulos() {
  return (
    <Layout title="Editar Folio de Título">
      <FoliosData solicitudType="titulo" />
    </Layout>
  );
}
