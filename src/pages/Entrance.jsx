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
  const [loading, setLoading] = useState(false);
  const [isZeroCredit, setIsZeroCredit] = useState(false); 
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

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

      let finalCredits = data.isNew ? 33 : data.balance; 

      await setDoc(userRef, {
        email: targetEmail.toLowerCase(),
        nation: "Kids",
        credits: finalCredits,
        createdAt: userSnap.exists() ? userSnap.data().createdAt : new Date()
      }, { merge: true });

      if (finalCredits <= 0) {
        setIsZeroCredit(true);
        setShowPremiumModal(true); // 👈 핵심! 0점 확인 즉시 결제 팝업을 강제로 엽니다.
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
    <div style={{ 
      background: 'radial-gradient(circle at top, #fff0f6 0%, #ffe0ec 40%, #ffb8d1 100%)', 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Noto Sans KR', sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      
      {/* 🌸 배경 흩날리는 꽃잎 효과 */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '30px', opacity: 0.4, filter: 'blur(2px)', transform: 'rotate(20deg)' }}>🌸</div>
      <div style={{ position: 'absolute', top: '30%', right: '10%', fontSize: '40px', opacity: 0.3, filter: 'blur(3px)', transform: 'rotate(-15deg)' }}>🌺</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '25px', opacity: 0.5, filter: 'blur(1px)', transform: 'rotate(45deg)' }}>🌷</div>

      {/* 2. 메인 컨텐츠 영역 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', zIndex: 1 }}>
        
        {/* 💻 반응형 클래스(responsive-wrapper) 추가: PC에서는 가로가 850px로 넓어짐! */}
        <div className="responsive-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          
          {/* 🌿 화환 장식 요소들 */}
          <div className="wreath-tl" style={{ position: 'absolute', top: '-25px', left: '-15px', fontSize: '45px', zIndex: 2, filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))', transform: 'rotate(-20deg)', pointerEvents: 'none' }}>🌸🌿</div>
          <div className="wreath-tr" style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '40px', zIndex: 2, filter: 'drop-shadow(-2px 4px 6px rgba(0,0,0,0.1))', transform: 'rotate(15deg)', pointerEvents: 'none' }}>🌺🍃</div>
          <div className="wreath-bl" style={{ position: 'absolute', bottom: '-25px', left: '-15px', fontSize: '45px', zIndex: 2, filter: 'drop-shadow(2px -4px 6px rgba(0,0,0,0.1))', transform: 'rotate(-40deg)', pointerEvents: 'none' }}>🌷🌱</div>
          <div className="wreath-br" style={{ position: 'absolute', bottom: '-20px', right: '-15px', fontSize: '42px', zIndex: 2, filter: 'drop-shadow(-2px -4px 6px rgba(0,0,0,0.1))', transform: 'rotate(25deg)', pointerEvents: 'none' }}>🌸🌿</div>
          <div className="wreath-ml" style={{ position: 'absolute', top: '40%', left: '-20px', fontSize: '30px', zIndex: 2, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))', pointerEvents: 'none' }}>🌼</div>
          <div className="wreath-mr" style={{ position: 'absolute', top: '55%', right: '-20px', fontSize: '35px', zIndex: 2, filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.1))', pointerEvents: 'none' }}>🌺</div>

          {/* 🤍 반응형 중앙 박스: 모바일은 세로(column), PC는 가로(row) 분할! */}
          <div className="responsive-card" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            display: 'flex', flexDirection: 'column', 
            boxShadow: '0 20px 50px rgba(232, 67, 147, 0.2), inset 0 0 0 4px rgba(255, 204, 224, 0.4)', 
            borderRadius: '40px', overflow: 'visible', position: 'relative', zIndex: 1 
          }}>
            
            {/* 왼쪽 (로고 영역) */}
            <header className="responsive-header" style={{ padding: '45px 20px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '65px' }}>🐰</div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#00b894', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Mom & Kids English Tutor
                  </div>
                  <h2 style={{ fontSize: '30px', fontWeight: '900', lineHeight: '1.15', margin: 0, color: '#2d3436' }}>
                    Rabbit Kids<br/>
                    <span style={{ color: '#e84393' }}>English</span>
                  </h2>
                </div>
              </div>
            </header>

            {/* 오른쪽 (입력 영역) */}
            <div className="responsive-body" style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '92%', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                
                <div style={{ width: '100%', backgroundColor: '#ffffff', border: '3px dashed #ffcce0', borderRadius: '24px', padding: '25px 20px', textAlign: 'center', boxSizing: 'border-box', position: 'relative' }}>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#00b894', margin: '0 0 5px 0' }}>📩 가입만 해도</p>
                  <p style={{ fontSize: '24px', fontWeight: '900', color: '#e84393', margin: '0 0 20px 0' }}>33점 무료 증정! ✨</p>

                  <input
                    type="email"
                    placeholder="이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '15px', border: '2px solid #ffcce0', marginBottom: '15px', textAlign: 'center', outline: 'none', backgroundColor: '#fafafa', boxSizing: 'border-box' }}
                  />

                  <button 
                    onClick={handleEntrance}
                    disabled={loading}
                    style={{
                      background: loading ? '#b2bec3' : 'linear-gradient(135deg, #e84393, #fd79a8)',
                      color: 'white', padding: '18px', fontSize: '22px', border: 'none', borderRadius: '15px', cursor: loading ? 'wait' : 'pointer', fontWeight: '900', width: '100%',
                      boxShadow: '0 10px 20px rgba(232, 67, 147, 0.3)', transition: '0.3s'
                    }}
                  >
                    {loading ? '확인 중...' : '시작하기 ✨'}
                  </button>
                </div>

                {/* 🌸 [시크릿 가든 멤버십 바] */}
                <div 
                  onClick={() => setShowPremiumModal(true)}
                  className="secret-garden-btn"
                  style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: '100%', padding: '12px 15px', borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)', 
                    color: '#ffffff', cursor: 'pointer', boxSizing: 'border-box',
                    position: 'relative', overflow: 'hidden', border: '3px solid #ffffff',
                    boxShadow: '0 8px 20px rgba(150, 230, 161, 0.4)'
                  }}
                >
                  <span style={{ position: 'absolute', left: '5px', bottom: '2px', fontSize: '20px' }}>🌳</span>
                  <span style={{ position: 'absolute', right: '5px', top: '2px', fontSize: '20px' }}>🌲</span>
                  <span style={{ position: 'absolute', left: '15%', top: '2px', fontSize: '16px' }} className="buzzing-bee">🐝</span>
                  <span style={{ position: 'absolute', right: '15%', bottom: '2px', fontSize: '18px' }} className="fluttering-butterfly">🦋</span>
                  <span style={{ position: 'absolute', left: '35%', bottom: '0', fontSize: '16px' }}>🌷</span>
                  <span style={{ position: 'absolute', right: '35%', top: '0', fontSize: '14px' }}>🌼</span>
                  <span style={{ position: 'absolute', left: '45%', bottom: '2px', fontSize: '18px' }} className="hopping-rabbit">🐰</span>

                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#1b5e20', zIndex: 1, background: 'rgba(255,255,255,0.7)', padding: '1px 8px', borderRadius: '8px' }}>
                    💎 프리미엄 멤버십 구독
                  </span>
                  <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold', zIndex: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    무제한 누적 마법 정원 / $2.9
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 무삭제 정석 푸터 영역 */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '40px 24px', textAlign: 'center', fontSize: '12px', lineHeight: '1.8', zIndex: 2 }}>
        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="/manual_rabbit.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#d1d5db', textDecoration: 'underline', fontWeight: 'bold' }}>📖 사용설명서</a>
          <span onClick={() => setActivePolicy('terms')} style={{ color: '#d1d5db', textDecoration: 'underline', cursor: 'pointer' }}>이용약관</span>
          <span onClick={() => setActivePolicy('privacy')} style={{ color: '#d1d5db', textDecoration: 'underline', cursor: 'pointer', color: '#00b894', fontWeight: 'bold' }}>개인정보처리방침</span>
          <span onClick={() => setActivePolicy('refund')} style={{ color: '#d1d5db', textDecoration: 'underline', cursor: 'pointer' }}>환불정책</span>
        </div>
        
        <div style={{ borderTop: '1px solid #374151', paddingTop: '25px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ color: '#f3f4f6', fontWeight: '700', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Contact & Info</span>
          <p style={{ margin: '0 0 5px 0' }}>대표: <strong>정철호</strong> | Email: <strong>cgene@daum.net</strong> (또는 cgen@daum.net)</p>
          <p style={{ margin: '0 0 10px 0', wordBreak: 'keep-all' }}>주소: 12054, 경기도 남양주시 진접읍 봉현로 51-4 길훈상가 202호</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <strong style={{ color: '#d1d5db', fontSize: '14px' }}>Rabbit Kids English</strong>
          <p style={{ margin: '5px 0' }}>© 2026 All right reserved.</p>
        </div>
      </footer>

      {/* 팝업 모달 (프리미엄 구독 - 최종 결제 링크 장착 버전) */}
      {showPremiumModal && (
        <div onClick={() => setShowPremiumModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#ffffff', borderRadius: '30px', padding: '35px 25px', maxWidth: '420px', width: '100%', position: 'relative', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            
            <button onClick={() => setShowPremiumModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>✖</button>
            
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>💎</div>
            
            <h3 style={{ margin: '0 0 15px 0', color: '#2d3436', fontSize: '21px', fontWeight: '900', lineHeight: '1.4' }}>
              🚀 우리 아이 영어 실력 쑥쑥!<br/>
              <span style={{ color: '#e84393' }}>[프리미엄 33 크레딧 충전]</span>
            </h3>
            
            <p style={{ fontSize: '14px', color: '#636e72', marginBottom: '25px', lineHeight: '1.6' }}>
              전문가의 1:1 맞춤 피드백과 엄마를 위한 지도 가이드를 이메일로 편하게 받아보세요.
            </p>

            {/* 💎 프리미엄 혜택 박스 */}
            <div style={{ backgroundColor: '#fdf2f2', borderRadius: '20px', padding: '15px', marginBottom: '25px', textAlign: 'left' }}>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', color: '#2d3436', lineHeight: '2' }}>
                <li>✅ <strong>30 + 3(보너스)</strong> 프리미엄 크레딧</li>
                <li>✅ <strong>원어민 음성 복습</strong> (개인 라디오)</li>
                <li>✅ <strong>1:1 밀착 피드백</strong> 서비스 우선권</li>
              </ul>
            </div>

            {/* 🚨 실전 결제 버튼 (Lemon Squeezy 연결) */}
            <a 
              href="https://tiger-hangeul.lemonsqueezy.com/checkout/buy/082a60b7-dda3-4251-bd54-3f564a3bcd3d"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'block', width: '100%', padding: '18px', borderRadius: '18px', 
                background: 'linear-gradient(135deg, #ff7979, #e84393)', color: '#fff', 
                fontSize: '18px', fontWeight: '900', border: 'none', cursor: 'pointer',
                textDecoration: 'none', marginBottom: '12px', boxShadow: '0 8px 20px rgba(232, 67, 147, 0.3)',
                boxSizing: 'border-box'
              }}
            >
              ⚡ 프리미엄 가입하기 ($2.9)
            </a>

            <button 
              onClick={() => setShowPremiumModal(false)} 
              style={{ width: '100%', padding: '12px', borderRadius: '15px', backgroundColor: '#f1f2f6', color: '#7f8c8d', fontSize: '14px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              나중에 할게요 (Close)
            </button>

            <p style={{ fontSize: '11px', color: '#b2bec3', marginTop: '15px' }}>* 구독 약정 없는 1회성 안전 결제입니다.</p>
          </div>
        </div>
      )}

      {/* 📜 정책 안내 모달 (내용 100% 무삭제) */}
      {activePolicy && (
        <div onClick={() => setActivePolicy(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px', boxSizing: 'border-box' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '25px', maxWidth: '500px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', boxSizing: 'border-box' }}>
            <button onClick={() => setActivePolicy(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>✖</button>
            <h3 style={{ margin: '0 0 15px 0', color: '#2d3436', fontSize: '22px', fontWeight: '900', borderBottom: '2px solid #ffcce0', paddingBottom: '10px' }}>
              {activePolicy === 'terms' && '📜 이용약관'}
              {activePolicy === 'refund' && '💸 환불정책'}
              {activePolicy === 'privacy' && '🛡️ 개인정보처리방침'}
            </h3>
            
            <div style={{ flex: 1, overflowY: 'auto', fontSize: '14px', color: '#4b5563', lineHeight: '1.6', paddingRight: '10px', wordBreak: 'keep-all' }}>
              {activePolicy === 'terms' && (
                <>
                  <p><strong>1. 서론:</strong> Rabbit Kids English(대표: 정철호)에 오신 것을 환영합니다. 당사 웹사이트에 접속하고 서비스를 이용함으로써 귀하는 본 약관에 동의하게 됩니다.</p>
                  <p><strong>2. 서비스:</strong> Rabbit Kids English는 AI 기반 영어 글쓰기 교정 및 교육 콘텐츠를 제공합니다. 당사는 서비스의 일부 또는 전부를 언제든지 수정하거나 중단할 권리를 보유합니다.</p>
                  <p><strong>3. 사용자 계정:</strong> 귀하는 계정 자격 증명의 보안을 유지할 책임이 있습니다.</p>
                  <p><strong>4. 지적 재산권:</strong> Rabbit Kids English가 제공하는 모든 콘텐츠는 당사의 자산입니다. 그러나 귀하가 작성하여 제출한 글은 여전히 귀하의 지적 재산으로 남습니다.</p>
                  <p><strong>5. 책임의 제한:</strong> 법률이 허용하는 최대 범위 내에서, Rabbit Kids English는 서비스 이용으로 인해 발생하는 간접적 또는 결과적 손해에 대해 책임을 지지 않습니다.</p>
                  <p><strong>문의처:</strong> cgene@daum.net</p>
                </>
              )}
              {activePolicy === 'refund' && (
                <>
                  <p><strong>1. 만족 보장:</strong> Rabbit Kids English(대표: 정철호)는 고객님의 만족을 최우선으로 합니다. 만약 서비스에 만족하지 못하신 경우, 구매일로부터 14일 이내에 환불을 요청하실 수 있습니다.</p>
                  <p><strong>2. 환불 요청 방법:</strong> 환불을 요청하시려면 주문 번호와 환불 사유를 함께 기재하여 cgene@daum.net으로 이메일을 보내주시기 바랍니다.</p>
                  <p><strong>3. 처리 절차:</strong> 승인된 환불은 원래 결제 수단으로 5~10 영업일 이내에 처리됩니다.</p>
                </>
              )}
              {activePolicy === 'privacy' && (
                <>
                  <p>Rabbit Kids English(대표: 정철호, 이하 "당사")에 오신 것을 환영합니다. 당사는 고객님의 개인정보를 보호하고, 정보가 어떻게 처리되는지 이해할 수 있도록 최선을 다합니다. 본 방침은 고객님이 서비스 및 플랫폼을 이용할 때 당사가 개인정보를 수집·이용·공유하는 방법을 설명합니다.</p>
                  <p><strong>1. 수집하는 정보:</strong><br/>- 계정 정보: 이메일 주소를 수집하여 계정을 생성·관리합니다.<br/>- 사용자 콘텐츠: 교정을 위해 제출하는 텍스트, 문장("입력 데이터")을 수집합니다.<br/>- 이용 데이터: 접속 시간 등 서비스 이용 방식에 관한 정보를 수집할 수 있습니다.</p>
                  <p><strong>2. 개인정보 이용 목적:</strong><br/>- 서비스 제공: 플랫폼 운영 및 AI 기반 글쓰기 교정 제공<br/>- 결제 처리: 제휴 결제망(Lemon Squeezy)을 통한 거래 처리<br/>- AI 정확도 개선: 제3자 AI를 통한 피드백 생성<br/>- 커뮤니케이션: 업데이트, 문의 응답</p>
                  <p><strong>3. 제3자 서비스 및 AI 처리 (중요):</strong><br/>- <strong>OpenAI (AI 처리):</strong> 제출된 텍스트는 분석 및 피드백 생성에 사용됩니다. API 정책에 따라 모델 학습에 사용되지 않습니다.<br/>- <strong>Lemon Squeezy:</strong> 결제 처리업체이며 해당 업체의 정책이 적용됩니다.<br/>- <strong>Google:</strong> Firebase 및 Google Apps Script 인프라에서 운영됩니다.</p>
                  <p><strong>4. 데이터 보관:</strong> 명시된 목적을 달성하거나 법적 의무 준수에 필요한 기간 동안만 보관하며, 언제든 삭제 요청이 가능합니다.</p>
                  <p><strong>5. 고객 권리:</strong> 개인정보 열람, 수정, 데이터 삭제("잊힐 권리") 요청이 가능합니다.</p>
                  <p><strong>6. 보안:</strong> 합리적인 보안 조치를 취하나 인터넷 전송 방식의 100% 안전은 보장할 수 없습니다.</p>
                  <p><strong>7. 정책 변경:</strong> 필요 시 본 방침을 업데이트할 수 있습니다.</p>
                  <p><strong>8. 문의처:</strong> 이메일 cgene@daum.net / 서비스명: Rabbit Kids English</p>
                </>
              )}
            </div>
            <button onClick={() => setActivePolicy(null)} style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#e84393', color: '#fff', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '20px' }}>확인했습니다</button>
          </div>
        </div>
      )}

      {/* 🚨 CSS 마법 구역: 여기서 PC와 모바일을 완벽하게 분리합니다! 🚨 */}
      <style>{`
        /* 공통 애니메이션 */
        @keyframes sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        .hopping-rabbit { animation: sway 2s infinite ease-in-out; }
        .buzzing-bee { animation: sway 0.5s infinite linear; }
        .fluttering-butterfly { animation: sway 3s infinite ease-in-out; }

        /* 💻 [PC 전용 스타일] 가로 해상도가 850px 이상일 때만 작동! 모바일은 이 코드를 철저히 무시합니다. */
        @media (min-width: 850px) {
          .responsive-wrapper { max-width: 850px !important; }
          .responsive-card { 
            flex-direction: row !important; 
            padding: 50px 20px !important; 
            align-items: center !important; 
          }
          .responsive-header { 
            flex: 1 !important; 
            padding: 0 40px !important; 
            border-right: 3px dashed #ffeaef !important; 
          }
          .responsive-body { 
            flex: 1.2 !important; 
            padding: 0 40px !important; 
          }
          /* PC 화면이 넓어지니 화환 꽃 장식도 살짝 키워서 바깥으로 밀어줍니다 */
          .wreath-tl { font-size: 60px !important; top: -35px !important; left: -25px !important; }
          .wreath-tr { font-size: 55px !important; top: -30px !important; right: -20px !important; }
          .wreath-bl { font-size: 60px !important; bottom: -35px !important; left: -25px !important; }
          .wreath-br { font-size: 55px !important; bottom: -30px !important; right: -25px !important; }
        }
      `}</style>

    </div>
  );
}

export default Entrance;