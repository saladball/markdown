import { createHttpProxy } from "resift";
import shortId from "shortid";
import delay from "delay";
import moment from "moment";
import { stripIndent } from "common-tags";

const waitTime = 1000;

let noteData = [
  {
    id: "sJxbrzBcn",
    content: stripIndent`
      # What is this app?

      This app is a basic CRUD app created to demonstrate the developer experience of ReSift.

      Below is a summary of the modules and components within the app.

      ## Modules, components, and endpoints

      There are 5 (mock) endpoints:

      1. \`GET /notes\` — get all the note
      2. \`POST /notes\` — create a note
      3. \`GET /notes/:id\` — get an individual note
      4. \`PUT /notes/:id\` — edit an individual note
      5. \`DELETE /notes/:id\` — delete an individual note


      Each of these endpoints have a corresponding fetch factory:

      1. \`/fetches/getNoteList.js\`
      2. \`/fetches/createNoteItem.js\`
      3. \`/fetches/makeGetNoteItem.js\`
      4. \`/fetches/makeUpdateNoteItem.js\`
      5. \`/fetches/makeDeleteNoteItem.js\`


      There 4 components within the \`App\` component:

      1. \`AppBar\`
      2. \`NewNoteDialog\`
      3. \`NoteItem\`
      4. \`NoteList\`
    `,
    updatedAt: moment().toISOString()
  },
  {
    id: "O18cyvOq",
    content: stripIndent`
      # What are fetches?
      
      In ReSift, a **fetch** (it's a noun in this case) is the unit/token that represents information about your request.

      > Don't mix ReSift's concept of fetches with \`window.fetch\`

      ## Fetch factories

      In ReSift, you define a type of request using \`defineFetch\`:

      \`\`\`js
      import { defineFetch } from 'resift';

      // prefix the fetch factory with \`make\`
      const makeGetPerson = defineFetch({
        displayName: 'Get Person',
        make: personId => ({
          request: () => ({ http }) => http({
            method: 'GET',
            route: \`/api/people/\${personId}\`
          })
        }),
      });

      export default makeGetPerson;
      \`\`\`

      ## Fetch instances

      Fetch factories produce **fetch instances**. You can use fetch instances to dispatch requests and pull data from the local cache.

      \`\`\`js
      import React, { useEffect } from 'react';
      import { useData, useStatus, useDispatch, isLoading, Guard } from 'resift';
      import makeGetPerson from './makeGetPerson';

      function Person({ id }) {
        // make the fetch instance
        const getPerson = makeGetPerson(id);

        // use these custom hooks to pull the data and status from local cache
        const person = useData(getPerson); // NOTE: \`person\` is null if there is no data for this fetch
        const status = useStatus(getPerson);

        // pull dispatch and use it in effects to dispatch requests
        const dispatch = useDispatch();

        // use an effect to fetch the person when this component mount
        useEffect(() => {
          dispatch(getPerson());
        }, [dispatch, getPerson])

        return (
          <div>
            {isLoading(status) && <Spinner />}
            {person && <div>{person.name}</div>}

            {/* you can also use the \`Guard\` component so you don't have to deal with nulls */}
            <Guard fetch={getPerson}>{person => <div>{person.name}</div>}</Guard>
          </div>
        );
      }

      export default Person;
      \`\`\`

    `,
    updatedAt: moment("10/03/2019", "MM-DD-YYYY").toISOString()
  },
  {
    id: "Q8DkWQ9M",
    content: stripIndent`
      # Globalness and sharing state

      ## Sharing state

      Fetch and fetch factories are often related to one another.

      For example, if you had a fetch for a \`PUT\` request for a person, you'd probably want the data as part of the \`GET\` request to update as well.

      You can do this using \`share\` and \`namespace\` in ReSift:

      \`\`\`js
      import { defineFetch } from 'resift';

      const makeGetPerson = defineFetch({
        displayName: 'Get Person',
        share: { namespace: 'person' }, // 👈 this tells resift this state should be shared
        make: personId => ({
          request: () => ({ http }) => http({
            method: 'GET',
            route: \`/api/people/\${personId}\`,
          }),
        }),
      });

      const makeUpdatePerson = defineFetch({
        displayName: 'Update Person',
        share: { namespace: 'person', }, // 👈 this namespace has to match the above
        make: personId => ({
          request: updatedPerson => ({ http }) => http({
            method: 'PUT',
            route: \`/api/people/\${personId}\`,
            data: updatedPerson,
          }),
        }),
      });
      \`\`\`

      ## Globalness

      An important thing to realize about ReSift and its fetches is that they are global.

      By "global", we mean that fetches dispatch from one component can be pull anywhere else in the React tree.

      So you can dispatch requests anywhere and pull data anywhere.
      
      For example, the \`AppBar\` component in this app has a spinning syncing indictaor that spins whenever a note is getting or saving data.
      
      The state of the status doesn't need to be drilled into \`NoteItem\` and \`AppBar\` because both component can pull them from ReSift state.
    `,
    updatedAt: moment("9/27/2019", "MM-DD-YYYY").toISOString()
  },
  {
    id: "OiHZXNi8",
    content: stripIndent`
      # Data consistency via shares

      The previous note introduced shares. This note takes it a step further.

      You can share state across different namespaces by using merges.

      In this app, there is a fetch for all the notes (\`getNoteList\`) and there is a fetch for a single note (\`makeGetNoteItem\`).

      When a note item updates, it would be ideal if the note list also was notified since both fetches are related.

      We can tell ReSift what to do with the current namespace when another namespace changes.

      \`\`\`js
      import { defineFetch } from 'resift';

      const makeGetNoteList = defineFetch({
        displayName: 'Get Note List',
        share: {
          namespace: 'noteList',
          merge: {
            // this tells ReSift to handle data coming from another namespace
            // this function is similar to redux reducers if you're familiar
            noteItem: (previousNoteList, nextNoteItem) => {
              if (!previousNoteList) return null;

              const index = previousNoteList.findIndex(note => note.id === nextNoteItem.id);

              if (index === -1) return previousNoteList;

              return [
                ...previousNoteList.slice(0, index),
                nextNoteItem,
                ...previousNoteList.slice(index + 1, previousNoteList.length),
              ];
            }
          },
        },
        make: () => ({
          request: () => ({ http }) => http({
            method: 'GET',
            route: '/api/notes',
          }),
        }),
      });

      const makeGetNoteItem = defineFetch({
        displayName: 'Get Note Item',
        share: {
          namespace: 'noteItem',
          merge: {
            noteList: (previousNoteItem, nextNoteList) => {
             // ... omitted for brevity
            },
          },
        },
        make: noteItemId => ({
          request: () => ({ http }) => http({
            method: 'GET',
            route: \`/api/notes/\${noteItemId}\`,
          }),
        })
      })
      \`\`\`
    `,
    updatedAt: moment("9/03/2019", "MM-DD-YYYY").toISOString()
  },
  {
    id: "FUwMTEJ4",
    content: stripIndent`
      # Where to go from here

      - Play around with the code in this playground!
      - Check out the rest of the docs at [resift.org](https://resift.org)!
      - If you have any ideas, don't hesitate to [contribute](https://github.com/JustSift/ReSift).
    `,
    updatedAt: moment("9/03/2019", "MM-DD-YYYY").toISOString()
  }
];

export const notes = createHttpProxy(
  { path: "/notes", exact: true },
  async ({ requestParams }) => {
    await delay(waitTime);

    const { method, data } = requestParams;

    if (method === "GET") {
      // send a shallow copy just in case.
      // with a real API, the object returned would always be fresh references
      return [...noteData];
    }

    if (method === "POST") {
      const newNote = {
        ...data,
        id: shortId()
      };
      noteData.push(newNote);

      return newNote;
    }
  }
);

export const note = createHttpProxy(
  "/notes/:id",
  async ({ requestParams, match }) => {
    await delay(waitTime);

    const { method, data } = requestParams;
    const { id } = match.params;

    if (method === "GET") {
      const note = noteData.find(note => note.id === id);
      if (!note) throw new Error("Not Found");

      return note;
    }

    if (method === "PUT") {
      const index = noteData.findIndex(note => note.id === id);
      if (index === -1) throw new Error("Not Found");

      noteData[index] = data;
      return data;
    }

    if (method === "DELETE") {
      const note = noteData.find(note => note.id === id);
      if (!note) throw new Error("Not Found");

      noteData = noteData.filter(note => note.id !== id);
      return undefined;
    }
  }
);
