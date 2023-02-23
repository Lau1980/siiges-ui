import { useEffect, useState } from 'react';

export default function getInstituciones() {
  const [instituciones, setInstituciones] = useState();
  const [loading, setLoading] = useState(false);
  let userData = {};

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/instituciones')
      .then((response) => response.json())
      .then((data) => {
        setLoading(true);
        if (data.data !== undefined) {
          userData = data.data;
        }
        setInstituciones(userData);
      });
    setLoading(false);
  }, []);

  return {
    instituciones,
    loading,
  };
}