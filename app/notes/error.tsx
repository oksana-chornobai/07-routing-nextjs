'use client';

export default function GlobalError({ error }: { error: Error }) {
  return <p>Could not fetch data. {error.message}</p>;
}