import React, { useState, useRef, useEffect } from 'react';

export default function RabbitPlayer({ sentenceText, audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); 
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const requestRef = useRef(null);

  const startLipSync = () => {
    if (!audioRef.current) return;
    
    // 브라우저 정책상 사용자 클릭 후 AudioContext 생성
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

  const analyzeAudio = () => {
    if (!analyzerRef.current) return;
    
    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
    const average = sum / dataArray.length;

    // 입 크기 조절 수치
    if (average > 50) setMouthOpen(1.5);      
    else if (average > 25) setMouthOpen(0.8); 
    else if (average > 10) setMouthOpen(0.3); 
    else setMouthOpen(0);                     

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* 📺 토끼 아바타 박스 */}
      <div style={{
        width: '100%', height: '350px', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)', marginBottom: '20px', position: 'relative', border: '5px solid white'
      }}>
        <div style={{
          width: '160px', height: '160px', backgroundColor: 'white', borderRadius: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative',
          animation: isPlaying ? 'rabbitBounce 0.5s infinite alternate' : 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          {/* 귀 */}
          <div style={{position:'absolute', top:'-60px', left:'15px', width:'30px', height:'80px', background:'white', borderRadius:'50px 50px 0 0', border:'4px solid #fbc2eb'}}></div>
          <div style={{position:'absolute', top:'-60px', right:'15px', width:'30px', height:'80px', background:'white', borderRadius:'50px 50px 0 0', border:'4px solid #fbc2eb'}}></div>
          
          {/* 눈 */}
          <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
            <div style={{ width: '22px', height: '22px', backgroundColor: '#2d3436', borderRadius: '50%' }} />
            <div style={{ width: '22px', height: '22px', backgroundColor: '#2d3436', borderRadius: '50%' }} />
          </div>
          
          {/* 💋 립싱크 입 */}
          <div style={{
            width: '35px', height: `${10 + (mouthOpen * 25)}px`, backgroundColor: '#ff7675', 
            borderRadius: mouthOpen > 0.5 ? '40%' : '10px 10px 30px 30px', transition: 'height 0.05s'
          }} />
        </div>
      </div>

      {/* 📝 자막 박스 */}
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '20px', width: '100%',
        textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '20px'
      }}>
        <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2d3436', lineHeight: '1.5' }}>
          {sentenceText}
        </p>
      </div>

      <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} />

      <button onClick={togglePlay} style={{
          backgroundColor: isPlaying ? '#ff7675' : '#00b894', color: 'white', border: 'none', 
          padding: '18px 40px', borderRadius: '30px', fontSize: '20px', fontWeight: '900', cursor: 'pointer'
        }}>
        {isPlaying ? "❚❚ 멈추기" : "▶ 선생님 음성 듣기"}
      </button>

      <style>{` @keyframes rabbitBounce { from { transform: translateY(0); } to { transform: translateY(-8px); } } `}</style>
    </div>
  );
}