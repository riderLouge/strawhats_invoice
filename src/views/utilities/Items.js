import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";
import * as ExcelJS from "exceljs";
import MainCard from "../../ui-component/cards/MainCard";
import DialogTemplate from "../../ui-component/Dialog";
const Items = () => {
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
  const [openDialog, setOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [buttonClicked, setButtonClicked] = useState("");

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    const data = [];
    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        const rowData = row.values;
        data.push(rowData);
      });
    });

    console.log(data);
  };
  const handleOpenDialog = (buttonName) => {
    setOpenDialog(true);
    setButtonClicked(buttonName);
    setDialogTitle(buttonName);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setButtonClicked("");
    setDialogTitle("");
  };

  const handleSubmitDialog = () => {
    setOpenDialog(false);
    setButtonClicked("");
    setDialogTitle("");
  };

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
        onClick={() => handleOpenDialog("Stock Adjustment")}
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
        onClick={() => handleOpenDialog("Add/Edit")}
      >
        Add / Edit Item
      </Button>
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
        onClick={() => handleOpenDialog("Import")}
      >
        Import
      </Button>
      <DialogTemplate
        open={openDialog}
        title={"Import"}
        body={
          buttonClicked === "Import" ? (
            <label
              htmlFor="file-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <Button variant="outlined" component="span">
                Choose File
              </Button>
              <span>Selected file: {fileName}</span>
            </label>
          ) : (
            <span>{`You clicked on: ${buttonClicked}`}</span>
          )
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
    </MainCard>
  );
};

export default Items;
