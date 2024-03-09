import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";
import * as ExcelJS from "exceljs";
import MainCard from "../../ui-component/cards/MainCard";
import DialogTemplate from "../../ui-component/Dialog";
import axios from "axios";

const Suppliers = () => {
  const [companyName, setCompanyName] = useState([]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get("api/company/fetchCompany");
        console.log(response.data);
        setCompanyName(response.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "cName",
        header: "Supplier",
      },
      {
        accessorKey: "cShort",
        header: "Short form",
      },
    ],
    []
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
    setOpenDialog(true);
    setButtonClicked(buttonName);
    setDialogTitle(buttonName);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setButtonClicked("");
    setDialogTitle("");
  };

  const handleSubmitDialog = () => {
    setOpenDialog(false);
    setButtonClicked("");
    setDialogTitle("");
  };

  return (
    <MainCard title="Suppliers" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={companyName}
          enableRowSelection
          getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
        />
      </Card>
      <Button
        variant="contained"
        color="secondary"
        style={{
          top: "10px",
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => handleOpenDialog("Stock Adjustment")}
      >
        Stock Adjustment
      </Button>
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
        Add / Edit Item
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          margin: "8px",
          zIndex: 1,
        }}
        onClick={() => handleOpenDialog("Import")}
      >
        Import
      </Button>
      <DialogTemplate
        open={openDialog}
        title={"Import"}
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
            <span>{`You clicked on: ${buttonClicked}`}</span>
          )
        }
        handleCloseDialog={handleCloseDialog}
        handleSave={handleSubmitDialog}
      />
    </MainCard>
  );
};

export default Suppliers;
