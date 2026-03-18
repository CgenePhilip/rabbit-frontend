import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import confetti from 'canvas-confetti';

const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzcoAlzAN3R_SIdAFJhXiRloJ-UsQsCuGOf-_lyGdT18ouYCJnmrQZZzecYRY8niqzy/exec";

function Entrance() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlEmail = queryParams.get('email') || ""; 

  const [email, setEmail] = useState(urlEmail);
  const [nation, setNation] = useState('Kids'); // 기본값 세팅
  const [loading, setLoading] = useState(false);
  const [isZeroCredit, setIsZeroCredit] = useState(false); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (urlEmail) {
      processUser(urlEmail, true); 
    }
  }, [urlEmail]);

  const processUser = async (targetEmail, isAutoLink = false) => {
    setLoading(true);
    setIsZeroCredit(false);

    try {
      const response = await fetch(`${GAS_WEBAPP_URL}?action=checkUser&email=${encodeURIComponent(targetEmail)}`);
      const data = await response.json(); 

      const userRef = doc(db, 'users', targetEmail.toLowerCase());
      const userSnap = await getDoc(userRef);

      let finalCredits = data.isNew ? 33 : data.balance; // 🐰 래빗 기본 크레딧 33점

      await setDoc(userRef, {
        email: targetEmail.toLowerCase(),
        nation: "Kids",
        credits: finalCredits,
        createdAt: userSnap.exists() ? userSnap.data().createdAt : new Date()
      }, { merge: true });

      if (finalCredits <= 0) {
        alert("작문을 위한 크레딧이 부족합니다. 충전해주세요!");
        setIsZeroCredit(true);
        setLoading(false);
        return;
      }

      if (data.isNew) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#e84393', '#00b894', '#fdcb6e'] });
        alert("환영합니다! 가입 축하 33 크레딧이 지급되었습니다! ✨");
      }

      navigate('/level', { state: { email: targetEmail.toLowerCase(), credits: finalCredits, isNew: data.isNew } });

    } catch (error) {
      console.error("Sync Error:", error);
      alert("연결에 문제가 발생했습니다. 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  const handleEntrance = () => {
    if (!email || !email.includes('@')) {
      alert("올바른 이메일 주소를 입력해주세요!");
      return;
    }
    processUser(email, false); 
  };

  return (
    <div style={{ backgroundColor: '#fff0f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: "'Noto Sans KR', sans-serif" }}>
      
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', boxShadow: '0 0 20px rgba(232, 67, 147, 0.1)', position: 'relative' }}>
        
        <header style={{ padding: '45px 20px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ flexShrink: 0, fontSize: '65px' }}>
              🐰
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#00b894', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Mom & Kids English Tutor
              </div>
              <h2 style={{ fontSize: '30px', fontWeight: '900', lineHeight: '1.15', margin: 0, color: '#2d3436', letterSpacing: '-1px' }}>
                Rabbit Kids<br/>
                <span style={{ color: '#e84393' }}>
                  English
                </span>
              </h2>
            </div>
          </div>

          <p style={{ fontSize: '15px', color: '#636e72', margin: 0, lineHeight: '1.5', textAlign: 'center', wordBreak: 'keep-all', width: '100%' }}>
            우리 아이 첫 영어, 엄마와 함께!<br/>
            AI와 전문가가 돕는 기적의 엄마표 영어 튜터링
          </p>
        </header>

        <div style={{ padding: '0 20px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {isZeroCredit ? (
            <div style={{ background: '#fff4e6', padding: '25px', borderRadius: '20px', width: '92%', border: '5px solid #ff9f43', boxSizing: 'border-box', textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#e17055', margin: '0 0 15px 0' }}>🔐 LOW CREDITS!</h2>
              <p style={{ color: '#2d3436', fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' }}>
                작문 크레딧이 모두 소진되었습니다.<br/>(잔여: <span style={{color: '#e74c3c'}}>0</span>점)
              </p>
            </div>
          ) : (
            <div style={{ width: '92%', backgroundColor: '#f8f9fa', border: '3px dashed #ffcce0', borderRadius: '24px', padding: '25px 20px', textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }}>
              
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#00b894', margin: '0 0 5px 0' }}>📩 가입만 해도</p>
              
              <p style={{ fontSize: '26px', fontWeight: '900', color: '#e84393', margin: '0 0 20px 0', lineHeight: '1.2', textAlign: 'center' }}>
                33점 무료 증정! ✨
              </p>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="email"
                  placeholder="자주 쓰는 이메일 주소 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '15px', border: '2px solid #ffcce0', marginBottom: '20px', textAlign: 'center', outline: 'none', backgroundColor: '#ffffff', fontWeight: '500', boxSizing: 'border-box' }}
                />

                <button 
                  onClick={handleEntrance}
                  disabled={loading}
                  style={{
                    background: loading ? '#b2bec3' : 'linear-gradient(135deg, #e84393, #fd79a8)',
                    color: 'white', padding: '18px', fontSize: '20px', border: 'none', borderRadius: '15px', cursor: loading ? 'wait' : 'pointer', fontWeight: '900', width: '100%', boxSizing: 'border-box',
                    boxShadow: loading ? 'none' : '0 8px 15px rgba(232, 67, 147, 0.3)',
                    transition: '0.3s'
                  }}
                >
                  {loading ? '확인 중...' : '시작하기 ✨'}
                </button>
              </div>
            </div>
          )}

          <div 
            onClick={() => setShowModal(true)}
            className="neon-btn"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', width: '92%', padding: '16px 20px', borderRadius: '16px', background: '#00b894', color: '#ffffff', fontSize: '16px', fontWeight: '900', textAlign: 'center', boxSizing: 'border-box', marginTop: '5px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 184, 148, 0.3)' }}
          >
            <span>💎 프리미엄 멤버십 구독:</span>
            <span style={{ color: '#ffeaa7' }}>잔여 크레딧 무제한 누적 / $2.9</span>
          </div>
        </div>

        {/* 푸터 생략 (대표님께서 기존 타이거 푸터 코드를 그대로 활용하셔도 무방합니다) */}

        {showModal && (
          <div 
            onClick={() => setShowModal(false)} 
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px 25px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative', textAlign: 'left', boxSizing: 'border-box' }}
            >
              <button 
                onClick={() => setShowModal(false)} 
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af', padding: '5px' }}
              >✖</button>

              <h3 style={{ margin: '0 0 15px 0', color: '#2d3436', fontSize: '20px', fontWeight: '900', lineHeight: '1.3' }}>
                🔥 우리 아이 영어 실력 쑥쑥! <br/>
                <span style={{ color: '#e84393', fontSize: '16px' }}>[프리미엄 33 크레딧 충전]</span><br/>
                단돈 $2.90로 튜터링 받기 🚀
              </h3>
              <p style={{ fontSize: '14px', color: '#636e72', marginBottom: '20px', lineHeight: '1.5' }}>
                전문가의 1:1 맞춤 피드백과 엄마를 위한 지도 가이드를 이메일로 편하게 받아보세요.
              </p>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ width: '100%', padding: '15px', borderRadius: '14px', backgroundColor: '#00b894', color: '#fff', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}
              >
                닫기 (Got it!)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Entrance;