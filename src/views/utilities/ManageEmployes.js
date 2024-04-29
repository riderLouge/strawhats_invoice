import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";

// const employeeData = [
//   {
//     id: 1,
//     name: "John Doe",
//     joinDate: "2023-01-01",
//     role: "Manager",
//     email: "john@example.com",
//     phoneNumber: "1234567890",
//     address: "123 Main St, City, Country",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     joinDate: "2022-05-15",
//     role: "Assistant",
//     email: "jane@example.com",
//     phoneNumber: "0987654321",
//     address: "456 Elm St, Town, Country",
//   },
//   {
//     id: 3,
//     name: "Michael Johnson",
//     joinDate: "2023-02-28",
//     role: "Supervisor",
//     email: "michael@example.com",
//     phoneNumber: "9876543210",
//     address: "789 Oak St, Village, Country",
//   },
//   {
//     id: 4,
//     name: "Emily Brown",
//     joinDate: "2022-09-10",
//     role: "Assistant",
//     email: "emily@example.com",
//     phoneNumber: "0123456789",
//     address: "101 Pine St, Hamlet, Country",
//   },
//   {
//     id: 5,
//     name: "Daniel Wilson",
//     joinDate: "2023-03-20",
//     role: "Clerk",
//     email: "daniel@example.com",
//     phoneNumber: "8765432109",
//     address: "222 Cedar St, Town, Country",
//   },
//   {
//     id: 6,
//     name: "Sarah Martinez",
//     joinDate: "2022-11-05",
//     role: "Manager",
//     email: "sarah@example.com",
//     phoneNumber: "5432109876",
//     address: "333 Maple St, City, Country",
//   },
//   // Add more entries as needed
// ];

const ManageEmployees = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [dialogMode, setDialogMode] = useState("edit");
  const [toggleActive, setToggleActive] = useState(false); // Toggle state
  const [openDialog, setOpenDialog] = useState(false);
  const [staffsData, setStaffsData] = useState([]);

  // fetching staff details
  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get("api/staff/staffDetails");
      console.log(response);
      setStaffsData(response.data.data);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  }

  useEffect(() => {
    fetchStaffDetails();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Employee",
      },
      {
        accessorKey: "joinDate",
        header: "Join Date",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "email",
        header: "Mail",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <EditIcon
            style={{
              cursor: "pointer",
              color: hoveredRow === row.id ? "blue" : "inherit",
            }}
            onMouseEnter={() => setHoveredRow(row.id)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => handleEdit(row)}
          />
        ),
      },
    ],
    [hoveredRow]
  );

  const [rowSelection, setRowSelection] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleEdit = (row) => {
    setDialogMode("edit");
  };
  const handleAddEmployee = () => {
    setDialogMode("add");
    setOpenDialog(true);
  };

  const clearUserData = () => {
    document.getElementById('staffName').value = '';
    document.getElementById('staffEmail').value = '';
    document.getElementById('staffPhoneNumber').value = '';
    document.getElementById('staffAddress').value = '';
    document.getElementById('staffDesignation').value = '';
    document.getElementById('staffRole').value = '';
    setSelectedFile(null);
  };

  const handleCloseDialog = () => {
    console.log('close')
    clearUserData();
    setOpenDialog(false);
  };


  const handleSave = async () => {
    if (dialogMode === "edit") {
      console.log("Save edit");
    } else if (dialogMode === "add") {
      console.log("Save add");
      const newData = {
        name: document.getElementById('staffName').value,
        email: document.getElementById('staffEmail').value,
        phoneNumber: Number(document.getElementById('staffPhoneNumber').value),
        address: document.getElementById('staffAddress').value,
        designation: document.getElementById('staffDesignation').value,
        role: document.getElementById('staffRole').value,
        photo: selectedFile === null ? '' : selectedFile.imageUrl,
      };
      const response = await axios
        .post("api/staff/add", newData)
        .then((res) => {
          console.log(res, "========");
          fetchStaffDetails();
        });
      console.log(response, "========");
    }
    handleCloseDialog();
  };
  function getFileBase64Url(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const base64Url = fileReader.result;
        resolve(base64Url);
      };

      fileReader.onerror = () => {
        reject("Error occurred while reading the file.");
      };

      fileReader.readAsDataURL(file);
    });
  }
  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    // calling this function to get the base64 format url of selected image
    getFileBase64Url(file)
      .then((base64Url) => {
        const fileObject = {
          imageUrl: base64Url,
        };
        setSelectedFile(fileObject);
      })
      .catch((error) => {
        console.error("Error occurred while converting file to base64:", error);
      });
  };
  console.log(staffsData);
  return (
    <MainCard title="Employees" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={staffsData}
          enableRowSelection
          getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
        />
      </Card>
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
        onClick={handleAddEmployee}
      >
        Add Employee
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f0f0f0", // Set background color
            padding: "16px", // Add padding
            borderRadius: "8px", // Add border radius
            alignItems: "center", // Center items vertically
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {dialogMode === "edit" ? "Edit Employee Details" : "Add Employee"}
          </Typography>
          {dialogMode === "edit" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  color: toggleActive ? "text.secondary" : "primary.main",
                  fontWeight: 600,
                }}
              >
                Inactive
              </Typography>
              <Switch
                checked={toggleActive}
                onChange={() => setToggleActive(!toggleActive)}
              />
              <Typography
                sx={{
                  color: toggleActive ? "primary.main" : "text.secondary",
                  fontWeight: 600,
                }}
              >
                Active
              </Typography>
            </Box>
          )}
        </DialogTitle>

        <DialogContent>
          <div>
            <TextField
              id="staffName"
              label="Name"
              fullWidth
              margin="normal"
            />
            <TextField
              id="staffJoinDate"
              label="Join Date"
              fullWidth
              margin="normal"
            />
            <TextField
              id="staffRole"
              label="Role"
              fullWidth
              margin="normal"
            />
            <TextField
              id="staffEmail"
              label="Email"
              fullWidth
              margin="normal"
            />
            <TextField
              id="staffPhoneNumber"
              label="Phone Number"
              fullWidth
              margin="normal"
            />
            <TextField
              id="staffAddress"
              label="Address"
              fullWidth
              margin="normal"
            />
            <TextField
              id="staffDesignation"
              label="Designation"
              fullWidth
              margin="normal"
            />
            <Box>
              <Typography variant="body2">
                Add Profile Photo
              </Typography>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleSelectImage}
              />
              <Box sx={{ position: 'relative' }}>
                {selectedFile ? (
                  <div>
                    <img
                      alt="profile"
                      src={selectedFile.imageUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: '100%', maxHeight: '200px' }}
                    />
                    <CloseRoundedIcon sx={{ position: 'absolute', top: '0px', right: '0px', cursor: 'pointer' }} onClick={() => setSelectedFile(null)} />
                  </div>
                ) : (
                  <label htmlFor="image-input">
                    <Box component="span" sx={{ border: '1px dotted black', display: 'grid', placeItems: 'center', cursor: 'pointer', borderRadius: '8px', mt: 1 }}>
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </label>
                )}
              </Box>
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ManageEmployees;
