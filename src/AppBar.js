import React from "react";
import classNames from "classnames";
import _get from "lodash/get";
import { useStatus, isLoading, isNormal } from "resift";
import { useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar as MuiAppBar, Toolbar, Typography } from "@material-ui/core";
import SyncOutlinedIcon from "@material-ui/icons/SyncOutlined";
import makeGetNoteItem from "./fetches/makeGetNoteItem";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  toolbar: {
    marginRight: theme.spacing(2)
  },
  saving: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: theme.spacing(2),
    opacity: 0,
    pointerEvents: "none",
    transition: theme.transitions.create("all")
  },
  savingShown: {
    opacity: 1,
    pointerEvents: "auto"
  },
  savingText: {
    marginRight: theme.spacing(2)
  },
  spinner: {
    animation: "$circular-rotate 1.4s linear infinite"
  },
  "@keyframes circular-rotate": {
    "100%": {
      transform: "rotate(360deg)"
    }
  }
}));

function AppBar({ className }) {
  const classes = useStyles();
  const match = useRouteMatch("/notes/:id");
  const id = _get(match, ["params", "id"]);
  const getNoteItem = id && makeGetNoteItem(id);

  const status = useStatus(getNoteItem);

  return (
    <MuiAppBar
      position="static"
      className={classNames(classes.root, className)}
    >
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">
          <strong>ReSift Notes</strong>
        </Typography>
      </Toolbar>

      <div
        className={classNames(classes.saving, {
          [classes.savingShown]: isNormal(status) && isLoading(status)
        })}
      >
        <SyncOutlinedIcon color="inherit" className={classes.spinner} />
      </div>
    </MuiAppBar>
  );
}

export default AppBar;
