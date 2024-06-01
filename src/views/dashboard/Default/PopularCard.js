import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import * as ExcelJS from "exceljs";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Box,
  Tooltip,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

// project imports
import MainCard from "../../../ui-component/cards/MainCard";
import SkeletonPopularCard from "../../../ui-component/cards/Skeleton/PopularCard";
import { gridSpacing } from "../../../store/constant";
import axios from "axios";

// assets
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [showMoreOpen, setShowMoreOpen] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "https://api-skainvoice.top/api/products/fetchItems"
      );
      const filteredProducts = response.data.filter((product) => product.HSN);
      const productsWithZeroFQTY = filteredProducts.filter(
        (product) => product.FQTY === ""
      );
      setProducts(productsWithZeroFQTY);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleShowMoreOpen = () => {
    setShowMoreOpen(true);
  };

  const handleShowMoreClose = () => {
    setShowMoreOpen(false);
  };

  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stock Alert");

    // Add headers
    const headers = ["Product Name"];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    worksheet.addRow("");
    // Add data
    products.forEach((product) => {
      const row = [product.NAME];
      worksheet.addRow(row);
    });

    // Generate buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "StockAlert.xlsx";
      a.click();
    });
  };
  console.log(products);

  const displayedProducts = products.slice(0, 6);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">Stock Alert</Typography>
                  </Grid>
                  <Grid item>
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
                          onClick={() => handleExportToExcel()}
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
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {displayedProducts.map((product, index) => (
                  <div key={index}>
                    <Grid container direction="column">
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {product.NAME}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                  </div>
                ))}
                {products.length > 6 && (
                  <Button
                    onClick={handleShowMoreOpen}
                    size="small"
                    disableElevation
                  >
                    Show More
                    <ChevronRightOutlinedIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
      <Dialog open={showMoreOpen} onClose={handleShowMoreClose}>
        <DialogTitle>All Products</DialogTitle>
        <DialogContent>
          <List>
            {products.map((product, index) => (
              <ListItem key={index}>
                <ListItemText primary={product.NAME} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default PopularCard;
