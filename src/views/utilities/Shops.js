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

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );
      setShops(response.data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  useEffect(() => {
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
      if (buttonClicked === "Import") {
        const chunkSize = 100;
        for (let i = 0; i < modifiedData.length; i += chunkSize) {
          const chunk = modifiedData.slice(i, i + chunkSize);

          const response = await axios.post(
            "https://api-skainvoice.top/api/shops/insert",
            chunk
          );
          console.log("Data inserted successfully:", response.data);
        }

        modifiedData.splice(0, modifiedData.length);

        setOpenDialog(false);
        setFileName("");

        setButtonClicked("");
        setDialogTitle("");
      } else if (buttonClicked === "Add Shops") {
        const newData = {
          GRPNAM: document.getElementById("groupName").value,
          CUSNAM: document.getElementById("customerName").value,
          ADRONE: document.getElementById("addressOne").value,
          ADRTWO: document.getElementById("addressTwo").value,
          ADRTHR: document.getElementById("addressThr").value,
          ADRFOU: document.getElementById("addressThr").value,
          PLC: document.getElementById("place").value,
          PINCOD: document.getElementById("pincode").value,
          CNTPER: document.getElementById("contactPerson").value,
          SLNO: document.getElementById("SLNO").value,
          TNGST: document.getElementById("TNGST").value,
          TELNUM: document.getElementById("TELNUM").value,
          ZONNAM: document.getElementById("zoneName").value,
        };
        console.log(newData);
        const response = await axios.post("api/shop/add", newData).then(() => {
          fetchProduct();
        });
        console.log(response, "========");
      } else if (buttonClicked === "Edit Shops") {
        // Gather edited data from form fields
        const editedData = {
          ID: selectedItem.ID, // Assuming ID is required for editing
          GRPNAM: document.getElementById("groupName").value,
          CUSNAM: document.getElementById("customerName").value,
          ADRONE: document.getElementById("addressOne").value,
          ADRTWO: document.getElementById("addressTwo").value,
          ADRTHR: document.getElementById("addressThr").value,
          ADRFOU: document.getElementById("addressThr").value,
          PLC: document.getElementById("place").value,
          PINCOD: document.getElementById("pincode").value,
          CNTPER: document.getElementById("contactPerson").value,
          SLNO: document.getElementById("SLNO").value,
          TNGST: document.getElementById("TNGST").value,
          TELNUM: document.getElementById("TELNUM").value,
          ZONNAM: document.getElementById("zoneName").value,
        };

        // Make API call to edit the item
        const response = await axios.put(
          `api/items/edit/${selectedItem.ID}`,
          editedData
        );
        console.log("Item edited successfully:", response);
      } else if (buttonClicked === "Stock Adjustment") {
        const editedData = {
          ID: selectedItem.ID,
          FQTY:
            document.getElementById("stockQuantity").value -
            document.getElementById("damagedQuantity").value,
        };
        const newData = {
          ID: selectedItem.ID,
          DQTY: document.getElementById("damagedQuantity").value,
        };
        console.log(newData);
      }

      // Clear form fields and close dialog
      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
    }
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
        onClick={() => {
          handleOpenDialog("Add Shops");
        }}
      >
        Add Customer
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
          ) : buttonClicked === "Add Shops" ||
            buttonClicked === "Edit Shops" ? (
            <div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="groupName"
                    label="Group Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.GRPNAM
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="customerName"
                    label="Customer Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.CUSNAM
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="addressOne"
                    label="Address One"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.ADRTWO
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="addressTwo"
                    label="Address Two"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.MRP
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="addressThr"
                    label="Address Three"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.ADRTHR
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="addressFour"
                    label="Address Four"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.ADRFOU
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="place"
                    label="Place"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.PLC
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="pincode"
                    label="Pincode"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.PINCOD
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="contactPerson"
                    label="Contact Person"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.CNTPER
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="SLNO"
                    label="SL No"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.SLNO
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="TNGST"
                    label="TNGST"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.TNGST
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="TELNUM"
                    label="Tel Number"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.TELNUM
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="zoneName"
                    label="Zone Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.ZONNAM
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </div>
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
