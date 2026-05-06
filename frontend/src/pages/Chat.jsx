import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createThread, listThreads, deleteThread, chatInThread, getThreadMessages } from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Plus, Trash2, Send, Bot, User, ArrowRight, Loader, MessageSquare } from 'lucide-react';

/* ── Markdown components for neo-brutalist styling ─────────────────────────── */
const mdComponents = {
  // Tables
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        border: '3px solid #000', fontFamily: 'Space Grotesk, sans-serif',
      }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: '#000', color: '#fff' }}>{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr style={{ borderBottom: '2px solid #000' }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th style={{
      padding: '10px 14px', textAlign: 'left',
      fontWeight: 900, fontSize: 12, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: '#fff',
      borderRight: '2px solid rgba(255,255,255,0.2)',
    }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{
      padding: '10px 14px', fontSize: 14, fontWeight: 500,
      borderRight: '2px solid rgba(0,0,0,0.1)',
      background: 'inherit',
    }}>{children}</td>
  ),
  // Headings
  h1: ({ children }) => (
    <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, marginTop: 20, borderBottom: '3px solid #000', paddingBottom: 6 }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, marginTop: 16 }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: 15, fontWeight: 900, marginBottom: 8, marginTop: 12, background: 'var(--muted)', padding: '4px 10px', display: 'inline-block' }}>{children}</h3>
  ),
  // Text
  p: ({ children }) => (
    <p style={{ marginBottom: 10, lineHeight: 1.75, fontSize: 15 }}>{children}</p>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 900 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.75)' }}>{children}</em>
  ),
  // Code
  code: ({ inline, children }) => inline ? (
    <code style={{
      background: 'rgba(0,0,0,0.08)', padding: '2px 6px',
      fontFamily: 'monospace', fontSize: 13, border: '1px solid rgba(0,0,0,0.15)',
    }}>{children}</code>
  ) : (
    <pre style={{
      background: '#1a1a1a', color: '#e8e8e8', padding: '16px 20px',
      margin: '12px 0', overflow: 'auto', borderRadius: 0,
      border: '3px solid #000', fontFamily: 'monospace', fontSize: 13,
    }}>
      <code>{children}</code>
    </pre>
  ),
  // Lists
  ul: ({ children }) => (
    <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 6, fontSize: 15, lineHeight: 1.7 }}>{children}</li>
  ),
  // Blockquote
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '5px solid var(--accent)', paddingLeft: 16,
      margin: '12px 0', color: 'rgba(0,0,0,0.7)', fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
  // HR
  hr: () => (
    <hr style={{ border: 'none', borderTop: '3px solid #000', margin: '16px 0' }} />
  ),
};

/* ── Tool call indicator ────────────────────────────────────────────────────── */
function ToolCallLine({ line }) {
  const isCalling = line.startsWith('🔧');
  const isDone = line.startsWith('✅');
  if (!isCalling && !isDone) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 12px', marginBottom: 6,
      border: '2px solid #000',
      background: isDone ? 'var(--secondary)' : 'var(--muted)',
      fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
      letterSpacing: '0.04em',
    }}>
      <span>{line}</span>
    </div>
  );
}

