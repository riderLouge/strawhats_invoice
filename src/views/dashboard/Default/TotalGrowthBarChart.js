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
  Chip,
} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SkeletonTotalGrowthBarChart from "../../../ui-component/cards/Skeleton/TotalGrowthBarChart";
import MainCard from "../../../ui-component/cards/MainCard";
import { gridSpacing } from "../../../store/constant";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useOverAllContext } from "../../../context/overAllContext";
import capitalizeText from "../../../utils/capitalizeText";

const TotalGrowthBarChart = ({ isLoading }) => {
  const [open, setOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [selectedDeliveryGuy, setSelectedDeliveryGuy] = useState(null);
  const [amountsCollected, setAmountsCollected] = useState({});
  const theme = useTheme(); // Import useTheme from @mui/material/styles
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  async function fetchDeliveryDetails() {
    try {
      const response = await axios.get("https://api-skainvoice.top/api/fetch/current-day-delivery", {
        params: {
          date: new Date().toISOString().split('T')[0],
        },
      });
      setDeliveryDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
      throw error;
    }
  }

  async function updateInvoiceStatus() {
    try {
      const invoiceIds = selectedDeliveryGuy.shops.map((shop => shop.invoiceId));

        await axios.post("https://api-skainvoice.top/api/update/invoice-status", {
        invoiceIds,
      staffId: selectedDeliveryGuy.staffId,
      deliveryId: selectedDeliveryGuy.id,
    });
      setOpen(false)

      const completedDetails = {
        ...selectedDeliveryGuy,
        shops: selectedDeliveryGuy.shops.filter(shop => shop.shop.status === "COMPLETED")
      };

      updateCreditDebit(completedDetails)

    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
      throw error;
    }
  }

  async function updateCreditDebit(data) {
    try {
      const invoiceDetails = data.flatMap(delivery =>
        delivery.shops.map(shop => ({
          invoiceId: shop.invoiceId,
          paidAmount: shop.shop.paidAmount
        }))
      );
      await axios.post("https://api-skainvoice.top/api/update/credit-debit", invoiceDetails);
      setOpen(false)

    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
      throw error;
    }
  }

  useEffect(() => {
    fetchDeliveryDetails();
  }, []);

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

  const getTotalAmountToBeCollected = () => {
    return selectedDeliveryGuy?.shops.reduce((acc, shop) => acc + shop.totalAmount, 0);
  };

  const handleSave = () => {
    const isAnyShopsNotDelivered = selectedDeliveryGuy.shops.filter((shop) => {
      return shop.shop.status === 'NOT_COMPLETED';
    });

    if (isAnyShopsNotDelivered.length > 0) {
      setConfirmationOpen(true);
    }
    else {
      updateCreditDebit(deliveryDetails)
    }
  };


  const handleConfirmationClose = (confirm) => {
    if (confirm) {
      updateInvoiceStatus();
    }
    setConfirmationOpen(false);
  };

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
              {deliveryDetails.map((deliveryGuy, index) => {
                const completedShops = deliveryGuy.shops.filter(shop => shop.shop.status === "COMPLETED").length;
                const progressValue = (completedShops / deliveryGuy.shops.length) * 100;

                return (
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
                        sx={{ fontWeight: "bold", color: "#333", textTransform: "uppercase" }}
                      >
                        {deliveryGuy?.staff?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <LinearProgress
                        variant="determinate"
                        value={progressValue}
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
                      >
                        {`${Math.round(progressValue)}%`}
                      </Typography>
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
                );
              })}
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
                        <TableCell align="center">Shop Name</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Amount</TableCell>
                        <TableCell align="center">Collected</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDeliveryGuy?.shops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell component="th" scope="row" align="center">
                            {shop?.shop?.CUSNAM}
                          </TableCell>
                          <TableCell align="center">
                            <Chip sx={{ height: '24px' }}
                              label={capitalizeText(shop?.shop?.status === 'NOT_COMPLETED' ? 'Yet to deliver' : shop?.shop?.status)} />
                          </TableCell>
                          <TableCell align="center">{shop.totalAmount}</TableCell>
                          <TableCell align="center">
                            <TextField
                              margin="dense"
                              label="Collected"
                              type="number"
                              fullWidth
                              value={shop?.shop?.paidAmount || ""}
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
                        <TableCell colSpan={3} align="right">Total Amount to Be Collected</TableCell>
                        <TableCell align="right">{getTotalAmountToBeCollected()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">Total Amount Collected</TableCell>
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
          <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                textAlign: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              Confirm Status Update
            </DialogTitle>
            <DialogContent
              sx={{
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                padding: '20px',
              }}
            >
              <Typography variant="body1" sx={{ paddingTop: "40px", textAlign: 'center', fontWeight: 500 }}>
                Do you want to convert the status of shops with "Yet to deliver" to "Pending delivery"?
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                padding: '10px',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <Button
                onClick={() => handleConfirmationClose(false)}
                color="secondary"
                variant="outlined"
                sx={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  marginRight: '10px',
                }}
              >
                No
              </Button>
              <Button
                onClick={() => handleConfirmationClose(true)}
                color="primary"
                variant="contained"
                sx={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                }}
              >
                Yes
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
