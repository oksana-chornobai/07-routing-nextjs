'use client';

import css from './Notes.module.css';
import { useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoResult from '@/components/NoResult/NoResult';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import { NoteTag } from '@/types/note';

interface Props {
  tag?: NoteTag;
}

export default function Notes({ tag }: Props) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery({
    queryKey: ['notes', searchQuery, currentPage, tag],
    queryFn: () =>
      fetchNotes({ search: searchQuery, page: currentPage, perPage, tag }),
    placeholderData: keepPreviousData,
  });

  const handleCreateNote = () => {
    setCurrentPage(1);
    queryClient.invalidateQueries({
      queryKey: ['notes'],
    });
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          textInput={searchInput}
          onSearch={value => {
            setSearchInput(value);
            debouncedSearch(value);
          }}
        />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => setModalOpen(true)}
          disabled={isLoading || isFetching}
        >
          Create note +
        </button>
      </div>
      {isError && <div className={css.error}>Помилка при завантаженні нотаток</div>}
      {!isLoading && !isError && data?.notes.length === 0 && <NoResult />}
      {isSuccess && data?.notes?.length > 0 && <NoteList notes={data.notes} />}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onSuccess={handleCreateNote}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}