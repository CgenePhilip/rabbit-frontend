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
  
  // 🐰 제출 완료 상태와 남은 크레딧을 기억하는 State
  const [isComplete, setIsComplete] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);

  const fetchStarted = useRef(false); 
  const textareaRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const userEmail = location.state?.email || '';
  const level = location.state?.level || 'Lv.1 Sprout';
  const cost = location.state?.cost || 1;

  const playFullAudioSequence = (currentKeyword) => {
    window.speechSynthesis.cancel(); 

    const intro = new SpeechSynthesisUtterance("Today's magic words");
    intro.lang = 'en-US'; intro.rate = 0.9; intro.pitch = 1.1;

    const keywordSpeech = new SpeechSynthesisUtterance(currentKeyword);
    keywordSpeech.lang = 'en-US'; keywordSpeech.rate = 0.85; keywordSpeech.pitch = 1.1;

    keywordSpeech.onend = () => {
      setTimeout(() => {
        const part1 = new SpeechSynthesisUtterance("여기에 ");
        part1.lang = 'ko-KR'; part1.rate = 0.95; part1.pitch = 1.1;

        const part2 = new SpeechSynthesisUtterance("Today's magic words");
        part2.lang = 'en-US'; part2.rate = 0.9; part2.pitch = 1.1;

        const part3 = new SpeechSynthesisUtterance(" 로 영어문장을 쓰는 마법을 써봐요.");
        part3.lang = 'ko-KR'; part3.rate = 0.95; part3.pitch = 1.1;

        window.speechSynthesis.speak(part1);
        window.speechSynthesis.speak(part2);
        window.speechSynthesis.speak(part3);
      }, 1000); 
    };

    window.speechSynthesis.speak(intro);
    window.speechSynthesis.speak(keywordSpeech);
  };

  useEffect(() => {
    if (!userEmail) { navigate('/'); return; }
    if (fetchStarted.current) return; 
    fetchStarted.current = true; 

    const fetchKeywordFromSheet = async () => {
      try {
        const response = await fetch(`${GAS_WEBAPP_URL}?action=getKeyword&level=${level}`);
        const data = await response.json();
        
        setKeyword(data.keyword);
        playFullAudioSequence(data.keyword);

      } catch (error) {
        console.error("키워드 가져오기 실패:", error);
        setKeyword("Dog, Bark"); 
        playFullAudioSequence("Dog, Bark");
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

        const newCredits = currentCredits - cost;
        await updateDoc(userRef, { credits: newCredits });

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
            creditsLeft: newCredits
          })
        });

        // 🐰 결제가 차감된 후, 남은 크레딧을 State에 예쁘게 저장해 둡니다.
        setRemainingCredits(newCredits);

        window.speechSynthesis.cancel(); 
        const successSpeech = new SpeechSynthesisUtterance("제출 완료! 래빗 선생님의 피드백이 곧 이메일로 발송될 거예요.");
        successSpeech.lang = 'ko-KR'; 
        successSpeech.rate = 0.95; 
        successSpeech.pitch = 1.1;

        // 🐰 쫓아내는 alert 대신, 예쁜 '제출 완료 화면'으로 전환합니다!
        successSpeech.onend = () => { setIsComplete(true); };
        successSpeech.onerror = () => { setIsComplete(true); };

        window.speechSynthesis.speak(successSpeech);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("앗, 뭔가 오류가 발생했어요.");
      setIsSubmitting(false);
    }
  };

  const getNeonBoxStyle = () => {
    const brandingPink = '#e84393'; 
    const baseStyle = {
      width: '100%', height: '180px', padding: '15px 20px', borderRadius: '15px',
      boxSizing: 'border-box', marginBottom: '20px', transition: 'all 0.3s ease-in-out',
      display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', cursor: 'text',
    };

    if (isFocused) {
      return {
        ...baseStyle,
        border: `3px solid ${brandingPink}`, 
        animation: 'neon-breath 2s infinite ease-in-out',
      };
    } else {
      return {
        ...baseStyle,
        border: '3px solid #ffcce0', 
        boxShadow: '0 0 5px rgba(232, 67, 147, 0.2)', 
        animation: 'none', 
      };
    }
  };

  // 🎉 [제출 완료 전용 화면] isComplete가 true가 되면 렌더링
  if (isComplete) {
    return (
      <div style={{ backgroundColor: '#fff0f6', minHeight: '100vh', padding: '30px', fontFamily: "'Noto Sans KR', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
        <div style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(232,67,147,0.1)', boxSizing: 'border-box', textAlign: 'center' }}>
          
          <h2 style={{ color: '#27ae60', marginTop: 0, fontWeight: '900', fontSize: '28px' }}>제출 완료!</h2>
          <p style={{ fontSize: '16px', color: '#636e72', marginBottom: '30px', lineHeight: '1.6', wordBreak: 'keep-all' }}>
            래빗 선생님이 문장을 꼼꼼히 읽고 있어요.<br/>
            피드백이 곧 <strong>어머니의 이메일</strong>로 도착할 거예요! 🐰💌
          </p>

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #eee' }}>
            <span style={{ fontSize: '14px', color: '#b2bec3', fontWeight: 'bold' }}>남은 작문 크레딧</span><br/>
            <span style={{ fontSize: '28px', fontWeight: '900', color: '#00b894' }}>{remainingCredits} 점</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              // 🐰 이전처럼 이메일을 까먹는 게 아니라, state에 담아서 레벨 선택 창으로 고이 모셔다 드립니다.
              onClick={() => navigate('/level', { state: { email: userEmail, credits: remainingCredits, isNew: false } })}
              style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', color: 'white', background: '#0984e3', border: 'none', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 6px 15px rgba(9,132,227,0.3)', transition: '0.2s' }}
            >
              ⬅️ 다른 글 더쓰기(레벨선택)
            </button>
            
            {/* 🐰 [완성] 아이들의 해방감을 위한 '놀러 가기' 버튼! (초기 화면으로 완벽 로그아웃) */}
            <button
              onClick={() => navigate('/')} 
              style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', color: '#d35400', background: '#ffeaa7', border: 'none', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,234,167,0.5)', transition: '0.2s' }}
            >
              👋 작문 끝! 신나게 놀러 가기
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 📝 아직 제출 전이라면 기존의 작문 화면 렌더링
  return (
    <div style={{ backgroundColor: '#fff0f6', minHeight: '100vh', padding: '30px', fontFamily: "'Noto Sans KR', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <style>{`
        @keyframes neon-breath {
          0%, 100% { box-shadow: 0 0 10px #fff, 0 0 15px rgba(232, 67, 147, 0.6), inset 0 0 5px rgba(255, 255, 255, 0.4); }
          50% { box-shadow: 0 0 12px #fff, 0 0 20px rgba(232, 67, 147, 0.75), inset 0 0 6px rgba(255, 255, 255, 0.5); }
        }
      `}</style>
      
      <div style={{ fontSize: '60px', marginBottom: '10px' }}>🐰</div>
      
      <div style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(232,67,147,0.1)', boxSizing: 'border-box' }}>
        <h2 style={{ color: '#2d3436', marginTop: 0, textAlign: 'center', fontWeight: '900' }}>📝 {level}</h2>
        
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', border: '2px dashed #00b894' }}>
          <span style={{ fontSize: '14px', color: '#00b894', fontWeight: 'bold' }}>Today's Magic Words</span><br/>
          <span style={{ fontSize: '26px', fontWeight: '900', color: '#2d3436', display: 'inline-block', marginTop: '10px' }}>
            {keyword}
          </span>
        </div>

        <p style={{ fontSize: '14px', color: '#636e72', textAlign: 'center', marginBottom: '15px', wordBreak: 'keep-all' }}>
          어머니, 위 단어들을 활용해서 아이와 함께 문장을 완성해보세요! 문법이 완벽하지 않아도 괜찮아요.
        </p>

        <div style={getNeonBoxStyle()} onClick={() => textareaRef.current.focus()}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span role="img" aria-label="magic wand" style={{ fontSize: '20px', marginRight: '6px', filter: isFocused ? 'drop-shadow(0 0 5px #ffcce0)' : 'none', transition: '0.3s' }}>
              🪄
            </span>
            <span style={{ fontSize: '14px', color: isFocused ? '#e84393' : '#636e72', fontWeight: 'bold', transition: '0.3s' }}>
              여기에 <span style={{color: '#00b894'}}>Today's magic words</span>영어문장을 쓰는 마법을 써봐요.
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="마법의 문장... 🐰"
            
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)} 

            style={{ flex: 1, width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '18px', fontFamily: 'inherit', background: 'transparent', color: '#2d3436' }}
          />
        </div>

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