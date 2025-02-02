'use client';
import React from 'react';
import { useCall } from '@stream-io/video-react-sdk';

const MuteButton: React.FC = () => {
  const call = useCall(); // Get the current call instance

  const muteAllExceptHost = async () => {
    if (!call) return;

    const participants = call.state.participants;
    const localUserId = call.state.localParticipant?.userId;

    for (const [userId, participant] of Object.entries(participants)) {
      if (userId === localUserId) continue; // Skip the host (local user)

      try {
        // Use the mute/unmute API methods instead
        await call.muteUser(userId);
      } catch (error) {
        console.error(`Failed to mute ${userId}:`, error);
      }
    }
  };

  return (
    <button
      onClick={muteAllExceptHost}
      className="bg-red-500 px-4 py-2 rounded-lg text-white"
    >
      Mute Everyone Except Host
    </button>
  );
};

export default MuteButton;
