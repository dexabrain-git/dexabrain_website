'use client';

import { useState } from 'react';
import InviteOverlay from '@/components/InviteOverlay';
import MainEventPage from '@/components/MainEventPage';

export default function NeuroResetAwarenessSeminar() {
  const [showInvite, setShowInvite] = useState(true);

  return (
    <>
      {showInvite ? (
        <InviteOverlay 
          onClick={() => setShowInvite(false)}
          // You can pass a custom background image here
          // backgroundImage="/assets/custom-bg.jpg"
        />
      ) : (
        <MainEventPage />
      )}
    </>
  );
} 