import React, { useEffect } from "react";
import { Guard, useDispatch, useStatus, isLoading, isNormal } from "resift";
import classNames from "classnames";
import moment from "moment";
import _get from "lodash/get";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Fab,
  Divider
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link, useRouteMatch } from "react-router-dom";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import getNoteList from "./fetches/getNoteList";

function getTitle(content) {
  return (content || "").trim().split("\n")[0];
}

const useStyles = makeStyles(theme => ({
  root: {
    flex: "0 0 auto",
    width: 250,
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  list: {
    flex: "1 1 auto",
    overflow: "auto"
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  fabContainer: {
    padding: theme.spacing(1)
  },
  fab: {
    fontWeight: "bold"
  },
  addIcon: {
    marginRight: theme.spacing(1)
  },
  listItemText: {
    display: "flex",
    flexDirection: "column"
  },
  textEllipsis: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  }
}));

function NoteList({ className, onNewClick }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const status = useStatus(getNoteList);

  const match = useRouteMatch("/notes/:id");
  const currentId = _get(match, ["params", "id"]);

  useEffect(() => {
    dispatch(getNoteList());
  }, [dispatch]);

  return (
    <>
      <nav className={classNames(classes.root, className)}>
        {isLoading(status) && !isNormal(status) && (
          <div className={classes.loaderOverlay}>
            <CircularProgress />
          </div>
        )}

        <div className={classes.fabContainer}>
          <Fab
            className={classes.fab}
            variant="extended"
            color="secondary"
            onClick={onNewClick}
          >
            <AddIcon className={classes.addIcon} /> New
          </Fab>
        </div>

        <Divider />

        <List className={classes.list}>
          <Guard fetch={getNoteList}>
            {notes =>
              notes.map(note => (
                <ListItem
                  key={note.id}
                  selected={note.id === currentId}
                  button
                  component={Link}
                  to={`/notes/${note.id}`}
                >
                  <ListItemText
                    className={classes.listItemText}
                    classes={{
                      primary: classes.textEllipsis,
                      secondary: classes.textEllipsis
                    }}
                    primary={getTitle(note.content) || "Untitled Note"}
                    secondary={moment(note.updatedAt).calendar()}
                  />
                  <ChevronRightIcon />
                </ListItem>
              ))
            }
          </Guard>
        </List>
      </nav>
    </>
  );
}

export default NoteList;
