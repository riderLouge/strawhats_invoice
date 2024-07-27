import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  LinearProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SkeletonTotalGrowthBarChart from "../../../ui-component/cards/Skeleton/TotalGrowthBarChart";
import MainCard from "../../../ui-component/cards/MainCard";
import { gridSpacing } from "../../../store/constant";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useOverAllContext } from "../../../context/overAllContext";

const TotalGrowthBarChart = ({ isLoading }) => {
  const [open, setOpen] = useState(false);
  const [selectedDeliveryGuy, setSelectedDeliveryGuy] = useState(null);
  const [amountsCollected, setAmountsCollected] = useState({});
  const theme = useTheme(); // Import useTheme from @mui/material/styles
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();

  async function fetchDeliveryDetails(data) {
    try {
      const response = await axios.get(
        "/api/fetch/current-day-delivery",
        {
          params: {
            date: new Date().toISOString().split('T')[0], 
          },
        }
      );
      console.log(response)
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
      throw error;
    }
  }

  useEffect(
     () => {
      fetchDeliveryDetails();
    },
    []
  );

  const handleClickOpen = (deliveryGuy) => {
    setSelectedDeliveryGuy(deliveryGuy);
    setAmountsCollected({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAmountChange = (shopId, amount) => {
    setAmountsCollected((prevAmounts) => ({
      ...prevAmounts,
      [shopId]: parseFloat(amount) || 0,
    }));
  };

  const getTotalCollected = () => {
    return Object.values(amountsCollected).reduce((acc, curr) => acc + curr, 0);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log(`Amounts Collected:`, amountsCollected);
    setOpen(false);
  };

  const deliveryGuys = [
    {
      id: 1, progress: 10, total: 20, amountToBeCollected: 2000, shops: [
        { id: 1, name: 'Shop 1', amount: 500 },
        { id: 2, name: 'Shop 2', amount: 400 },
        { id: 3, name: 'Shop 3', amount: 300 },
        { id: 4, name: 'Shop 4', amount: 200 },
        { id: 5, name: 'Shop 5', amount: 300 },
        { id: 6, name: 'Shop 6', amount: 300 },
      ]
    },
    {
      id: 2, progress: 15, total: 25, amountToBeCollected: 3245, shops: [
        { id: 1, name: 'Shop 1', amount: 545 },
        { id: 2, name: 'Shop 2', amount: 600 },
        { id: 3, name: 'Shop 3', amount: 700 },
        { id: 4, name: 'Shop 4', amount: 800 },
        { id: 5, name: 'Shop 5', amount: 300 },
        { id: 6, name: 'Shop 6', amount: 300 },
      ]
    },
    {
      id: 3, progress: 8, total: 15, amountToBeCollected: 456, shops: [
        { id: 1, name: 'Shop 1', amount: 100 },
        { id: 2, name: 'Shop 2', amount: 50 },
        { id: 3, name: 'Shop 3', amount: 70 },
        { id: 4, name: 'Shop 4', amount: 80 },
        { id: 5, name: 'Shop 5', amount: 90 },
        { id: 6, name: 'Shop 6', amount: 66 },
      ]
    },
    {
      id: 4, progress: 20, total: 20, amountToBeCollected: 1234, shops: [
        { id: 1, name: 'Shop 1', amount: 200 },
        { id: 2, name: 'Shop 2', amount: 220 },
        { id: 3, name: 'Shop 3', amount: 240 },
        { id: 4, name: 'Shop 4', amount: 260 },
        { id: 5, name: 'Shop 5', amount: 300 },
        { id: 6, name: 'Shop 6', amount: 14 },
      ]
    },
    {
      id: 5, progress: 15, total: 25, amountToBeCollected: 2454, shops: [
        { id: 1, name: 'Shop 1', amount: 400 },
        { id: 2, name: 'Shop 2', amount: 500 },
        { id: 3, name: 'Shop 3', amount: 600 },
        { id: 4, name: 'Shop 4', amount: 700 },
        { id: 5, name: 'Shop 5', amount: 100 },
        { id: 6, name: 'Shop 6', amount: 154 },
      ]
    },
    {
      id: 6, progress: 8, total: 15, amountToBeCollected: 9876, shops: [
        { id: 1, name: 'Shop 1', amount: 1000 },
        { id: 2, name: 'Shop 2', amount: 1500 },
        { id: 3, name: 'Shop 3', amount: 2000 },
        { id: 4, name: 'Shop 4', amount: 2500 },
        { id: 5, name: 'Shop 5', amount: 2876 },
        { id: 6, name: 'Shop 6', amount: 0 },
      ]
    },
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
                      <Typography variant="h3" sx={{ color: '#3f51b5' }}>Delivery</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {deliveryGuys.map((deliveryGuy, index) => (
                <Grid
                  key={index}
                  container
                  alignItems="center"
                  spacing={2}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <Grid item xs={3}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >{`Delivery Guy ${index + 1}`}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <LinearProgress
                      variant="determinate"
                      value={(deliveryGuy.progress / deliveryGuy.total) * 100}
                      sx={{
                        height: "10px",
                        borderRadius: "5px",
                        backgroundColor: "#ddd",
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3f51b5'
                        }
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
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(deliveryGuy)}
                    >
                      <AttachMoneyIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: '#fff', textAlign: 'center' }}>
              Enter Amounts Collected
            </DialogTitle>
            <DialogContent>
              <Box sx={{ padding: '20px' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Shop Name</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Collected</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDeliveryGuy?.shops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell component="th" scope="row">
                            {shop.name}
                          </TableCell>
                          <TableCell align="right">{shop.amount}</TableCell>
                          <TableCell align="right">
                            <TextField
                              margin="dense"
                              label="Collected"
                              type="number"
                              fullWidth
                              value={amountsCollected[shop.id] || ""}
                              onChange={(e) =>
                                handleAmountChange(shop.id, e.target.value)
                              }
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} align="right">Total Amount to Be Collected</TableCell>
                        <TableCell align="right">{selectedDeliveryGuy?.amountToBeCollected}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} align="right">Total Amount Collected</TableCell>
                        <TableCell align="right">{getTotalCollected()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default TotalGrowthBarChart;
