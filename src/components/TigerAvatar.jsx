import React, { useState, useEffect } from 'react';

// 소리 크기에 따라 호랑이 입을 뻐끔거리게 만드는 컴포넌트입니다.
function TigerAvatar({ isSpeaking, text }) {
  const [isMouthOpen, setIsMouthOpen] = useState(false);

  useEffect(() => {
    let interval;
    if (isSpeaking) {
      // 말하고 있을 때 0.15초마다 입 모양을 무작위로 바꿉니다 (뻐끔뻐끔 효과)
      interval = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 150);
    } else {
      setIsMouthOpen(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <img 
        src={isMouthOpen ? "/tiger_open.png" : "/tiger_close.png"} 
        alt="Tiger Avatar"
        style={{ width: '250px', transition: '0.1s' }}
      />
      {text && (
        <div style={{
          marginTop: '15px', padding: '15px', background: 'white',
          borderRadius: '20px', border: '2px solid #ff8c00', display: 'inline-block'
        }}>
          <strong>🐯 타이거: </strong> "{text}"
        </div>
      )}
    </div>
  );
}

export default TigerAvatar;