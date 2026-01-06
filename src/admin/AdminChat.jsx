import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { db } from "../lib/firebase";

const cn = (...classes) => classes.filter(Boolean).join(" ");

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

export default function AdminChat() {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);

  // Realtime conversations list
  useEffect(() => {
    setLoadingUsers(true);
    const q = query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const mapped = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().userId || d.id,
          last: d.data().lastMessage || "Chua co tin nhan",
          unread: d.data().unread || 0,
        }));
        setAllUsers(mapped);
        setUsers(mapped);
        if (!activeUserId && mapped[0]) setActiveUserId(mapped[0].id);
        setLoadingUsers(false);
      },
      (err) => {
        setError(err.message || "Loi tai danh sach chat");
        setLoadingUsers(false);
      }
    );
    return () => unsub();
  }, [activeUserId]);

  // Realtime messages of active conversation
  useEffect(() => {
    if (!activeUserId) {
      setMessages([]);
      return undefined;
    }
    setLoadingMessages(true);
    const q = query(
      collection(db, "conversations", activeUserId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingMessages(false);
      },
      (err) => {
        setError(err.message || "Loi tai tin nhan");
        setLoadingMessages(false);
      }
    );
    return () => unsub();
  }, [activeUserId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers(allUsers);
      return;
    }
    const q = searchTerm.toLowerCase();
    setUsers(
      allUsers.filter(
        (u) => u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, allUsers]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !activeUserId) return;
    setDraft("");

    try {
      const convoRef = doc(db, "conversations", activeUserId);
      await setDoc(
        convoRef,
        {
          userId: activeUserId,
          lastMessage: text,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await addDoc(collection(convoRef, "messages"), {
        text,
        from: "admin",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err.message || "Khong gui duoc tin nhan");
    }
  };

  const activeUser = useMemo(
    () => allUsers.find((u) => u.id === activeUserId) || null,
    [allUsers, activeUserId]
  );

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex">
      {/* Left: user list */}
      <div className="w-[320px] border-r bg-white">
        <div className="p-4 border-b">
          <div className="text-lg font-bold text-gray-900">Chat</div>
          <div className="text-xs text-gray-500">Admin chat qua Firebase</div>
        </div>

        <div className="p-3">
          <input
            placeholder="Tim user..."
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto h-full pb-24">
          {loadingUsers && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Dang tai danh sach chat...
            </div>
          )}
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setActiveUserId(u.id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition",
                activeUserId === u.id && "bg-red-50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{u.name}</div>
                {activeUserId === u.id && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-600 text-white">
                    Dang mo
                  </span>
                )}
                {u.unread > 0 && activeUserId !== u.id && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    {u.unread} moi
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 truncate mt-1">{u.last}</div>
            </button>
          ))}
          {!users.length && !loadingUsers && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Khong tim thay user phu hop.
            </div>
          )}
        </div>
      </div>

      {/* Right: conversation */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-900">
              {activeUser ? `User: ${activeUser.name}` : "Chon user de chat"}
            </div>
            <div className="text-xs text-gray-500">Du lieu qua Firebase</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {loadingMessages && (
            <div className="text-sm text-gray-500">Dang tai tin nhan...</div>
          )}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {messages.map((m) => {
            const isAdmin = m.from === "admin";
            return (
              <div
                key={m.id}
                className={cn("flex", isAdmin ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    isAdmin
                      ? "bg-red-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                  <div
                    className={cn(
                      "mt-1 text-[11px]",
                      isAdmin ? "text-white/80" : "text-gray-400"
                    )}
                  >
                    {formatTime(m.createdAt || m.at)}
                  </div>
                </div>
              </div>
            );
          })}

          {!messages.length && !loadingMessages && (
            <div className="text-sm text-gray-500">
              Chua co tin nhan. Hay bat dau cuoc tro chuyen.
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2 items-end">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Nhap tin nhan cho user..."
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={!activeUserId}
            />
            <button
              type="button"
              onClick={send}
              disabled={!activeUserId}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50"
            >
              Gui
            </button>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            Enter de gui, Shift+Enter de xuong dong
          </div>
        </div>
      </div>
    </div>
  );
}
