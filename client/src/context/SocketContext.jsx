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
    
    // ✅ Use the Render backend URL from Vercel environment variables
    // Falls back to localhost for local development
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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