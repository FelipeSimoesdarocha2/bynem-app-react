import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";

import create from "zustand";

import { Button } from "antd";
import { Close } from "@mui/icons-material";

type ConfirmDialogStore = {
  message: string;
  onSubmit?: () => void;
  close: () => void;
};

const useConfirmDialogStore = create<ConfirmDialogStore>((set) => ({
  message: "",
  onSubmit: undefined,
  close: () =>
    set({
      onSubmit: undefined,
    }),
}));

export const confirmDialog = (message: string, onSubmit: () => void) => {
  useConfirmDialogStore.setState({
    message,
    onSubmit,
  });
};

const ConfirmDialog: React.FC = () => {
  const { message, onSubmit, close } = useConfirmDialogStore();
  return (
    <Dialog open={Boolean(onSubmit)} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>Deseja realmente exluir o simulado?</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={close}>
          <Close></Close>
        </IconButton>
      </Box>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>

        <Button
          style={{ backgroundColor: "#ff4d4f", color: "#ffffff" }}
          onClick={close}
        >
          Não
        </Button>
        <Button
          style={{ backgroundColor: "#1890ff", color: "#ffffff" }}
          onClick={onSubmit}
        >
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
