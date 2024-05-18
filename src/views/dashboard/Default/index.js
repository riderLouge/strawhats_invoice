import { useEffect, useRef, useState } from "react";

// material-ui
import { Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";

// project imports
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

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [pdfType, setPdfType] = useState("");
  useEffect(() => {
    setLoading(false);
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
  const downloadInvoice = async (data, invoiceDate) => {
    const doc = new jsPDF();

    // Define content
    const date = moment(invoiceDate).format("DD/MM/YYYY");
    const companyName = "Sri Krishna Agencies";

    // Define positions
    const invoiceNumberX = 15;
    const dateY = 35;
    const companyNameX = 150;
    const companyNameY = 30;

    // Draw text content
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Sales List", 15, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, invoiceNumberX, dateY);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, companyNameX, companyNameY);

    // Define table columns
    const columns = [
      { header: 'S.No', dataKey: 'serialNo' },
      { header: 'Product', dataKey: 'productName' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Price', dataKey: 'price' },
      { header: 'Total', dataKey: 'total' }
    ];

    // Generate table rows from data
    const rows = data.map((product, index) => ({
      serialNo: index + 1,
      productName: product.name,
      quantity: product.quantity,
      price: product.currentPrice,
      total: parseFloat(Number(product.currentPrice) * Number(product.quantity)).toFixed(2),
    }));

    // Product table with custom options to control the footer
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      startY: companyNameY + 20,
      columnStyles: { 2: { halign: 'center' } }
    });

    // Total amount
    const totalAmount = data.reduce((sum, product) => sum + parseFloat(Number(product.currentPrice) * Number(product.quantity)), 0);
    doc.setFont("helvetica", "bold");
    doc.text("Total", companyNameX + 10, doc.autoTableEndPosY() + 10);
    doc.setFont("helvetica", "normal");
    doc.text(
      totalAmount.toFixed(2),
      companyNameX + 30,
      doc.autoTableEndPosY() + 10
    );

    doc.save("SaleList.pdf");
  };


  // Function to fetch invoices based on createdAt date
  async function fetchInvoicesByDate(createdAt) {
    try {
      const response = await axios.get('https://api-skainvoice.top/api/get-all-invoices-by-date', {
        params: {
          createdAt: createdAt
        }
      });
      downloadInvoice(response.data.data, response.data.invoiceDate);
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
      throw error;
    }
  }

  const handleSubmitDialog = async () => {
    const date = document.getElementById("invoiceDate").value;
    fetchInvoicesByDate(date);
    setOpenDialog(false);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
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
                  <TextField
                    fullWidth
                    placeholder="Area"
                    type="text"
                    variant="outlined"
                    id="invoiceArea"
                    name="invoiceArea"
                  />
                </Grid>
              </Grid>
            )}
          </>
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
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
