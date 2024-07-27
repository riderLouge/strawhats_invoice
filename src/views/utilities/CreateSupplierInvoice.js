import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, Autocomplete } from "@mui/material";
import SubCard from "../../ui-component/cards/SubCard";
import MainCard from "../../ui-component/cards/MainCard";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { useOverAllContext } from "../../context/overAllContext";

const UtilitiesCreateSupplierBill = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    billDate: "",
    customerName: "",
    billingAddress: "",
    phoneNumber: "",
    gstin: "",
    city: "",
    state: "",
    productName: "",
    quantity: "",
    rate: "",
    hsnNumber: "",
    discount: "",
    gst: "",
    mrp: "",
    purchasePrice: "",
    paymentType: '',
  });

  const [tableData, setTableData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  console.log(selectedSupplier);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://api-skainvoice.top/api/company/fetchCompany"
        );
        const uniqueCompanies = Array.from(
          new Set(response.data.map((company) => company.cName))
        ).map((cName) =>
          response.data.find((company) => company.cName === cName)
        );
        setSuppliers(uniqueCompanies);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://api-skainvoice.top/api/products/fetchItems"
        );
        const filteredProducts = response.data.filter((product) => product.HSN);
        console.log(filteredProducts);

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);

    setFormData({
      ...formData,
      productName: product.NAME,
      rate: product.SPRICE,
      mrp: product.MRP, // Populate MRP
      purchasePrice: product.PPRICE, // Populate Purchase Price
      hsnNumber: product.HSN,
      discount: product.DISCOUNT,
      gst: product.GST,
      productId: product.ID,
      productCurrentPrice: product.MRP,
      quantity: 1,
    });
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);

    // Concatenate address fields for billing address
    const billingAddress = `${customer.ADRONE || ""} ${customer.ADRTWO || ""} ${customer.ADRTHR || ""
      }`;

    setFormData({
      ...formData,
      customerName: customer.CUSNAM || "",
      billingAddress: billingAddress.trim(),
      phoneNumber: customer.TELNUM || "",
      gstin: customer.GSTIN || "",
      city: customer.City || "",
      state: customer.State || "",
    });
  };

  const handleAdd = () => {

    const totalWithoutGST = formData.quantity * formData.rate;
    const totalWithGST =
      totalWithoutGST + (totalWithoutGST * formData.gst) / 100;
    const discountAmount = (totalWithGST * (formData.discount || 0)) / 100;
    const totalWithDiscount = totalWithGST - discountAmount;

    setTableData([
      ...tableData,
      {
        ...formData,
        totalWithoutGST,
        totalWithGST,
        totalWithDiscount,
      },
    ]);

    setFormData({
      ...formData, 
      productName: "",
      quantity: "",
      rate: "",
      hsnNumber: "",
      discount: "",
      gst: "",
      mrp: "",
      purchasePrice: "",
    });

    setSelectedProduct(null);
    

  };


  const billTotal = (data) => {
    console.log(data);
    const total = data.reduce((acc, curr) => {
      const totalWithoutGST = Number(curr.quantity) * Number(curr.rate);
      const totalWithGST =
        totalWithoutGST + (totalWithoutGST * Number(curr.gst)) / 100;
      const discountAmount = (totalWithGST * Number(curr.discount) || 0) / 100;
      const totalWithDiscount = totalWithGST - discountAmount;
      return acc + totalWithDiscount;
    }, 0)
    return total;
  }
  const saveAndGenerateInvoice = async () => {
    const invoiceData = {
      billNumber: Number(formData.invoiceNumber) || "",
      products: tableData,
      billTotal: billTotal(tableData),
      billDate: new Date(formData.billDate).toISOString(),
      paymentMode: formData.paymentType,
      pendingPayment: Number(formData.pendingPayment),
      address: formData.address,
      supplierId: selectedSupplier.id,
      userId: JSON.parse(localStorage.getItem("userId")),
    };

    console.log(invoiceData);

    try {
      const response = await axios.post("https://api-skainvoice.top/api/supplier-bill/create", invoiceData);
      console.log("Invoice saved successfully:", response.data);
      setFormData({});
      setTableData([]);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };
  const columns = [
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    // {
    //   accessorKey: "mrp",
    //   header: "Mrp",
    // },
    // {
    //   accessorKey: "purchasePrice",
    //   header: "Purchase Price",
    // },
    {
      accessorKey: "rate",
      header: "Selling Price",
    },
    // {
    //   accessorKey: "hsnNumber",
    //   header: "HSN Number",
    // },
    {
      accessorKey: "discount",
      header: "Discount",
    },
    {
      accessorKey: "gst",
      header: "GST",
    },
    // {
    //   accessorKey: "totalWithoutGST",
    //   header: "Before GST",
    // },
    // {
    //   accessorKey: "totalWithGST",
    //   header: "After GST",
    // },
    {
      accessorKey: "totalWithDiscount",
      header: "Total",
    },
  ];

  const clearSupplierDetails = () => {
    setSelectedSupplier(null);
    setFormData({
      ...formData,
      supplierName: "",
      supplierAddress: "",
    });
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    console.log(supplier);
    setFormData({
      ...formData,
      supplierName: supplier.cName,
      supplierAddress: supplier.address,
    });
  };
  const handlePaymentTypeSelect = (value) => {
    setFormData((prevData) => ({ ...prevData, paymentType: value }))
};
console.log(formData);
return (
  <MainCard title="Invoice">
    <Grid item xs={12}>
      <SubCard title="Create Supplier bills" sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Bill Number"
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
              name="billDate"
              value={formData.billDate}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </SubCard>
      <SubCard>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Autocomplete
              fullWidth
              options={suppliers}
              getOptionLabel={(option) => option.cName}
              value={selectedSupplier}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier Name"
                  variant="outlined"
                />
              )}
              onChange={(event, value) => handleSupplierSelect(value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Supplier Address"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pending Payment"
              variant="outlined"
              name="pendingPayment"
              value={formData.pendingPayment}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              fullWidth
              options={['CASH', 'UPI', 'CARD', 'NET BANKING']}
              getOptionLabel={(option) => option}
              value={formData.paymentType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Type"
                  variant="outlined"
                  name="paymentType"
                />
              )}
              onChange={(_, value) => handlePaymentTypeSelect(value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={clearSupplierDetails}
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
        borderBottom: "1px solid #ccc",
      }}
    >
      <Grid item xs={12} sm={4} md={2}>
        <Autocomplete
          fullWidth
          options={products}
          getOptionLabel={(option) => option.NAME}
          value={selectedProduct}
          onChange={(event, newValue) => handleProductSelect(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Product Name" variant="outlined" />
          )}
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
          label="MRP"
          variant="outlined"
          type="number"
          name="mrp"
          value={formData.mrp}
          onChange={handleChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={2} md={2}>
        <TextField
          fullWidth
          label="Purchase Price"
          variant="outlined"
          type="number"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={2} md={2}>
        <TextField
          fullWidth
          label="Selling Price"
          variant="outlined"
          type="number"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          disabled
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
          disabled
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
          disabled
        />
      </Grid>
      <Grid item xs={12} align="right">
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Grid>
    </Grid>
    <Grid sx={{ marginTop: 2 }}>
      <MaterialReactTable columns={columns} data={tableData} />
      <Grid container spacing={2} mt={2}>
        <Grid item>
          <Button variant="contained" color="secondary">
            Remove
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={saveAndGenerateInvoice}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </MainCard>
);
};

export default UtilitiesCreateSupplierBill;
