import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Game from "./Game";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const USE_PROD_SERVER = false;
    let newSocket;
    if (USE_PROD_SERVER) {
      newSocket = io("https://bandit-server-production.up.railway.app/");
    } else {
      newSocket = io(`http://${window.location.hostname}:3000`);
    }
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
}

export default App;
