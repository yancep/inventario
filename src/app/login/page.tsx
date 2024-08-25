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
import AuthService from "../../services/AuthService";
import { useRouter } from 'next/navigation';
import {showToast} from '@/components/Toast';

export default function SignIn() {
  const router = useRouter();

  async function handleSubmit(event: any) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    const authService = AuthService.getInstance();
    const value = await authService.login(username, password);
    if (value) {
      router.push('/productos');
      showToast('El usuario ha sido confirmado', 'success');
    }
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
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Entrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User"
            name="username"
            autoComplete="username"
            autoFocus
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="outlined"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuérdame"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Olvidó la contraseña?
              </Link>
            </Grid>
            <Grid item>
              <Link href="register/" variant="body2">
                {"No tiene una cuenta? Registrese"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
