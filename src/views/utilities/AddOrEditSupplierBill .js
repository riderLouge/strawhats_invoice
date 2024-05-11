import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";

// material-ui
import { Box, Card, Grid, Button } from "@mui/material";
import DialogTemplate from "../../ui-component/Dialog";
import { MaterialReactTable } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";

// project imports
import SubCard from "../../ui-component/cards/SubCard";
import MainCard from "../../ui-component/cards/MainCard";
import SecondaryAction from "../../ui-component/cards/CardSecondaryAction";
import { gridSpacing } from "../../store/constant";
import InvoiceTemplate from "./ViewInvoice";
import axios from "axios";

const ShadowBox = ({ shadow }) => (
  <Card sx={{ mb: 3, boxShadow: shadow }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4.5,
        bgcolor: "primary.light",
        color: "grey.800",
      }}
    >
      <Box sx={{ color: "inherit" }}>boxShadow: {shadow}</Box>
    </Box>
  </Card>
);

ShadowBox.propTypes = {
  shadow: PropTypes.string.isRequired,
};

export default function Invoice() {
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState(false);
  const [hoveredRowEdit, setHoveredRowEdit] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [invoiceData, setInvoiceDate] = useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitDialog = async () => {};
  const fetchInvoices = async () => {
    try {
      const response = await axios.get("/api/invoices");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleEdit = (row) => {
    // setSelectedItem(row.original);
    // handleOpenDialog("Edit Items");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
      },
      {
        accessorKey: "shop.CUSNAM",
        header: "Shop Name",
      },
      {
        accessorKey: "invoiceDate",
        header: "Invoice Date",
      },
      {
        accessorKey: "user.name",
        header: "Biller",
      },
      // {
      //   accessorKey: "ADRONE",
      //   header: "Total",
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div>
            <EditIcon
              style={{
                cursor: "pointer",
                color: hoveredRowEdit === row.id ? "blue" : "inherit",
              }}
              onMouseEnter={() => setHoveredRowEdit(row.id)}
              onMouseLeave={() => setHoveredRowEdit(null)}
              onClick={() => handleEdit(row)}
            />
            <FileCopyIcon
              style={{
                cursor: "pointer",
                color: hoveredRow === row.id ? "blue" : "inherit",
                marginLeft: "20px",
              }}
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => {
                setOpenDialog(true);
                setInvoiceDate(row);
              }}
            />
          </div>
        ),
      },
    ],
    [hoveredRow, hoveredRowEdit]
  );
  return (
    <MainCard title="Invoice">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title="Supplier Bills">
            <MaterialReactTable columns={columns} data={data.data ?? {}} />
          </SubCard>
          <Button
            variant="contained"
            color="primary"
            style={{
              top: "10px",
              right: "10px",
              margin: "8px",
              zIndex: 1,
            }}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            test
          </Button>
        </Grid>
        <DialogTemplate
          open={openDialog}
          title={"Invoice"}
          body={<InvoiceTemplate data={invoiceData} />}
          handleCloseDialog={handleCloseDialog}
          handleSave={handleSubmitDialog}
        />
      </Grid>
    </MainCard>
  );
}
