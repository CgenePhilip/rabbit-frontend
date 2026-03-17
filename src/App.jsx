import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 디자인 테마 색상
  const colors = {
    primary: '#e84393',
    background: '#fff0f6',
    lv1: '#00b894',
    lv2: '#0984e3',
    lv3: '#d63031',
  };

  const handleLevelSelect = (level) => {
    if (!email.includes('@')) {
      alert('Miss Rabbit이 메일을 보낼 수 있게 이메일 주소를 정확히 적어주세요! 🐰');
      return;
    }
    
    setIsLoading(true);
    // TODO: GAS 서버 연동 로직
    console.log(`Email: ${email}, Selected Level: ${level}`);
    setTimeout(() => {
        alert(`${level} 방으로 이동합니다! (기능 준비 중)`);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      backgroundColor: colors.background,
      fontFamily: "'Noto Sans KR', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      margin: 0
    }}>
      
      <div style={{
        backgroundColor: 'white',
        padding: '50px 30px',
        borderRadius: '40px',
        boxShadow: '0 15px 40px rgba(232, 67, 147, 0.2)',
        border: '8px solid #ffcce0',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ fontSize: '80px', marginBottom: '10px' }}>🐰</div>
        <h1 style={{ color: colors.primary, fontSize: '36px', fontWeight: '900', margin: '0 0 20px 0' }}>
          Miss Rabbit's Class
        </h1>
        
        <p style={{ color: '#636e72', fontSize: '18px', fontWeight: '700', marginBottom: '30px' }}>
          재미있는 영어 작문 시간!<br/>이메일을 적고 레벨을 선택해봐요.
        </p>

        <input
          type="email"
          placeholder="이메일 입력 (ex: rabbit@mail.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '80%',
            padding: '15px',
            borderRadius: '30px',
            border: '3px solid #b2bec3',
            fontSize: '18px',
            textAlign: 'center',
            marginBottom: '30px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {isLoading ? (
          <div style={{ fontSize: '24px', color: colors.primary, fontWeight: 'bold' }}>
            🐰 Rabbit 선생님이 준비 중이에요...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => handleLevelSelect('Lv.1 Sprout')} style={{...btnStyle, backgroundColor: colors.lv1}}>
              🌱 Lv.1 Sprout
            </button>
            <button onClick={() => handleLevelSelect('Lv.2 Tree')} style={{...btnStyle, backgroundColor: colors.lv2}}>
              🌿 Lv.2 Tree
            </button>
            <button onClick={() => handleLevelSelect('Lv.3 Forest')} style={{...btnStyle, backgroundColor: colors.lv3}}>
              🌳 Lv.3 Forest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 공통 버튼 스타일
const btnStyle = {
  padding: '20px',
  border: 'none',
  borderRadius: '40px',
  fontSize: '22px',
  fontWeight: '900',
  color: 'white',
  cursor: 'pointer',
  boxShadow: '0 6px 0 rgba(0,0,0,0.1)',
  transition: 'transform 0.1s',
};

export default App;