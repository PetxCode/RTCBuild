import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";

const RemoteDisplay = () => {
  const { roomID } = useParams();

  const shareVideo = useRef();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const userStream = useRef();
  const otherUser = useRef();
  const socketRef = useRef();
  const peerRef = useRef();

  const servers = {
    iceServers: [
      {
        url: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
      },
    ],
  };

  const share = () => {
    navigator.mediaDevices.getDisplayMedia().then((stream) => {
      shareVideo.current.srcObject = stream;
    });
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socketRef.current = io("http://localhost:2344");
        socketRef.current.emit("join room", roomID);

        socketRef.current.on("other user", (userID) => {
          callUser(userID);
          socketRef.current = userID;
        });

        socketRef.current.on("user joined", (userID) => {
          socketRef.current = userID;
        });

        socketRef.current.on("offer", handleReceived);
        socketRef.current.on("answer", handleAnswer);
        socketRef.current.on("ice-candidate", handleIceCanadidateMGS);
      });
  }, []);

  const callUser = (userID) => {
    peerRef.current = createPeer(userID);

    userStream.current.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, userStream.current);
    });
  };

  const createPeer = (userID) => {
    const peer = new RTCPeerConnection(servers);

    peer.onicecandidate = handleIceCandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
  };

  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current
      .createOffer()
      .then((offer) => {
        peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("offer", payload);
      });
  };

  const handleTrackEvent = (e) => {
    partnerVideo.current.srcObject = e.streams[0];
  };

  const handleIceCandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  };

  return (
    <div>
      <center>
        <h1>Remote Display</h1>
        <br />
        <br />
        <video autoPlay playsInline ref={userVideo} />
        <video autoPlay playsInline ref={partnerVideo} />
        <br />
        <br />
        <button onClick={share}>Share Screen</button>
        <video
          ref={shareVideo}
          autoPlay
          playsInline
          style={{ width: "500px", height: "300px", objectFit: "contain" }}
        />
      </center>
    </div>
  );
};

export default RemoteDisplay;
