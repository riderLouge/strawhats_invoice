import { useEffect, useState } from "react";
import {
  Autocomplete,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  TablePagination,
  MenuItem,
  Stack
} from "@mui/material";
import ExcelJS from 'exceljs';
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
import { CreditCard } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import MonthYearSelector from "../../../ui-component/MonthYearSelector";

const Dashboard = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [pdfType, setPdfType] = useState("");
  const [zoneNames, setZoneNames] = useState([]);
  const [credit, setCredit] = useState([]);
  const [debit, setDebit] = useState([]);
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [searchBy, setSearchBy] = useState("invoice"); 
  const [selectedZoneName, setSelectedZoneName] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [openEarningCard, setOpenEarningCard] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [typeName, setTypeName] = useState('');
  const [excelData, setExcelData] = useState('');

  const handleClickOpenEarningCard = () => {
    setOpenEarningCard(true);
  };

  const handleCloseEarningCard = () => {
    setOpenEarningCard(false);
  };
  const fetchZonNames = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/get-all-zone-name"
      );
      setZoneNames(response.data.data);
      const debitcreditResponse = await axios.get(
        "https://api-skainvoice.top/api/shops/debitcredit"
      );
      const data = debitcreditResponse.data;
      const creditData = data.filter((item) => item.status === "Credit");
      const debitData = data.filter((item) => item.status === "Debit");
      const fetchItemsResponse = await axios.get(
        "https://api-skainvoice.top/api/shops/fetchItems"
      );

      const updatedCredit = creditData.map((creditItem) => {
        const matchingShop = fetchItemsResponse.data.find(
          (shop) => shop.shopId === creditItem.shopId
        );
        if (matchingShop) {
          console.log(matchingShop);
          // Update credit item with additional data from matching shop
          return {
            ...creditItem,
            shopName: matchingShop.CUSNAM,
            zoneName: matchingShop.ZONNAM,
          };
        }
        return creditItem; // Return original credit item if no match found
      });
      console.log("updatedCredit =",updatedCredit)
      setCredit(updatedCredit);
      setDebit(debitData);
      setFilteredData(creditData);
      console.log(updatedCredit, "00000");
    } catch (error) {
      console.error("Error fetching zone name:", error);
    }
  };

  
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

  const downloadInvoice = async (data, invoiceDate, area, allInvoices) => {
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
      price: product.rate,
      total: parseFloat(
        Number(product.rate) * Number(product.quantity)
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
        sum + parseFloat(Number(product.rate) * Number(product.quantity)),
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
    doc.addPage();
    let currentY = 20;

    for (let invoice of allInvoices) {
      const invoiceNumber = invoice.invoiceNumber;
      const date = moment(invoice.invoiceDate).format("DD/MM/YYYY");
      const customerName = invoice.shop?.CUSNAM;
      const address =
        (invoice.shop?.ADRONE || "") +
        (invoice.shop?.ADRTWO || "") +
        (invoice.shop?.ADRTHR || "");
      const phoneNumber = invoice.shop?.TELNUM;
      const totalAmount = invoice.products.reduce(
        (sum, product) =>
          sum + parseFloat(Number(product.rate) * Number(product.quantity)),
        0
      );

      // Define positions
      const invoiceNumberX = 15;
      const customerInfoX = 15;
      const customerInfoPaddingX = 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Number: ${invoiceNumber}`, invoiceNumberX, currentY);
      currentY += 5;
      doc.text(`Date: ${date}`, invoiceNumberX, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, companyNameX, currentY - 5);
      currentY += 10;

      doc.setFillColor("#f5f5f5");
      doc.rect(15, currentY, 180, 40, "F");
      currentY += 10;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Info", customerInfoX + customerInfoPaddingX, currentY);
      currentY += 5;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Customer Name: ${customerName}`, customerInfoX + customerInfoPaddingX, currentY);
      currentY += 5;
      doc.text(`Address: ${address}`, customerInfoX + customerInfoPaddingX, currentY);
      currentY += 5;
      doc.text(`Phone Number: ${phoneNumber}`, customerInfoX + customerInfoPaddingX, currentY);
      currentY += 5;
      doc.text(`Total Amount: ${parseFloat(totalAmount).toFixed(2)}`, customerInfoX + customerInfoPaddingX, currentY);
      currentY += 20;

      // Payment Notes Section
      const paymentNotesText = "Payment Notes";
      doc.setFontSize(10);
      doc.text(paymentNotesText, 15, currentY);
      doc.setDrawColor("#cccccc");
      currentY -= 1;
      doc.rect(
        15,
        currentY + 15,
        doc.internal.pageSize.getWidth() - 30, // Reduced width
        35,
        "D"
      );
      currentY += 55;

      // Customer Signature Section
      const signatureText = "Customer Signature";
      doc.setFontSize(10);
      doc.text(signatureText, 15, currentY + 10);
      currentY += 20;

      // Check if we need a new page
      if (currentY > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        currentY = 20; // Reset Y position for the new page
      }
    }
    doc.save("SaleList.pdf");
    setSuccess(true);
    setOpenErrorAlert(true);
    setErrorInfo("Invoice generated successfully");
  };

  async function fetchInvoicesByDate(createdAt) {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/get-all-invoices-by-date",
        {
          params: {
            createdAt: createdAt,
          },
        }
      );
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
      const response = await axios.get(
        "/api/get-products/based-on-area",
        {
          params: {
            invoiceDate: data.date,
            area: data.shopArea,
          },
        }
      );
      downloadInvoice(
        response.data.data,
        response.data.invoiceDate,
        response.data.invoiceArea,
        response.data.allInvoices,
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
      fetchInvoicesByDate(date);
    } else {
      const date = document.getElementById("invoiceDate").value;
      const shopArea = document.getElementById("shopArea").value;
      fetchProductsBasedOnArea({ date, shopArea });
    }
  };

  useEffect(() => {
    fetchZonNames();
    setLoading(false);
  }, []);

  const handleCreditClick = () => {
    setCreditDialogOpen(true);
  };
  const handleSearch = () => {
    // Filter data based on selected criteria
    let newData = [...credit];

    if (searchBy === "invoice" && selectedInvoiceNumber) {
      newData = newData.filter(
        (item) => item.invoiceNumber === selectedInvoiceNumber
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

  const zoneOptions = credit
    .filter((item) => item.shopName === selectedShopId)
    .map((item) => item.zoneName)
    .filter((name, index, self) => self.indexOf(name) === index);

  const shopOptions = credit
    .filter((item) => item.zoneName === selectedZoneName)
    .map((item) => item.shopName)
    .filter((name, index, self) => self.indexOf(name) === index);

  const uniqueInvoiceNumbers = [
    ...new Set(credit.map((item) => item.invoiceNumber)),
  ];
  const uniqueShopIds = [...new Set(credit.map((item) => item.shopId))];

  const handleToggle = (event, newSearchBy) => {
    if (newSearchBy !== null) {
      setSearchBy(newSearchBy);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToDisplay = credit.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const processAndDownloadExcelSales = (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Data');

    // Add title in the first row and merge cells
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = 'SRI KRISHNA AGENCIES';
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.font = { bold: true };

    // Skip the second row
    worksheet.addRow([]);

    // Extract month and year from the first invoice date
    const firstInvoiceDate = new Date(data[0][Object.keys(data[0])[0]].sales[0].products[0].invoiceDate);
    const month = firstInvoiceDate.toLocaleString('default', { month: 'long' });
    const year = firstInvoiceDate.getFullYear();

    // Add header with dynamic date in the third row and merge cells
    const headerRow = worksheet.getRow(3);
    headerRow.getCell(1).value = `GST SALES DURING MONTH OF ${month} ${year} GSTIN: 33DBWPS2559L1ZQ`;
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.font = { bold: true };

    // Skip the fourth row
    worksheet.addRow([]);

    // Add table header in the fifth row and set background color to yellow
    const tableHeader = worksheet.getRow(5);
    tableHeader.values = [
        'S.No', 'Name of the Buyer', 'GSTIN', 'Invoice Number', 'Invoice Date',
        'HSN Code', 'Sales Value', 'GST %', 'SGST', 'CGST', 'IGST'
    ];
    worksheet.mergeCells(3, 1, 3, tableHeader.values.length); // Adjusted to merge the cells up to the 11th column (based on header length)
    worksheet.mergeCells(1, 1, 1, tableHeader.values.length); // Adjusted to merge the cells up to the 11th column (based on header length)
    tableHeader.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }, // Yellow fill
        };
        cell.font = { bold: true };
    });

    let sNo = 1;

    // Add empty row after header
    worksheet.addRow([]);

    // Track column widths
    const columnWidths = Array(tableHeader.values.length).fill(10); // Initialize with a default width of 10

    // Initialize totals
    let totalSalesValue = 0;
    let totalSGST = 0;
    let totalCGST = 0;
    let totalIGST = 0;

    // Initialize GST summary
    const gstSummary = {
        0: { basicValue: 0, sgst: 0, cgst: 0 },
        5: { basicValue: 0, sgst: 0, cgst: 0 },
        12: { basicValue: 0, sgst: 0, cgst: 0 },
        18: { basicValue: 0, sgst: 0, cgst: 0 }
    };

    data.forEach((item) => {
        const buyerName = Object.keys(item)[0];
        const buyerData = item[buyerName];
        const gstin = buyerData.Slno;

        buyerData.sales.forEach((sale) => {
            sale.products.forEach((product) => {
                const invoiceId = sale.invoiceId;
                const invoiceDate = product.invoiceDate.split('T')[0]; // Remove time zone
                const hsnNumber = product.hsnNumber;
                const salesValue = product.totalWithoutGST;
                const gst = parseFloat(product.gst);
                const isTamilNadu = gstin.startsWith('33'); // Tamil Nadu GSTIN starts with 33
                const sgst = isTamilNadu ? (gst / 2 / 100) * salesValue : 0;
                const cgst = isTamilNadu ? (gst / 2 / 100) * salesValue : 0;
                const igst = isTamilNadu ? 0 : (gst / 100) * salesValue;

                // Add to totals
                totalSalesValue += salesValue;
                totalSGST += sgst;
                totalCGST += cgst;
                totalIGST += igst;

                // Add to GST summary
                if (gstSummary[gst] !== undefined) {
                    gstSummary[gst].basicValue += salesValue;
                    gstSummary[gst].sgst += sgst;
                    gstSummary[gst].cgst += cgst;
                }

                const row = worksheet.addRow([
                    sNo++, buyerName, gstin, invoiceId, invoiceDate,
                    hsnNumber, salesValue, gst, sgst, cgst, igst
                ]);

                // Calculate the width of the column based on cell value length
                row.eachCell((cell, colNumber) => {
                    const cellValueLength = String(cell.value).length;
                    if (cellValueLength > columnWidths[colNumber - 1]) {
                        columnWidths[colNumber - 1] = cellValueLength;
                    }
                });
            });
        });
    });

    // Leave one row after the table
    worksheet.addRow([]);

    // Add total row
    const totalRow = worksheet.addRow([
        '', '', '', '', '', 'Total', totalSalesValue, '', totalSGST, totalCGST, totalIGST
    ]);

    // Make the total row bold
    totalRow.eachCell((cell) => {
        cell.font = { bold: true };
    });

    // Leave three rows after the table
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Add summary header
    const summaryHeaderRow = worksheet.addRow([`SUMMARY ${month.toUpperCase()} ${year} SALES`]);
    summaryHeaderRow.font = { bold: true };
    summaryHeaderRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(summaryHeaderRow.number, 1, summaryHeaderRow.number, tableHeader.values.length);

    // Leave one row after the summary header
    worksheet.addRow([]);

    // Add summary table header
    const summaryTableHeader = worksheet.addRow([
        'GST%', 'BASIC VALUE', 'SGST%', 'SGST TAX', 'CGST%', 'CGST TAX', 'TOTAL TAX', 'TOTAL VALUE'
    ]);
    summaryTableHeader.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }, // Yellow fill
        };
    });

    // Add summary data rows
    [0, 5, 12, 18].forEach((gst) => {
        const basicValue = gstSummary[gst].basicValue;
        const sgst = gstSummary[gst].sgst;
        const cgst = gstSummary[gst].cgst;
        const totalTax = sgst + cgst;
        const totalValue = basicValue + totalTax;

        worksheet.addRow([
            gst, basicValue, gst / 2, sgst, gst / 2, cgst, totalTax, totalValue
        ]);
    });

    // Dynamically determine the max row and column
    const maxRow = worksheet.lastRow.number;
    const maxColumn = tableHeader.values.length;

    // Set the column widths
    worksheet.columns.forEach((column, index) => {
        column.width = columnWidths[index] + 2; // Add some padding for better readability
    });

    // Write to file
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SalesData.xlsx';
        a.click();
    });
};

