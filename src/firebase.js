import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. Firebase 환경 설정 (6개 변수)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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