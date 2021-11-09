import { defineFetch } from "resift";

const makeCreateNoteItem = defineFetch({
  displayName: "Create Note Item",
  share: { namespace: "newNoteItem" },
  make: () => ({
    request: newNote => ({ http }) =>
      http({
        method: "POST",
        route: "/notes",
        data: newNote
      })
  })
});

const createNoteItem = makeCreateNoteItem();

export default createNoteItem;
