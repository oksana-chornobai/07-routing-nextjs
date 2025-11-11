'use client';

type Props = {
  error: Error;
};

export default function Error({ error }: Props) {
  return <p>Failed to load notes. {error.message}</p>;
}