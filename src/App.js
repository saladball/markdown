import React, { useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { Route } from "react-router-dom";
import { Typography } from "@material-ui/core";
import AppBar from "./AppBar";
import NoteItem from "./NoteItem";
import NoteList from "./NoteList";
import NewNoteDialog from "./NewNoteDialog";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column"
  },
  appBar: {
    flex: "0 0 auto"
  },
  body: {
    flex: "1 1 auto",
    display: "flex",
    overflow: "hidden",
    position: "relative"
  },
  noteList: {
    flex: "0 0 auto",
    width: 250,
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default,
    position: "relative"
  },
  content: {
    flex: "1 1 auto",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    overflow: "auto"
  },
  noteItem: {
    margin: "0 auto"
  },
  empty: {
    margin: "auto",
    padding: theme.spacing(2),
    color: theme.palette.text.hint,
    textAlign: "center"
  },
  title: {
    fontWeight: "bold"
  }
}));

function App() {
  const classes = useStyles();
  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false);

  return (
    <>
      <NewNoteDialog
        open={newNoteDialogOpen}
        onClose={() => setNewNoteDialogOpen(false)}
      />

      <div className={classNames(classes.root)}>
        <AppBar className={classes.appBar} />

        <div className={classes.body}>
          <NoteList
            className={classes.noteList}
            onNewClick={() => setNewNoteDialogOpen(true)}
          />

          <main className={classes.content}>
            <Route
              path="/notes/:id"
              render={({ match }) => (
                <NoteItem id={match.params.id} className={classes.noteItem} />
              )}
            />

            <Route
              path={["/", "/notes"]}
              exact
              render={() => (
                <div className={classes.empty}>
                  <Typography className={classes.title} variant="h3">
                    <span role="img" aria-label="Wave">
                      👋
                    </span>{" "}
                    Hello there,
                  </Typography>
                  <Typography className={classes.subtitle}>
                    Select or create note to get started.
                  </Typography>
                </div>
              )}
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
