import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";

// material-ui
import { Box, Card, Grid, Button, Typography, TextField } from "@mui/material";
import DialogTemplate from "../../ui-component/Dialog";
import { MaterialReactTable } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from "@mui/icons-material/FileCopy";
import * as constants from '../../utils/constants';
// project imports
import SubCard from "../../ui-component/cards/SubCard";
import MainCard from "../../ui-component/cards/MainCard";
import { gridSpacing } from "../../store/constant";
import axios from "axios";
import SupplierViewInvoice from "./supplierViewInvoice";
import moment from "moment";
import { useOverAllContext } from "../../context/overAllContext";

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
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState(false);
  const [hoveredRowEdit, setHoveredRowEdit] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredRowId, setHoveredRowId] = useState('');
  const [invoiceData, setInvoiceDate] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [invoiceType, setInvoiceType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEditProductPopup, setOpenEditProductPopup] = useState(false);
  const currentUserRole = constants.role;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const deleteSupplierBill = async () => {
    try {
      const response = await axios.delete(`https://api-skainvoice.top/api/supplier-bill/delete/${selectedItem.id}`);
      if (response.status === 200) {
        setSuccess(true);
        setOpenErrorAlert(true);
        setErrorInfo(response.data.message);
        setOpenDialog(false);
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo('Error while deleting invoice');
    }
  };

  const updateSupplierBillProductQuantity = async () => {
    const updatedProductQuantity = document.getElementById("supplibillProductQuantity").value;
    try {
      const response = await axios.put(`https://api-skainvoice.top/api/supplier-bill/update-product/${selectedItem.id}`, {
        productId: selectedProduct.productId,
        quantity: parseInt(updatedProductQuantity) || 0,
      });

      if (response.status === 200) {
        setSuccess(true);
        setOpenErrorAlert(true);
        setErrorInfo(response.data.message);
        setSelectedItem((prev) => {
          return {
            ...prev,
            products: response.data.data,
          };
        })
        fetchInvoices();
        setOpenEditProductPopup(false);
      }
    } catch (err) {
      console.error('Error updating product quantity:', err);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(err.response.data.message);
    }
  };
    const handleSubmitDialog = () => {
      if (invoiceType === 'Delete Supplier Bill') {
        deleteSupplierBill();
      } else if ('Edit Product') {
        updateSupplierBillProductQuantity();
      }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("https://api-skainvoice.top/api/supplier-bills");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenDialog = (type) => {
    setInvoiceType(type);
    setOpenDialog(true);
  };
  const handleEdit = (row, type) => {
    setSelectedItem(row.original);
    handleOpenDialog(type);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "billNumber",
        header: "Bill Number",
      },
      {
        accessorKey: "supplier.cName",
        header: "Supplier Name",
      },
      {
        accessorKey: "billDate",
        header: "Bill Date",
        Cell: ({ row }) => moment(row.original.billDate).format('DD/MM/YYYY')
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
                color: (hoveredRow === 1 && hoveredRowId === row.id) ? "blue" : "inherit",
                display: currentUserRole === constants.ROLE_ADMIN ? 'revert' : 'none',
              }}
              onMouseEnter={() => { setHoveredRow(1); setHoveredRowId(row.id); }}
              onMouseLeave={() => { setHoveredRow(0); setHoveredRowId(null); }}
              onClick={() => handleEdit(row, "Edit Supplier Bill")}
            />
            <FileCopyIcon
              style={{
                cursor: "pointer",
                color: (hoveredRow === 2 && hoveredRowId === row.id) ? "blue" : "inherit",
                marginLeft: "20px",
              }}
              onMouseEnter={() => { setHoveredRow(2); setHoveredRowId(row.id); }}
              onMouseLeave={() => { setHoveredRow(0); setHoveredRowId(null); }}
              onClick={() => {
                handleOpenDialog('View Supplier Bill');
                setInvoiceDate(row);
              }}
            />
            <DeleteIcon
              style={{
                cursor: "pointer",
                color: (hoveredRow === 3 && hoveredRowId === row.id) ? "blue" : "inherit",
                marginLeft: "20px",
                display: currentUserRole === constants.ROLE_ADMIN ? 'revert' : 'none',
              }}
              onMouseEnter={() => { setHoveredRow(3); setHoveredRowId(row.id); }}
              onMouseLeave={() => { setHoveredRow(0); setHoveredRowId(null); }}
              onClick={() => {
                handleEdit(row, "Delete Supplier Bill");
              }}
            />
          </div>
        ),
      },
    ],
    [hoveredRow, hoveredRowEdit]
  );

  
  const editInvoiceColumns = [
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "rate",
      header: "Selling Price",
    },
    {
      accessorKey: "gst",
      header: "GST",
    },
    {
      accessorKey: "totalWithDiscount",
      header: "Total",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <EditIcon
          style={{
            cursor: "pointer",
            color: (hoveredRow === 1 && hoveredRowId === row.id) ? "blue" : "inherit",
          }}
          onMouseEnter={() => { setHoveredRow(1); setHoveredRowId(row.id); }}
          onMouseLeave={() => { setHoveredRow(0); setHoveredRowId(null); }}
          onClick={() => { setOpenEditProductPopup(true); setInvoiceType('Edit Product'); setSelectedProduct(row.original); }
          }
        />
      )
    }
  ];
  return (
    <MainCard title="Invoice">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title="Supplier Bills">
            <MaterialReactTable columns={columns} data={data.data ?? {}} />
          </SubCard>
        </Grid>
        <DialogTemplate
        open={openDialog}
        title={invoiceType}
        body={
          invoiceType === 'View Supplier Bill' ? (
            <SupplierViewInvoice data={invoiceData} type={"Customer"} />
          ) : invoiceType === 'Delete Supplier Bill' ? (
            <Typography variant="body2">Are you sure do you want to delete this Supplier Bill?</Typography>
          ) : (
            <MaterialReactTable columns={editInvoiceColumns} data={selectedItem?.products} />
          )
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
        type={invoiceType === 'View Supplier Bill' ? 'Invoice' : invoiceType === 'Delete Supplier Bill' ? 'Delete' : invoiceType === 'Edit Supplier Bill' ? 'Invoice' : 'Update'}
        width={(invoiceType === 'Edit Supplier Bill' || invoiceType === 'Edit Product') ? 'lg' : 'md'}
        />
        <DialogTemplate
        open={openEditProductPopup}
        title={'Edit Product'}
        body={
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>Update a quantity</Typography>
            <TextField id="supplibillProductQuantity" fullWidth defaultValue={selectedProduct?.quantity} />
          </Box>
        }
        handleCloseDialog={() => setOpenEditProductPopup(false)}
        handleSave={handleSubmitDialog}
        type={'Update'}
        width={'sm'}
      />
      </Grid>
    </MainCard>
  );
}
