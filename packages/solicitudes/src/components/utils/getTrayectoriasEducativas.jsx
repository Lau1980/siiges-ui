import { useContext, useEffect, useState } from 'react';
import { Context, getToken } from '@siiges-ui/shared';

export default function useTrayectoriasEducativas(programaId) {
  const { session, setNoti } = useContext(Context);
  const [trayectorias, setTrayectorias] = useState({});
  const [loadingTrayectoria, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrayectorias() {
      const apikey = process.env.NEXT_PUBLIC_API_KEY;
      const url = process.env.NEXT_PUBLIC_URL;
      const token = getToken();

      if (session && Number.isInteger(programaId)) {
        setLoading(true);
        try {
          const response = await fetch(
            `${url}/api/v1/trayectorias/programas/${programaId}`,
            {
              method: 'GET',
              headers: {
                api_key: apikey,
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (!response.ok) {
            throw new Error('¡Error al obtener datos!');
          }
          const data = await response.json();
          setTrayectorias(data.data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchTrayectorias();
  }, [session, programaId, setNoti]);

  return {
    trayectorias,
    loadingTrayectoria,
  };
}
