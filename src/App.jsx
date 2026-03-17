import React, { useState } from 'react';
import RabbitPlayer from './RabbitPlayer'; // 🐰 창고에서 토끼 부품을 가져옵니다!

export default function App() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false); // 가입 성공 여부 체크

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
    // 가상 가입 로직 (나중에 GAS 연동)
    setTimeout(() => {
      setIsJoined(true); // 가입 성공 상태로 변경!
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
      
      {!isJoined ? (
        // 1️⃣ 아직 가입 전이면 '대문' 화면을 보여줍니다.
        <div style={{
          backgroundColor: 'white', padding: '50px 30px', borderRadius: '30px',
          boxShadow: '0 20px 50px rgba(255, 107, 129, 0.15)',
          borderTop: `10px solid ${colors.primary}`, maxWidth: '450px', width: '100%', textAlign: 'center'
        }}>
          <div style={{ fontSize: '70px', marginBottom: '5px' }}>🐰</div>
          <h2 style={{ color: colors.primary, fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0' }}>Miss Rabbit's Class</h2>
          <p style={{ color: '#747d8c', fontSize: '15px', fontWeight: 'bold', marginBottom: '25px' }}>엄마표 영어의 완성, AI 튜터</p>

          <div style={{ backgroundColor: '#fffcf2', border: `2px dashed ${colors.accent}`, borderRadius: '20px', padding: '25px 15px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: colors.accent, fontSize: '22px', fontWeight: '900' }}>🎁 첫 가입 혜택!</h3>
            <p style={{ margin: 0, color: colors.text, fontSize: '17px', fontWeight: '700' }}>30 크레딧 즉시 무료 지급! ✨</p>
          </div>

          <input
            type="email" placeholder="엄마의 이메일을 적어주세요" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #dfe4ea', fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}
          />

          <button onClick={handleJoin} disabled={isLoading} style={{
            width: '100%', backgroundColor: isLoading ? '#ced6e0' : colors.primary, color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontSize: '20px', fontWeight: '900', cursor: 'pointer'
          }}>
            {isLoading ? '🐰 선생님 부르는 중...' : '🚀 30크레딧 받고 시작하기'}
          </button>
        </div>
      ) : (
        // 2️⃣ 가입 버튼을 누르면 '토끼 플레이어' 화면이 짠! 나타납니다.
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: colors.primary, marginBottom: '20px' }}>반가워요! 우리 아이 첫 공부 시작! 🌟</h2>
          <RabbitPlayer 
            sentenceText="Hello! Welcome to Miss Rabbit's Class. Let's start our first writing!"
            audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // 실제론 TTS mp3 주소가 들어갈 자리!
          />
          <button onClick={() => setIsJoined(false)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#636e72', textDecoration: 'underline', cursor: 'pointer' }}>
            처음으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}