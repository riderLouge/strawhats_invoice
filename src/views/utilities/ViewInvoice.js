import {
  Container,
  Paper,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Divider,
  Card,
  CardContent,
  Fab,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import numberToWords from "../../utils/numberToWord";

export default function InvoiceTemplate({ data, type }) {
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const invoiceRef = useRef(null);
  const invoiceHeaderRef = useRef(null);
  const fetchInvoiceProducts = async (products) => {
    try {
      const response = await axios.post(
        "https://api-skainvoice.top/api/invoice/products",
        { products }
      );
      setInvoiceProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };

  const totalProductAmount = (data) => {
    const total = data.reduce((acc, cur) => {
      return acc + Number(cur.totalWithGST);
    }, 0);
    return total;
  };

  const downloadInvoice = async () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    console.log(data.original)
    const invoiceDetails = data.original;
    const companyName = "SRI KRISHNA AGENCIES";
    //Customer Info Details

    const customerName = invoiceDetails.shop.CUSNAM;
    const addressOne = invoiceDetails.shop.ADRONE;
    const addressTwo = invoiceDetails.shop.ADRTWO;
    const addressOneThree = invoiceDetails.shop.ADRTHR;
    const addressFour = invoiceDetails.shop.ADRFOU;

    const invoiceNumber = invoiceDetails.invoiceNumber;
    const invoiceDate = moment(invoiceDetails.invoiceDate).format('DD/MMM/YYYY');
    doc.setFontSize(16);
    doc.text(companyName, 3, 7);
    doc.setFontSize(16);
    doc.text("TAX INVOICE", 180, 7);
    doc.setFontSize(12);
    doc.text(companyName, 3, 15);
    doc.setFontSize(10);
    doc.text("110E, NEHRU STREET, SHENBAKKAM,", 3, 20);
    doc.text("VELLORE-632013", 3, 25);
    doc.text("CELL NO. 9849179475, 9171235600", 3, 30);

    //Customer Info (Top Section)
    doc.setFontSize(12);
    doc.text(customerName, 100, 15);
    doc.setFontSize(10);
    doc.text(addressOne, 100, 20);
    doc.text(addressTwo, 100, 25);
    doc.text(addressOneThree, 100, 30);
    doc.text(addressFour, 100, 35);

    doc.setLineDash([1, 1], 0);
    doc.line(0, 42, doc.internal.pageSize.width, 42);
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`BNo: ${invoiceNumber}`, 70, 50);
    doc.text(`Date: ${invoiceDate}`, 110, 50);

    doc.setLineDash([1, 1], 0);
    doc.line(0, 55, doc.internal.pageSize.width, 55);
    const productData = invoiceDetails.products.map((product, index) => {
      const sNo = index + 1;
      const amount = product.rate * product.quantity;
      return [
        sNo,
        product.productName,
        product.hsnNumber,
        product.mrp,
        product.quantity,
        "",
        product.rate,
        amount,
        product.gst,
        product.totalWithGST,
        product.productCurrentPrice,
      ]
    });
    console.log(productData);
    // Product Table
    doc.autoTable({
      startY: 57,
      head: [['S.No', 'Item Name', 'HSN Code', 'MRP', 'QTY', 'FREE', 'RATE', 'AMOUNT', 'GST %', 'GST AMT', 'Net Rate']],
      body: productData,
      theme: 'plain',
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 10 },
        5: { cellWidth: 12 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 },
        8: { cellWidth: 13 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 },
      },
      margin: { left: 0, right: 0 }, // Remove left and right margins
      tableWidth: 'wrap',
      didDrawCell: (data) => {
        // Dotted Line Below Each Row
        if (data.row.index === data.table.body.length - 1) {
          doc.setLineDash([1, 1], 0);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      }
    });

    // dot line for header
    doc.setLineDash([1, 1], 0);
    doc.line(0, 64, doc.internal.pageSize.width, 64);

    // Total Calculation Section (Bottom Section)
    const finalY = doc.lastAutoTable.finalY + 10;
    const pageHeight = doc.internal.pageSize.getHeight();
    console.log(finalY, pageHeight)
    const bottomContentHeight = pageHeight - 50;
    if (finalY > pageHeight - 50) {
      doc.addPage();
    }
    // Horizontal Dotted Line Below Total Section
    doc.setLineDash([1, 1], 0);
    doc.line(0, bottomContentHeight - 5, doc.internal.pageSize.width, bottomContentHeight - 5);

    const topContentHeight = bottomContentHeight + 5;
    doc.setFontSize(10);
    doc.text(`For ${companyName}`, 3, topContentHeight);
    doc.setFontSize(10);
    doc.text("Authorized Signatory", 3, doc.internal.pageSize.height - 10);
    doc.setLineDash([1, 1], 0);
    doc.line(55, bottomContentHeight - 2, 55, doc.internal.pageSize.height - 10);


    const handleBillFooter = (value, yAxis = 17) =>{
      doc.text("222", 57, topContentHeight + yAxis);
      doc.text("222", 73, topContentHeight + yAxis);
      doc.text("222", 86, topContentHeight + yAxis);
      doc.text("222", 100, topContentHeight + yAxis);
      doc.text("222", 113, topContentHeight + yAxis);
      doc.text("222", 125, topContentHeight + yAxis);
      doc.text("222", 140, topContentHeight + yAxis);
    }


    doc.setFontSize(10);
    doc.text("Taxable", 57, topContentHeight);
    // doc.text("222", 57, topContentHeight + 17);
    doc.text("SGST", 73, topContentHeight);
    // doc.text("222", 73, topContentHeight + 17);
    doc.text("Tax", 86, topContentHeight);
    // doc.text("222", 86, topContentHeight + 17);
    doc.text("CGST", 100, topContentHeight);
    // doc.text("222", 100, topContentHeight + 17);
    doc.text("Tax", 113, topContentHeight);
    // doc.text("222", 113, topContentHeight + 17);
    doc.text("Cess", 125, topContentHeight);
    // doc.text("222", 125, topContentHeight + 17);
    doc.text("Cess", 140, topContentHeight);
    // doc.text("222", 140, topContentHeight + 17);
    doc.text("Total GST & Val:", 150, topContentHeight);
    doc.text("10044.3", 185, topContentHeight);
    doc.text("76869.32", 205, topContentHeight);

    handleBillFooter("x")

    const amount = numberToWords("510");

    doc.text(amount, 57, doc.internal.pageSize.height - 18);
    doc.setLineDash([1, 1], 0);
    doc.line(153, topContentHeight + 15, 180, topContentHeight + 15);
    doc.text("Net Amount : 510.00", 153, topContentHeight + 23);
    doc.text(`Total : 510`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 40);

    doc.text("Signature", doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 18);

    // Vertical Dotted Line on the Right Side
    doc.setLineDash([1, 1], 0); // Set line style to dotted
    doc.line(230, 0, 230, doc.internal.pageSize.height - 15);  // Vertical line covering the entire height of the page
    // Company and Customer Info (Top Section)
    doc.setFontSize(10);
    doc.text(companyName, 233, 5);
    doc.setFontSize(10);
    doc.text("VELLORE-632013", 233, 10);
    doc.setFontSize(10);
    doc.text("CEL: 9849179475", 263, 10);
    doc.setLineDash([1, 1], 0);
    doc.line(237, 15, doc.internal.pageSize.width - 10, 15);
    doc.setFontSize(10);
    doc.text(customerName, 233, 25);
    doc.setFontSize(10);
    doc.text(addressOne, 233, 30);
    doc.text(addressTwo, 233, 35);
    doc.text(addressOneThree, 233, 40);
    doc.text(addressFour, 233, 45);

    //bill no

    doc.setFontSize(10);
    doc.text(`BNo: ${invoiceNumber}`, 233, 50);
    doc.text(`Date: ${invoiceDate}`, 260, 50);

    const supplierProductData = invoiceDetails.products.map((product) => {
      return [
        product.productName,
        product.quantity,
      ]
    });
    // Product Table
    doc.autoTable({
      startY: 57,
      head: [['Item Name', 'QTY']],
      body: supplierProductData,
      theme: 'plain',
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 10 },
      },
      margin: { left: 232, right: 0 }, // Remove left and right margins
      tableWidth: 'wrap',
      didDrawCell: (data) => {
        // Dotted Line Below Each Row
        if (data.row.index === data.table.body.length - 1) {
          doc.setLineDash([1, 1], 0);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      }
    });

    doc.save("invoice.pdf");
  };



  useEffect(() => {
    fetchInvoiceProducts(data.original.products);
  }, []);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Tooltip placement="top" title="Download">
          <Fab
            onClick={() => downloadInvoice()}
            variant="circle"
            size="small"
            sx={{
              background: "#b06dd4",
              color: "#FFFFFF",
              "&:hover": { background: "#b06dd4" },
            }}
          >
            <DownloadRoundedIcon />
          </Fab>
        </Tooltip>
      </Box>
      <Paper
        sx={{
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "8px",
          pb: 5,
        }}
        ref={invoiceRef}
      >
        <Box ref={invoiceHeaderRef}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <Typography variant="h3" gutterBottom>
                INVOICE
              </Typography>
              <Typography variant="body1">
                Invoice Number: {data.original?.invoiceNumber}
                <br />
                Date: {moment(data?.original?.invoiceDate).format("DD/MM/YYYY")}
              </Typography>
            </div>
            <Typography
              variant="h3"
              style={{ fontWeight: "bold", color: "black" }}
            >
              Sri Krishna Agencies
            </Typography>
          </div>

          <Card
            variant="outlined"
            style={{
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                style={{ fontWeight: "bold", marginBottom: "16px" }}
              >
                {type} Information
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "8px" }}>
                <strong>{type} Name:</strong> {data?.original?.shop?.CUSNAM}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "8px" }}>
                <strong>Address:</strong>{" "}
                {`${data?.original?.shop?.ADRONE || ""} ${data?.original?.shop?.ADRTWO || ""
                  } ${data?.original?.shop?.ADRTHR || ""}`}
              </Typography>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {data?.original?.shop?.TELNUM}
              </Typography>
              {/* Add more customer details as needed */}
            </CardContent>
          </Card>
        </Box>

        {/* Add more gap */}
        <div style={{ marginBottom: "24px" }}></div>

        <TableContainer>
          <Table size="small" aria-label="invoice table">
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="center">HSN</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Gst</TableCell>

                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceProducts.map((data, index) => {
                const sNo = index + 1;
                return (
                  <TableRow key={data.productId}>
                    <TableCell>{sNo}</TableCell>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell align="center">{data.hsnNumber}</TableCell>
                    <TableCell align="center">{data.quantity}</TableCell>
                    <TableCell align="center">{data.gst}</TableCell>
                    <TableCell align="right">{data.rate}</TableCell>
                    <TableCell align="right">
                      {parseFloat(Number(data.totalWithGST)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TableFooter>
            <TableRow sx={{ color: "black" }}>
              <TableCell
                colSpan={4}
                style={{
                  fontWeight: "bold",
                  width: "100%",
                  textAlign: "end",
                  pr: "39px",
                }}
              >
                Total
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                {parseFloat(totalProductAmount(invoiceProducts)).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </TableContainer>

        {/* Payment details */}
        {type === "Customer" ? (
          <div style={{ marginTop: "24px" }}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              Payment Notes
            </Typography>
            <div
              style={{
                border: "1px solid #ccc",
                width: "100%",
                height: "100px",
                marginTop: "8px",
              }}
            ></div>
            <Divider style={{ marginTop: "20px" }} />

            <Typography
              variant="h6"
              gutterBottom
              style={{ fontWeight: "bold", marginTop: "16px" }}
            >
              Customer Signature
            </Typography>
          </div>
        ) : null}
      </Paper>
    </Container>
  );
}
