import { React } from 'react';
import Image from 'next/image';
import { SignIn } from '@siiges-ui/authentication';
import { Logo, Header, Navbar } from '@siiges-ui/shared';
import { Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

function LogInPage() {
  return (
    <ThemeProvider theme={theme}>
      <Image
        alt="travel"
        src="/Fondo.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
        style={{
          zIndex: -1,
          overflow: 'hidden',
        }}
      />
      <Grid
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={3} sx={{ textAlign: 'center' }}>
          <Navbar />
          <Logo />
          <Header />
          <SignIn />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LogInPage;
