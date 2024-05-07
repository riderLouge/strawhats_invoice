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
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function InvoiceTemplate({ data }) {
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const fetchInvoiceProducts = async (products) => {
    try {
      const response = await axios.post('/api/invoice/products', { products });
      console.log(response);
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

  useEffect(() => {
    fetchInvoiceProducts(data.original.products);
  }, [])
  console.log(invoiceProducts);
  return (
    <Container maxWidth="md">
      <Paper
        style={{
          backgroundColor: "#ffffff",
          padding: "24px",
          marginTop: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
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
              Date: {data.original?.invoiceDate}
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
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
              <strong>Shop Name:</strong> {data?.original?.shop?.CUSNAM}
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

        {/* Add more gap */}
        <div style={{ marginBottom: "24px" }}></div>

        <TableContainer>
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
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} style={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  {parseFloat(totalProductAmount(invoiceProducts)).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Payment details */}

        <div style={{ marginTop: "24px" }}>
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
            Customer Signature
          </Typography>
          {/* Add signature area */}
          {/* You can use a SignaturePad component or any other method to capture the signature */}
        </div>
      </Paper>
    </Container>
  );
}
