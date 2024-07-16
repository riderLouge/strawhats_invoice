import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button, TextField, Grid, Autocomplete, CardContent, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";



const DeliveryStats = () => {
  const [filteredAgentDetails, setFilteredAgentDetails] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [zoneNames, setZoneNames] = useState([]);
  const [deliveryGuys, setDeliveryGuys] = useState([])
  const [selectedDeliveryGuys, setSelectedDeliveryGuys] = useState([])

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

  const handleSearch = () => {
    if (deliveryGuys) {
      const filteredData = deliveryGuys.filter(
        (agent) => agent.name.toLowerCase() === selectedDeliveryGuys.toLowerCase()
      );
      setFilteredAgentDetails(filteredData);
      setIsTableVisible(true);
    }
  };

  const fetchDeliveryAgent = async () => {
    try {
      const response = await axios.get('/api/fetch/assigned-delivery-agent');
      console.log(response);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchDeliveryAgent()
  }, [])
  return (
    <MainCard title="Delivery Stats" sx={{ position: "relative" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8} md={3}>
          <Autocomplete
            options={deliveryGuys.map((option) => option.name)}
            fullWidth
            value={selectedDeliveryGuys}
            onChange={(event, newValue) => {
              setSelectedDeliveryGuys(newValue);
              console.log(newValue, "===")
            }}
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
      {isTableVisible && (
        <Card sx={{ overflow: 'hidden', marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {selectedDeliveryGuys}
            </Typography>
            <Typography color="text.secondary">
              Contact: {deliveryPersonData.contactNumber}
            </Typography>
            <Typography color="text.secondary">
              Delivery Area: {deliveryPersonData.deliveryArea}
            </Typography>
            <Divider sx={{ margin: '16px 0' }} />
            <Typography variant="subtitle1" component="div">
              List of Deliveries:
            </Typography>
            <List>
              {deliveryPersonData.deliveries.map((delivery, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={delivery.customerName}
                    secondary={`Bill Value: ${delivery.billValue}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </MainCard>
  );
};

export default DeliveryStats;
