import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button, TextField, Grid, Autocomplete } from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard";

const agentDetails = [
  {
    id: 1,
    agentName: "Sam",
    address: "123 Main Street, City",
    phoneNumber: "123-456-7890",
    status: "Out For Delivery",
  },
  {
    id: 2,
    agentName: "Vishal",
    address: "456 Elm Street, Town",
    phoneNumber: "987-654-3210",
    status: "Active",
  },
  {
    id: 3,
    agentName: "Gautham",
    address: "789 Oak Street, Village",
    phoneNumber: "111-222-3333",
    status: "In Active",
  },
];

const DeliveryStats = () => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [filteredAgentDetails, setFilteredAgentDetails] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "agentName",
        header: "Agent",
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
        accessorKey: "status",
        header: "Status",
      },
    ],
    []
  );

  useEffect(() => {
    if (!selectedAgent) {
      setIsTableVisible(false);
    }
  }, [selectedAgent]);

  useEffect(() => {
    // Handle row selection changes here...
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleSearch = () => {
    if (selectedAgent) {
      const filteredData = agentDetails.filter(
        (agent) => agent.agentName.toLowerCase() === selectedAgent.toLowerCase()
      );
      setFilteredAgentDetails(filteredData);
      setIsTableVisible(true);
    }
  };

  return (
    <MainCard title="Delivery Stats" sx={{ position: "relative" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8} md={3}>
          <Autocomplete
            options={agentDetails.map((option) => option.agentName)}
            fullWidth
            value={selectedAgent}
            onChange={(event, newValue) => {
              setSelectedAgent(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search Agent" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!selectedAgent}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {isTableVisible && (
        <Card sx={{ overflow: "hidden", marginTop: "16px" }}>
          <MaterialReactTable
            columns={columns}
            data={filteredAgentDetails}
            enableRowSelection
            getRowId={(row) => row.id}
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection }}
          />
        </Card>
      )}
    </MainCard>
  );
};

export default DeliveryStats;
