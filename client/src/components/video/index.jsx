import { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { getStreamToken } from "@/services";
import { useToast } from "@/hooks/use-toast";

/**
 * VideoCall Component
 * 
 * Props:
 * @param {string} callId - Unique call ID (room ID)
 * @param {object} user - User object from your existing auth system
 *   - user.id: string (required) - User ID
 *   - user.name: string (optional) - User's display name
 *   - user.image: string (optional) - User's profile image URL
 * @param {string} authToken - Optional: JWT token from your existing auth system
 * @param {function} onCallEnd - Optional: Callback when call ends
 * @param {boolean} showControls - Whether to show call controls (default: true)
 */
const VideoCall = ({
  callId,
  user,
  authToken = null,
  onCallEnd = null,
  showControls = true,
}) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const initCall = async () => {
      if (!callId || !user?.id) {
        setError("Call ID and User ID are required");
        setIsConnecting(false);
        return;
      }

      try {
        setIsConnecting(true);
        setError(null);

        // Get Stream token from your backend
        const tokenData = await getStreamToken(user.id, authToken);

        if (!tokenData.token || !tokenData.apiKey) {
          throw new Error("Failed to get Stream token");
        }

        // Create Stream video client
        const videoClient = new StreamVideoClient({
          apiKey: tokenData.apiKey,
          user: {
            id: user.id,
            name: user.name || user.fullName || `User ${user.id}`,
            image: user.image || user.profilePic || undefined,
          },
          token: tokenData.token,
        });

        // Create and join the call
        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
        setIsConnecting(false);
      } catch (error) {
        console.error("Error initializing call:", error);
        setError(error.message || "Could not join the call. Please try again.");
        toast({
          title: "Error",
          description: error.message || "Could not join the call. Please try again.",
          variant: "destructive",
        });
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup on unmount
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [callId, user?.id, authToken]);

  if (isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Could not initialize call. Please refresh or try again later.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-900">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent onCallEnd={onCallEnd} showControls={showControls} />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

const CallContent = ({ onCallEnd, showControls }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.LEFT && onCallEnd) {
      onCallEnd();
    }
  }, [callingState, onCallEnd]);

  if (callingState === CallingState.LEFT) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-lg">Call ended</p>
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      {showControls && <CallControls />}
    </StreamTheme>
  );
};

export default VideoCall;