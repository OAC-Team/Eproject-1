import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../themes/ChatWidget.css';
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    
    const [messages, setMessages] = useState(() => {
        const savedChat = sessionStorage.getItem('chatHistory');
        return savedChat ? JSON.parse(savedChat) : [
            { 
                role: 'assistant', 
                text: 'Hi! I\'m your art assistant. Ask me anything about painting techniques, styles, color theory. Or you could give me the reference to a painting and I will analyze it for you.' 
            }
        ];
    });

    const [currentPainting, setCurrentPainting] = useState(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const token = Cookies.get('token');
            const response = await axios.post(
                'http://localhost:5000/api/assistant/chat',
                { message: input, painting: currentPainting },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, { role: 'assistant', text: response.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong, please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleClearChat = () => {
        sessionStorage.removeItem('chatHistory');
        setMessages([
            { role: 'assistant', text: 'Chat reset! Ask me anything about art or paintings!' }
        ]);
    };

    useEffect(() => {
        const match = location.pathname.match(/\/gallery\/([a-zA-Z0-9]+)/);

        if (match) {
            const paintingId = match[1];
            const token = Cookies.get('token');

            axios.get(`http://localhost:5000/api/user/gallery/${paintingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setCurrentPainting(res.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch painting:", err);
                    setCurrentPainting(null);
                });
        } else {
            setCurrentPainting(null);
        }
    }, [location.pathname]);

    return (
        <div className="chat-widget">
            {/* Floating bubble */}
            <button className="chat-bubble-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : <i className='bi bi-brush' />}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>Art Assistant</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                                onClick={handleClearChat} 
                                title="Clear Chat History"
                                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}
                            >
                                Clear
                            </button>
                            <button onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.role}`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-msg assistant">
                                <span className="typing-dots">...</span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="chat-input-row">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about art techniques..."
                            disabled={isLoading}
                        />
                        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}