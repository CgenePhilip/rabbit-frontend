import React, { useState, useRef, useEffect } from 'react';

export default function RabbitPlayer({ sentenceText, audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); 
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const requestRef = useRef(null);

  // 🎵 오디오 재생 및 립싱크 분석 엔진
  const startLipSync = () => {
    if (!audioRef.current) return;
    
    // 오디오 컨텍스트가 없으면 초기화 (브라우저 정책상 사용자 클릭 후 활성화되어야 함)
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);
    }

    audioRef.current.play();
    setIsPlaying(true);
    analyzeAudio();
  };

  // 🔊 실시간 볼륨(파형) 분석기
  const analyzeAudio = () => {
    if (!analyzerRef.current) return;
    
    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
    const average = sum / dataArray.length;

    // 볼륨에 따른 입 크기 매핑 (이 수치를 조절하면 립싱크가 더 리얼해집니다)
    if (average > 60) setMouthOpen(1.5);      // 아!
    else if (average > 30) setMouthOpen(0.8); // 오~
    else if (average > 10) setMouthOpen(0.3); // 음
    else setMouthOpen(0);                     // 닫힘

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setMouthOpen(0);
    cancelAnimationFrame(requestRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      handleEnded();
    } else {
      startLipSync();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '20px', fontFamily: "'Noto Sans KR', sans-serif"
    }}>
      
      {/* 📺 비디오(아바타) 화면 영역 */}
      <div style={{
        width: '100%', maxWidth: '350px', height: '350px',
        background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        borderRadius: '30px', display: 'flex', justifyContent: 'center', 
        alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        marginBottom: '20px', overflow: 'hidden', border: '5px solid white'
      }}>
        {/* 🐰 반응형 토끼 얼굴 */}
        <div style={{
          width: '160px', height: '160px', backgroundColor: 'white', 
          borderRadius: '50%', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', position: 'relative',
          animation: isPlaying ? 'bounce 0.5s infinite alternate' : 'none',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          {/* 토끼 귀 (순수 CSS로 구현) */}
          <div style={{position:'absolute', top:'-60px', left:'15px', width:'30px', height:'80px', background:'white', borderRadius:'50px 50px 0 0', border:'4px solid #fbc2eb'}}></div>
          <div style={{position:'absolute', top:'-60px', right:'15px', width:'30px', height:'80px', background:'white', borderRadius:'50px 50px 0 0', border:'4px solid #fbc2eb'}}></div>
          
          {/* 눈 */}
          <div style={{ display: 'flex', gap: '30px', marginBottom: '15px', zIndex: 10 }}>
            <div style={{ width: '22px', height: '22px', backgroundColor: '#2d3436', borderRadius: '50%' }} />
            <div style={{ width: '22px', height: '22px', backgroundColor: '#2d3436', borderRadius: '50%' }} />
          </div>
          
          {/* 💋 립싱크 입 (mouthOpen 값에 따라 height와 borderRadius가 실시간 변경됨!) */}
          <div style={{
            width: '35px', 
            height: `${10 + (mouthOpen * 25)}px`, 
            backgroundColor: '#ff7675', 
            borderRadius: mouthOpen > 0.5 ? '40%' : '10px 10px 30px 30px',
            transition: 'height 0.05s, border-radius 0.05s', // 매우 빠른 반응속도
            zIndex: 10
          }} />
        </div>
      </div>

      {/* 📝 자막 영역 */}
      <div style={{
        backgroundColor: 'white', padding: '25px', borderRadius: '20px', 
        width: '100%', maxWidth: '350px', textAlign: 'center', 
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '20px', boxSizing: 'border-box'
      }}>
        <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2d3436', lineHeight: '1.5' }}>
          {sentenceText || "Hello! Shall we write a sentence?"}
        </p>
      </div>

      {/* 🔊 숨겨진 오디오 플레이어 (crossOrigin 필수!) */}
      <audio 
        ref={audioRef} 
        src={audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
        onEnded={handleEnded}
        crossOrigin="anonymous" 
      />

      {/* ▶️ 재생 버튼 */}
      <button 
        onClick={togglePlay} 
        style={{
          backgroundColor: isPlaying ? '#ff7675' : '#00b894', 
          color: 'white', border: 'none', padding: '18px 40px', 
          borderRadius: '30px', fontSize: '20px', fontWeight: '900', 
          cursor: 'pointer', boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s'
        }}>
        {isPlaying ? "❚❚ 멈추기" : "▶ 선생님 음성 듣기"}
      </button>

      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}