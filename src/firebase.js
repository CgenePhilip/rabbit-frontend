import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. Firebase 환경 설정 (직접 입력 방식 - .env 에러 완벽 차단!)
const firebaseConfig = {
  apiKey: "AIzaSyD3DU9iloOCfWt8J4zCFr7fxWhdYV5Wg4",
  authDomain: "rabbit-kids-english.firebaseapp.com",
  projectId: "rabbit-kids-english",
  storageBucket: "rabbit-kids-english.firebasestorage.app",
  messagingSenderId: "809325389200",
  appId: "1:809325389200:web:e0e96017b37b98f48dff15"
};

// 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 2. 비즈니스 로직 (크레딧 정책)
export const CREDIT_POLICY = {
  // 검로드 고객: 7 + 10 + 1 = 18점
  GUMROAD_INITIAL: 18,
  
  // 레먼 고객: (무료 7점) + 10 + 1 = 18점 (결과적으로 첫 구매 시 18점이 됨)
  LEMON_PURCHASE_ADD: 11, 
  
  // 충전 안내 기준: 3점 남았을 때부터
  RECHARGE_THRESHOLD: 3,
  
  // 이벤트 중복 수령 불가 (true/false로 체크할 용도)
  EVENT_REUSABLE: false
};

/**
 * 고객별 맞춤형 초기 크레딧 계산기
 * @param {string} type - 'gumroad' 또는 'lemon'
 * @param {number} currentBalance - 현재 잔액 (레먼 고객용)
 */
export const getInitialCreditByType = (type, currentBalance = 0) => {
  if (type === 'gumroad') return CREDIT_POLICY.GUMROAD_INITIAL;
  if (type === 'lemon') return currentBalance + CREDIT_POLICY.LEMON_PURCHASE_ADD;
  return 0;
};

/**
 * 충전 안내 메일 대상 여부 확인
 */
export const shouldSendRechargeNotice = (credits) => {
  return credits <= CREDIT_POLICY.RECHARGE_THRESHOLD;
};