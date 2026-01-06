import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Minus, Send, X } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const formatTime = (value) => {
  try {
    const d =
      value?.toDate?.() instanceof Date
        ? value.toDate()
        : value instanceof Date
          ? value
          : new Date(value);
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

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

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "username") window.location.reload();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Realtime listener for this user's conversation
  useEffect(() => {
    if (!isOpen) return undefined;
    setLoading(true);
    const q = query(
      collection(db, "conversations", userId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Loi tai tin nhan");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [isOpen, userId]);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");

    try {
      const convoRef = doc(db, "conversations", userId);
      await setDoc(
        convoRef,
        {
          userId,
          lastMessage: text,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await addDoc(collection(convoRef, "messages"), {
        text,
        from: "user",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err.message || "Gui tin nhan that bai");
    }
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
                      {formatTime(m.createdAt || m.at)}
                    </div>
                  </div>
                </div>
              );
            })}

            {!messages.length && !loading && (
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
