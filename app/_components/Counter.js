'use client';

import { useState } from 'react';

export default function Counter({ users }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Users {users.length}</p>
      <button onClick={() => setCount((cur) => cur + 1)}>{count}</button>
    </div>
  );
}