const processAndDownloadExcelPurchase = (data) => {
  const ExcelJS = require('exceljs'); // Ensure you have the ExcelJS library installed
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Purchase Data');

  // Add title in the first row and merge cells
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = 'PURCHASE DATA';
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
  titleRow.font = { bold: true };

  // Skip the second row
  worksheet.addRow([]);

  // Extract month and year from the first invoice date
  const firstInvoiceDate = new Date(data[0][Object.keys(data[0])[0]].sales[0].products[0].billDate);
  const month = firstInvoiceDate.toLocaleString('default', { month: 'long' });
  const year = firstInvoiceDate.getFullYear();

  // Add header with dynamic date in the third row and merge cells
  const headerRow = worksheet.getRow(3);
  headerRow.getCell(1).value = `PURCHASES DURING MONTH OF ${month} ${year}`;
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.font = { bold: true };

  // Skip the fourth row
  worksheet.addRow([]);

  // Add table header in the fifth row and set background color to yellow
  const tableHeader = worksheet.getRow(5);
  tableHeader.values = [
      'S.No', 'Supplier Name', 'Invoice Number', 'Bill Date',
      'Product Name', 'HSN Code', 'MRP', 'Rate', 'Quantity', 'Total Without GST', 
      'GST%', 'Total With GST', 'Payment Type'
  ];
  tableHeader.eachCell((cell) => {
      cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow fill
      };
      cell.font = { bold: true };
  });

  let sNo = 1;

  // Add empty row after header
  worksheet.addRow([]);

  // Initialize totals
  let totalPurchaseValue = 0;
  let totalGST = 0;

  data.forEach((item) => {
      const supplierName = Object.keys(item)[0];
      const supplierData = item[supplierName];

      supplierData.sales.forEach((sale) => {
          sale.products.forEach((product) => {
              const invoiceId = sale.invoiceId;
              const billDate = product.billDate.split('T')[0]; // Remove time zone
              const productName = product.productName;
              const hsnNumber = product.hsnNumber;
              const mrp = product.mrp;
              const rate = product.rate;
              const quantity = product.quantity;
              const totalWithoutGST = product.totalWithoutGST;
              const gst = parseFloat(product.gst);
              const totalWithGST = product.totalWithGST;
              const paymentType = product.paymentType;

              // Add to totals
              totalPurchaseValue += totalWithoutGST;
              totalGST += totalWithGST - totalWithoutGST;

              worksheet.addRow([
                  sNo++, supplierName, invoiceId, billDate,
                  productName, hsnNumber, mrp, rate, quantity, totalWithoutGST,
                  gst, totalWithGST, paymentType
              ]);
          });
      });
  });

  // Leave one row after the table
  worksheet.addRow([]);

  // Add total row
  const totalRow = worksheet.addRow([
      '', '', '', '', '', 'Total', '', '', '', totalPurchaseValue,
      '', totalGST, ''
  ]);

  // Make the total row bold
  totalRow.eachCell((cell) => {
      cell.font = { bold: true };
  });

  // Dynamically determine the max row and column
  const maxRow = worksheet.lastRow.number;
  const maxColumn = tableHeader.values.length;

  // Set the column widths
  worksheet.columns.forEach((column) => {
      column.width = 15; // Set a default width for readability
  });

  // Write to file
  workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PurchaseData.xlsx';
      a.click();
  });
};


  
  const handleSubmit = async (params) => {

    const apiUrl = '/api/products/by-date-report';
    try {
      const response = await axios.post(apiUrl, params);
      if (response.status === 200) {
        setSuccess(true);
        setOpenErrorAlert(true);
        setErrorInfo(response.data.message);
        if(params.typeName === 2){
          processAndDownloadExcelSales(response.data.data)
        }
        else if(params.typeName === 1){
          processAndDownloadExcelPurchase(response.data.data)
        }
      } else {
        setSuccess(false);
        setOpenErrorAlert(true);
        setErrorInfo(response.data.message);
      }
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
    }
  };
  
  const type = [
    { value: 1, label: 'Purchase Data' },
    { value: 2, label: 'Sales Data' },
    { value: 3, label: 'Sales Worksheet' },

  ];

  const handleTypeChange = (event) => {
    setTypeName(event.target.value);
  };

  const Params = {
    typeName,
    month,
    year,
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12} onClick={handleClickOpenEarningCard}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Dialog open={openEarningCard} onClose={handleCloseEarningCard} maxWidth="md" fullWidth>
            <DialogTitle>Purchase / Sales Report Download</DialogTitle>
            <DialogContent>
              <>
              <Grid container spacing={4} alignItems="center">
                  <>
                    <Grid item xs={4} lg={8}>
                      <Stack direction="row">
                      <TextField
                        select
                        label="Type"
                        value={typeName}
                        onChange={handleTypeChange}
                        fullWidth
                        margin="normal"
                      >
                        {type.map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <MonthYearSelector
                        year={year}
                        setYear={setYear}
                        month={month}
                        setMonth={setMonth}
                      />
                      </Stack>
                    </Grid>
                  </>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: theme.palette.primary.main }}
                    onClick={() => handleSubmit(Params)}
                  >
                    Download
                  </Button>
                </Grid>
              </Grid>
            </>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEarningCard}>Close</Button>
            </DialogActions>
          </Dialog>
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
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.primary.main,
            padding: "16px",
            marginBottom: "16px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px 4px 0 0",
            color: "white",
          }}
        >
          <CreditCard style={{ marginRight: "10px", color: "white" }} />
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "white" }}
          >
            Credit Data
          </Typography>
        </DialogTitle>
        <DialogContent>
          <ToggleButtonGroup
            value={searchBy}
            exclusive
            onChange={handleToggle}
            aria-label="search by"
            style={{ marginBottom: "16px" }}
          >
            <ToggleButton
              value="invoice"
              aria-label="invoice number"
              style={{
                padding: "8px 16px",
                textAlign: "center",
                border: "1px solid #ccc",
                backgroundColor:
                  searchBy === "invoice"
                    ? theme.palette.primary.main
                    : "#f0f0f0",
                color: searchBy === "invoice" ? "white" : "#333",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              Invoice Number
            </ToggleButton>
            <ToggleButton
              value="shop"
              aria-label="shop"
              style={{
                padding: "8px 16px",
                textAlign: "center",
                border: "1px solid #ccc",
                backgroundColor:
                  searchBy === "shop" ? theme.palette.primary.main : "#f0f0f0",
                color: searchBy === "shop" ? "white" : "#333",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              Shop
            </ToggleButton>
          </ToggleButtonGroup>
          <Grid container spacing={2} alignItems="center">
            {searchBy === "invoice" && (
              <Grid item xs={6}>
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
            )}
            {searchBy === "shop" && (
              <>
                <Grid item xs={4}>
                  <Autocomplete
                    options={credit
                      .map((item) => item.zoneName)
                      .filter(
                        (name, index, self) => self.indexOf(name) === index
                      )}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Zone Name"
                        variant="outlined"
                      />
                    )}
                    value={selectedZoneName}
                    onChange={(event, newValue) =>
                      setSelectedZoneName(newValue)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    options={credit
                      .map((item) => item.shopName)
                      .filter(
                        (name, index, self) => self.indexOf(name) === index
                      )}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shop Name"
                        variant="outlined"
                      />
                    )}
                    value={selectedShopId}
                    onChange={(event, newValue) => setSelectedShopId(newValue)}
                    fullWidth
                  />
                </Grid>
              </>
            )}
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: theme.palette.primary.main }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} style={{ marginTop: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Shop</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsToDisplay.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{item.shopName}</TableCell>
                    <TableCell>{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={credit.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
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