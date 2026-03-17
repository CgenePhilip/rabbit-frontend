import React, { useState } from 'react';

export default function App() { // 이름을 App으로 통일했습니다!
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    primary: '#ff6b81', 
    background: '#fff0f6',
    accent: '#ffa502', 
    text: '#2f3542'
  };

  const handleJoin = () => {
    if (!email.includes('@')) {
      alert('어머니, 혜택을 받으실 정확한 이메일 주소를 입력해주세요! 🐰');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      alert(`🎉 환영합니다! [${email}] 계정으로 30 크레딧이 충전되었습니다. 우리 아이의 첫 작문을 시작해볼까요?`);
      setIsLoading(false);
    }, 1500);
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
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px 30px',
        borderRadius: '30px',
        boxShadow: '0 20px 50px rgba(255, 107, 129, 0.15)',
        borderTop: `10px solid ${colors.primary}`,
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '70px', marginBottom: '5px', animation: 'bounce 2s infinite' }}>🐰</div>
        <h2 style={{ color: colors.primary, fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
          Miss Rabbit's Class
        </h2>
        <p style={{ color: '#747d8c', fontSize: '15px', fontWeight: 'bold', marginBottom: '25px' }}>
          엄마표 영어의 완성, 우리 아이 전담 AI 튜터
        </p>

        <div style={{
          backgroundColor: '#fffcf2',
          border: `2px dashed ${colors.accent}`,
          borderRadius: '20px',
          padding: '25px 15px',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: colors.accent, fontSize: '22px', fontWeight: '900' }}>
            🎁 첫 가입 특별 혜택!
          </h3>
          <p style={{ margin: 0, color: colors.text, fontSize: '17px', lineHeight: '1.5', fontWeight: '700' }}>
            지금 이메일만 등록하시면<br/>
            우리아이를 위한 <span style={{color: '#ff4757', fontSize: '22px', fontWeight: '900'}}>30 크레딧</span>을<br/>
            즉시 무료로 드립니다!
          </p>
        </div>

        <input
          type="email"
          placeholder="엄마의 이메일을 적어주세요 (@)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '15px',
            border: '2px solid #dfe4ea',
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '20px',
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 'bold'
          }}
        />

        <button onClick={handleJoin} disabled={isLoading} style={{
          width: '100%',
          backgroundColor: isLoading ? '#ced6e0' : colors.primary,
          color: 'white',
          border: 'none',
          padding: '20px',
          borderRadius: '15px',
          fontSize: '20px',
          fontWeight: '900',
          cursor: isLoading ? 'wait' : 'pointer',
          boxShadow: isLoading ? 'none' : '0 10px 20px rgba(255, 107, 129, 0.3)'
        }}>
          {isLoading ? '🐰 토끼 선생님 부르는 중...' : '🚀 30크레딧 받고 시작하기'}
        </button>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}