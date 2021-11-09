import { defineFetch } from "resift";

const makeGetNoteList = defineFetch({
  displayName: "Get Note List",
  share: {
    namespace: "noteList",
    merge: {
      noteItem: (prevNoteList, nextNoteItem) => {
        if (!prevNoteList) return null;

        const index = prevNoteList.findIndex(
          note => note.id === nextNoteItem.id
        );

        if (index === -1) {
          return prevNoteList;
        }

        if (nextNoteItem.deleted) {
          return prevNoteList.filter(note => note.id !== nextNoteItem.id);
        }

        return [
          ...prevNoteList.slice(0, index),
          nextNoteItem,
          ...prevNoteList.slice(index + 1, prevNoteList.length)
        ];
      },
      newNoteItem: (prevNoteList, newNoteItem) => {
        if (!prevNoteList) return null;

        return [...prevNoteList, newNoteItem];
      }
    }
  },
  make: () => ({
    request: () => ({ http }) =>
      http({
        method: "GET",
        route: "/notes"
      })
  })
});

const getNoteList = makeGetNoteList();

export default getNoteList;
