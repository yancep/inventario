"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AuthService from "../../services/AuthService"
import CookieService from '../../services/LocalStorangeService';
import { useRouter } from 'next/navigation';
import {showToast} from '@/components/Toast';

export default function SignIn() {
  const router = useRouter();

  async function handleSubmit (event: any) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    const authService = AuthService.getInstance();
    await authService.register(username, password);
    showToast('El usuario ha sido registrado correctamente', 'success');
    router.push('/');
    const cookieService = CookieService.getInstance();
      
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3, py: 6, mt: 8 }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
        <Typography component="h1" variant="h5">
          Registro
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoComplete="User"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuerdame"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Grid container>
            <Grid item xs>
             
            </Grid>
            <Grid item>
              <Link href="login/" variant="body2">
                {"Ya tengo una cuenta? Loguearse"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}