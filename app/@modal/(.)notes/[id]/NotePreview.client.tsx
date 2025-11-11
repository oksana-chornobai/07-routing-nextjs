'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '../../../../components/Modal/Modal'; // якщо є
import css from './NotePreview.module.css';

type Props = {
  id: string;
};

export default function NotePreview({ id }: Props) {
  const router = useRouter();
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (isLoading) {
    return <div className={css.loading}>Завантаження...</div>;
  }

  if (error || !note) {
    return <div className={css.error}>Не вдалося завантажити нотатку.</div>;
  }

  return (
    <Modal onClose={handleClose}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p><strong>Tag:</strong> {note.tag}</p>
      <p><strong>Created:</strong> {new Date(note.createdAt).toLocaleString()}</p>
      <button onClick={handleClose}>Закрити</button>
    </Modal>
  );
}