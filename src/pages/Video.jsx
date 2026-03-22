import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzcoAlzAN3R_SIdAFJhXiRloJ-UsQsCuGOf-_lyGdT18ouYCJnmrQZZzecYRY8niqzy/exec";

function Video() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  // 🐰 [추가됨] 플레이리스트와 현재 보고 있는 문장 번호 상태 관리
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
        
        // 🐰 백엔드에서 배열(list)을 보내주면 플레이리스트에 저장합니다.
        if (data && data.list && data.list.length > 0) {
          setPlaylist(data.list);
        } else if (data && data.feedback) {
          // 구버전 백엔드 대비용 스페어
          setPlaylist([{ text: data.feedback, date: data.date || "" }]);
        } else {
          setPlaylist([{ text: "아직 래빗 선생님의 피드백이 도착하지 않았어요! / No feedback yet.", date: "" }]);
        }

      } catch (error) { 
        console.error("Error:", error); 
        setPlaylist([{ text: "서버와 통신 중 문제가 발생했습니다. / Connection error.", date: "" }]);
      }
      finally { setLoading(false); }
    };
    fetchFeedback();
  }, [email]);

  // 현재 화면에 보여줄 데이터 추출
  const currentItem = playlist[currentIndex] || { text: "", date: "" };
  const extractedSentence = currentItem.text;
  const currentDate = currentItem.date;

  const handlePlay = () => {
    if (!extractedSentence) return;
    window.speechSynthesis.cancel();

    const parts = extractedSentence.split('/');
    const engPart = parts[0] ? parts[0].trim() : "";
    const korPart = parts[1] ? parts[1].trim() : "";

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Female')) || voices.find(v => v.lang.includes('en'));
    const koVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Female')) || voices.find(v => v.lang.includes('ko'));

    setIsPlaying(true);
    
    // 3번 자동 반복 스파르타 모드 (유지)
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

  // 🐰 [추가됨] 이전/다음 곡 넘기기 기능
  const handlePrev = () => {
    if (currentIndex > 0) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentIndex(prev => prev + 1);
    }
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

      {/* 🐰 플레이어 컨트롤 영역 (이전 곡, 재생, 다음 곡) */}
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        
        <button onClick={handlePrev} disabled={currentIndex === 0 || isPlaying} style={{
          background: (currentIndex === 0 || isPlaying) ? '#dfe6e9' : 'white', color: (currentIndex === 0 || isPlaying) ? '#b2bec3' : '#e84393',
          border: '2px solid #ffcce0', padding: '15px', borderRadius: '50%', width: '60px', height: '60px',
          fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: (currentIndex === 0 || isPlaying) ? 'default' : 'pointer',
          boxShadow: (currentIndex === 0 || isPlaying) ? 'none' : '0 5px 15px rgba(232, 67, 147, 0.15)', transition: '0.2s'
        }}>
          ◁
        </button>

        <button onClick={handlePlay} disabled={isPlaying} style={{
          flex: 1, background: isPlaying ? '#b2bec3' : 'linear-gradient(135deg, #00b894, #55efc4)',
          color: 'white', border: 'none', padding: '18px 20px', borderRadius: '40px',
          fontSize: '20px', fontWeight: '900', cursor: isPlaying ? 'default' : 'pointer',
          boxShadow: isPlaying ? 'none' : '0 10px 20px rgba(0, 184, 148, 0.3)', transition: '0.2s'
        }}>
          {isPlaying ? '강의 진행 중 🔊' : '▶ 래빗 선생님 듣기'}
        </button>

        <button onClick={handleNext} disabled={currentIndex === playlist.length - 1 || isPlaying} style={{
          background: (currentIndex === playlist.length - 1 || isPlaying) ? '#dfe6e9' : 'white', color: (currentIndex === playlist.length - 1 || isPlaying) ? '#b2bec3' : '#e84393',
          border: '2px solid #ffcce0', padding: '15px', borderRadius: '50%', width: '60px', height: '60px',
          fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: (currentIndex === playlist.length - 1 || isPlaying) ? 'default' : 'pointer',
          boxShadow: (currentIndex === playlist.length - 1 || isPlaying) ? 'none' : '0 5px 15px rgba(232, 67, 147, 0.15)', transition: '0.2s'
        }}>
          ▷
        </button>
      </div>

      {/* 플레이리스트 위치 및 텍스트 렌더링 박스 */}
      <div style={{
        width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '30px',
        borderRadius: '24px', border: '2px solid #ffcce0', lineHeight: '1.8', textAlign: 'center',
        boxShadow: '0 4px 15px rgba(232, 67, 147, 0.05)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #ffeaa7' }}>
          <span style={{ color: '#00b894', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            📅 {currentDate || 'Shadowing Guide'}
          </span>
          <span style={{ color: '#e84393', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#fff0f6', padding: '3px 10px', borderRadius: '15px' }}>
            Track {currentIndex + 1} / {playlist.length}
          </span>
        </div>

        <div style={{ fontSize: '22px', fontWeight: '900', color: '#2d3436', marginBottom: '15px', wordBreak: 'keep-all' }}>
          {extractedSentence.split('/')[0]}
        </div>
        <div style={{ fontSize: '16px', color: '#636e72', wordBreak: 'keep-all' }}>
          {extractedSentence.split('/')[1] || ""}
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0% {transform: translateY(0);} 100% {transform: translateY(-15px);} }
      `}</style>
    </div>
  );
}

export default Video;