import React, { useState } from 'react';
import RabbitPlayer from './RabbitPlayer';

export default function App() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [balance, setBalance] = useState(0);

  // ★ 중요: 대표님이 GAS 배포(Deploy) 후 받은 .exec 주소를 여기에 넣으세요!
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxQ_89Tti0k5XBk_fL8mNrJqJ6OMAlrRkrFRkGQel4xuM88xaay-4x2RaAC2gsI64JY/exec";

  const handleJoin = async () => {
    if (!email.includes('@')) {
      alert('어머니, 혜택을 받으실 정확한 이메일 주소를 입력해주세요! 🐰');
      return;
    }
    
    setIsLoading(true);

    try {
      // GAS 엔진에 유저 상태 확인 및 33점 지급 요청
      const response = await fetch(`${GAS_URL}?action=checkUser&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      setBalance(data.balance);
      setIsJoined(true);
      if (data.isNew) {
        alert(`🎉 환영합니다! [${email}] 계정으로 ${data.balance} 크레딧이 선물되었습니다!`);
      }
    } catch (error) {
      alert("선생님을 부르는 중에 오류가 났어요. 잠시 후 다시 시도해주세요! 😭");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      {!isJoined ? (
        <div style={styles.card}>
          <div style={{ fontSize: '70px' }}>🐰</div>
          <h2 style={{ color: '#ff6b81', fontWeight: '900' }}>Miss Rabbit's Class</h2>
          <div style={styles.banner}>
            <h3 style={{ color: '#ffa502', margin: 0 }}>🎁 첫 가입 특별 혜택!</h3>
            <p style={{ fontWeight: '700' }}>33 크레딧 즉시 무료 지급! ✨</p>
          </div>
          <input
            type="email" placeholder="엄마의 이메일을 적어주세요" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleJoin} disabled={isLoading} style={styles.btn}>
            {isLoading ? '🐰 선생님 부르는 중...' : '🚀 33크레딧 받고 시작하기'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ff6b81' }}>나의 잔액: {balance}점 🌟</h2>
          <RabbitPlayer 
            sentenceText="Hello! Welcome to Miss Rabbit's Class. Let's start our first writing!"
            audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
          />
          <button onClick={() => setIsJoined(false)} style={styles.backBtn}>처음으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  bg: { backgroundColor: '#fff0f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { backgroundColor: 'white', padding: '50px 30px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(255, 107, 129, 0.15)', borderTop: '10px solid #ff6b81', maxWidth: '450px', width: '100%', textAlign: 'center' },
  banner: { backgroundColor: '#fffcf2', border: '2px dashed #ffa502', borderRadius: '20px', padding: '25px 15px', margin: '30px 0' },
  input: { width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #dfe4ea', fontSize: '16px', textAlign: 'center', marginBottom: '20px', boxSizing: 'border-box' },
  btn: { width: '100%', backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '20px', borderRadius: '15px', fontSize: '20px', fontWeight: '900', cursor: 'pointer' },
  backBtn: { marginTop: '20px', background: 'none', border: 'none', color: '#636e72', textDecoration: 'underline', cursor: 'pointer' }
};