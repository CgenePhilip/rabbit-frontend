import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function LevelSelect() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const userEmail = location.state?.email || '';
  const userCredits = location.state?.credits || 0;
  const isNew = location.state?.isNew || false;

  useEffect(() => {
    if (!userEmail) { navigate('/'); return; }
    const greetingText = isNew 
      ? "환영합니다! 33 크레딧이 지급되었어요. 아이의 레벨을 선택해주세요!" 
      : `다시 오셨군요! 현재 ${userCredits} 크레딧이 남아있습니다. 시작해볼까요?`;
    speakMsg(greetingText);
  }, [userEmail, userCredits, isNew, navigate]);

  const speakMsg = (text) => {
    window.speechSynthesis.cancel(); 
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'ko-KR';
    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  const handleLevelClick = (level, cost) => {
    if (userCredits < cost) {
      speakMsg(`앗! 크레딧이 부족해요. 충전이 필요합니다.`);
      alert(`🚨 크레딧이 부족합니다. (현재: ${userCredits}점)`);
      return;
    }
    
    speakMsg(`좋아요! ${level} 레벨로 이동합니다!`);
    setTimeout(() => {
      navigate('/write', { state: { email: userEmail, level: level, cost: cost } });
    }, 1500);
  };

  return (
    <div style={{ textAlign: 'center', padding: '30px', fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#fff0f6', minHeight: '100vh' }}>
      <div style={{ fontSize: '80px', marginBottom: '10px', animation: isSpeaking ? 'bounce 0.5s infinite' : 'none' }}>🐰</div>
      
      <h1 style={{ color: '#e84393', fontSize: '28px', marginTop: '10px', fontWeight: '900' }}>Choose Your Level!</h1>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#636e72', marginBottom: '40px' }}>
        남은 크레딧: <span style={{ color: '#00b894', fontSize: '24px' }}>{userCredits}</span> 점
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => handleLevelClick('Lv.1 Sprout', 1)} style={btnStyle('#00b894')}>
          🌱 Lv.1 Sprout (새싹반)
        </button>
        <button onClick={() => handleLevelClick('Lv.2 Tree', 1)} style={btnStyle('#0984e3')}>
          🌳 Lv.2 Tree (나무반)
        </button>
        <button onClick={() => handleLevelClick('Lv.3 Forest', 1)} style={btnStyle('#6c5ce7')}>
          🌲 Lv.3 Forest (숲속반)
        </button>
      </div>
      <style>{`@keyframes bounce { 0%, 100% {transform: translateY(0);} 50% {transform: translateY(-10px);} }`}</style>
    </div>
  );
}

const btnStyle = (bgColor) => ({
  backgroundColor: bgColor, color: 'white', padding: '20px',
  fontSize: '20px', fontWeight: 'bold', border: 'none',
  borderRadius: '20px', cursor: 'pointer', width: '90%',
  maxWidth: '400px', boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  transition: 'transform 0.1s'
});

export default LevelSelect;