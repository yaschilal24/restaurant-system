// import { createContext, useState, useEffect, useContext } from 'react';
// import { io } from 'socket.io-client';
// import { AuthContext } from './AuthContext';

// export const SocketContext = createContext(null);

// export function SocketProvider({ children }) {
//   const { user } = useContext(AuthContext);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const s = io('/', {
//       auth: { token },
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//     });
//     setSocket(s);
//     return () => s.disconnect();
//   }, [user?.id]);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// }

import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Check if we are running locally or in production
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    // Hardcode the Render URL for production (Vercel cannot proxy WebSockets)
    const SOCKET_URL = isProduction 
      ? 'https://restaurant-system-gmj1.onrender.com' 
      : 'http://localhost:5000';

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    
    setSocket(s);
    return () => s.disconnect();
  }, [user?.id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}