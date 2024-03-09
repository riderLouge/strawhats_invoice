import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "../../../../layout/MainLayout/Header/Header.css";
import AuthCardWrapper from "../AuthCardWrapper";
import AuthLogin from "../auth-forms/AuthLogin";
import AuthFooter from "../../../../ui-component/cards/AuthFooter";
import { useTheme } from "@emotion/react";
import { useState } from "react";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const softwareNameStyle = {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#b06dd4",
};

export default function ResetPassword() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== "") {
      navigate("/dashboard");
    }
  };
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{ minHeight: "100vh", background: "#eef2f6" }}
    >
      <Grid item xs={12}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "calc(100vh - 68px)" }}
        >
          <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            <AuthCardWrapper>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item sx={{ mb: 3 }}>
                  <Typography style={softwareNameStyle}>
                    <span className="strawhat">Straw</span>
                    <span className="hat">hat</span> Invoice
                  </Typography>{" "}
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    direction={matchDownSM ? "column-reverse" : "row"}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                      >
                        <Typography
                          color={theme.palette.secondary.main}
                          gutterBottom
                          variant={matchDownSM ? "h3" : "h2"}
                        >
                          Hi, Welcome Back
                        </Typography>
                        <Typography
                          variant="caption"
                          fontSize="16px"
                          textAlign={matchDownSM ? "center" : "inherit"}
                        >
                          Enter your Email to continue
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <form onSubmit={handleSubmit}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="outlined-adornment-email-login">
                        New Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-email-login"
                        type="email"
                        value={newPassword}
                        name="email"
                        onChange={(e) => setNewPassword(e.target.value)}
                        label="New Password"
                        inputProps={{}}
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel htmlFor="outlined-adornment-email-login">
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-email-login"
                        type="email"
                        value={confirmPassword}
                        name="email"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        label="Confirm Password"
                        inputProps={{}}
                      />
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                      <AnimateButton>
                        <Button
                          disableElevation
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          Save
                        </Button>
                      </AnimateButton>
                    </Box>
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    item
                    container
                    direction="column"
                    alignItems="center"
                    xs={12}
                  >
                    {/* <Typography
                    component={Link}
                    to="/pages/register/register3"
                    variant="subtitle1"
                    sx={{ textDecoration: "none" }}
                  >
                    Don&apos;t have an account?
                  </Typography> */}
                  </Grid>
                </Grid>
              </Grid>
            </AuthCardWrapper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  );
}
