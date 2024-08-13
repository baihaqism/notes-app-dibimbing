import { gql } from '@apollo/client';
import { Note } from './note';

export const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      title
      createdAt
      body
    }
  }
`;

export const GET_NOTE_ID = gql`
  query GetNoteId($id: String!) {
    note(id: $id) {
      id
      title
      createdAt
      body
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $body: String!) {
    createNote(title: $title, body: $body) {
      id
      title
      createdAt
      body
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: String!, $title: String, $body: String) {
    updateNote(id: $id, title: $title, body: $body) {
      id
      title
      body
      createdAt
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id)
  }
`;

export interface GetNotesData {
  notes: Note[];
}

export interface GetNoteByIdData {
  note: Note | null;
}

export interface CreateNoteData {
  createNote: Note;
}

export interface UpdateNoteData {
  updateNote: Note;
}

export interface DeleteNoteData {
  deleteNote: boolean;
}

export interface GetNotesVars {}

export interface GetNoteByIdVars {
  id: string;
}

export interface CreateNoteVars {
  title: string;
  body: string;
}

export interface UpdateNoteVars {
  id: string;
  title?: string;
  body?: string;
}

export interface DeleteNoteVars {
  id: string;
}
