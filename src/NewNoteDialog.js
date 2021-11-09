import React, { useState, useEffect } from "react";
import { useDispatch, useStatus, isLoading } from "resift";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import createNoteItem from "./fetches/createNoteItem";

const useStyles = makeStyles(theme => ({
  createButton: {
    minWidth: 90
  }
}));

function NewNoteDialog({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const status = useStatus(createNoteItem);

  const handleCreate = async () => {
    await dispatch(createNoteItem({ content: `# ${name}` }));
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Note</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          label="Note Name"
          fullWidth
          value={name}
          onChange={e => {
            setName(e.currentTarget.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          className={classes.createButton}
          variant="contained"
          color="secondary"
          onClick={handleCreate}
          disabled={isLoading(status) || !name}
        >
          {isLoading(status) ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewNoteDialog;
