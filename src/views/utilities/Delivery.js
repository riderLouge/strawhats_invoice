import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button ,Grid ,Autocomplete ,TextField} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DialogTemplate from "../../ui-component/Dialog";


const DeliveryAgent = () => {

  const [deliveryGuys, setDeliveryGuys] = useState([])
  const [rowSelection, setRowSelection] = useState({});
  const [hoveredRow, setHoveredRow] = useState({});
  const [hoveredRowIcon, setHoveredRowIcon] = useState({});
  const [open, setOpen] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
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
        "/api/fetch/deliveryAgents"
      );
      setDeliveryGuys(response.data);
      console.log(response)
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
        accessorKey: "status",
        header: "Status",
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
            <VisibilityIcon
              style={{
                cursor: "pointer",
                color: hoveredRow === row.id ? "blue" : "inherit",
                marginLeft: "20px",
              }}
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
            />
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

  const handleSubmitDialog = () => {
    console.log("Selected Zone:", selectedZones);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Row Data:", selectedRowData);

    setOpen(false);
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
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  name="invoiceDate"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </Grid>
            </Grid>
          </>
       }
       handleCloseDialog={() => setOpen(false)}
       handleSave={handleSubmitDialog}/>
    </MainCard>
  );
};

export default DeliveryAgent;
