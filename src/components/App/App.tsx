import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';

import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';


export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);

  const [totalPages, setTotalPages] = useState(1);
  const qc = useQueryClient();

  function handleCreated() {
    qc.invalidateQueries({ queryKey: ['notes', page, perPage, debouncedSearch] });
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={(v) => { setPage(1); setSearch(v); }} />
        <Pagination pageCount={totalPages} onPageChange={setPage} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList
        page={page}
        perPage={perPage}
        search={debouncedSearch}
        setTotalPages={setTotalPages}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
        </Modal>
      )}
    </div>
  );
}