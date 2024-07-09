import { FoliosData } from '@siiges-ui/serviciosescolares';
import { Layout } from '@siiges-ui/shared';
import React from 'react';

export default function CrearTitulo() {
  return (
    <Layout title="Agregar Título">
      <FoliosData solicitudType="titulo" />
    </Layout>
  );
}
