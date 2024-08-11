import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button, TextField } from "@mui/material";
import * as ExcelJS from "exceljs";
import MainCard from "../../ui-component/cards/MainCard";
import DialogTemplate from "../../ui-component/Dialog";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useOverAllContext } from "../../context/overAllContext";

const Suppliers = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [companyName, setCompanyName] = useState([]);
  const [hoveredRowEdit, setHoveredRowEdit] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [cName, setCName] = useState("");
  const [cShort, setCShort] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [stateCode, setStateCode] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          "https://api-skainvoice.top/api/company/fetchCompany"
        );
        console.log(response.data);
        const uniqueCompanies = Array.from(
          new Set(response.data.map((company) => company.cName))
        ).map((cName) =>
          response.data.find((company) => company.cName === cName)
        );

        setCompanyName(uniqueCompanies);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, []);

  const handleEdit = (row) => {
    const supplier = row.original;
    setSelectedItem(supplier);
    setCName(supplier.cName);
    setCShort(supplier.cShort);
    setAddress(supplier.address);
    setEmail(supplier.email);
    setPhoneNumber(supplier.phoneNumber);
    setGstin(supplier.gstin);
    setStateCode(supplier.stateCode);
    handleOpenDialog("Edit Items");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "cName",
        header: "Supplier",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "email",
        header: "E-mail",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      {
        accessorKey: "gstin",
        header: "Gstin",
      },
      {
        accessorKey: "stateCode",
        header: "State Code",
      },
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
          </div>
        ),
      },
    ],
    [hoveredRowEdit, hoveredRow]
  );

  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [buttonClicked, setButtonClicked] = useState("");

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    const data = [];
    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        const rowData = row.values;
        data.push(rowData);
      });
    });

    console.log(data);
  };

  const handleOpenDialog = (buttonName) => {
    console.log("in")
    if (buttonName === "Add/Edit") {
      resetForm();
    }
    setOpenDialog(true);
    setButtonClicked(buttonName);
    setDialogTitle(buttonName);

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setButtonClicked("");
    setDialogTitle("");
    resetForm();
  };

  const resetForm = () => {
    setCName("");
    setCShort("");
    setAddress("");
    setEmail("");
    setPhoneNumber("");
    setGstin("");
    setStateCode("");
  };

  const handleSubmitDialog = async () => {
    const supplierData = {
      cName,
      cShort,
      address,
      email,
      phoneNumber,
      gstin,
      stateCode,
    };
    console.log(buttonClicked, " = ", supplierData)
    try {
      if (buttonClicked === "Add/Edit" || buttonClicked === "Edit Items") {
        if (selectedItem) {
          // Edit supplier
          await axios.put(`https://api-skainvoice.top/api/company/update/${selectedItem.id}`, supplierData);
        } else {
          // Add supplier
          await axios.post("https://api-skainvoice.top/api/company/create", supplierData);
        }
      }
      // Fetch updated data
      const response = await axios.get("https://api-skainvoice.top/api/company/fetchCompany");
      setCompanyName(response.data);

      setOpenDialog(false);
      setButtonClicked("");
      setDialogTitle("");
      resetForm();
    } catch (error) {
      console.error("Error saving supplier:", error);
      setSuccess(false);
      setOpenErrorAlert(true);
      setErrorInfo(error.response.data.message);
    }
  };

  return (
    <MainCard title="Suppliers" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={companyName}
          getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
        />
      </Card>
      <Button
        variant="contained"
        color="primary"
        style={{
          top: "10px",
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => handleOpenDialog("Add/Edit")}
      >
        Add Supplier
      </Button>
      <DialogTemplate
        open={openDialog}
        title={dialogTitle}
        body={
          buttonClicked === "Import" ? (
            <label
              htmlFor="file-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <Button variant="outlined" component="span">
                Choose File
              </Button>
              <span>Selected file: {fileName}</span>
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <TextField
                label="Company Name"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Company Short Name"
                value={cShort}
                onChange={(e) => setCShort(e.target.value)}
                fullWidth
              />
              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone Number"
                inputProps={{
                  maxLength: 10,
                }}
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
              />
              <TextField
                label="GSTIN"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                fullWidth
              />
              <TextField
                label="State Code"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                fullWidth
              />
            </div>
          )
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
    </MainCard>
  );
};

export default Suppliers;

