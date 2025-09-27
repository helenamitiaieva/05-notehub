import axios, { type AxiosResponse } from 'axios';
import { type Note } from '../types/note';

const API_BASE = import.meta.env.VITE_API_BASE as string;
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN as string;

const http = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  if (TOKEN) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${TOKEN}`;
  }
  return config;
});

export type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

export function fetchNotes(
  params: FetchNotesParams = {}
): Promise<AxiosResponse<Paginated<Note>>> {
  return http.get<Paginated<Note>>('/notes', { params });
}

export function createNote(
  payload: { title: string; body: string; tag: Note['tag'] }
): Promise<AxiosResponse<Note>> {
  return http.post<Note>('/notes', payload);
}

export function deleteNote(id: string): Promise<AxiosResponse<Note>> {
  return http.delete<Note>(`/notes/${id}`);
}