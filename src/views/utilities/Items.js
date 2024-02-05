import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";

// project imports
import MainCard from "../../ui-component/cards/MainCard";

const groceryProducts = [
  {
    id: 1,
    name: "Apples",
    category: "Fruits",
    price: 1.99,
    quantity: 10,
  },
  {
    id: 2,
    name: "Bread",
    category: "Bakery",
    price: 2.49,
    quantity: 5,
  },
  {
    id: 3,
    name: "Milk",
    category: "Dairy",
    price: 1.79,
    quantity: 3,
  },
  {
    id: 4,
    name: "Apples",
    category: "Fruits",
    price: 1.99,
    quantity: 10,
  },
  {
    id: 5,
    name: "Bread",
    category: "Bakery",
    price: 2.49,
    quantity: 5,
  },
  {
    id: 6,
    name: "Milk",
    category: "Dairy",
    price: 1.79,
    quantity: 3,
  },
];

const Items = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  return (
    <MainCard title="Items" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={groceryProducts}
          enableRowSelection
          getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
        />
      </Card>
      <Button
        variant="contained"
        color="secondary"
        style={{
          top: "10px",
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => {}}
      >
        Stock Adjustment
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{
          top: "10px",
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => {}}
      >
        Add / Edit Item
      </Button>
    </MainCard>
  );
};

export default Items;
