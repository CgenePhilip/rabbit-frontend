import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TigerAvatar from '../components/TigerAvatar';

function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tigerMsg, setTigerMsg] = useState('Roar! Analyzing your sentence... 🔍');

  const { email, level, sentence, creditsLeft } = location.state || {};

  useEffect(() => {
    if (!sentence) {
      navigate('/');
      return;
    }
    fetchAIFeedback();
  }, [sentence]);

  const speakAndDisplay = (text) => {
    setTigerMsg(text);
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  const fetchAIFeedback = async () => {
    try {
      // 프론트엔드에서 직접 OpenAI 호출 (빠른 프로토타이핑용)
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // 빠르고 가성비 좋은 모델
          messages: [
            { 
              role: "system", 
              content: "You are a friendly and encouraging Korean language teacher named 'Tiger'. The user will provide a Korean sentence they wrote. Your job is to: 1) Correct any errors naturally. 2) Explain the grammar or vocabulary clearly in English. 3) Keep it encouraging and fun! Format with clear headings using markdown." 
            },
            { 
              role: "user", 
              content: `Level: ${level}\nSentence: ${sentence}` 
            }
          ]
        })
      });

      const data = await response.json();
      const aiResult = data.choices[0].message.content;
      
      setFeedback(aiResult);
      setIsLoading(false);
      speakAndDisplay("Here is your feedback! You did a great job! 🐯🎉");

    } catch (error) {
      console.error("OpenAI Error:", error);
      setFeedback("Sorry, the AI teacher is currently resting. Please try again later!");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <TigerAvatar isSpeaking={isSpeaking} text={tigerMsg} />
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>📝 Your Sentence</h2>
        <p style={{ fontSize: '20px', color: '#34495e', fontStyle: 'italic' }}>"{sentence}"</p>

        <h2 style={{ color: '#27ae60', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: '30px' }}>✨ AI Teacher's Feedback</h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#e67e00', fontSize: '20px', fontWeight: 'bold' }}>
            ⏳ Tiger is thinking hard... Please wait!
          </div>
        ) : (
          <div style={{ lineHeight: '1.6', fontSize: '16px', color: '#2c3e50', whiteSpace: 'pre-wrap' }}>
            {feedback}
          </div>
        )}
      </div>

      {/* 🐯 타이거 원칙 3: 크레딧 3점 이하일 때 프리미엄 유도 배너 노출 */}
      {!isLoading && creditsLeft <= 3 && (
        <div style={{ 
          marginTop: '30px', background: 'linear-gradient(135deg, #2c3e50, #34495e)', 
          padding: '25px', borderRadius: '20px', textAlign: 'center', border: '3px solid #f1c40f',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ color: '#f1c40f', margin: '0 0 10px 0' }}>⚠️ Low Credits Alert (Balance: {creditsLeft})</h3>
          <p style={{ color: 'white', fontSize: '16px', marginBottom: '20px' }}>
            You are running out of credits! Keep your learning streak alive. <br/>
            Get <strong>10+1 Premium Credits</strong> now and never stop writing!
          </p>
          <a 
            href={`https://bit.ly/tiger-lemon?checkout[email]=${encodeURIComponent(email)}`} 
            style={{ 
              display: 'inline-block', background: '#f1c40f', color: '#2c3e50', 
              padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', 
              textDecoration: 'none', borderRadius: '12px', transition: '0.2s'
            }}
          >
            🚀 Upgrade & Get +11 Credits ($2.90)
          </a>
        </div>
      )}

      {/* 계속하기 버튼 */}
      {!isLoading && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/level', { state: { email, credits: creditsLeft, isNew: false }})}
            style={{ background: '#ff8c00', color: 'white', border: 'none', padding: '15px 40px', fontSize: '20px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Write Another Sentence ✍️
          </button>
        </div>
      )}
    </div>
  );
}

export default Feedback;