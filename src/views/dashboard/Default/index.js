import { useEffect, useState } from "react";

// material-ui
import { Grid, TextField } from "@mui/material";

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
    console.log("Grid item clicked!");
  };

  const handleDeliveryPdf = () => {
    setPdfType("Delivery");
    setOpenDialog(true);
    console.log("Grid item clicked!");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleSubmitDialog = async () => {
    const date = document.getElementById("invoiceDate").value;
    const response = await axios
      .post("api/dayInvoice/download", date)
      .then((res) => {});
    console.log(response);
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
