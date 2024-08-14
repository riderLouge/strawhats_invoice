import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import AddIcon from "@mui/icons-material/Add";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
  Tooltip,
  Backdrop,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MainCard from "../../ui-component/cards/MainCard";
import axios from "axios";
import emptyProfile from "../../assets/images/profileImage.jpg";
import { useOverAllContext } from "../../context/overAllContext";
import { UserRoles } from "../../utils/constants";
import moment from "moment";


const ManageEmployees = () => {
  const { setSuccess, setOpenErrorAlert, setErrorInfo } = useOverAllContext();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [dialogMode, setDialogMode] = useState("");
  const [toggleActive, setToggleActive] = useState(false); // Toggle state
  const [openDialog, setOpenDialog] = useState(false);
  const [staffsData, setStaffsData] = useState([]);
  const [viewProfile, setViewProfile] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [role, setRole] = useState('');

  // fetching staff details
  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get("https://api-skainvoice.top/api/staff/staffDetails");
      console.log(response);
      setStaffsData(response.data.data);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  };

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
        Cell: ({ row }) => moment(row.original.joinDate).format('DD/MM/YYYY'),
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
          <Box>
            <Tooltip placement="top" title="Edit">
              <EditIcon
                sx={{
                  cursor: "pointer",
                  color: hoveredRow === 1 ? "blue" : "inherit",
                  mr: 1,
                }}
                onMouseEnter={() => setHoveredRow(1)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleEdit(row)}
              />
            </Tooltip>
            <Tooltip placement="top" title="View Profile">
              <Person2RoundedIcon
                style={{
                  cursor: "pointer",
                  color: hoveredRow === 2 ? "blue" : "inherit",
                }}
                onMouseEnter={() => setHoveredRow(2)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => {
                  setViewProfile(true);
                  setSelectedFile({ imageUrl: row.original.photo });
                }}
              />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [hoveredRow]
  );

  useEffect(() => {
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleEdit = (row) => {
    setSelectedUserDetails(row.original);
    setDialogMode("edit");
    setOpenDialog(true);
    if (row.original.photo !== "") {
      setSelectedFile({ imageUrl: row.original.photo });
    } else {
      setSelectedFile(null);
    }
  };
  const handleAddEmployee = () => {
    setDialogMode("add");
    setOpenDialog(true);
  };

  const clearUserData = () => {
    document.getElementById("staffName").value = "";
    document.getElementById("staffEmail").value = "";
    document.getElementById("staffPhoneNumber").value = "";
    document.getElementById("staffAddress").value = "";
    document.getElementById("staffDesignation").value = "";
    document.getElementById("staffRole").value = "";
    setSelectedFile(null);
  };

  const handleCloseDialog = () => {
    clearUserData();
    setOpenDialog(false);
  };

  const handleSave = async () => {

    if (dialogMode === "add") {
      const newData = {
        name: document.getElementById("staffName").value,
        email: document.getElementById("staffEmail").value,
        phoneNumber: document.getElementById("staffPhoneNumber").value,
        address: document.getElementById("staffAddress").value,
        designation: document.getElementById("staffDesignation").value,
        role: role,
        photo: selectedFile === null ? "" : selectedFile.imageUrl,
        joinDate: new Date(document.getElementById("staffJoinDate").value),
      };
      try {
        const response = await axios.post("/api/staff/add", newData)
        if (response.status === 201) {
          setSuccess(true);
          setOpenErrorAlert(true);
          setErrorInfo('Employee Created Successfully');
          fetchStaffDetails();
          handleCloseDialog();
        }
        console.log(response, "========");
      } catch (error) {
        console.log(error)
        setSuccess(false);
        setOpenErrorAlert(true);
        setErrorInfo(error.response.data.error);
      }

    } else if (dialogMode === "edit") {
      const updatedData = {
        name: document.getElementById("staffName").value,
        email: document.getElementById("staffEmail").value,
        phoneNumber: document.getElementById("staffPhoneNumber").value,
        address: document.getElementById("staffAddress").value,
        designation: document.getElementById("staffDesignation").value,
        role: document.getElementById("staffRole").value,
        photo: selectedFile === null ? "" : selectedFile.imageUrl,
        joinDate: new Date(document.getElementById("staffJoinDate").value),
      };
      const response = await axios.put(`https://api-skainvoice.top/api/staff/edit/${selectedUserDetails.userid}`, updatedData)

      if (response.status === 200) {
        setSuccess(true);
        setOpenErrorAlert(true);
        setErrorInfo('Details updated Successfully');
        fetchStaffDetails();
        handleCloseDialog();
      }

      console.log(response, "========");
    }

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
  console.log(selectedFile);
  return (
    <MainCard title="Employees" sx={{ position: "relative" }}>
      <Card sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          columns={columns}
          data={staffsData}
          // enableRowSelection
          // getRowId={(row) => row.id}
          // onRowSelectionChange={setRowSelection}
          // state={{ rowSelection }}
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
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.name
                  : ""
              }
            />
            <TextField
              id="staffJoinDate"
              label="Join Date"
              fullWidth
              focused
              type="date"
              margin="normal"
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.joinDate
                  : ""
              }
            />
            {/* <TextField
              id="staffRole"
              label="Role"
              fullWidth
              margin="normal"
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.role
                  : ""
              }
            /> */}
            <Select
              id="staffRole"
              placeholder="Role"
              fullWidth
              defaultValue={dialogMode === "edit" && selectedUserDetails
                ? selectedUserDetails.role
                : ""}
              onChange={(e) => setRole(e.target.value)}
            >
              {JSON.parse(localStorage.getItem('role')) === UserRoles.OWNER && (
                <MenuItem value={UserRoles.ADMIN}>{UserRoles.ADMIN}</MenuItem>
              )}
              <MenuItem value={UserRoles.DELIVERY}>{UserRoles.DELIVERY}</MenuItem>
              <MenuItem value={UserRoles.STAFF}>{UserRoles.STAFF}</MenuItem>
            </Select>
            <TextField
              id="staffEmail"
              label="Email"
              fullWidth
              margin="normal"
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.email
                  : ""
              }
            />
            <TextField
              id="staffPhoneNumber"
              label="Phone Number"
              fullWidth
              margin="normal"
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.phoneNumber
                  : ""
              }
              inputProps={{
                maxLength: 10,
              }}
            />
            <TextField
              id="staffAddress"
              label="Address"
              fullWidth
              margin="normal"
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.address
                  : ""
              }
            />
            <TextField
              id="staffDesignation"
              label="Designation"
              fullWidth
              margin="normal"
              defaultValue={
                dialogMode === "edit" && selectedUserDetails
                  ? selectedUserDetails.designation
                  : ""
              }
            />
            <Box>
              <Typography variant="body2">Add Profile Photo</Typography>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleSelectImage}
              />
              <Box sx={{ position: "relative" }}>
                {selectedFile ? (
                  <div>
                    <img
                      alt="profile"
                      src={selectedFile.imageUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        maxWidth: "100%",
                        maxHeight: "200px",
                      }}
                    />
                    <CloseRoundedIcon
                      sx={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedFile(null)}
                    />
                  </div>
                ) : (
                  <label htmlFor="image-input">
                    <Box
                      component="span"
                      sx={{
                        py: 2,
                        border: "1px dotted black",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        borderRadius: "8px",
                        mt: 1,
                      }}
                    >
                      <AddIcon />
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
      <Backdrop
        open={viewProfile}
        sx={{ zIndex: 5000, display: "grid", placeItems: "center" }}
        onClick={() => setViewProfile(false)}
      >
        <img
          alt="profile"
          src={selectedFile?.imageUrl || emptyProfile}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            maxWidth: "100%",
            maxHeight: "300px",
          }}
        />
      </Backdrop>
    </MainCard>
  );
};

export default ManageEmployees;
