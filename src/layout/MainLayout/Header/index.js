import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Avatar,
  Button,
  ButtonBase,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material"; import { IconMenu2 } from "@tabler/icons";
import "./Header.css";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";
import DialogTemplate from "../../../ui-component/Dialog"
import axios from "axios";
import MonthYearPicker from "../../../ui-component/MonthYearSelector";
import MonthYearSelector from "../../../ui-component/MonthYearSelector";
import { useOverAllContext } from "../../../context/overAllContext";

const Header = ({ handleLeftDrawerToggle }) => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [searchBy, setSearchBy] = useState("Supplier"); // 'invoice' or 'shop'
  const [selectedZoneName, setSelectedZoneName] = useState(null);
  const [shopsData, setShopsData] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const supplierNames = [
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
  const [selectedZone, setSelectedZone] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  console.log(selectedZone, selectedCustomer)
  const supplierProductParams = {
    companyName: supplierName,
    month,
    year,
  }
  const customerProductParams = {
    zoneName: selectedZone,
    shopName: selectedCustomer?.CUSNAM,
    month,
    year,
  }
  useEffect(() => {
    fetchCustomers();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedZone) {
      const filteredCustomers = shopsData.filter(
        (v) => v.ZONNAM === selectedZone
      );
      setFilteredCustomers(filteredCustomers);
    } else {
      setFilteredCustomers(shopsData);
    }
  }, [selectedZone, shopsData]);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );
      setShopsData(response.data);
      const zoneNames = response.data
        .map((v) => v.ZONNAM)
        .filter((name) => name);
      const uniqueZoneNames = [...new Set(zoneNames)];
      setZoneNames(uniqueZoneNames);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchSupplierReport = async () => {
    try {
      const response = await axios.post(
        "/api/products/by-company-date"
      );
      console.log(response)
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };
  const handleSubmit = async (params) => {
    const apiUrl = searchBy === "Supplier" ? '/api/products/by-company-date' : '/api/products/by-zone-shop-date';
    try {
      const response = await axios.post(apiUrl, params);
      if (response.status === 200) {
        setSuccess(true);
        setOpenErrorAlert(true);
        setErrorInfo(response.data.message);
      } else {
        setSuccess(false);
        setOpenErrorAlert(true);
        setErrorInfo(response.data.message);
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
    }
  };

  const handleSearch = () => {
    setSelectedCustomer()
    let newData = [];

    if (searchBy === "invoice" && supplierName) {
      newData = newData.filter(
        (item) => item.invoiceNumber === supplierName
      );
    } else if (searchBy === "shop" && selectedZoneName && selectedShopId) {
      newData = newData.filter(
        (item) =>
          item.shopName === selectedShopId && item.zoneName === selectedZoneName
      );
    } else if (searchBy === "shop" && selectedZoneName) {
      newData = newData.filter((item) => item.zoneName === selectedZoneName);
    } else if (searchBy === "shop" && selectedShopId) {
      newData = newData.filter((item) => item.shopName === selectedShopId);
    }

    setFilteredData(newData);
  };

  const softwareNameStyle = {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#b06dd4",
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitDialog = async () => {

  };

  const handleToggle = (event, newSearchBy) => {
    if (newSearchBy !== null) {
      setSearchBy(newSearchBy);
    }
  };
  return (
    <>
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          <Typography style={softwareNameStyle}>
            <span className="strawhat">Sri</span>
            <span className="hat"></span>KrishnaAgencies
          </Typography>
        </Box>
        <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              "&:hover": {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      <Button
        variant="contained"
        color="secondary"
        style={{
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => { setOpenDialog(true) }}
      >
        Report
      </Button>
      <DialogTemplate
        width="lg"
        open={openDialog}
        title={"REPORT"}
        body={
          <><ToggleButtonGroup
            value={searchBy}
            exclusive
            onChange={handleToggle}
            aria-label="search by"
            style={{ marginBottom: "16px" }}
          >
            <ToggleButton
              value="Supplier"
              aria-label="Supplier Name"
              style={{
                padding: "8px 16px",
                textAlign: "center",
                border: "1px solid #ccc",
                backgroundColor:
                  searchBy === "Supplier"
                    ? theme.palette.primary.main
                    : "#f0f0f0",
                color: searchBy === "Supplier" ? "white" : "#333",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              Supplier
            </ToggleButton>
            <ToggleButton
              value="Customer"
              aria-label="Customer"
              style={{
                padding: "8px 16px",
                textAlign: "center",
                border: "1px solid #ccc",
                backgroundColor:
                  searchBy === "Customer" ? theme.palette.primary.main : "#f0f0f0",
                color: searchBy === "Customer" ? "white" : "#333",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              Customer
            </ToggleButton>
          </ToggleButtonGroup>
            <Grid container spacing={2} alignItems="center">
              {searchBy === "Supplier" && (
                <>
                  <Grid item xs={4}>
                    <Autocomplete
                      options={supplierNames}
                      getOptionLabel={(option) => option.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supplier Name"
                          variant="outlined"
                        />
                      )}
                      value={supplierName}
                      onChange={(event, newValue) =>
                        setSupplierName(newValue)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MonthYearSelector
                      year={year}
                      setYear={setYear}
                      month={month}
                      setMonth={setMonth}
                    />
                  </Grid>
                </>
              )}
              {searchBy === "Customer" && (
                <>
                  <Grid item xs={3}>
                    <Autocomplete
                      options={zoneNames}
                      getOptionLabel={(option) => option}
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Zone Name" variant="outlined" />
                      )}
                      onChange={(event, value) => setSelectedZone(value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      options={filteredCustomers}
                      getOptionLabel={(option) => option.CUSNAM}
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
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <MonthYearSelector
                      year={year}
                      setYear={setYear}
                      month={month}
                      setMonth={setMonth}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: theme.palette.primary.main }}
                  onClick={() => handleSubmit(searchBy === "Supplier" ? supplierProductParams : customerProductParams)}
                >
                  Search
                </Button>
              </Grid>
            </Grid></>
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
