import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE as string,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN as string}`;
  return config;
});

export interface FetchNotesParams {
  page?: number;              
  perPage?: number;            
  search?: string;          
  tag?: NoteTag;               
  sortBy?: 'createdAt' | 'title' | 'tag';
  order?: 'asc' | 'desc';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(params: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const {
    page = 1,
    perPage = 12,
    search,
    tag,
    sortBy,
    order,
  } = params;

  const res = await http.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: search?.trim() || undefined,
      tag,
      sortBy,
      order,
    },
  });
  return res.data;
}

export async function createNote(payload: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> {
  const res = await http.post<Note>('/notes', payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await http.delete<Note>(`/notes/${id}`);
  return res.data;
}