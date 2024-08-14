import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button, Grid, Autocomplete, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DialogTemplate from "../../ui-component/Dialog";
import { useOverAllContext } from "../../context/overAllContext";


const DeliveryAgent = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [deliveryGuys, setDeliveryGuys] = useState([])
  const [rowSelection, setRowSelection] = useState({});
  const [hoveredRow, setHoveredRow] = useState({});
  const [hoveredRowIcon, setHoveredRowIcon] = useState({});
  const [open, setOpen] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    fetchDeliveryGuys();
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );
      setCustomers(response.data);
      const zoneNames = response.data
        .map((v) => v.ZONNAM)
        .filter((name) => name);
      const uniqueZoneNames = [...new Set(zoneNames)];
      setZoneNames(uniqueZoneNames);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchDeliveryGuys = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/fetch/deliveryAgents"
      );
      setDeliveryGuys(response.data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };



  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Delivery Person",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        Cell: ({ row }) => {
          return row.original.isActive ? "Assigned" : "Not Assigned";
        }
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div>
            <DeliveryDiningIcon
              style={{
                cursor: "pointer",
                color: hoveredRowIcon === row.id ? "blue" : "inherit",
              }}
              onMouseEnter={() => setHoveredRowIcon(row.id)}
              onMouseLeave={() => setHoveredRowIcon(null)}
              onClick={() => handleClickDeliveryGuy(row)}
            />
            {/* <VisibilityIcon
              style={{
                cursor: "pointer",
                color: hoveredRow === row.id ? "blue" : "inherit",
                marginLeft: "20px",
              }}
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
            /> */}
          </div>

        ),
      },
    ],
    [hoveredRow]
  );

  const handleClickDeliveryGuy = (row) => {
    setSelectedRowData(row.original);
    setOpen(true);
  };
  const assignDeliveryAgent = async (params) => {
    try {
      const response = await axios.post('https://api-skainvoice.top/api/shop/assign-delivery-agent', params);
      if (response.status === 200) {
        setSuccess(true);
      setOpenErrorAlert(true);
      setErrorInfo(response.data.message);
      fetchDeliveryGuys();
      }
      console.log(response);
      setOpen(false);
    } catch (error) {
      console.log(error, 'error while assinging a agent')
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
    }
  }
  const handleSubmitDialog = () => {
    const params = {
      areas: selectedZones,
      date: selectedDate,
      staffId: selectedRowData.userid,
      deliveryDate,
    }
    assignDeliveryAgent(params);

  }



  return (
    <MainCard title="Delivery" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={deliveryGuys}
        />
      </Card>
      {/* <Button
        variant="contained"
        color="primary"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => {}}
      >
        Set Delivery
      </Button> */}
      <DialogTemplate
        open={open}
        title={'Set Delivery'}
        body={
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <Typography mb={1} ml={0.5}>Select Zone</Typography>
                <Autocomplete
                  multiple
                  fullWidth
                  options={zoneNames}
                  getOptionLabel={(option) => option}
                  value={selectedZones}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Zone Name" variant="outlined" />
                  )}
                  onChange={(event, value) => setSelectedZones(value)}
                />
              </Grid>
              <Grid item xs={6}>
              <Typography mb={1} ml={0.5}>Select InvoiceDate</Typography>
                <TextField
                lable="Invoice date"
                  fullWidth
                  type="date"
                  variant="outlined"
                  name="invoiceDate"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography mb={1} ml={0.5}>Select DeliveryDate</Typography>
                <TextField
                lable="Delivery date"
                  fullWidth
                  type="date"
                  variant="outlined"
                  name="DeliveryDate"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                />
              </Grid>
            </Grid>
          </>
        }
        handleCloseDialog={() => setOpen(false)}
        handleSave={handleSubmitDialog} />
    </MainCard>
  );
};

export default DeliveryAgent;
