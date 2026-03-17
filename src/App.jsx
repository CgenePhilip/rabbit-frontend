import React, { useState } from 'react';
import RabbitPlayer from './RabbitPlayer';

export default function App() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [balance, setBalance] = useState(0);
  const [audioUrl, setAudioUrl] = useState(''); // 🔊 진짜 목소리 데이터를 담을 곳

  // ★ 중요: 대표님의 실제 GAS 주소를 여기에 붙여넣으세요!
  const GAS_URL = "https://script.google.com/macros/s/AKfycbQ_89Tti0k5XBk_fL8mNrJqJ6OMAlrRkrFRkGQel4xuM88xaay-4x2RaAC2gsI64JY/exec";

  const handleJoin = async () => {
    if (!email.includes('@')) {
      alert('어머니, 혜택을 받으실 정확한 이메일 주소를 입력해주세요! 🐰');
      return;
    }
    
    setIsLoading(true);

    try {
      // 🛰️ GAS 엔진에 접속하여 유저 확인 및 33점 지급 요청
      const response = await fetch(`${GAS_URL}?action=checkUser&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      setBalance(data.balance);
      
      // 만약 GAS에서 OpenAI 목소리(audioUrl)를 보내줬다면 상태에 저장!
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
      }
      
      setIsJoined(true);
      if (data.isNew) {
        alert(`🎉 환영합니다! [${email}] 계정으로 33 크레딧이 선물되었습니다!`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("토끼 선생님이 잠시 자리를 비웠나봐요. 다시 시도해볼까요? 😭");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      {!isJoined ? (
        // [화면 1] 엄마들을 위한 핑크 대문
        <div style={styles.card}>
          <div style={{ fontSize: '70px', marginBottom: '10px', animation: 'bounce 2s infinite' }}>🐰</div>
          <h2 style={{ color: '#ff6b81', fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0' }}>Miss Rabbit's Class</h2>
          <p style={{ color: '#747d8c', fontSize: '15px', fontWeight: 'bold', marginBottom: '25px' }}>엄마표 영어의 완성, AI 튜터</p>

          <div style={styles.banner}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffa502', fontSize: '20px', fontWeight: '900' }}>🎁 첫 가입 특별 혜택!</h3>
            <p style={{ margin: 0, color: '#2f3542', fontSize: '17px', fontWeight: '700' }}>
              지금 등록하시면 우리아이를 위한<br/>
              <span style={{color: '#ff4757', fontSize: '22px'}}>33 크레딧</span> 즉시 무료 지급! ✨
            </p>
          </div>

          <input
            type="email" placeholder="엄마의 이메일을 적어주세요 (@)" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleJoin} disabled={isLoading} style={styles.btn}>
            {isLoading ? '🐰 선생님 부르는 중...' : '🚀 33크레딧 받고 시작하기'}
          </button>
        </div>
      ) : (
        // [화면 2] 립싱크 토끼 공부방
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
          <h2 style={{ color: '#ff6b81', marginBottom: '10px', fontWeight: '900' }}>반가워요! 우리 아이 첫 공부 시작! 🌟</h2>
          <p style={{ color: '#747d8c', marginBottom: '30px', fontWeight: 'bold' }}>나의 잔액: {balance}점</p>
          
          <RabbitPlayer 
            sentenceText={audioUrl ? "Hello! I am Miss Rabbit. Let's study English together!" : "Welcome back! Ready for today's mission?"}
            audioUrl={audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
          />
          
          <button onClick={() => setIsJoined(false)} style={styles.backBtn}>
            ← 처음으로 돌아가기
          </button>
        </div>
      )}
      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}

const styles = {
  bg: { backgroundColor: '#fff0f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { backgroundColor: 'white', padding: '50px 30px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(255, 107, 129, 0.15)', borderTop: '10px solid #ff6b81', maxWidth: '450px', width: '100%', textAlign: 'center' },
  banner: { backgroundColor: '#fffcf2', border: '2px dashed #ffa502', borderRadius: '20px', padding: '25px 15px', marginBottom: '30px' },
  input: { width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #dfe4ea', fontSize: '16px', textAlign: 'center', marginBottom: '20px', outline: 'none', boxSizing: 'border-box', fontWeight: 'bold' },
  btn: { width: '100%', backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontSize: '20px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 107, 129, 0.3)' },
  backBtn: { marginTop: '30px', background: 'none', border: 'none', color: '#a4b0be', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }
};