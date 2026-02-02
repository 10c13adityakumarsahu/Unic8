import VideoCall from "@/components/video";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VideoCallPage() {
    const { auth } = useContext(AuthContext);
    const { callId } = useParams();
    const navigate = useNavigate();

    const handleCallEnd = () => {
        navigate(-1);
    };

    return (
        <VideoCall
            callId={callId}
            user={{
                id: auth?.user?._id,
                name: auth?.user?.userName,
                image: auth?.user?.userImage,
            }}
            onCallEnd={handleCallEnd}
        />
    );
}

export default VideoCallPage;
