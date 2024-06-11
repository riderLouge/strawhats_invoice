import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, Autocomplete, Tooltip, FormControl, InputLabel, Select, MenuItem, InputAdornment } from "@mui/material";
import SubCard from "../../ui-component/cards/SubCard";
import MainCard from "../../ui-component/cards/MainCard";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { useOverAllContext } from "../../context/overAllContext";

const UtilitiesCreateBill = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
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
    discountType: "",
    discount: "",
    gst: "",
    mrp: "",
    purchasePrice: "",
  });
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [tableData, setTableData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedZone, setSelectedZone] = useState("");
  const [zoneNames, setZoneNames] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [discountType, setDiscountType] = useState('');
  const numberRegx = /^[0-9]*$/;

  const clearCustomerDetails = () => {
    setSelectedCustomer(null);
    setFormData({
      ...formData,
      customerName: "",
      billingAddress: "",
      phoneNumber: "",
      gstin: "",
      city: "",
      state: "",
      invoiceDate: '',
      invoiceNumber: '',
    });
  };
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );
      setCustomers(response.data);
      const zoneNames = response.data
        .map((v) => v.ZONNAM)
        .filter((name) => name);
      const uniqueZoneNames = [...new Set(zoneNames)];
      setZoneNames(uniqueZoneNames);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };
  const getInvoiceCount = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/invoice/overall-count"
      );
      console.log(response);
      if (response.status === 200) {
        setInvoiceNumber(response.data.count);
      }
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

      setProducts(filteredProducts);
      const availableProducts = filteredProducts.filter((product) => product.FQTY > 0);
      setAvailableProducts(availableProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    getInvoiceCount();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const handleDiscountChange = () => {
      if (!numberRegx.test(value)) return;
      const numericValue = parseFloat(value);
      const numericRate = parseFloat(formData.rate);
      if (formData.discountType === 'cash' && numericValue > numericRate) {
        setSuccess(false);
        setOpenErrorAlert(true);
        setErrorInfo('Cash discount must be less than product price');
      } else if (formData.discountType !== 'cash' && numericValue > 100) {
        setSuccess(false);
        setOpenErrorAlert(true);
        setErrorInfo('Percentage discount must be less than 100%');
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    if (name === 'discount') {
      handleDiscountChange();
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      discount: formData.discount,
      discountType: formData.discountType,
      gst: product.GST,
      productId: product.ID,
      productCurrentPrice: product.MRP,
      quantity: 1,
      companyName: product.CNAME,
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

  const checkProductAvailability = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/product/availability-check",
        {
          params: {
            productId: formData.productId,
            requestedQuantity: formData.quantity,
          },
        }
      );

      if (response.data.isAvailable) {
        if (formData.discountType === '') {
          setSuccess(false);
          setOpenErrorAlert(true);
          setErrorInfo('Please select the discount type');
          return;
        }

        const totalWithoutGST = formData.quantity * formData.rate;
        
        const totalWithGST = totalWithoutGST + (totalWithoutGST * formData.gst) / 100;
        let discountAmount = 0;

        if (formData.discountType === 'cash') {
          discountAmount = formData.discount ?? 0;
        } else {
          discountAmount = (totalWithGST * (formData.discount ?? 0)) / 100;
        }

        const totalWithDiscount = totalWithGST - discountAmount;
        setTableData([
          ...tableData,
          {
            ...formData,
            totalWithoutGST,
            totalWithGST,
            totalWithDiscount: totalWithDiscount.toFixed(2),
          },
        ]);

        setFormData({
          ...formData, // Keep other form data fields
          productName: "", // Clear product name
          quantity: "",
          rate: "",
          hsnNumber: "",
          discount: "",
          gst: "",
          mrp: "",
          purchasePrice: "",
          discountType: "",
        });

        // Clear the Autocomplete component
        setDiscountType('');
        setSelectedProduct(null);

      } else {
        setSuccess(false);
        setOpenErrorAlert(true);
        setErrorInfo(
          response.data.availableQuantity === 0
            ? "Product out of stock"
            : `Only ${response.data.availableQuantity} items available. Please adjust your quantity.`
        );
      }
      // setAvailability(response.data);
    } catch (err) {
      // setAvailability(null);
      console.log(err.response?.data?.error || "An error occurred");
    }
  };

  const handleAdd = () => {
    checkProductAvailability();
  };
  console.log(tableData);
  const getTotalProductAmount = (data) => {
    const totalProductAmount = data.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.totalWithGST || 0);
    }, 0);
    return totalProductAmount;
  };
  const saveAndGenerateInvoice = async () => {
    if (tableData.length === 0) {
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo("please add a product to create invoice");
    } else {
      const invoiceData = {
        invoiceNumber: Number(invoiceNumber),
        products: tableData,
        invoiceDate: new Date(formData.invoiceDate).toISOString(),
        shopId: selectedCustomer.shopId,
        userId: JSON.parse(localStorage.getItem("userId")),
        total: getTotalProductAmount(tableData),
      };

      console.log(invoiceData);

      try {
        const response = await axios.post(
          "https://api-skainvoice.top/api/invoice/create",
          invoiceData
        );
        console.log("Invoice saved successfully:", response);
        if (response.status === 201) {
          setSuccess(true);
          setOpenErrorAlert(true);
          setErrorInfo("Invoice created successfully");
          setTableData([]);
          clearCustomerDetails();
          setSelectedZone('');
          getInvoiceCount();
        }
      } catch (error) {
        console.error("Error saving invoice:", error);
      }
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
      accessorKey: "discountType",
      header: "Discount Type",
    },
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

  useEffect(() => {
    if (selectedZone) {
      const filteredCustomers = customers.filter(
        (v) => v.ZONNAM === selectedZone
      );
      setFilteredCustomers(filteredCustomers);
    } else {
      setFilteredCustomers(customers);
    }
  }, [selectedZone, customers]);
  console.log(formData);
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
                value={invoiceNumber}
                disabled
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
              <Autocomplete
                fullWidth
                options={zoneNames}
                getOptionLabel={(option) => option}
                value={selectedZone}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Zone Name" variant="outlined" />
                )}
                onChange={(event, value) => setSelectedZone(value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Tooltip
                arrow
                placement="top"
                title={
                  !selectedZone
                    ? "please select a zone to access this field"
                    : ""
                }
              >
                <Autocomplete
                  fullWidth
                  disabled={!selectedZone}
                  options={filteredCustomers}
                  getOptionLabel={(option) => option.CUSNAM}
                  value={selectedCustomer}
                  renderOption={(props, option) => (
                    <li {...props} key={option.shopId}>
                      {option.CUSNAM}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Shop Name"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, value) => handleCustomerSelect(value)}
                />
              </Tooltip>
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
            {/* <Grid item xs={6}>
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
            </Grid> */}
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setFormData({});
                  setSelectedCustomer(null);
                  clearCustomerDetails();
                }}
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
        sx={{
          marginTop: 2,
          paddingBottom: 4,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Grid item xs={12} sm={4} md={2}>
          <Autocomplete
            fullWidth
            options={availableProducts}
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
          <FormControl sx={{ m: 1, minWidth: 120 }} disabled={!formData.productName}>
            <InputLabel id="demo-select-small-label">Discount Type</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={discountType}
              label="Discount Type"
              name="discountType"
              onChange={(e) => { setDiscountType(e.target.value); handleChange(e); }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <TextField
            fullWidth
            label="Discount"
            variant="outlined"
            name="discount"
            disabled={!discountType}
            value={formData.discount}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">{discountType === 'cash' ? '₹' : '%'}</InputAdornment>,
            }}
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

export default UtilitiesCreateBill;
