import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';

import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';

import { fetchNotes } from '../../services/noteService';
import type { Note } from '../../types/note';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const perPage: number = 12;

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce<string>(search, 400);

  const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['notes', debouncedSearch, page],
  queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
  placeholderData: (previousData) => previousData,
});

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  const handleOpenModal = (): void => setIsModalOpen(true);
  const handleCloseModal = (): void => setIsModalOpen(false);

  const handleSearchChange = (value: string): void => {
    setPage(1);
    setSearch(value);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const handleCreated = async (): Promise<void> => {
    await refetch();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Завантаження...</p>}
      {isError && <p>Помилка при завантаженні</p>}

      {notes.length > 0 && (
       <NoteList 
          notes={notes} 
          queryKey={['notes', debouncedSearch, page]} 
        />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} onCreated={handleCreated} />
        </Modal>
      )}
    </div>
  );
}