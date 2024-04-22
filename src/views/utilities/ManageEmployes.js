import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MainCard from "../../ui-component/cards/MainCard";

const employeeData = [
  {
    id: 1,
    name: "John Doe",
    joinDate: "2023-01-01",
    role: "Manager",
    email: "john@example.com",
    phoneNumber: "1234567890",
    address: "123 Main St, City, Country",
  },
  {
    id: 2,
    name: "Jane Smith",
    joinDate: "2022-05-15",
    role: "Assistant",
    email: "jane@example.com",
    phoneNumber: "0987654321",
    address: "456 Elm St, Town, Country",
  },
  {
    id: 3,
    name: "Michael Johnson",
    joinDate: "2023-02-28",
    role: "Supervisor",
    email: "michael@example.com",
    phoneNumber: "9876543210",
    address: "789 Oak St, Village, Country",
  },
  {
    id: 4,
    name: "Emily Brown",
    joinDate: "2022-09-10",
    role: "Assistant",
    email: "emily@example.com",
    phoneNumber: "0123456789",
    address: "101 Pine St, Hamlet, Country",
  },
  {
    id: 5,
    name: "Daniel Wilson",
    joinDate: "2023-03-20",
    role: "Clerk",
    email: "daniel@example.com",
    phoneNumber: "8765432109",
    address: "222 Cedar St, Town, Country",
  },
  {
    id: 6,
    name: "Sarah Martinez",
    joinDate: "2022-11-05",
    role: "Manager",
    email: "sarah@example.com",
    phoneNumber: "5432109876",
    address: "333 Maple St, City, Country",
  },
  // Add more entries as needed
];

const ManageEmployees = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogMode, setDialogMode] = useState("edit");
  const [toggleActive, setToggleActive] = useState(false); // Toggle state

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

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleEdit = (row) => {
    setSelectedEmployee(row.original);
    setDialogMode("edit");
  };
  const newId = employeeData.length + 1;

  const handleAddEmployee = () => {
    setSelectedEmployee({
      id: newId,
      name: "",
      joinDate: "",
      role: "",
      email: "",
      phoneNumber: "",
      address: "",
    });
    setDialogMode("add");
  };

  const handleCloseDialog = () => {
    setSelectedEmployee(null);
  };

  const handleSave = () => {
    if (dialogMode === "edit") {
      console.log("Save edit");
    } else if (dialogMode === "add") {
      console.log("Save add");
    }
    handleCloseDialog();
  };

  return (
    <MainCard title="Employees" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={employeeData}
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
      <Dialog open={!!selectedEmployee} onClose={handleCloseDialog}>
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
          {selectedEmployee && (
            <div>
              <TextField
                label="Name"
                value={selectedEmployee.name}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    name: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Join Date"
                value={selectedEmployee.joinDate}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    joinDate: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                value={selectedEmployee.role}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    role: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={selectedEmployee.email}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    email: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                value={selectedEmployee.phoneNumber}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    phoneNumber: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={selectedEmployee.address}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    address: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
            </div>
          )}
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
