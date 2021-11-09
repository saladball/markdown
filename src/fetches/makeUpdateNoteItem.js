import { defineFetch } from "resift";

const makeUpdateNoteItem = defineFetch({
  displayName: "Update Note Item",
  share: { namespace: "noteItem" },
  make: noteId => ({
    request: updatedNote => ({ http }) =>
      http({
        method: "PUT",
        route: `/notes/${noteId}`,
        data: updatedNote
      })
  })
});

export default makeUpdateNoteItem;
