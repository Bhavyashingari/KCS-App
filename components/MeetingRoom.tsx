'use client';

import { useState, useEffect } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';

import { Chat, Channel, Window, MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'stream-chat-react/dist/css/v2/index.css';

import { useRouter } from 'next/navigation';
import { Users, LayoutList, MessageSquare } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import MuteButton from './MuteButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

interface MeetingRoomProps {
  apiKey: string;
  userToken: string;
  userData: {
    id: string;
    name?: string;
    image?: string;
  };
}

const MeetingRoom = ({ apiKey, userToken, userData }: MeetingRoomProps) => {
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const callingState = useCallCallingState();

  // Initialize Chat Client with Error Handling
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  useEffect(() => {
    if (!apiKey || !userToken || !userData) {
      setError('Missing required configuration');
      setIsLoading(false);
      return;
    }

    let client: StreamChat | null = null;

    const initChat = async () => {
      try {
        console.log('Initializing chat client...', { apiKey, userData });
        client = StreamChat.getInstance(apiKey);
        
        await client.connectUser(userData, userToken);
        console.log('Chat client connected successfully');
        setChatClient(client);
      } catch (err) {
        console.error('Chat initialization failed:', err);
        setError('Failed to initialize chat');
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser();
        setChatClient(null);
      }
    };
  }, [apiKey, userToken, userData]);

  // Initialize Video Client
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  useEffect(() => {
    if (!apiKey || !userToken || !userData) return;

    let client: StreamVideoClient | null = null;

    try {
      client = new StreamVideoClient({
        apiKey,
        user: userData,
        token: userToken,
      });
      setVideoClient(client);
      console.log('Video client initialized successfully');
    } catch (err) {
      console.error('Video initialization failed:', err);
      setError('Failed to initialize video');
    }

    return () => {
      if (client) {
        client.disconnectUser();
        setVideoClient(null);
      }
    };
  }, [apiKey, userToken, userData]);

  // Setup Chat Channel
  const [channel, setChannel] = useState<any>(null);
  useEffect(() => {
    if (!chatClient || !userData?.id) return;

    const initChannel = async () => {
      try {
        console.log('Creating chat channel...');
        const channelId = 'meeting-chat';
        
        const newChannel = chatClient.channel('messaging', channelId, {
          name: 'Meeting Chat',
          members: [userData.id],
          created_by_id: userData.id,
        });

        await newChannel.watch();
        console.log('Channel created and watched successfully');
        setChannel(newChannel);
      } catch (err) {
        console.error('Channel initialization failed:', err);
        setError('Failed to initialize chat channel');
      }
    };

    initChannel();
  }, [chatClient, userData]);

  // Error Display Component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="p-6 text-center rounded-lg bg-red-600">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{message}</p>
      </div>
    </div>
  );

  if (error) return <ErrorDisplay message={error} />;
  if (isLoading || callingState !== CallingState.JOINED) return <Loader />;

  const isHost = call?.state.localParticipant?.roles?.includes('host');

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    chatClient && videoClient && call ? (
      <Chat client={chatClient} theme="messaging dark">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
              <div className="relative flex items-center justify-center size-full">
                <div
                  className={cn('flex items-center size-full max-w-[1000px]', {
                    'max-w-[800px]': showChat || showParticipants,
                  })}
                >
                  <CallLayout />
                </div>

                {/* Participants List */}
                {showParticipants && !showChat && (
                  <div className="ml-2 h-[calc(100vh-86px)] w-80">
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                  </div>
                )}

                {/* Chat Panel */}
                {showChat && !showParticipants && channel && (
                  <div className="ml-2 h-[calc(100vh-86px)] w-80 overflow-hidden rounded-lg bg-[#19232d]">
                    <Channel channel={channel}>
                      <Window>
                        <MessageList />
                        <MessageInput focus />
                      </Window>
                    </Channel>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 pb-4">
                <CallControls onLeave={() => router.push('/')} />

                {isHost && <MuteButton />}

                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] cursor-pointer">
                    <LayoutList size={20} className="text-white" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-dark-1 border-dark-1 text-white">
                    {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item) => (
                      <DropdownMenuItem
                        key={item}
                        onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <CallStatsButton />

                <button
                  onClick={() => {
                    setShowParticipants((prev) => !prev);
                    setShowChat(false);
                  }}
                  className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] cursor-pointer"
                >
                  <Users className="text-white" />
                </button>

                <button
                  onClick={() => {
                    setShowChat((prev) => !prev);
                    setShowParticipants(false);
                  }}
                  className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] cursor-pointer"
                >
                  <MessageSquare className="text-white" />
                </button>
              </div>
            </section>
          </StreamCall>
        </StreamVideo>
      </Chat>
    ) : (
      <Loader />
    )
  );
};

export default MeetingRoom;
