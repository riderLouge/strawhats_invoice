import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  MenuItem,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

// project imports
import SkeletonTotalGrowthBarChart from "../../../ui-component/cards/Skeleton/TotalGrowthBarChart";
import MainCard from "../../../ui-component/cards/MainCard";
import { gridSpacing } from "../../../store/constant";

// chart data
import chartData from "./chart-data/total-growth-bar-chart";

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const [value, setValue] = useState("today");
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  // useEffect(() => {
  //   const newChartData = {
  //     ...chartData.options,
  //     colors: [primary200, primaryDark, secondaryMain, secondaryLight],
  //     xaxis: {
  //       labels: {
  //         style: {
  //           colors: [
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //             primary,
  //           ],
  //         },
  //       },
  //     },
  //     yaxis: {
  //       labels: {
  //         style: {
  //           colors: [primary],
  //         },
  //       },
  //     },
  //     grid: {
  //       borderColor: grey200,
  //     },
  //     tooltip: {
  //       theme: "light",
  //     },
  //     legend: {
  //       labels: {
  //         colors: grey500,
  //       },
  //     },
  //   };

  //   // do not load chart when loading
  //   if (!isLoading) {
  //     ApexCharts.exec(`bar-chart`, "updateOptions", newChartData);
  //   }
  // }, [
  //   navType,
  //   primary200,
  //   primaryDark,
  //   secondaryMain,
  //   secondaryLight,
  //   primary,
  //   darkLight,
  //   grey200,
  //   isLoading,
  //   grey500,
  // ]);

  const deliveryGuys = [
    { id: 1, progress: 10, total: 20 },
    { id: 2, progress: 15, total: 25 },
    { id: 3, progress: 8, total: 15 },
    { id: 4, progress: 20, total: 20 },
    { id: 5, progress: 15, total: 25 },
    { id: 6, progress: 8, total: 15 },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h3">Delivery</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* comment below */}
              {/*<Grid item xs={12}>
              <Chart {...chartData} />
      </Grid>*/}
            {/* uncomment below */}
            <Grid item xs={12}>
              {deliveryGuys.map((deliveryGuy, index) => (
                <Grid
                  key={index}
                  container
                  alignItems="center"
                  spacing={2}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                  }}
                >
                  <Grid item xs={4}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >{`Delivery Guy ${index + 1}`}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LinearProgress
                      variant="determinate"
                      value={(deliveryGuy.progress / deliveryGuy.total) * 100}
                      sx={{
                        height: "10px",
                        borderRadius: "5px",
                        backgroundColor: "#ddd",
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      variant="body1"
                      sx={{ color: "#555", textAlign: "center" }}
                    >{`${Math.round(
                      (deliveryGuy.progress / deliveryGuy.total) * 100
                    )}%`}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalGrowthBarChart;