/* ── Single message bubble ──────────────────────────────────────────────────── */
function Message({ role, content }) {
  const isUser = role === 'user';

  // Split off tool call lines (🔧 / ✅) from actual markdown content
  const lines = content.split('\n');
  const toolLines = lines.filter(l => l.startsWith('🔧') || l.startsWith('✅'));
  const mdContent = lines.filter(l => !l.startsWith('🔧') && !l.startsWith('✅')).join('\n').trim();

  return (
    <div style={{
      display: 'flex', gap: 12,
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 28, alignItems: 'flex-start',
    }}>
      {!isUser && (
        <div style={{
          width: 38, height: 38, border: '3px solid #000', background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4,
        }}>
          <Bot size={18} strokeWidth={3} />
        </div>
      )}

      <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Tool call badges */}
        {!isUser && toolLines.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
            {toolLines.map((l, i) => <ToolCallLine key={i} line={l} />)}
          </div>
        )}

        {/* Message body */}
        {mdContent && (
          <div style={{
            padding: '16px 20px',
            border: '3px solid #000',
            background: isUser ? '#000' : '#fff',
            color: isUser ? '#fff' : '#000',
            boxShadow: isUser ? '4px 4px 0 0 var(--accent)' : '4px 4px 0 0 #000',
          }}>
            {isUser ? (
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {mdContent}
              </p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
              >
                {mdContent}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div style={{
          width: 38, height: 38, border: '3px solid #000', background: 'var(--secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4,
        }}>
          <User size={18} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

/* ── Suggestions ────────────────────────────────────────────────────────────── */
const SUGGESTIONS = [
  'Find React engineers with 3+ years experience',
  'Show me backend developers open to full-time',
  'Who has Flask and PostgreSQL skills?',
  'Find engineers in Bangalore open to remote',
];

/* ── Main Chat page ─────────────────────────────────────────────────────────── */
export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'recruiter') { navigate('/'); return; }
    loadThreads();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const res = await listThreads();
      setThreads(res.data);
    } catch { /* ignore */ }
    finally { setLoadingThreads(false); }
  };

  /* Select a thread + load its history */
  const selectThread = async (thread) => {
    setActiveThread(thread);
    setMessages([]);
    setLoadingHistory(true);
    try {
      const res = await getThreadMessages(thread.id);
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]); // gracefully show empty if history fails
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleNewThread = async () => {
    try {
      const res = await createThread(input || null);
      const thread = res.data;
      setThreads(prev => [thread, ...prev]);
      setActiveThread(thread);
      setMessages([]);
    } catch (err) { console.error(err); }
  };

  const handleDeleteThread = async (threadId, e) => {
    e.stopPropagation();
    try {
      await deleteThread(threadId);
      setThreads(prev => prev.filter(t => t.id !== threadId));
      if (activeThread?.id === threadId) { setActiveThread(null); setMessages([]); }
    } catch { /* ignore */ }
  };

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    if (!activeThread) {
      const res = await createThread(input);
      const thread = res.data;
      setThreads(prev => [thread, ...prev]);
      setActiveThread(thread);
      setMessages([]);
      doChat(thread.id, input);
    } else {
      doChat(activeThread.id, input);
    }
  };

  const doChat = async (threadId, message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setInput('');
    setStreaming(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await chatInThread(threadId, message);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = {
            role: 'assistant',
            content: msgs[msgs.length - 1].content + chunk,
          };
          return msgs;
        });
      }
    } catch (err) {
      setMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = {
          role: 'assistant',
          content: `❌ Error: ${err.message || 'Failed to get response.'}`,
        };
        return msgs;
      });
    } finally {
      setStreaming(false);
      loadThreads(); // Refresh thread list to fetch auto-generated title
    }
  };

  return (
    <main style={{ height: 'calc(100vh - 68px)', display: 'flex', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside style={{
        width: 280, borderRight: '4px solid #000',
        display: 'flex', flexDirection: 'column',
        background: '#fff', flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: '18px 16px', borderBottom: '4px solid #000', background: 'var(--secondary)' }}>
          <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
            ⚡ AI Hiring Agent
          </div>
          <button
            onClick={handleNewThread}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px', border: '3px solid #000', background: '#000', color: '#fff',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
              boxShadow: '3px 3px 0 0 var(--accent)',
            }}
          >
            <Plus size={14} strokeWidth={3} /> New Thread
          </button>
        </div>

        {/* Thread list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingThreads ? (
            <div style={{ textAlign: 'center', paddingTop: 32, fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>
              Loading...
            </div>
          ) : threads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', lineHeight: 1.8 }}>
              No threads yet.<br />Start a conversation!
            </div>
          ) : threads.map(t => {
            const isActive = activeThread?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => selectThread(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 14px', cursor: 'pointer',
                  borderBottom: '2px solid rgba(0,0,0,0.08)',
                  background: isActive ? '#000' : 'transparent',
                  color: isActive ? '#fff' : '#000',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--muted)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <MessageSquare size={14} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span style={{ fontSize: 13, fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title}
                </span>
                <button
                  onClick={(e) => handleDeleteThread(t.id, e)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 4, flexShrink: 0, color: 'inherit', opacity: 0.6,
                  }}
                  title="Delete thread"
                >
                  <Trash2 size={13} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Chat Area ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          padding: '12px 24px', borderBottom: '4px solid #000',
          background: '#fff', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, border: '3px solid #000', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={18} strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15 }}>AI Hiring Agent</div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)' }}>
              {activeThread ? activeThread.title : 'No thread selected'} ·{' '}
              {streaming ? (
                <span style={{ color: 'var(--accent)' }}>● generating...</span>
              ) : (
                <span style={{ color: 'green' }}>● ready</span>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 40px' }}>
          {loadingHistory ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <Loader size={32} strokeWidth={3} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontWeight: 700, marginTop: 12, opacity: 0.5 }}>Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            /* Empty state / suggestions */
            <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 40 }}>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 900, marginBottom: 12, lineHeight: 0.95 }}>
                Ask me anything about{' '}
                <span style={{
                  background: 'var(--secondary)', border: '4px solid #000',
                  padding: '0 12px', display: 'inline-block', boxShadow: '4px 4px 0 0 #000',
                }}>
                  engineers.
                </span>
              </h2>
              <p style={{ fontWeight: 600, color: 'rgba(0,0,0,0.55)', marginBottom: 28, fontSize: 15, lineHeight: 1.7 }}>
                Search in plain English. The agent will query the database, verify GitHub profiles, check LeetCode activity, and return ranked candidates.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    style={{
                      padding: '14px 16px', border: '3px solid #000', background: '#fff',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                      cursor: 'pointer', textAlign: 'left', boxShadow: '3px 3px 0 0 #000',
                      transition: 'all 0.1s', lineHeight: 1.5,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <ArrowRight size={13} strokeWidth={3} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: '16px 24px', borderTop: '4px solid #000', background: '#fff' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask: 'Find React engineers with 3+ years' — Shift+Enter for new line"
              disabled={streaming}
              style={{
                flex: 1, padding: '12px 16px', border: '4px solid #000',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                fontSize: 15, resize: 'none', height: 58, background: '#fff',
                outline: 'none', lineHeight: 1.5, transition: 'box-shadow 0.15s',
              }}
              onFocus={e => { e.target.style.boxShadow = '4px 4px 0 0 #000'; e.target.style.background = 'var(--secondary)'; }}
              onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.background = '#fff'; }}
            />
            <button
              onClick={handleSend}
              disabled={streaming || !input.trim()}
              style={{
                height: 58, paddingInline: 24, border: '4px solid #000',
                background: (!streaming && input.trim()) ? 'var(--accent)' : '#ccc',
                cursor: (!streaming && input.trim()) ? 'pointer' : 'not-allowed',
                boxShadow: (!streaming && input.trim()) ? '4px 4px 0 0 #000' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {streaming
                ? <Loader size={20} strokeWidth={3} style={{ animation: 'spin 1s linear infinite' }} />
                : <Send size={20} strokeWidth={3} />}
            </button>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>
            Recruiter-only · AI-powered by MCP Agent · Press Enter to send
          </div>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
