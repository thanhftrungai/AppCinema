import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Minus, Send, X } from "lucide-react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

const getApiBase = () => {
  // Vite: VITE_CHAT_API; CRA: REACT_APP_CHAT_API
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_CHAT_API) {
    return import.meta.env.VITE_CHAT_API;
  }
  if (typeof process !== "undefined" && process.env?.REACT_APP_CHAT_API) {
    return process.env.REACT_APP_CHAT_API;
  }
  return "http://localhost:4000";
};
const API_BASE = getApiBase();
const getWsUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_CHAT_WS) {
    return import.meta.env.VITE_CHAT_WS.replace(/^ws/, "http");
  }
  if (typeof process !== "undefined" && process.env?.REACT_APP_CHAT_WS) {
    return process.env.REACT_APP_CHAT_WS.replace(/^ws/, "http");
  }
  // Convert http(s) -> ws(s) and append /ws-chat
  try {
    const url = new URL(API_BASE);
    // SockJS requires http/https endpoint; it will upgrade as needed
    url.protocol = url.protocol === "https:" ? "https:" : "http:";
    url.pathname = "/ws-chat";
    return url.toString();
  } catch {
    return "http://localhost:4000/ws-chat";
  }
};
const WS_URL = getWsUrl();

export default function ChatWidget() {
  const username = useMemo(
    () => localStorage.getItem("username") || "guest",
    []
  );
  const userId = useMemo(() => username, [username]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stompRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "username") window.location.reload();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/messages/${encodeURIComponent(userId)}`
      );
      if (!res.ok) throw new Error("Khong tai duoc tin nhan");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Loi tai tin nhan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (stompRef.current && connectedRef.current) {
        stompRef.current.disconnect(() => {});
      }
      connectedRef.current = false;
      return;
    }

    fetchMessages();

    const socket = new SockJS(WS_URL);
    const stomp = Stomp.over(socket);
    stomp.debug = () => {}; // mute logs

    stomp.connect(
      {},
      () => {
        connectedRef.current = true;
        stomp.subscribe(`/topic/chat/${userId}`, (msg) => {
          try {
            const body = JSON.parse(msg.body);
            setMessages((prev) => {
              if (prev.some((m) => m.id === body.id)) return prev;
              return [...prev, body];
            });
          } catch {
            // ignore
          }
        });
      },
      () => {
        connectedRef.current = false;
        setError("Mat ket noi chat");
      }
    );

    stompRef.current = stomp;

    return () => {
      if (stompRef.current && connectedRef.current) {
        stompRef.current.disconnect(() => {});
      }
      connectedRef.current = false;
    };
  }, [isOpen, userId]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;

    setDraft("");

    if (stompRef.current && connectedRef.current) {
      stompRef.current.send(
        `/app/chat/${userId}`,
        {},
        JSON.stringify({ userId, text, from: "user" })
      );
      return;
    }

    // fallback HTTP nếu WS không kết nối
    const optimistic = {
      id: `tmp_${Date.now()}`,
      userId,
      from: "user",
      text,
      createdAt: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    fetch(`${API_BASE}/api/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text, from: "user" }),
    })
      .then(fetchMessages)
      .catch(() => setError("Gui tin nhan that bai"));
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 transition"
        >
          <MessageCircle className="w-5 h-5" />
          Chat voi admin
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">Ho tro truc tuyen</div>
              <div className="text-[11px] text-white/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Admin se phan hoi som nhat
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition"
                aria-label="Thu nho chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition"
                aria-label="Dong chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-3 max-h-[380px] overflow-y-auto bg-gray-50">
            {loading && (
              <div className="text-xs text-gray-500 text-center">
                Dang tai tin nhan...
              </div>
            )}
            {error && (
              <div className="text-xs text-red-500 text-center">{error}</div>
            )}
            {messages.map((m) => {
              const isUser = m.from !== "admin";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isUser
                        ? "bg-red-600 text-white rounded-br-md"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {m.text}
                    </div>
                    <div
                      className={`mt-1 text-[11px] ${
                        isUser ? "text-white/80" : "text-gray-400"
                      }`}
                    >
                      {new Date(m.at || m.createdAt).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {!messages.length && (
              <div className="text-xs text-gray-500 text-center">
                Hay dat cau hoi hoac nhan tin cho Admin. Tin nhan duoc luu lai
                de xem khi can.
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                placeholder="Nhap tin nhan..."
              />
              <button
                type="button"
                onClick={sendMessage}
                className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow hover:from-red-700 hover:to-red-800 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Enter de gui, Shift+Enter de xuong dong
            </div>
          </div>
        </div>
      )}
    </>
  );
}
