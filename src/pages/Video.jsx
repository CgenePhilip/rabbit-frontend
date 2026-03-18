import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzcoAlzAN3R_SIdAFJhXiRloJ-UsQsCuGOf-_lyGdT18ouYCJnmrQZZzecYRY8niqzy/exec";

function Video() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const [extractedSentence, setExtractedSentence] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!email) { setLoading(false); return; }
      try {
        const url = `${GAS_WEBAPP_URL}?action=getVideoData&email=${encodeURIComponent(email)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.feedback) {
          const lines = data.feedback.split(/\n|<br>/);
          let found = "";
          for (let line of lines) {
            // 🐰 래빗 포맷에 맞춘 파싱
            if (/(Corrected|Alternative|Expression|교정)/i.test(line) && line.includes("/")) {
              found = line.replace(/[\*⭕❌✨💡]/g, "") 
                          .replace(/^[^a-zA-Z가-힣0-9]+/g, "") 
                          .replace(/^(?:Corrected|Alternative|Expression|교정).*?[:;]\s*/i, "") 
                          .replace(/^[^a-zA-Z가-힣0-9]+/g, "") 
                          .trim();
              break;
            }
          }
          setExtractedSentence(found || "아직 래빗 선생님의 피드백이 도착하지 않았어요!");
        }
      } catch (error) { console.error("Error:", error); }
      finally { setLoading(false); }
    };
    fetchFeedback();
  }, [email]);

  const handlePlay = () => {
    if (!extractedSentence) return;
    window.speechSynthesis.cancel();

    const parts = extractedSentence.split('/');
    const engPart = parts[0] ? parts[0].trim() : "";
    const korPart = parts[1] ? parts[1].trim() : "";

    const voices = window.speechSynthesis.getVoices();
    // 🐰 여성 목소리(Female)를 우선적으로 찾도록 세팅
    const enVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Female')) || voices.find(v => v.lang.includes('en'));
    const koVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Female')) || voices.find(v => v.lang.includes('ko'));

    setIsPlaying(true);
    
    // 3번 자동 반복 스파르타 모드
    let currentLoop = 0;
    const MAX_LOOPS = 3;

    const playSequence = () => {
      if (currentLoop >= MAX_LOOPS) {
        setIsPlaying(false);
        setMouthOpen(false);
        return;
      }
      currentLoop++;

      const playKor = () => {
        if (!korPart) {
          setTimeout(playSequence, 1200);
          return;
        }
        const uKor = new SpeechSynthesisUtterance(korPart);
        uKor.lang = 'ko-KR';
        if (koVoice) uKor.voice = koVoice;
        uKor.rate = 0.9;

        let korSyncInterval;
        uKor.onstart = () => { korSyncInterval = setInterval(() => setMouthOpen(prev => !prev), 150); };
        uKor.onend = () => {
          clearInterval(korSyncInterval);
          setMouthOpen(false);
          setTimeout(playSequence, 1200); 
        };
        window.speechSynthesis.speak(uKor);
      };

      if (engPart) {
        const uEng = new SpeechSynthesisUtterance(engPart);
        uEng.lang = 'en-US';
        if (enVoice) uEng.voice = enVoice;
        uEng.rate = 0.85;

        let engSyncInterval;
        uEng.onstart = () => { engSyncInterval = setInterval(() => setMouthOpen(prev => !prev), 150); };
        uEng.onend = () => {
          clearInterval(engSyncInterval);
          setMouthOpen(false);
          setTimeout(playKor, 400); 
        };
        window.speechSynthesis.speak(uEng);
      } else {
        playKor();
      }
    };

    playSequence();
  };

  if (loading) return <div style={{color: '#e84393', textAlign:'center', marginTop:'50px', fontSize:'20px', fontWeight:'bold'}}>Loading Rabbit... 🐰</div>;

  return (
    <div style={{ backgroundColor: '#fff0f6', minHeight: '100vh', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: '"Noto Sans KR", sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <span style={{ fontWeight: '900', color: '#e84393', fontSize: '22px', letterSpacing: '-1px' }}>🐰 RABBIT SHORTS</span>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '28px', color: '#b2bec3' }}>✕</span>
      </div>

      <div style={{
        width: '180px', height: '180px', borderRadius: '50%', border: `4px solid ${isPlaying ? '#00b894' : '#ffcce0'}`,
        backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: '100px', marginBottom: '30px', transition: '0.3s',
        boxShadow: isPlaying ? '0 0 40px rgba(0, 184, 148, 0.4)' : '0 10px 20px rgba(232, 67, 147, 0.1)',
        transform: isPlaying ? 'scale(1.05)' : 'scale(1)',
        animation: mouthOpen ? 'bounce 0.4s infinite alternate' : 'none'
      }}>
        🐰
      </div>

      <button onClick={handlePlay} disabled={isPlaying} style={{
        background: isPlaying ? '#b2bec3' : 'linear-gradient(135deg, #00b894, #55efc4)',
        color: 'white', border: 'none', padding: '16px 50px', borderRadius: '40px',
        fontSize: '20px', fontWeight: '900', cursor: isPlaying ? 'default' : 'pointer', marginBottom: '40px',
        boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(0, 184, 148, 0.3)', transition: '0.2s'
      }}>
        {isPlaying ? '강의 진행 중 🔊' : '▶ 래빗 선생님 듣기'}
      </button>

      <div style={{
        width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '30px',
        borderRadius: '24px', border: '2px solid #ffcce0', lineHeight: '1.8', textAlign: 'center',
        boxShadow: '0 4px 15px rgba(232, 67, 147, 0.05)'
      }}>
        <div style={{ color: '#00b894', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          Shadowing Guide
        </div>
        <div style={{ fontSize: '22px', fontWeight: '900', color: '#2d3436', marginBottom: '15px', wordBreak: 'keep-all' }}>
          {extractedSentence.split('/')[0]}
        </div>
        <div style={{ fontSize: '16px', color: '#636e72', wordBreak: 'keep-all' }}>
          {extractedSentence.split('/')[1]}
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0% {transform: translateY(0);} 100% {transform: translateY(-15px);} }
      `}</style>
    </div>
  );
}

export default Video;