import { useRef, useState } from "react";

type UseWebSocketConfig = {
  wsBaseUrl: string;
  getToken: () => Promise<{ data?: { results?: { token?: string } } }>;
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
};

export function useWebSocket({
  wsBaseUrl,
  getToken,
  onMessage,
  onOpen,
  onClose,
}: UseWebSocketConfig) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Connect function to manually start WS connection and send config
  async function connect(config: any) {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      const response = await getToken();
      const token = (response?.data?.results ?? { token: "" }).token ?? "";

      const wsUrl = `${wsBaseUrl}?token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsRunning(true);
        ws.send(JSON.stringify(config));
        if (onOpen) onOpen();
      };

      ws.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          data = event.data;
        }
        if (onMessage) onMessage(data);
      };

      ws.onclose = (event) => {
        setIsRunning(false);
        if (onClose) onClose(event);
      };

      ws.onerror = (error) => {
        setIsRunning(false);
      };
    } catch {
      setIsRunning(false);
    }
  }

  // Optional cleanup function
  function disconnect() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, "Manual disconnect");
    }
  }

  return { connect, disconnect, isRunning };
}
