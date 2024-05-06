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

export default function InvoiceTemplate({ data }) {
  console.log(data, "in invoice pdf");
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

        {/* Add more gap */}
        <div style={{ marginBottom: "24px" }}></div>

        <TableContainer>
          <Table size="small" aria-label="invoice table">
            <TableHead>
              <TableRow>
                <TableCell>Items</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Sample data rows */}
              <TableRow>
                <TableCell>Item 1</TableCell>
                <TableCell>Description 1</TableCell>
                <TableCell align="right">2</TableCell>
                <TableCell align="right">$10</TableCell>
                <TableCell align="right">$2</TableCell>
                <TableCell align="right">$24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Item 2</TableCell>
                <TableCell>Description 2</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">$20</TableCell>
                <TableCell align="right">$4</TableCell>
                <TableCell align="right">$24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Item 3</TableCell>
                <TableCell>Description 3</TableCell>
                <TableCell align="right">2</TableCell>
                <TableCell align="right">$10</TableCell>
                <TableCell align="right">$2</TableCell>
                <TableCell align="right">$24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Item 4</TableCell>
                <TableCell>Description 4</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">$20</TableCell>
                <TableCell align="right">$4</TableCell>
                <TableCell align="right">$24</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} style={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  $96
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
