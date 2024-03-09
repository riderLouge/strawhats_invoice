import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";
import * as ExcelJS from "exceljs";
import MainCard from "../../ui-component/cards/MainCard";
import DialogTemplate from "../../ui-component/Dialog";
import axios from "axios";

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
  const companyNames = [
    "ASIA CANDY",
    "BEIERSDORF INDIA PVT LTD",
    "DRISHTI FB",
    "FRIENDS DIAPERS",
    "GANAPATHY SEMIYA",
    "GOKULAM DATES",
    "HALDIRAM'S",
    "HEARTY FEEDING BOTTLE",
    "HUGGIES",
    "K.P.L.COCONUT OIL",
    "LOTTE INDIA CORPORATION LTD",
    "MUGI",
    "NATRAJ OIL MILLS (P) LTD",
    "PASS PASS",
    "RAS OIL",
    "RICHEESE WAFER",
    "TIGER BALM",
    "UNITED FOODS",
    "USHODAYA ENTERPRISES LTD",
    "VIKAAS FOOD PRODUCTS",
  ];
  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [buttonClicked, setButtonClicked] = useState("");

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);
  const [modifiedData, setModifiedData] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        const rowData = row.values;
        let companyName = rowData[1] || null;
        if (companyNames.includes(companyName)) {
          let productName = rowData[2];
          let mrp = rowData[3];
          let purchasePrice = rowData[4];
          let sellingPrice = rowData[5];
          let gst = rowData[6] || null;
          let hsn = rowData[7] || null;
          let cessPercent = rowData[8] || null;
          let cmCode = rowData[9] !== undefined ? rowData[9] : null; // Check for undefined cmCode
          let fitmentCode = rowData[10];
          let quantity = rowData[11];
          let freeQuantity = rowData[12];
          let discountPercent = rowData[13] || null;

          // Construct object with the desired structure
          const object = {
            CNAME: companyName,
            NAME: productName,
            MRP: mrp,
            PPRICE: purchasePrice,
            SPRICE: sellingPrice,
            GST: gst,
            HSN: hsn,
            CESSP: cessPercent,
            CMCODE: cmCode,
            FITEC: fitmentCode,
            FQTY: quantity,
            FREE: freeQuantity,
            DISCP: discountPercent,
          };

          if (companyName === "USHODAYA ENTERPRISES LTD") {
            console.log("object =", rowData[9]);
          }
          modifiedData.push(object);
        }
      });
    });
  };

  const handleOpenDialog = (buttonName) => {
    setOpenDialog(true);
    setButtonClicked(buttonName);
    setDialogTitle(buttonName);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFileName("");

    setButtonClicked("");
    setDialogTitle("");
  };

  const handleSubmitDialog = async () => {
    console.log(modifiedData);
    try {
      const chunkSize = 100;
      for (let i = 0; i < modifiedData.length; i += chunkSize) {
        const chunk = modifiedData.slice(i, i + chunkSize);

        const response = await axios.post("api/items/insert", chunk);
        console.log("Data inserted successfully:", response.data);
      }

      modifiedData.splice(0, modifiedData.length);
    } catch (error) {
      console.error("Error inserting data:", error);
      modifiedData.splice(0, modifiedData.length);
    }

    setOpenDialog(false);
    setFileName("");

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
