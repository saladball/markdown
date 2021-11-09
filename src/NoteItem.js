import React, { useEffect, useState } from "react";
import classNames from "classnames";
import delay from "delay";
import moment from "moment";
import {
  Guard,
  useDispatch,
  useStatus,
  useData,
  useError,
  isNormal,
  isLoading
} from "resift";
import {
  CircularProgress,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import Editor from "rich-markdown-editor";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import makeGetNoteItem from "./fetches/makeGetNoteItem";
import makeUpdateNoteItem from "./fetches/makeUpdateNoteItem";
import makeDeleteNoteItem from "./fetches/makeDeleteNoteItem";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: 700,
    maxWidth: `calc(100% - ${theme.spacing(4)}px)`,
    padding: theme.spacing(2),
    position: "relative"
  },
  titleRow: {
    display: "flex",
    overflow: "hidden",
    flex: "0 0 auto",
    alignItems: "center"
  },
  spinner: {
    flex: "0 0 auto",
    opacity: 1,
    marginRight: theme.spacing(2),
    transition: theme.transitions.create("all")
  },
  spinnerHidden: {
    opacity: 0
  },
  updatedAt: {
    padding: theme.spacing(0, 1),
    marginRight: theme.spacing(2),
    borderRadius: 99999,
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest
    })
  },
  updatedFlash: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  contentInput: {
    justifyContent: "flex-start"
  },
  emptyLoader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  iconButton: {
    marginLeft: "auto"
  },
  deleteButton: {
    minWidth: 90
  }
}));

function NoteItem({ className, id }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const getNoteItem = makeGetNoteItem(id);
  const updateNoteItem = makeUpdateNoteItem(id);
  const deleteNoteItem = makeDeleteNoteItem(id);

  const status = useStatus(getNoteItem);
  const data = useData(getNoteItem);
  const error = useError(getNoteItem);

  const [flashUpdated, setFlashUpdated] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = async content => {
    if (data.content === content) return;

    await dispatch(
      updateNoteItem({
        ...data,
        content,
        updatedAt: moment().toISOString()
      })
    );
    setFlashUpdated(true);

    await delay(1000);
    setFlashUpdated(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteNoteItem());
    history.push("/notes");
  };

  useEffect(() => {
    dispatch(getNoteItem());
  }, [dispatch, getNoteItem]);

  useEffect(() => {
    // if this was a real API, you should check for a 404 status
    if (error) {
      history.replace("/");
    }
  }, [error, history]);

  return (
    <>
      <div className={classNames(classes.root, className)}>
        {!isNormal(status) && isLoading(status) && (
          <div className={classes.emptyLoader}>
            <CircularProgress />
          </div>
        )}

        <Guard fetch={getNoteItem}>
          {data => {
            if (!data) return null;

            return (
              <>
                <div className={classes.titleRow}>
                  <Typography
                    className={classNames(classes.updatedAt, {
                      [classes.updatedFlash]: flashUpdated
                    })}
                    variant="caption"
                  >
                    Updated {moment(data.updatedAt).calendar()}
                  </Typography>

                  <IconButton
                    className={classes.iconButton}
                    onClick={e => {
                      setMenuAnchor(e.currentTarget);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Menu
                    open={!!menuAnchor}
                    anchorEl={menuAnchor}
                    onClose={() => setMenuAnchor(null)}
                  >
                    <MenuItem
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        setMenuAnchor(null);
                      }}
                    >
                      Delete Note
                    </MenuItem>
                  </Menu>
                </div>

                <Editor
                  key={id}
                  className={classes.contentInput}
                  defaultValue={data.content}
                  onChange={getContent => {
                    const content = getContent();
                    window.content = content;
                    handleSave(content);
                  }}
                />
              </>
            );
          }}
        </Guard>
      </div>

      <Dialog open={deleteDialogOpen} maxWidth="xs" fullWidth>
        <DialogTitle>Are you sure you want to delete this note?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className={classes.deleteButton}
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            disabled={isLoading(status)}
          >
            {isLoading(status) ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NoteItem;
