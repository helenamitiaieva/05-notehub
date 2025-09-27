import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

export default function NoteList({
  page,
  perPage,
  search,
  setTotalPages,
}: {
  page: number;
  perPage: number;
  search: string;
  setTotalPages: (n: number) => void;
}) {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }).then((r) => r.data),
  });

  const totalPages = data?.totalPages ?? 1;
  useEffect(() => { setTotalPages(totalPages); }, [totalPages, setTotalPages]);

  const del = useMutation({
    mutationFn: (id: string) => deleteNote(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes', page, perPage, search] });
    },
  });

  if (isLoading) return <p>Завантаження...</p>;
  if (isError) return <p>Помилка при завантаженні</p>;
  if (!data || !data.items || data.items.length === 0) return null; 

  return (
    <ul className={css.list}>
      {data.items.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content ?? note.body ?? ''}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag ?? 'Todo'}</span>
            <button className={css.button} onClick={() => del.mutate(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}