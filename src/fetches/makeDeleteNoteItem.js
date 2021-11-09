import { defineFetch } from "resift";

const makeDeleteNoteItem = defineFetch({
  displayName: "Delete Note Item",
  share: { namespace: "noteItem" },
  make: noteId => ({
    request: updatedNote => async ({ http }) => {
      // server doesn't return anything...
      await http({
        method: "DELETE",
        route: `/notes/${noteId}`
      });

      // ...so return an entity with a deleted flag
      return { id: noteId, deleted: true };
    }
  })
});

export default makeDeleteNoteItem;
