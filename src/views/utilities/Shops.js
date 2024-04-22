import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MainCard from "../../ui-component/cards/MainCard";
import DialogTemplate from "../../ui-component/Dialog";
import * as ExcelJS from "exceljs";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { TextField, Grid, Autocomplete } from "@mui/material";

const Shops = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredRowEdit, setHoveredRowEdit] = useState(null);

  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [buttonClicked, setButtonClicked] = useState("");
  const [shops, setShops] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("api/shops/fetchItems");
        console.log(response.data);
        setShops(response.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchProduct();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "GRPNAM",
        header: "Group Name",
      },
      {
        accessorKey: "CUSNAM",
        header: "Shop Name",
      },
      {
        accessorKey: "ADRONE",
        header: "Address 1",
      },
      {
        accessorKey: "ADRTWO",
        header: "Address 2",
      },
      {
        accessorKey: "ADRTHR",
        header: "Address 3",
      },
      {
        accessorKey: "PINCOD",
        header: "Pincode",
      },
      {
        accessorKey: "CNTPER",
        header: "Contact Person",
      },
      {
        accessorKey: "TELNUM",
        header: "Contact Number",
      },
      {
        accessorKey: "ZONNAM",
        header: "Zone",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div>
            <EditIcon
              style={{
                cursor: "pointer",
                color: hoveredRowEdit === row.id ? "blue" : "inherit",
              }}
              onMouseEnter={() => setHoveredRowEdit(row.id)}
              onMouseLeave={() => setHoveredRowEdit(null)}
              onClick={() => handleEdit(row)}
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
    [hoveredRow, hoveredRowEdit]
  );

  const handleEdit = (row) => {
    setSelectedItem(row.original);
    handleOpenDialog("Edit Items");
  };

  const handleOpenDialog = (buttonName) => {
    setOpenDialog(true);
    setButtonClicked(buttonName);
    setDialogTitle(buttonName);
  };

  const handleSubmitDialog = async () => {
    try {
      const chunkSize = 100;
      for (let i = 0; i < modifiedData.length; i += chunkSize) {
        const chunk = modifiedData.slice(i, i + chunkSize);

        const response = await axios.post("api/shops/insert", chunk);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        const rowData = row.values;
        let companyName = rowData[1] || null;
        let productName = rowData[2];
        let mrp = rowData[3];
        let purchasePrice = rowData[4];
        let sellingPrice = rowData[5];
        let gst = rowData[6] || null;
        let hsn = rowData[7] || null;
        let cessPercent = rowData[8] || null;
        let cmCode = rowData[9] !== undefined ? rowData[9] : null;
        let fitmentCode = rowData[10];
        let quantity = rowData[11];
        let freeQuantity = rowData[12];
        let discountPercent = rowData[13] || null;

        const object = {
          GRPNAM: companyName,
          CUSNAM: productName,
          ADRONE: mrp,
          ADRTWO: purchasePrice,
          ADRTHR: sellingPrice,
          ADRFOU: gst,
          PLC: hsn,
          PINCOD: cessPercent,
          CNTPER: cmCode,
          SLNO: fitmentCode,
          TNGST: quantity,
          TELNUM: freeQuantity,
          ZONNAM: discountPercent,
        };

        modifiedData.push(object);
      });
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFileName("");

    setButtonClicked("");
    setDialogTitle("");
  };
  return (
    <MainCard title="Shops" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable columns={columns} data={shops} />
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
        Update Debit / Credit
      </Button> */}
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
        Update Debit / Credit
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
        Add / Edit Customer
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
          ) : buttonClicked === "Add Items" ||
            buttonClicked === "Edit Items" ? (
            ""
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

export default Shops;
