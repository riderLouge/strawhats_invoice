import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { IconMenu2 } from "@tabler/icons";
import "./Header.css";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  const softwareNameStyle = {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#b06dd4",
  };

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          <Typography style={softwareNameStyle}>
            <span className="strawhat">Sri</span>
            <span className="hat"></span>KrishnaAgencies
          </Typography>
        </Box>
        <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              "&:hover": {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
