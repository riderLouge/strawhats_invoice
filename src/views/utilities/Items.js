import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";
import * as ExcelJS from "exceljs";
import MainCard from "../../ui-component/cards/MainCard";
import DialogTemplate from "../../ui-component/Dialog";
import axios from "axios";
import { TextField, Grid, Autocomplete } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useOverAllContext } from "../../context/overAllContext";

const Items = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [buttonClicked, setButtonClicked] = useState("");
  const [products, setProducts] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "ID",
        header: "Id",
      },
      {
        accessorKey: "NAME",
        header: "Product Name",
      },
      {
        accessorKey: "HSN",
        header: "Hsn",
      },
      {
        accessorKey: "MRP",
        header: "Mrp",
      },
      {
        accessorKey: "PPRICE",
        header: "Purchase Price",
      },
      {
        accessorKey: "SPRICE",
        header: "Selling Price",
      },
      {
        accessorKey: "FREE",
        header: "Free",
      },
      {
        accessorKey: "FQTY",
        header: "Quantity",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <EditIcon
            style={{
              cursor: "pointer",
              color: hoveredRow === row.id ? "blue" : "inherit",
            }}
            onMouseEnter={() => setHoveredRow(row.id)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => handleEdit(row)}
          />
        ),
      },
    ],
    [hoveredRow]
  );

  const handleEdit = (row) => {
    setSelectedItem(row.original);
    handleOpenDialog("Edit Items");
  };

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

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/products/fetchItems"
      );
      const filteredProducts = response.data.filter((product) => product.HSN);

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

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
          let cmCode = rowData[9] !== undefined ? rowData[9] : null;
          let fitmentCode = rowData[10];
          let quantity = rowData[11];
          let freeQuantity = rowData[12];
          let discountPercent = rowData[13] || null;

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
    formData.quantity = 0;
    setFileName("");

    setButtonClicked("");
    setDialogTitle("");
  };

  const handleSubmitDialog = async () => {
    try {
      if (buttonClicked === "Import") {
        const chunkSize = 100;
        for (let i = 0; i < modifiedData.length; i += chunkSize) {
          const chunk = modifiedData.slice(i, i + chunkSize);

          const response = await axios.post(
            "https://api-skainvoice.top/api/items/insert",
            chunk
          );
          console.log("Data inserted successfully:", response.data);
        }

        modifiedData.splice(0, modifiedData.length);

        setOpenDialog(false);
        setFileName("");

        setButtonClicked("");
        setDialogTitle("");
      } else if (buttonClicked === "Add Items") {
        // Gather data from form fields
        const newData = {
          CNAME: document.getElementById("companyName").value,
          NAME: document.getElementById("productName").value,
          HSN: document.getElementById("hsn").value,
          MRP: document.getElementById("mrp").value,
          PPRICE: document.getElementById("purchasePrice").value,
          SPRICE: document.getElementById("sellingPrice").value,
          GST: document.getElementById("gst").value,
          CESSP: document.getElementById("cess").value,
          CMCODE: document.getElementById("cmCode").value,
          FITEC: document.getElementById("fitec").value,
          FQTY: document.getElementById("quantity").value,
          FREE: document.getElementById("free").value,
          DISCP: document.getElementById("discription").value,
        };
        console.log(newData);
        const response = await axios
          .post("https://api-skainvoice.top/api/items/add", newData)
          .then(() => {
            fetchProduct();
          });
        console.log(response, "========");
      } else if (buttonClicked === "Edit Items") {
        // Gather edited data from form fields
        const editedData = {
          ID: selectedItem.ID, // Assuming ID is required for editing
          CNAME: document.getElementById("companyName").value,
          NAME: document.getElementById("productName").value,
          HSN: document.getElementById("hsn").value,
          MRP: document.getElementById("mrp").value,
          PPRICE: document.getElementById("purchasePrice").value,
          SPRICE: document.getElementById("sellingPrice").value,
          GST: document.getElementById("gst").value,
          CESSP: document.getElementById("cess").value,
          CMCODE: document.getElementById("cmCode").value,
          FITEC: document.getElementById("fitec").value,
          FQTY: document.getElementById("quantity").value,
          FREE: document.getElementById("free").value,
          DISCP: document.getElementById("discription").value,
        };

        // Make API call to edit the item
        console.log(selectedItem.ID, "===", editedData);
        const response = await axios.put(
          `https://api-skainvoice.top/api/items/edit/${selectedItem.ID}`,
          editedData
        );
        console.log("Item edited successfully:", response);
      } else if (buttonClicked === "Stock Adjustment") {
        const productQuantity = Number(
          document.getElementById("stockQuantity").value
        );
        const damagedQuantity = Number(
          document.getElementById("damagedQuantity").value
        );
        if (damagedQuantity > productQuantity) {
          setSuccess(false);
          setOpenErrorAlert(true);
          setErrorInfo(
            "Damaged quantity must be lesser than product available quantity"
          );
        } else {
          const params = {
            productName: selectedProduct.NAME,
            productId: selectedProduct.ID,
            productQuantity: productQuantity,
            damagedQuantity: damagedQuantity,
            Reason: document.getElementById("reason").value,
            userId: localStorage.getItem("userId"),
          };
          axios
            .post("https://api-skainvoice.top/api/update/product-stock", params)
            .then((response) => {
              if (response.data.status === "success") {
                setSuccess(true);
                setOpenErrorAlert(true);
                setErrorInfo(response.data.message);
                setProducts((prevProd) => {
                  const updatedProducts = prevProd.map((product) => {
                    if (product.ID === response.data.data.updatedProduct.ID) {
                      return {
                        ...product,
                        FQTY: response.data.data.updatedProduct.FQTY,
                      };
                    } else {
                      return product;
                    }
                  });
                  return updatedProducts;
                });
                setTimeout(() => {
                  handleCloseDialog();
                }, 1500);
              } else {
                setSuccess(false);
                setOpenErrorAlert(true);
                setErrorInfo(response.data.message);
              }
            });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    // Add headers
    const headers = [
      "ID",
      "Product Name",
      "Hsn",
      "Mrp",
      "Purchase Price",
      "Selling Price",
    ];
    worksheet.addRow(headers);

    // Add data
    products.forEach((product) => {
      const row = [
        product.ID,
        product.NAME,
        product.HSN,
        product.MRP,
        product.PPRICE,
        product.SPRICE,
      ];
      worksheet.addRow(row);
    });

    // Generate buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.xlsx";
      a.click();
    });
  };

  const [formData, setFormData] = useState({
    quantity: "",
  });
  const handleProductChange = (event, newValue) => {
    const selectedProduct = products.find(
      (product) => product.NAME === newValue
    );
    setFormData({
      ...formData,
      quantity: selectedProduct.FQTY,
    });
    setSelectedProduct(selectedProduct);
  };
  return (
    <MainCard title="Items" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={products}
          getRowId={(row) => row.id}
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
        onClick={() => handleOpenDialog("Add Items")}
      >
        Add Items
      </Button>
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
        onClick={() => handleOpenDialog("Import")}
      >
        Import
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
        onClick={handleExportToExcel}
      >
        Export to Excel
      </Button>
      <DialogTemplate
        open={openDialog}
        title={buttonClicked}
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
            <div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="companyName"
                    label="Company Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.CNAME
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="productName"
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.NAME
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="hsn"
                    label="Hsn"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.HSN
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="mrp"
                    label="Mrp"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.MRP
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="purchasePrice"
                    label="Purchase Price"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.PPRICE
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="sellingPrice"
                    label="Selling Price"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.SPRICE
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="gst"
                    label="Gst"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.GST
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="cess"
                    label="Cess"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.CESSP
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="cmCode"
                    label="CM Code"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.CMCODE
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="fitec"
                    label="FITEC"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.FITEC
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="quantity"
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.FQTY
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="free"
                    label="Free"
                    variant="outlined"
                    fullWidth
                    type="number"
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.FREE
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="discription"
                    label="Discription"
                    variant="outlined"
                    fullWidth
                    defaultValue={
                      buttonClicked === "Edit Items" && selectedItem
                        ? selectedItem.DISCP
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </div>
          ) : (
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="productNames"
                    options={products.map((product) => product.NAME)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product Names"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    onChange={handleProductChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="stockQuantity"
                    label="Stock Quantity"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formData.quantity}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="damagedQuantity"
                    label="Damaged Quantity"
                    variant="outlined"
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    multiline
                    rows={3}
                    id="reason"
                    label="Reason"
                    placeholder="Enter the Reason"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </div>
          )
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
    </MainCard>
  );
};

export default Items;
