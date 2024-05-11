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
  import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
  import { useEffect, useRef, useState } from "react";
  import jsPDF from "jspdf";
  import 'jspdf-autotable';
  import moment from "moment";
  
  export default function SupplierViewInvoice({ data }) {
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const supplierInvoiceRef = useRef(null);
      const supplierHeaderRef = useRef(null);
      console.log(data);
    const fetchInvoiceProducts = async (products) => {
      try {
        const response = await axios.post('/api/invoice/products', { products });
        setInvoiceProducts(response.data.data)
      } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error;
      }
    }
  
    const totalProductAmount = (data) => {
      const total = data.reduce((acc, cur) => {
        return acc + (Number(cur.SPRICE) * Number(cur.quantity));
      }, 0)
      return total;
    }
  
    const downloadInvoice = async () => {
      const doc = new jsPDF();
      const invoiceElement = supplierInvoiceRef.current;
      const invoiceHeaderElement = supplierHeaderRef.current;
      // Product table
      const table = invoiceElement.querySelector('table');
      // Define content
      const invoiceNumber = data.original?.invoiceNumber;
      const date = moment(data?.original?.invoiceDate).format('DD/MM/YYYY');
      const companyName = "Sri Krishna Agencies";
      const customerName = data?.original?.supplier?.cName;
      const address = (data?.original?.address || "");
  
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
      doc.text(`Invoice Number: ${invoiceNumber}`, invoiceNumberX, invoiceNumberY);
      doc.text(`Date: ${date}`, invoiceNumberX, dateY);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, companyNameX, companyNameY);
  
      doc.setFillColor("#f5f5f5");
      doc.rect(15, 50, 180, 50, "F");
  
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Info", customerInfoX + customerInfoPaddingX, customerInfoY + 5);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Supplier Name: ${customerName}`, customerInfoX + customerInfoPaddingX, customerInfoY + 15);
      doc.text(`Address: ${address}`, customerInfoX + customerInfoPaddingX, customerInfoY + 20);
  
      // Product table with custom options to control the footer
      doc.autoTable({ html: table, startY: invoiceHeaderElement.offsetHeight - 130, columnStyles: { 2: { halign: 'center' } } });
  
      // Total amount
      doc.setFont("helvetica", "bold");
      doc.text('total', companyNameX - 5, doc.autoTableEndPosY() + 10);
      doc.setFont("helvetica", "normal");
      doc.text(parseFloat(totalProductAmount(invoiceProducts)).toFixed(2), companyNameX + 30, doc.autoTableEndPosY() + 10);
      // Payment Notes Section
      const paymentNotesText = "Payment Notes";
      const paymentNotesY = doc.autoTableEndPosY() + 15;
      doc.setFontSize(10);
      doc.text(paymentNotesText, 15, paymentNotesY);
      doc.setDrawColor('#cccccc');
      doc.rect(15, paymentNotesY + doc.getTextDimensions(paymentNotesText).h + 5, doc.internal.pageSize.getWidth() - 18, 35, 'D');
  
      // Customer Signature Section
      const signatureText = "Supplier Signature";
      const signatureY = paymentNotesY + doc.getTextDimensions(paymentNotesText).h + 60;
      doc.setFontSize(10);
      doc.text(signatureText, 15, signatureY);
      doc.save('invoice.pdf');
    };
  
    useEffect(() => {
      fetchInvoiceProducts(data.original.products);
    }, [])
  
    return (
      <Container maxWidth="md">
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Tooltip placement="top" title="Download">
            <Fab onClick={() => downloadInvoice()} variant="circle" size="small" sx={{ background: '#b06dd4', color: '#FFFFFF', '&:hover': { background: '#b06dd4' } }}>
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
          ref={supplierInvoiceRef}
        >
          <Box ref={supplierHeaderRef}>
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
                  Date: {moment(data?.original?.invoiceDate).format('DD/MM/YYYY')}
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
                  Customer Information
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "8px" }}>
                  <strong>Supplier Name:</strong> {data?.original?.supplier?.cName}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "8px" }}>
                  <strong>Address:</strong>{" "}
                  {data?.original?.address || ""}
                </Typography>
                // <Typography variant="body1">
                //   <strong>Phone Number:</strong> {data?.original?.shop?.TELNUM}
                // </Typography>
                {/* Add more customer details as needed */}
              </CardContent>
            </Card>
          </Box>
  
          {/* Add more gap */}
          <div style={{ marginBottom: "24px" }}></div>
  
          <TableContainer className="product-list">
            <Table size="small" aria-label="invoice table">
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceProducts.map((data, index) => {
                  const sNo = index + 1;
                  return (
                    <TableRow key={data.ID}>
                      <TableCell>{sNo}</TableCell>
                      <TableCell>{data.NAME}</TableCell>
                      <TableCell align="center">{data.quantity}</TableCell>
                      <TableCell align="right">{data.SPRICE}</TableCell>
                      <TableCell align="right">{parseFloat(Number(data.SPRICE) * Number(data.quantity)).toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <TableFooter>
              <TableRow sx={{ color: 'black' }}>
                <TableCell colSpan={4} style={{ fontWeight: "bold", width: '100%', textAlign: 'end', pr: '39px' }}>
                  Total
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  {parseFloat(totalProductAmount(invoiceProducts)).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </TableContainer>
  
          {/* Payment details */}
  
          <div className="summary" style={{ marginTop: "24px" }}>
            <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
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
              Supplier Signature
            </Typography>
            {/* Add signature area */}
            {/* You can use a SignaturePad component or any other method to capture the signature */}
          </div>
        </Paper>
      </Container>
    );
  }
  