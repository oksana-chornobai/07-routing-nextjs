'use client';

import { useState } from 'react';
import { fetchNotes } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './Notes.module.css';
import { useQuery, keepPreviousData } from '@tanstack/react-query';



export default function NotesClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // скидаємо сторінку одразу при зміні пошуку
  };

const { data, isLoading, error } = useQuery({
  queryKey: ['notes', page, debouncedSearch],
  queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
  placeholderData: keepPreviousData,
});

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div className={css.wrapper}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {typeof data?.totalPages === 'number' && data.totalPages > 1 && (
  <Pagination
    pageCount={data.totalPages}
    currentPage={page}
    onPageChange={setPage}
  />
)}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {data?.notes.length ? <NoteList notes={data.notes} /> : <p>No notes found.</p>}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}