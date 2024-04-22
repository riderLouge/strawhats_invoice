import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
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

export default function ForgorPassword() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email !== "") {
      navigate("/");
    } else {
      setErrorMessage("Please enter your mail");
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
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  rowGap: 5,
                  width: "clamp(200px, 25vw, 300px)",
                  textAlign: "center",
                }}
              >
                <Box>
                  <Typography style={softwareNameStyle}>
                    <span className="strawhat">Straw</span>
                    <span className="hat">hat</span> Invoice
                  </Typography>{" "}
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
                </Box>
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-email-login">
                      Email Address
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email-login"
                      type="email"
                      value={email}
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email Address"
                      inputProps={{}}
                    />
                    <FormHelperText error>{errorMessage}</FormHelperText>
                  </FormControl>
                  <Box
                    sx={{
                      mt: 8,
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <AnimateButton>
                      <Button
                        disableElevation
                        fullWidth
                        size="large"
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/")}
                      >
                        Back
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                      >
                        Send Temp Password
                      </Button>
                    </AnimateButton>
                  </Box>
                </form>
              </Box>
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
