import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";

// material-ui
import { Box, Card, Grid, Button } from "@mui/material";
import DialogTemplate from "../../ui-component/Dialog";

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitDialog = async () => {};
  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices');
      return response.data.invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);
  return (
    <MainCard title="Invoice">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title="Manage BIlls"></SubCard>
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
          body={<InvoiceTemplate />}
          handleCloseDialog={handleCloseDialog}
          handleSave={handleSubmitDialog}
        />
      </Grid>
    </MainCard>
  );
}
