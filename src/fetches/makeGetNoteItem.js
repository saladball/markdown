import { defineFetch } from "resift";

const makeGetNoteItem = defineFetch({
  displayName: "Get Note Item",
  share: { namespace: "noteItem" },
  make: noteId => ({
    request: () => ({ http }) =>
      http({
        method: "GET",
        route: `/notes/${noteId}`
      })
  })
});

export default makeGetNoteItem;
