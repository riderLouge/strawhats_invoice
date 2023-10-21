import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";

// project imports
import MainCard from "../../ui-component/cards/MainCard";

const shopDetails = [
  {
    id: 1,
    shopName: "Shop 1",
    address: "123 Main Street, City",
    phoneNumber: "123-456-7890",
    lastOrder: "12/10/2023",
  },
  {
    id: 2,
    shopName: "Shop 2",
    address: "456 Elm Street, Town",
    phoneNumber: "987-654-3210",
    lastOrder: "19/10/2023",
  },
  {
    id: 3,
    shopName: "Shop 3",
    address: "789 Oak Street, Village",
    phoneNumber: "111-222-3333",
    lastOrder: "18/10/2023",
  },
];

const Shops = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "shopName",
        header: "Shop Name",
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
        accessorKey: "lastOrder",
        header: "Last Order",
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
    <MainCard title="Shops" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={shopDetails}
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
        Download Order
      </Button>
    </MainCard>
  );
};

export default Shops;
