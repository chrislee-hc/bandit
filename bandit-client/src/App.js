import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Game from "./Game";
// import SocketTest from "./SocketTest";
// import SocketTestInput from "./SocketTestInput";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div>
      {socket ? (
        <div>
          <Game socket={socket} />
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
  /*
  return (
    <div>
      <Game />
    </div>
  );
  */
}

export default App;
