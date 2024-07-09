const tiposDocentes = [
  { id: 1, nombre: 'Docente de asignatura' },
  { id: 2, nombre: 'Docente de tiempo completo' },
];

const documentosPresentados = [
  { id: 1, nombre: 'Título' },
  { id: 2, nombre: 'Cédula' },
];

const tipoContratacion = [
  { id: 1, nombre: 'Contratación' },
  { id: 2, nombre: 'Tiempo indefinido' },
  { id: 3, nombre: 'Otro' },
];

const nivel = [
  { id: 1, nombre: 'Licenciatura' },
  { id: 2, nombre: 'Técnico Superior Universitario' },
  { id: 3, nombre: 'Especialidad' },
  { id: 4, nombre: 'Maestría' },
  { id: 5, nombre: 'Doctorado' },
  { id: 6, nombre: 'Profesional Asociado' },
];

const transformDataForTable = (data) => data.map((item) => {
  const tipoDocenteObj = tiposDocentes.find(
    (tipo) => tipo.id === item.tipoDocente,
  );

  const tipoContratacionObj = tipoContratacion.find(
    (tipo) => tipo.id === item.tipoContratacion,
  );

  return {
    id: item.id,
    nombre: `${item.persona.nombre} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno}`,
    tipoDocente: tipoDocenteObj ? tipoDocenteObj.nombre : 'Desconocido',
    formacion: '-',
    asignatura: item.asignaturasDocentes
      .map((asig) => asig.asignatura?.nombre)
      .join(', '),
    experiencia: item.experiencias,
    tipoContratacion: tipoContratacionObj
      ? tipoContratacionObj.nombre
      : 'Desconocido',
    antiguedad: `${item.antiguedad} años`,
  };
});

export {
  tiposDocentes,
  transformDataForTable,
  documentosPresentados,
  tipoContratacion,
  nivel,
};
