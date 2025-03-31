import { getToken } from '@siiges-ui/shared';

function submitNewSolicitud(validations, setNewSubmit, setLoading, setSections, router) {
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;
  const {
    form, setNoti, setId, setProgramaId,
  } = validations;

  const token = getToken();

  fetch(`${url}/api/v1/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: apikey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form[1]),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('¡Error al enviar la solicitud!');
      }
      return response.json();
    })
    .then((data) => {
      setId(data.data.id);
      setProgramaId(data.data.programa.id);
      return fetch(`${url}/api/v1/solicitudes/${data.data.id}/secciones/1`, {
        method: 'POST',
        headers: {
          api_key: apikey,
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('¡Error al recuperar los datos de la sección!');
          }
          return response.json();
        })
        .then(() => {
          setSections((prevSections) => prevSections.map((section) => {
            if (section.id === 1) {
              return { ...section, disabled: true };
            }
            return section;
          }));
          setNewSubmit(false);
          router.push(`/solicitudes/detallesSolicitudes/${data.data.id}/editarSolicitud`);
          setTimeout(() => {
            setLoading(false);
            setNoti({
              open: true,
              message: '¡Éxito, no hubo problemas en esta sección!',
              type: 'success',
            });
          }, 1000);
        });
    })
    .catch((err) => {
      setTimeout(() => {
        setLoading(false);
        setNoti({
          open: true,
          message: `¡Hubo un problema, revise que los campos estén correctos!: ${err}`,
          type: 'error',
        });
      }, 1000);
    });
}

export default submitNewSolicitud;
