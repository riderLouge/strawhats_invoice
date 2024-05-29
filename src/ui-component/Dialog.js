import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const DialogTemplate = ({
  open,
  title,
  body,
  handleCloseDialog,
  handleSave,
  type,
  width,
}) => {
  return (
    <div>
      <Dialog fullWidth maxWidth={width || 'md'} open={open}>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f0f0f0",
            padding: "16px",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent style={{ padding: "16px" }}>{body}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          {type === "Invoice" ? null : (
            <Button onClick={handleSave} color="primary">
              {type === "Bill" ? "Download" : type === "Update" ? "Update" : type === "Delete" ? "Delete" : "Save"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogTemplate;
