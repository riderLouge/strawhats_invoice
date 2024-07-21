import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button, TextField, Grid, Autocomplete, CardContent, Typography, Divider, List, ListItem, ListItemText, Box, TableContainer, Table, TableBody, Paper, TableRow, TableCell, Stack, TableHead, styled, Chip, Checkbox } from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";
import { useOverAllContext } from "../../context/overAllContext";
import DeliveryGuyImage from '../../assets/images/deliveryAgent.jpg'
import moment from "moment";
import capitalizeText from "../../utils/capitalizeText";
import currencyFormatter from "../../utils/currencyFormatter";

const StyledTableCell = styled(TableCell)({
  padding: '1px 16px',
  color: '#5E6D82',
  height: '3rem',
});

const DeliveryStats = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [filteredAgentDetails, setFilteredAgentDetails] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [zoneNames, setZoneNames] = useState([]);
  const [deliveryGuys, setDeliveryGuys] = useState([])
  const [selectedDeliveryGuys, setSelectedDeliveryGuys] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  console.log(deliveryDetails)
  const deliveryPersonData = {
    name: "John Doe",
    contactNumber: "123-456-7890",
    deliveryArea: "Downtown",
    deliveries: [
      { customerName: "Alice", billValue: "$30" },
      { customerName: "Bob", billValue: "$45" },
      { customerName: "Charlie", billValue: "$20" }
    ]
  };

  const fetchDeliveryGuys = async () => {
    try {
      const response = await axios.get(
        "/api/fetch/deliveryAgents"
      );
      setDeliveryGuys(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );
      setZoneNames(response);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryGuys();
    fetchZones();
  }, []);

  useEffect(() => {
    if (!selectedDeliveryGuys) {
      setIsTableVisible(false);
    }
  }, [selectedDeliveryGuys]);

  useEffect(() => {
    // Handle row selection changes here...
    console.info({ rowSelection });
  }, [rowSelection]);

  const fetchDeliveryAgent = async (data) => {
    try {
      const response = await axios.get('/api/fetch/assigned-delivery-agent', {
        params: {
          userId: data.userId,
          date: data.date,
        }
      });
      setDeliveryDetails(response.data.data)
    } catch (error) {
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
    }
  }
  const handleSearch = () => {
    fetchDeliveryAgent({ userId: selectedDeliveryGuys.userid, date: selectedDate })
  };


  return (
    <MainCard title="Delivery Stats" sx={{ position: "relative", height: '82vh', overflow: 'auto' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8} md={3}>
          <Autocomplete
            options={deliveryGuys}
            fullWidth
            value={selectedDeliveryGuys}
            onChange={(event, newValue) => {
              setSelectedDeliveryGuys(newValue);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Search Agent" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={8} md={3}>
          <TextField
            fullWidth
            type="date"
            variant="outlined"
            id="date"
            name="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!selectedDeliveryGuys}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {deliveryDetails === null ? (
        <Stack direction="row" alignItems="center" width="100%" height="100%">
          <img src={DeliveryGuyImage} style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: '60%' }} alt="deliveryguy" />
          <Typography variant="h1">Search Your Delivery partner Details</Typography>
        </Stack>
      ) : (
        <Box>
          {
            deliveryDetails.details.map((data) => {

              return (
                <Box sx={{ mt: 4 }}>
                  <Stack>
                    <Typography variant="h4">{`Zone ${capitalizeText(data.zoneName)} - Delivery`}</Typography>
                    <Typography variant="body2" color="gray">{`Assigned on ${moment(deliveryDetails.assignedDate).format('MMM DD, YYYY')}`}</Typography>
                  </Stack>
                  <TableContainer component={Paper} sx={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', mt: 4 }}>
                    <Box p={2}>
                      <Typography variant="h4">Shops to Deliver</Typography>
                    </Box>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="left">Shop Name</StyledTableCell>
                          <StyledTableCell align="left">Total Amount</StyledTableCell>
                          <StyledTableCell align="left">Status</StyledTableCell>
                          <StyledTableCell align="left"></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.shops.map((row) => {
                          return (
                            <TableRow
                              key={row.shop.CUSNAM}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <StyledTableCell align="left">
                                {capitalizeText(row.shop.CUSNAM)}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {currencyFormatter(row.totalAmount, 'INR')}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Chip sx={{height: '24px'}}
                                  label={capitalizeText(row.shop.status)} />
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Checkbox />
                              </StyledTableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )
            })
          }
        </Box>
      )}
    </MainCard>
  );
};

export default DeliveryStats;
