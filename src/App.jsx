import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Entrance from './pages/Entrance';
import LevelSelect from './pages/LevelSelect';
import Write from './pages/Write'; 
import Video from './pages/Video'; 

// ----------------------------------------------------------------------
// 🐰 래빗표 인앱 브라우저 완벽 차단 및 링크 복사 유도기
// ----------------------------------------------------------------------
const useInAppEscape = () => {
  const [isInApp, setIsInApp] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const inAppKeywords = ['kakaotalk', 'naver', 'daum', 'instagram', 'outlook', 'fb_iab'];
    const isMatch = inAppKeywords.some(keyword => userAgent.includes(keyword));

    if (isMatch) {
      setIsInApp(true);
    }
  }, []);

  return isInApp;
};

function App() {
  const isInApp = useInAppEscape();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!\n크롬(Chrome)이나 사파리(Safari) 브라우저를 열고 주소창에 붙여넣기 해주세요. 🐰");
  };

  return (
    <>
      {isInApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#ffcce0', color: '#e84393', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '20px', textAlign: 'center', boxSizing: 'border-box'
        }}>
          <span style={{ fontSize: '70px', marginBottom: '15px' }}>🐰</span>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', wordBreak: 'keep-all', fontWeight: '900' }}>
            앗! 현재 화면에서는<br/>음성 지원이 제한됩니다.
          </h2>
          <p style={{ fontSize: '15px', marginBottom: '30px', opacity: 0.9, color: '#636e72' }}>
            카카오톡, 네이버 앱 내부에서는<br/>래빗 선생님의 목소리를 들을 수 없어요!
          </p>
          
          <button onClick={handleCopyLink} style={{
            backgroundColor: '#00b894', color: 'white', border: 'none', padding: '15px 30px',
            borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,184,148,0.3)', marginBottom: '20px'
          }}>
            🔗 현재 링크 복사하기
          </button>
          
          <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '15px', fontSize: '14px', lineHeight: '1.6', color: '#2d3436' }}>
            복사한 링크를 <strong>크롬(Chrome)</strong>이나<br/>
            <strong>사파리(Safari)</strong> 인터넷 주소창에 붙여넣어주세요!
          </div>
        </div>
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Entrance />} />
          <Route path="/level" element={<LevelSelect />} />
          <Route path="/write" element={<Write />} /> 
          <Route path="/video" element={<Video />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;