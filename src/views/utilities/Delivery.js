import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button ,Grid ,Autocomplete ,TextField} from "@mui/material";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DialogTemplate from "../../ui-component/Dialog";


const DeliveryAgent = () => {

  const [deliveryGuys, setDeliveryGuys] = useState([])
  const [rowSelection, setRowSelection] = useState({});
  const [hoveredRow, setHoveredRow] = useState({});
  const [open, setOpen] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");

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
          <DeliveryDiningIcon
            style={{
              cursor: "pointer",
              color: hoveredRow === row.id ? "blue" : "inherit",
            }}
            onMouseEnter={() => setHoveredRow(row.id)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => handleClickDeliveryGuy(row)}
          />
        ),
      },
    ],
    [hoveredRow]
  );

  const handleClickDeliveryGuy = () => {
    setOpen(true)
  }

  const handleSubmitDialog = () => {
    setOpen(true)
  }



  return (
    <MainCard title="Delivery" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={deliveryGuys}
        />
      </Card>
      <Button
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
      </Button>
      <DialogTemplate
       open={open}
       title={'Set Delivery'}
       body={
          <><Grid item xs={6}>
          <Autocomplete
            fullWidth
            options={zoneNames}
            getOptionLabel={(option) => option}
            value={selectedZone}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Zone Name" variant="outlined" />
            )}
            onChange={(event, value) => setSelectedZone(value)}
          />
        </Grid></>
       }
       handleCloseDialog={() => setOpen(false)}
       handleSave={handleSubmitDialog}/>
    </MainCard>
  );
};

export default DeliveryAgent;
