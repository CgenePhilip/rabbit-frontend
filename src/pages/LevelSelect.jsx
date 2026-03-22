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

  // 🐰 [수정 1] 언어(lang)를 선택할 수 있도록 업그레이드! (기본값은 한국어)
  const speakMsg = (text, lang = 'ko-KR') => {
    window.speechSynthesis.cancel(); 
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang; 
    
    // 영어일 때 래빗 선생님처럼 약간 더 다정하고 또박또박하게 세팅 (선택사항)
    if(lang === 'en-US') {
      speech.rate = 0.9;
      speech.pitch = 1.2;
    }

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
    
    // 🐰 [수정 2] 'Lv.1 Sprout'에서 'Sprout'만 쏙 뽑아내어 영어로 환영 인사!
    const cleanLevelName = level.split(' ')[1]; // 띄어쓰기 기준으로 뒤의 단어만 추출
    speakMsg(`Welcome to the ${cleanLevelName} level!`, 'en-US'); // 원어민 발음 발사!
    
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