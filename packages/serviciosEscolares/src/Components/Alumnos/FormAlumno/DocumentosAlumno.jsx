import { Grid, Typography } from '@mui/material';
import { GetFile, InputFile } from '@siiges-ui/shared';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function DocumentosAlumno({ id, type }) {
  const [fileURLs, setFileURLs] = useState([null, null, null]);

  const handleFileLoaded = (index, url) => {
    setFileURLs((prevURLs) => {
      const newURLs = [...prevURLs];
      newURLs[index] = url;
      return newURLs;
    });
  };

  useEffect(() => {
    if (type === 'edit') {
      const fetchFiles = async () => {
        const fileTypes = ['ARCHIVO_CERTIFICADO', 'ARCHIVO_NACIMIENTO', 'ARCHIVO_CURP'];
        const promises = fileTypes.map((tipoDocumento, index) => new Promise((resolve) => {
          GetFile({ tipoEntidad: 'ALUMNO', entidadId: id, tipoDocumento }, (url, error) => {
            if (!error) {
              handleFileLoaded(index, url);
            }
            resolve();
          });
        }));

        await Promise.all(promises);
      };

      fetchFiles();
    }
  }, [id, type]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="body1">
        ¡Nota importante! Los documentos que se adjunten tendrán que ser
        escaneados a color, con buena resolución y cuidando de que no se pierda
        u omita información.
      </Typography>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="ALUMNO"
            tipoDocumento="ARCHIVO_CERTIFICADO"
            id={id}
            label="Archivo Cédula Profesional, Título o equivalente (PDF)"
            url={fileURLs[0]}
            setUrl={(url) => handleFileLoaded(0, url)}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="ALUMNO"
            tipoDocumento="ARCHIVO_NACIMIENTO"
            id={id}
            label="Archivo Acta de Nacimiento (PDF)"
            url={fileURLs[1]}
            setUrl={(url) => handleFileLoaded(1, url)}
          />
        </Grid>
        <Grid item xs={12}>
          <InputFile
            tipoEntidad="ALUMNO"
            tipoDocumento="ARCHIVO_CURP"
            id={id}
            label="Archivo CURP (PDF)"
            url={fileURLs[2]}
            setUrl={(url) => handleFileLoaded(2, url)}
          />
        </Grid>
      </Grid>
    </div>
  );
}

DocumentosAlumno.defaultProps = {
  id: null,
  type: null,
};

DocumentosAlumno.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
};
