import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

// project imports
import SalesChartCard from "./SalesChartCard";
import MainCard from "../../../ui-component/cards/MainCard";
import SkeletonPopularCard from "../../../ui-component/cards/Skeleton/PopularCard";
import { gridSpacing } from "../../../store/constant";

// assets
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">Sales</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary[200],
                        cursor: "pointer",
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem>
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: "16px !important" }}>
                <SalesChartCard />
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Shop 1
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              INR 1890.00
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Shop 2
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              INR 1600.00
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Shop 3
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              INR 1800.00
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Shop 4
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              INR 1500.00
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Shop 5
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              INR 189.00
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: "center" }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default PopularCard;
