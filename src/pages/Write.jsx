import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzcoAlzAN3R_SIdAFJhXiRloJ-UsQsCuGOf-_lyGdT18ouYCJnmrQZZzecYRY8niqzy/exec";

function Write() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sentence, setSentence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyword, setKeyword] = useState('선생님이 단어를 고르고 있습니다... ⏳');
  const fetchStarted = useRef(false); 

  const userEmail = location.state?.email || '';
  const level = location.state?.level || 'Lv.1 Sprout';
  const cost = location.state?.cost || 1;

  useEffect(() => {
    if (!userEmail) { navigate('/'); return; }
    if (fetchStarted.current) return; 
    fetchStarted.current = true; 

    const fetchKeywordFromSheet = async () => {
      try {
        const response = await fetch(`${GAS_WEBAPP_URL}?action=getKeyword&level=${level}`);
        const data = await response.json();
        setKeyword(data.keyword);
      } catch (error) {
        console.error("키워드 가져오기 실패:", error);
        setKeyword("Dog, Bark"); // 통신 실패 시 기본값
      }
    };

    fetchKeywordFromSheet();
  }, [userEmail, level, navigate]);

  const handleSubmit = async () => {
    if (sentence.trim().length < 2) {
      alert("아이와 함께 문장을 완성해주세요! 🐰");
      return;
    }

    setIsSubmitting(true);

    try {
      const userRef = doc(db, 'users', userEmail);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentCredits = userSnap.data().credits;
        if (currentCredits < cost) {
          alert("🚨 크레딧이 부족합니다."); navigate('/'); return;
        }

        await updateDoc(userRef, { credits: currentCredits - cost });

        await fetch(GAS_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            action: 'submitSentence',
            email: userEmail,
            nation: "Kids", 
            level: level,
            keyword: keyword,
            sentence: sentence,
            creditsLeft: currentCredits - cost
          })
        });

        alert("🎉 제출 완료! 래빗 선생님의 피드백이 이메일로 발송됩니다.");
        navigate('/'); 
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("앗, 뭔가 오류가 발생했어요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff0f6', minHeight: '100vh', padding: '30px', fontFamily: "'Noto Sans KR', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ fontSize: '60px', marginBottom: '10px' }}>🐰</div>
      
      <div style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(232,67,147,0.1)', boxSizing: 'border-box' }}>
        <h2 style={{ color: '#2d3436', marginTop: 0, textAlign: 'center', fontWeight: '900' }}>📝 {level}</h2>
        
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', border: '2px dashed #00b894' }}>
          <span style={{ fontSize: '14px', color: '#00b894', fontWeight: 'bold' }}>Today's Magic Words</span><br/>
          <span style={{ fontSize: '26px', fontWeight: '900', color: '#2d3436', display: 'inline-block', marginTop: '10px' }}>
            {keyword}
          </span>
        </div>

        <p style={{ fontSize: '14px', color: '#636e72', textAlign: 'center', marginBottom: '10px', wordBreak: 'keep-all' }}>
          어머니, 위 단어들을 활용해서 아이와 함께 문장을 완성해보세요! 문법이 완벽하지 않아도 괜찮아요.
        </p>

        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="여기에 영어 문장을 적어주세요. 🐰"
          style={{ width: '100%', height: '140px', padding: '20px', fontSize: '18px', borderRadius: '15px', border: '3px solid #ffcce0', boxSizing: 'border-box', resize: 'none', outline: 'none', marginBottom: '20px', fontFamily: 'inherit' }}
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '18px', fontSize: '20px', fontWeight: 'bold', color: 'white', background: isSubmitting ? '#b2bec3' : '#e84393', border: 'none', borderRadius: '15px', cursor: isSubmitting ? 'wait' : 'pointer', boxShadow: '0 6px 15px rgba(232,67,147,0.3)', transition: '0.2s' }}
        >
          {isSubmitting ? '제출 중...' : '📨 래빗 선생님께 제출'}
        </button>
      </div>
    </div>
  );
}

export default Write;