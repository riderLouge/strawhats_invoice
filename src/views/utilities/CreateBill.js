import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import SubCard from "../../ui-component/cards/SubCard";
import MainCard from "../../ui-component/cards/MainCard";
import { gridSpacing } from "../../store/constant";
import { useTheme } from "@mui/material/styles";
import { MaterialReactTable } from "material-react-table";

const UtilitiesCreateBill = () => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    rate: "",
    hsnNumber: "",
    discount: "",
    gst: "",
  });

  const [tableData, setTableData] = useState([]);
  const theme = useTheme();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAdd = () => {
    // Add data to the tableData state
    setTableData([
      ...tableData,
      {
        productName: formData.productName,
        quantity: formData.quantity,
        rate: formData.rate,
        hsnNumber: formData.hsnNumber,
        discount: formData.discount,
        gst: formData.gst,
      },
    ]);

    // Clear form fields after adding to table
    setFormData({
      productName: "",
      quantity: "",
      rate: "",
      hsnNumber: "",
      discount: "",
      gst: "",
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "productName",
        header: "Product Name",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "rate",
        header: "Rate",
      },
      {
        accessorKey: "hsnNumber",
        header: "HSN Number",
      },
      {
        accessorKey: "discount",
        header: "Discount",
      },
      {
        accessorKey: "gst",
        header: "GST",
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  return (
    <MainCard title="Invoice">
      <Grid item xs={12}>
        <SubCard title="Create bills" sx={{ mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                variant="outlined"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </SubCard>
        <SubCard>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Customer Name"
                variant="outlined"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Billing Address"
                variant="outlined"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="GSTIN"
                variant="outlined"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                variant="outlined"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                // onClick={handleClear}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          marginTop: 2,
          paddingBottom: 4,
          borderBottom: "1px solid #ccc", // You can adjust the color and thickness as needed
        }}
      >
        <Grid item xs={12} sm={4} md={2}>
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <TextField
            fullWidth
            label="Quantity"
            variant="outlined"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <TextField
            fullWidth
            label="Rate"
            variant="outlined"
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <TextField
            fullWidth
            label="HSN Number"
            variant="outlined"
            type="number"
            name="hsnNumber"
            value={formData.hsnNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <TextField
            fullWidth
            label="Discount"
            variant="outlined"
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <TextField
            fullWidth
            label="GST"
            variant="outlined"
            type="number"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid
        sx={{
          marginTop: 2,
        }}
      >
        <MaterialReactTable
          columns={columns}
          data={tableData}
          enableRowSelection
          getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
        />
        <Grid container spacing={2} mt={2}>
          <Grid item>
            <Button variant="contained" color="secondary">
              Remove
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UtilitiesCreateBill;
