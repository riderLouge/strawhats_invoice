import { useEffect, useState } from "react";
import {
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EarningCard from "./EarningCard";
import PopularCard from "./PopularCard";
import TotalOrderLineChartCard from "./TotalOrderLineChartCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import TotalIncomeLightCard from "./TotalIncomeLightCard";
import TotalGrowthBarChart from "./TotalGrowthBarChart";
import { gridSpacing } from "../../../store/constant";
import DialogTemplate from "../../../ui-component/Dialog";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { useOverAllContext } from "../../../context/overAllContext";

const Dashboard = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [pdfType, setPdfType] = useState("");
  const [zoneNames, setZoneNames] = useState([]);
  const [credit, setCredit] = useState([]);
  const [debit, setDebit] = useState([]);
  const [shops, setShops] = useState([]);
  const [filteredCredit, setFilteredCredit] = useState([]);
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");

  const fetchZonNames = async () => {
    try {
      const response = await axios.get("/api/get-all-zone-name");
      setZoneNames(response.data.data);
    } catch (error) {
      console.error("Error fetching zone name:", error);
    }
  };

  useEffect(() => {
    setLoading(false);
    fetchZonNames();
  }, []);

  const handleWarehousePdf = () => {
    setPdfType("Warehouse");
    setOpenDialog(true);
  };

  const handleDeliveryPdf = () => {
    setPdfType("Delivery");
    setOpenDialog(true);
    console.log("Grid item clicked!");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseCreditDialog = () => {
    setCreditDialogOpen(false);
  };

  const downloadInvoice = async (data, invoiceDate, area) => {
    const doc = new jsPDF();
    const date = moment(invoiceDate).format("DD/MM/YYYY");
    const companyName = "Sri Krishna Agencies";
    const shopArea = area;

    const invoiceNumberX = 15;
    const dateY = 35;
    const companyNameX = 150;
    const companyNameY = 30;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Sales List", 15, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, invoiceNumberX, dateY);
    if (shopArea) {
      doc.text(`Shop Area: ${shopArea}`, invoiceNumberX, dateY + 10);
    }
    doc.setFont("helvetica", "bold");
    doc.text(companyName, companyNameX, companyNameY);

    const columns = [
      { header: "S.No", dataKey: "serialNo" },
      { header: "Product", dataKey: "productName" },
      { header: "Quantity", dataKey: "quantity" },
      { header: "Price", dataKey: "price" },
      { header: "Total", dataKey: "total" },
    ];

    const rows = data.map((product, index) => ({
      serialNo: index + 1,
      productName: product.name,
      quantity: product.quantity,
      price: product.currentPrice,
      total: parseFloat(
        Number(product.currentPrice) * Number(product.quantity)
      ).toFixed(2),
    }));

    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      startY: companyNameY + 20,
      columnStyles: { 2: { halign: "center" } },
    });

    const totalAmount = data.reduce(
      (sum, product) =>
        sum +
        parseFloat(Number(product.currentPrice) * Number(product.quantity)),
      0
    );
    doc.setFont("helvetica", "bold");
    doc.text("Total", companyNameX + 10, doc.autoTableEndPosY() + 10);
    doc.setFont("helvetica", "normal");
    doc.text(
      totalAmount.toFixed(2),
      companyNameX + 30,
      doc.autoTableEndPosY() + 10
    );

    doc.save("SaleList.pdf");
    setSuccess(true);
    setOpenErrorAlert(true);
    setErrorInfo("Invoice generated successfully");
  };

  async function fetchInvoicesByDate(createdAt) {
    try {
      const response = await axios.get("/api/get-all-invoices-by-date", {
        params: {
          createdAt: createdAt,
        },
      });
      downloadInvoice(response.data.data, response.data.invoiceDate);
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
      throw error;
    }
  }

  async function fetchProductsBasedOnArea(data) {
    try {
      const response = await axios.get("/api/get-products/based-on-area", {
        params: {
          invoiceDate: data.date,
          area: data.shopArea,
        },
      });
      downloadInvoice(
        response.data.data,
        response.data.invoiceDate,
        response.data.invoiceArea
      );
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
      throw error;
    }
  }

  const handleSubmitDialog = async () => {
    if (pdfType === "Warehouse") {
      const date = document.getElementById("invoiceDate").value;
      console.log(date);
      fetchInvoicesByDate(date);
    } else {
      const date = document.getElementById("invoiceDate").value;
      const shopArea = document.getElementById("shopArea").value;
      fetchProductsBasedOnArea({ date, shopArea });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/shops/debitcredit");
      const data = response.data;
      const creditData = data.filter((item) => item.status === "Credit");
      const debitData = data.filter((item) => item.status === "Debit");
      setCredit(creditData);
      setDebit(debitData);
      setFilteredCredit(creditData);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );
      setShops(response.data);
      const zoneNames = response.data
        .map((v) => v.ZONNAM)
        .filter((name) => name);
      const uniqueZoneNames = [...new Set(zoneNames)];
      setZoneNames(uniqueZoneNames);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchShops();
  }, []);

  const handleCreditClick = () => {
    setCreditDialogOpen(true);
  };

  const handleSearch = () => {
    let filtered = credit;
    if (selectedInvoiceNumber) {
      filtered = filtered.filter(
        (item) => item.invoiceNumber === selectedInvoiceNumber
      );
    }
    if (selectedShopId) {
      filtered = filtered.filter((item) => item.shopId === selectedShopId);
    }
    setFilteredCredit(filtered);
  };

  const uniqueInvoiceNumbers = [
    ...new Set(credit.map((item) => item.invoiceNumber)),
  ];
  const uniqueShopIds = [...new Set(credit.map((item) => item.shopId))];

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12} onClick={handleCreditClick}>
            <TotalOrderLineChartCard
              isLoading={isLoading}
              count={credit.length}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid
                item
                sm={6}
                xs={12}
                md={6}
                lg={12}
                onClick={handleWarehousePdf}
                style={{ cursor: "pointer" }}
              >
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid
                item
                sm={6}
                xs={12}
                md={6}
                lg={12}
                onClick={handleDeliveryPdf}
                style={{ cursor: "pointer" }}
              >
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DialogTemplate
        open={openDialog}
        title={"Day Sales List"}
        type={"Bill"}
        body={
          <>
            {pdfType === "Warehouse" ? (
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                id="invoiceDate"
                name="invoiceDate"
              />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    id="invoiceDate"
                    name="invoiceDate"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    options={zoneNames}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} label="zones" />
                    )}
                    fullWidth
                    id="shopArea"
                    placeholder="Area"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}
          </>
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
      <Dialog
        open={creditDialogOpen}
        onClose={handleCloseCreditDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Credit Data</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Autocomplete
                options={uniqueInvoiceNumbers}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Invoice Number"
                    variant="outlined"
                  />
                )}
                value={selectedInvoiceNumber}
                onChange={(event, newValue) =>
                  setSelectedInvoiceNumber(newValue)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                options={uniqueShopIds}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                  <TextField {...params} label="Shop ID" variant="outlined" />
                )}
                value={selectedShopId}
                onChange={(event, newValue) => setSelectedShopId(newValue)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} style={{ marginTop: "16px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Shop ID</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCredit.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{item.shopId}</TableCell>
                    <TableCell>{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreditDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
