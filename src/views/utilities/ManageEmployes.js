import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Card, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon
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
        onClick={() => {}}
      >
        Add Employee
      </Button>
    </MainCard>
  );
};

export default ManageEmployees;
