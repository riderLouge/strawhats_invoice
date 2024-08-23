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
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

    doc.setFontSize(16);
    doc.text("SRI KRISHNA AGENCIES", 3, 7);
    doc.setFontSize(16);
    doc.text("TAX INVOICE", 180, 7);
    // Company and Customer Info (Top Section)
    doc.setFontSize(12);
    doc.text("SRI KRISHNA AGENCIES", 3, 15);
    doc.setFontSize(10);
    doc.text("110E, NEHRU STREET, SHENBAKKAM,", 3, 20);
    doc.text("VELLORE-632013", 3, 25);
    doc.text("CELL NO. 9849179475, 9171235600", 3, 30);
    doc.text("GSTIN: 33AALKFA066D12M", 3, 35);

    doc.setFontSize(12);
    doc.text("To: M.K. FANCY", 100, 15);
    doc.setFontSize(10);
    doc.text("LONG BAZAAR (NR) S. KANNAN", 100, 20);
    doc.text("VELLORE-6380302783", 100, 25);

    doc.setLineDash([1, 1], 0);
    doc.line(0, 42, doc.internal.pageSize.width, 42);
    // Invoice Details
    doc.setFontSize(10);
    doc.text(`BNo.: G4803`, 70, 50);
    doc.text(`Date: 15/08/2024`, 110, 50);

    doc.setLineDash([1, 1], 0);
    doc.line(0, 55, doc.internal.pageSize.width, 55);

    // Product Table
    doc.autoTable({
      startY: 57,
      head: [['S.No', 'Item Name', 'HSN Code', 'MRP', 'QTY', 'FREE', 'RATE', 'AMOUNT', 'GST %', 'GST AMT', 'Net Rate']],
      body: [
        ['1', 'GATSBY H/SP EX HOLD 66ML MEN', '33059909', '115.00', '2', '2', '87.02', '174.04', '18%', '31.33', '205.37'],
        ['2', 'GATSBY H/SP SUPER HARD', '33059909', '120.00', '2', '2', '98.36', '196.72', '18%', '35.41', '232.13'],
        ['3', 'GATSBY H/SP SET WET HARD', '33059909', '138.00', '2', '2', '98.36', '196.72', '18%', '35.41', '232.13'],
        ['4', 'GATSBY H/SP SET WET ULT HARD', '33059909', '138.00', '2', '2', '0.00', '0.00', '18%', '0.00', '0.00'],
      ],
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
    doc.line(0, 65, doc.internal.pageSize.width, 65);

    // Total Calculation Section (Bottom Section)
    const finalY = doc.lastAutoTable.finalY + 10;
    // Horizontal Dotted Line Below Total Section
    doc.setLineDash([1, 1], 0);
    doc.line(0, finalY - 5, 290, finalY - 5);

    doc.text("Taxable", 15, finalY);
    doc.text("SGST", 50, finalY);
    doc.text("Tax", 85, finalY);
    doc.text("CGST", 120, finalY);
    doc.text("Tax Amt", 155, finalY);
    doc.text("Cess", 190, finalY);
    doc.text("Total GST % Val: 99.42", 225, finalY);
    doc.text("Total GST Amt: 49.71", 225, finalY + 5);
    doc.text("Total Amount: 652.00", 225, finalY + 10);



    // Footer
    doc.text("Rupees Six hundred fifty two only.", 15, finalY + 25);
    doc.text("Authorized Signatory", 160, finalY + 25);

    // Vertical Dotted Line on the Right Side
    doc.setLineDash([1, 1], 0); // Set line style to dotted
    doc.line(230, 0, 230, doc.internal.pageSize.height - 15);  // Vertical line covering the entire height of the page
    // Company and Customer Info (Top Section)
    doc.setFontSize(10);
    doc.text("SRI KRISHNA AGENCIES", 233, 5);
    doc.setFontSize(10);
    doc.text("VELLORE-632013", 233, 10);
    doc.setFontSize(10);
    doc.text("CEL: 9849179475", 263, 10);
    doc.setLineDash([1, 1], 0);
    doc.line(237, 15, doc.internal.pageSize.width - 10, 15);
    doc.setFontSize(10);
    doc.text("To: M.K. FANCY", 233, 25);
    doc.setFontSize(10);
    doc.text("LONG BAZAAR (NR) S. KANNAN", 233, 30);
    doc.text("VELLORE-6380302783", 233, 35);

    //bill no

    doc.setFontSize(10);
    doc.text(`BNo.: G4803`, 233, 50);
    doc.text(`Date: 15/08/2024`, 260, 50);

        // Product Table
    doc.autoTable({
      startY: 57,
      startX: 233,
      head: [['Item Name','QTY']],
      body: [
        ['GATSBY H/SP EX HOLD 66ML MEN', '2'],
        ['GATSBY H/SP SUPER HARD', '2'],
        ['GATSBY H/SP SET WET HARD', '2'],
        ['GATSBY H/SP SET WET ULT HARD', '2'],
      ],
      theme: 'plain',
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 10 },
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
