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

export default function InvoiceTemplate({ data, type }) {
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const invoiceRef = useRef(null);
  const invoiceHeaderRef = useRef(null);
  console.log(invoiceProducts);
  const fetchInvoiceProducts = async (products) => {
    try {
      const response = await axios.post(
        "https://api-skainvoice.top/api/invoice/products",
        { products }
      );
      console.log(response);
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
    const doc = new jsPDF();
    const invoiceElement = invoiceRef.current;
    const invoiceHeaderElement = invoiceHeaderRef.current;
    // Product table
    const table = invoiceElement.querySelector("table");
    // Define content
    const invoiceNumber = data.original?.invoiceNumber;
    const date = moment(data?.original?.invoiceDate).format("DD/MM/YYYY");
    const companyName = "Sri Krishna Agencies";
    const customerName = data?.original?.shop?.CUSNAM;
    const address =
      (data?.original?.shop?.ADRONE || "") +
      (data?.original?.shop?.ADRTWO || "") +
      (data?.original?.shop?.ADRTHR || "");
    const phoneNumber = data?.original?.shop?.TELNUM;

    // Define positions
    const invoiceNumberX = 15;
    const invoiceNumberY = 30;
    const dateY = 35;
    const companyNameX = 150;
    const companyNameY = 30;
    const customerInfoX = 15;
    const customerInfoY = 58;
    const customerInfoPaddingX = 10; // Padding for Customer Info rectangle

    // Draw text content
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 15, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Invoice Number: ${invoiceNumber}`,
      invoiceNumberX,
      invoiceNumberY
    );
    doc.text(`Date: ${date}`, invoiceNumberX, dateY);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, companyNameX, companyNameY);

    doc.setFillColor("#f5f5f5");
    doc.rect(15, 50, 180, 50, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Customer Info",
      customerInfoX + customerInfoPaddingX,
      customerInfoY + 5
    );
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Customer Name: ${customerName}`,
      customerInfoX + customerInfoPaddingX,
      customerInfoY + 15
    );
    doc.text(
      `Address: ${address}`,
      customerInfoX + customerInfoPaddingX,
      customerInfoY + 20
    );
    doc.text(
      `Phone Number: ${phoneNumber}`,
      customerInfoX + customerInfoPaddingX,
      customerInfoY + 25
    );

    // Product table with custom options to control the footer
    doc.autoTable({
      html: table,
      startY: invoiceHeaderElement.offsetHeight - 130,
      columnStyles: { 2: { halign: "center" } },
    });

    // Total amount
    doc.setFont("helvetica", "bold");
    doc.text("total", companyNameX - 5, doc.autoTableEndPosY() + 10);
    doc.setFont("helvetica", "normal");
    doc.text(
      parseFloat(totalProductAmount(invoiceProducts)).toFixed(2),
      companyNameX + 30,
      doc.autoTableEndPosY() + 10
    );
    // Payment Notes Section
    const paymentNotesText = "Payment Notes";
    const paymentNotesY = doc.autoTableEndPosY() + 15;
    doc.setFontSize(10);
    doc.text(paymentNotesText, 15, paymentNotesY);
    doc.setDrawColor("#cccccc");
    doc.rect(
      15,
      paymentNotesY + doc.getTextDimensions(paymentNotesText).h + 5,
      doc.internal.pageSize.getWidth() - 30,
      35,
      "D"
    );

    // Customer Signature Section
    const signatureText = "Customer Signature";
    const signatureY =
      paymentNotesY + doc.getTextDimensions(paymentNotesText).h + 60;
    doc.setFontSize(10);
    doc.text(signatureText, 15, signatureY);
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
                {`${data?.original?.shop?.ADRONE || ""} ${
                  data?.original?.shop?.ADRTWO || ""
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
