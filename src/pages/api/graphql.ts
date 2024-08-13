import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

const typeDefs = gql`
  type Note {
    id: String!
    title: String!
    createdAt: String!
    body: String!
  }

  type Query {
    notes: [Note!]!
    note(id: String!): Note
  }

  type Mutation {
    createNote(title: String!, body: String!): Note!
    updateNote(id: String!, title: String, body: String): Note!
    deleteNote(id: String!): Boolean!
  }
`;

type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const resolvers = {
  Query: {
    notes: async () => {
      try {
        const result = await pool.query<Note>('SELECT * FROM notes ORDER BY createdat DESC');
        return result.rows.map(row => {
          const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();
          if (isNaN(createdAt.getTime())) {
            console.error('Invalid date format for createdAt:', row.createdAt);
            throw new Error('Invalid date format');
          }
          return {
            ...row,
            id: row.id.toString(),
            createdAt: createdAt.toISOString(),
          };
        });
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw new Error('Failed to fetch notes');
      }
    },
    note: async (_: any, { id }: { id: string }) => {
      try {
        const result = await pool.query<Note>('SELECT * FROM notes WHERE id = $1', [id]);
        if (result.rows[0]) {
          const createdAt = result.rows[0].createdAt ? new Date(result.rows[0].createdAt) : new Date();
          if (isNaN(createdAt.getTime())) {
            console.error('Invalid date format for createdAt:', result.rows[0].createdAt);
            throw new Error('Invalid date format');
          }
          return {
            ...result.rows[0],
            id: result.rows[0].id.toString(),
            createdAt: createdAt.toISOString(),
          };
        }
        return null;
      } catch (error) {
        console.error('Error fetching note:', error);
        throw new Error('Failed to fetch note');
      }
    },
  },
  Mutation: {
    createNote: async (_: any, { title, body }: { title: string; body: string }) => {
      try {
        const result = await pool.query<Note>(
          'INSERT INTO notes (title, body, createdAt) VALUES ($1, $2, NOW()) RETURNING *',
          [title, body]
        );
        const note = result.rows[0];
        const createdAt = note.createdAt ? new Date(note.createdAt) : new Date();
        if (isNaN(createdAt.getTime())) {
          console.error('Invalid date format for createdAt:', note.createdAt);
          throw new Error('Invalid date format');
        }
        return {
          ...note,
          id: note.id.toString(),
          createdAt: createdAt.toISOString(),
        };
      } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to create note');
      }
    },
    updateNote: async (_: any, { id, title, body }: { id: string; title?: string; body?: string }) => {
      try {
        const result = await pool.query<Note>(
          'UPDATE notes SET title = COALESCE($1, title), body = COALESCE($2, body) WHERE id = $3 RETURNING *',
          [title, body, id]
        );

        if (result.rows.length === 0) {
          throw new Error('Note not found');
        }

        const note = result.rows[0];
        const createdAt = note.createdAt ? new Date(note.createdAt) : new Date();

        if (isNaN(createdAt.getTime())) {
          console.error('Invalid date format for createdAt:', note.createdAt);
          throw new Error('Invalid date format');
        }

        return {
          ...note,
          id: note.id.toString(),
          createdAt: createdAt.toISOString(),
        };
      } catch (error) {
        console.error('Error updating note:', error);
        throw new Error('Failed to update note');
      }
    },
    deleteNote: async (_: any, { id }: { id: string }) => {
      try {
        const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
      } catch (error) {
        console.error('Error deleting note:', error);
        throw new Error('Failed to delete note');
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server);
