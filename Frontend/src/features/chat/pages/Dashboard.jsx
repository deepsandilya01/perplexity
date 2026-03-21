import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import remarkGfm from "remark-gfm";

const formatChatTitle = (title) => {
  if (!title) return "New conversation";

  return title
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^\*+|\*+$/g, "")
    .replace(/^["'`]+|["'`]+$/g, "")
    .trim();
};

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const chatList = Object.values(chats);
  const currentChat = chats[currentChatId];

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(49,184,198,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.08),_transparent_18%),linear-gradient(180deg,_#090c12_0%,_#05070b_100%)] p-2 text-white sm:p-3 md:p-5">
      <section className="mx-auto flex min-h-[calc(100vh-1rem)] w-full flex-col gap-3 rounded-[24px] border border-white/10 bg-black/20 p-2 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:min-h-[calc(100vh-1.5rem)] sm:gap-4 sm:rounded-[30px] md:h-[calc(100vh-2.5rem)] md:flex-row md:gap-5">
        <aside className="hidden h-full w-80 shrink-0 rounded-[26px] border border-[#31b8c6]/15 bg-[linear-gradient(180deg,rgba(10,15,24,0.96),rgba(7,10,16,0.96))] p-5 md:flex md:flex-col">
          <div className="mb-6 rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7ee5ee]">
              Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
              Perplexity
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Fast conversations, cleaner history, and a calmer place to think.
            </p>
          </div>

          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-medium text-zinc-200">Recent Chats</h2>
            <span className="rounded-full border border-[#31b8c6]/20 bg-[#31b8c6]/10 px-2.5 py-1 text-xs text-[#9ceef4]">
              {chatList.length}
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {chatList.length ? (
              chatList.map((chatItem) => (
                <button
                  onClick={() => {
                    openChat(chatItem.id);
                  }}
                  key={chatItem.id}
                  type="button"
                  className={`w-full cursor-pointer rounded-2xl border px-4 py-3 text-left transition ${
                    currentChatId === chatItem.id
                      ? "border-[#31b8c6]/35 bg-[linear-gradient(135deg,rgba(49,184,198,0.16),rgba(49,184,198,0.05))] shadow-[0_12px_28px_rgba(49,184,198,0.12)]"
                      : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-white">
                    {formatChatTitle(chatItem.title)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Continue this thread
                  </p>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                No chats yet. Start by sending your first prompt.
              </div>
            )}
          </div>
        </aside>

        <section className="relative mx-auto flex min-h-[calc(100vh-1.75rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,16,24,0.94),rgba(8,11,17,0.98))] sm:min-h-[calc(100vh-2rem)] sm:rounded-[26px] md:h-full md:min-h-0">
          <header className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-4 py-4 sm:px-5 md:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7ee5ee]">
              Chat
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-white sm:text-2xl md:text-3xl">
                  {formatChatTitle(currentChat?.title)}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Ask anything and keep the answers flowing naturally.
                </p>
              </div>
              <div className="w-fit rounded-full border border-[#31b8c6]/20 bg-[#31b8c6]/10 px-3 py-1 text-xs text-[#a5eef3]">
                {currentChat?.messages?.length || 0} messages
              </div>
            </div>

            <div className="mt-4 md:hidden">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Recent Chats
                </h3>
                <span className="rounded-full border border-[#31b8c6]/20 bg-[#31b8c6]/10 px-2 py-0.5 text-[11px] text-[#a5eef3]">
                  {chatList.length}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {chatList.length ? (
                  chatList.map((chatItem) => (
                    <button
                      key={chatItem.id}
                      type="button"
                      onClick={() => {
                        openChat(chatItem.id);
                      }}
                      className={`min-w-[170px] rounded-2xl border px-3 py-3 text-left transition ${
                        currentChatId === chatItem.id
                          ? "border-[#31b8c6]/35 bg-[linear-gradient(135deg,rgba(49,184,198,0.16),rgba(49,184,198,0.05))]"
                          : "border-white/8 bg-white/[0.03]"
                      }`}
                    >
                      <p className="truncate text-sm font-medium text-white">
                        {formatChatTitle(chatItem.title)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">Open chat</p>
                    </button>
                  ))
                ) : (
                  <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                    No chats yet.
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="messages flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(49,184,198,0.05),_transparent_30%)] px-3 py-4 sm:px-4 sm:py-5 md:space-y-5 md:px-6 md:py-6">
            {currentChat?.messages?.length ? (
              currentChat.messages.map((message, index) => (
                <div
                  key={message.id || `${message.role}-${index}`}
                  className={`max-w-[92%] rounded-[22px] px-3.5 py-3 text-sm shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:max-w-[88%] sm:px-4 md:max-w-[85%] md:rounded-[26px] md:text-[15px] ${
                    message.role === "user"
                      ? "ml-auto rounded-br-md border border-[#31b8c6]/20 bg-[linear-gradient(135deg,#31b8c6,#6fe3ee)] text-[#041015]"
                      : "mr-auto rounded-bl-md border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] text-zinc-100"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="leading-7">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 leading-7 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 list-disc pl-5 leading-7">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-5 leading-7">
                            {children}
                          </ol>
                        ),
                        code: ({ children }) => (
                          <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-[#8fe7ee]">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#050913] p-4 shadow-inner shadow-black/30">
                            {children}
                          </pre>
                        ),
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-xl rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:px-6 sm:py-9 sm:rounded-[30px]">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,rgba(49,184,198,0.22),rgba(49,184,198,0.06))] text-lg font-bold text-[#9ceef4]">
                    Hey
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Start a thoughtful chat
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Ask a question, brainstorm an idea, or continue a saved
                    conversation from the left panel.
                  </p>
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,10,16,0.94),rgba(5,8,12,0.98))] p-3 sm:p-4 md:p-5">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Prompt
                </label>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-[#31b8c6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.16)]"
                />
              </div>
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-full rounded-2xl bg-[#31b8c6] px-6 py-3 text-base font-semibold text-[#041015] transition hover:bg-[#45c7d4] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
