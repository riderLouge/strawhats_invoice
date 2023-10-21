import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";

// project imports
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

const DeliveryAgent = () => {
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
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    // Handle row selection changes here...
    console.info({ rowSelection });
  }, [rowSelection]);

  return (
    <MainCard title="Delivery" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={agentDetails}
          enableRowSelection
          getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
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
    </MainCard>
  );
};

export default DeliveryAgent;
