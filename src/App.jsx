// npm install lucide-react recharts firebase

import React, { useState, useEffect } from 'react';
import { Check, X, Home, ChevronRight, List, Play, RotateCcw, Save, AlertCircle, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// --- Firebase Configuration ---
// 本番環境の環境変数に合わせて設定してください
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const APP_ID = "QuizApp_001";

// --- Quiz Data ---
const quizData = [
  {
    id: "q1",
    year: "令和元年 第5問",
    title: "計算書類",
    question: "会社法上の計算書類に関する記述として、最も適切なものはどれか。",
    options: [
      "会社法上の計算書類には、株主資本等変動計算書は含まれない。",
      "計算書類の作成と報告に当たっては、会社法のほかに財務諸表規則（財務諸表等の用語、様式および作成方法に関する規則）に準拠しなければならない。",
      "公開会社は、計算書類に加えて連結計算書類を作成し、定時株主総会に報告することが求められている。",
      "取締役会設置会社は、定時株主総会の招集の通知に際して、株主に計算書類を提供しなければならない。"
    ],
    answerIndex: 3,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：エ</p>
        <p>本問では、計算書類について問われています。株式会社は、会社法により計算書類（財務諸表）を作成することが義務付けられています。計算書類には、貸借対照表、損益計算書、株主資本等変動計算書、個別注記表があります。これらは、どんなに小さい企業であっても株式会社であれば作成が義務付けられています。さらに、取締役会設置会社では、定時株主総会の招集の通知に際して、株主に対し、計算書類及び事業報告（監査報告又は会計監査報告を含む）を提供しなければなりません。</p>
        <p>選択肢アですが、株主資本等変動計算書は、会社法によりその作成が義務付けられています。よって、不適切です。</p>
        <p>選択肢イですが、財務諸表規則は、金融商品取引法によって定められた規則であり、金融商品取引法が適用される上場会社のみ、その作成が義務付けられています。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-gray-400 mb-2">
            <thead>
              <tr className="bg-yellow-100">
                <th className="border border-gray-400 p-2 text-center">会社法（計算書類）<br/>すべての株式会社が対象</th>
                <th className="border border-gray-400 p-2 text-center">金融商品取引法（財務諸表規則）<br/>全ての上場会社が対象</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2">貸借対照表<br/>損益計算書<br/>株主資本等変動計算書<br/>個別注記表</td>
                <td className="border border-gray-400 p-2">貸借対照表<br/>損益計算書<br/>株主資本等変動計算書<br/>キャッシュ・フロー計算書<br/>付属明細表</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>そのため、計算書類の作成と報告に当たり、財務諸表規則に準拠する必要のある会社は、上場している会社のみであり、不適切です。</p>
        <p>選択肢ウですが、公開会社であっても子会社を持たない会社は存在します。子会社を持たない会社は連結決算が不要なため不適切です。</p>
        <p>選択肢エですが、記述の通り取締役会設置会社では計算書類等の提供義務があります。よって適切です。</p>
      </div>
    )
  },
  {
    id: "q2",
    year: "平成29年 第5問",
    title: "企業会計原則",
    question: "企業会計原則に関する記述として、最も適切なものはどれか。",
    options: [
      "会計処理の原則および手続きを毎期継続して適用し、みだりに変更してはならない。",
      "株主総会提出のため、信用目的のため、租税目的のためなど種々の目的のために異なる形式の財務諸表を作成してはならない。",
      "すべての費用および収益は、その支出および収入の時点において認識し、損益計算書に計上しなければならない。",
      "予測される将来の危険に備えて、合理的な見積額を上回る費用を計上することは、保守的な会計処理として認められる。"
    ],
    answerIndex: 0,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ア</p>
        <p>企業会計原則は、一般原則、損益計算書原則、貸借対照表原則の3つから構成されています。</p>
        <p>選択肢アでは、「継続性の原則」について述べられています。企業会計原則の一般原則には、「企業会計は、その処理の原則および手続を毎期継続して適用し、みだりにこれを変更してはならない」と規定されています。よって適切です。</p>
        <p>選択肢イでは、「単一性の原則」について述べられています。異なる形式の財務諸表を作成することを禁じるものではありません。実質一元、形式多元という表現で表されます。よって不適切です。</p>
        <p>選択肢ウでは、「発生主義」について述べられています。費用は発生主義により、収益は実現主義により認識することを要請しています。よって不適切です。</p>
        <p>選択肢エでは、「保守主義」について述べられています。合理的な見積額を上回る費用を計上することは、過度に保守的な会計処理であり認められません。よって不適切です。</p>
      </div>
    )
  },
  {
    id: "q3",
    year: "令和2年 第8問",
    title: "無形固定資産の会計",
    question: "無形固定資産の会計に関する記述として、最も適切なものはどれか。",
    options: [
      "自社が長年にわたり築き上げたブランドにより、同業他社に比べ高い収益性を獲得している場合には、これを無形固定資産に計上することができる。",
      "自社の研究開発活動により特許権を取得した場合には、それまでの年度に支出された研究開発費を戻し入れ、無形固定資産として計上しなければならない。",
      "受注制作のソフトウェアの制作費は、請負工事の会計処理に準じて処理され、無形固定資産に計上されない。",
      "のれんとして資産計上された金額は、最長10年にわたり、規則的に償却される。"
    ],
    answerIndex: 2,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ウ</p>
        <p>「無形固定資産」とは、物理的な形が無い資産です。特許権など権利を表す資産や「のれん」などがあります。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-gray-400 mb-2">
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 bg-orange-100 font-bold w-1/4">のれん</td>
                <td className="border border-gray-400 p-2">企業の買収・合併などで発生する無形固定資産です。買収にかかった投資額と買収された企業の純資産の金額に差額が発生した場合、「のれん」という科目に計上します。</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 bg-orange-100 font-bold">ソフトウェア</td>
                <td className="border border-gray-400 p-2">自社で利用する目的のプログラムのことです。「ソフトウェア」には、取得にかかった金額から、償却額を差し引いた金額が表示されます。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>選択肢ア：自社が獲得している収益性のあるブランド等を無形固定資産に計上することは認められていません。不適切です。</p>
        <p>選択肢イ：研究開発費は通常「一般管理費」として発生した期の費用に計上します。特許権を取得した場合でも過去の費用を戻し入れることはありません。不適切です。</p>
        <p>選択肢ウ：受注制作のソフトウェアの制作費は、請負工事の会計処理に準じて処理され、無形固定資産に計上されません。適切です。</p>
        <p>選択肢エ：「のれん」の償却は最長20年です。不適切です。</p>
      </div>
    )
  },
  {
    id: "q4",
    year: "令和5年 第5問",
    title: "計算書類(財務諸表)",
    question: "会社法における計算書類の作成、開示に関する記述として、最も適切なものはどれか。",
    options: [
      "計算書類とは、貸借対照表、損益計算書、キャッシュ・フロー計算書および株主資本等変動計算書のことである。",
      "子会社を有するすべての株式会社は、連結計算書類を作成しなければならない。",
      "すべての株式会社は、各事業年度に係る計算書類を作成しなければならない。",
      "すべての株式会社は、定時株主総会の終結後遅滞なく、貸借対照表と損益計算書を公告しなければならない。"
    ],
    answerIndex: 2,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ウ</p>
        <p>選択肢アは不適切な記述です。計算書類にはキャッシュ・フロー計算書は含まれていません。</p>
        <p>選択肢イは不適切な記述です。連結計算書類を作成する株式会社は、大会社のみであり、子会社を有するすべての株式会社ではありません。</p>
        <p>選択肢ウは適切な記述です。株式会社では、各事業年度に係る計算書類及びその附属明細書を作成する必要があります。</p>
        <p>選択肢エは不適切な記述です。株式会社であっても大会社以外の会社は、貸借対照表と損益計算書の両方の公告義務はなく、貸借対照表のみ公告義務があります。</p>
      </div>
    )
  },
  {
    id: "q5",
    year: "令和4年 第2問",
    title: "資産の部、負債の部",
    question: "A、B、Cの各商店は、いずれも資産2,000万円、負債500万円を有する小売業であるが、あるとき各商店ともそれぞれ800万円で店舗を増築した。支払いの内訳は以下のとおりである。\n・A店は全額を自店の現金で支払った。\n・B店は建築費の半額を銀行より借り入れ、残額を自店の現金で支払った。\n・C店は全額、銀行からの借り入れであった。\n増築後の各商店の財政状態を示すものとして、最も適切なものはどれか。",
    options: [
      "ア：A(資産2000, 負債500, 純資産1500), B(資産2000, 負債900, 純資産1100), C(資産2800, 負債1300, 純資産1500)",
      "イ：A(資産2000, 負債500, 純資産1500), B(資産2400, 負債900, 純資産1500), C(資産2800, 負債1300, 純資産1500)",
      "ウ：A(資産2800, 負債-, 純資産2800), B(資産2800, 負債400, 純資産2400), C(資産2800, 負債800, 純資産2000)",
      "エ：A, B, C すべて (資産2800, 負債500/900/1300, 純資産1500)"
    ],
    answerIndex: 1,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：イ</p>
        <p>増築前の純資産は 2,000万 - 500万 = 1,500万 です。</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>A店: 800万の固定資産が増え、800万の現金が減る。資産合計は2,000万のまま。負債も500万のまま。純資産1,500万。</li>
          <li>B店: 半額(400万)借入。負債は 500万 + 400万 = 900万。資産は 2,000万 + 400万(借入) + 800万(固定資産) - 800万(支払) = 2,400万。純資産1,500万。</li>
          <li>C店: 全額(800万)借入。負債は 500万 + 800万 = 1,300万。資産は 2,000万 + 800万(借入) + 800万(固定資産) - 800万(支払) = 2,800万。純資産1,500万。</li>
        </ul>
        <p>以上より、正しい組み合わせはイとなります。</p>
      </div>
    )
  },
  {
    id: "q6",
    year: "令和5年 第8問",
    title: "貸借対照表",
    question: "貸借対照表の表示に関する記述として、最も適切なものはどれか。",
    options: [
      "売掛金は、代金が回収されるまでの期間の長短にかかわらず流動資産に分類される。",
      "株式は、その保有目的にかかわらず流動資産に分類される。",
      "棚卸資産は、決算日の翌日から起算して1年以内に販売されるものは流動資産に、1年を超えるものは固定資産に分類される。",
      "長期借入金は、時の経過により、返済期日が決算日の翌日から起算して1年以内となっても、固定負債に分類される。"
    ],
    answerIndex: 0,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ア</p>
        <p>選択肢アは適切な記述です。売掛金は正常営業循環基準により、代金回収期間にかかわらず流動資産に分類されます。</p>
        <p>選択肢イは不適切です。株式は保有目的によって固定資産に分類されることもあります。</p>
        <p>選択肢ウは不適切です。棚卸資産も正常営業循環基準により流動資産に分類します。</p>
        <p>選択肢エは不適切です。長期借入金は、返済期日が1年以内となった場合は「1年以内返済長期借入金」として流動負債に分類します。</p>
      </div>
    )
  },
  {
    id: "q7",
    year: "令和4年 第5問",
    title: "固定資産",
    question: "貸借対照表における無形固定資産に関する記述として、最も適切なものはどれか。",
    options: [
      "受注制作のソフトウェアについても償却を行う。",
      "人的資産は無形固定資産に含まれる。",
      "のれんは減損処理の対象となる。",
      "無形固定資産の償却には定額法と定率法がある。"
    ],
    answerIndex: 2,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ウ</p>
        <p>選択肢アは不適切です。受注制作のソフトウェアの制作費は無形固定資産に計上されません。</p>
        <p>選択肢イは不適切です。人的資産は客観的な評価ができないため無形固定資産に計上されません。</p>
        <p>選択肢ウは適切な記述です。無形固定資産に属するのれん等は減損処理の対象となります。</p>
        <p>選択肢エは不適切です。知的財産権等の無形固定資産の償却は、原則として定額法により償却します。</p>
      </div>
    )
  },
  {
    id: "q8",
    year: "平成30年 第7問",
    title: "収益と費用の認識基準",
    question: "決算にあたり以下の一連の取引に対し計上される収益および費用の金額の組み合わせとして、最も適切なものを選べ。\n4月20日：7月開講予定のセミナー(全10回、50,000円/回)の受講料総額500,000円を現金で受け取った。\n5月30日：開講準備にあたり、全10回分のテキスト作成のため現金250,000円を支出した。\n12月31日(決算日)：全10回のセミナーのうち6回が終了していた。",
    options: [
      "収益：300,000円　費用：150,000円",
      "収益：300,000円　費用：250,000円",
      "収益：500,000円　費用：150,000円",
      "収益：500,000円　費用：250,000円"
    ],
    answerIndex: 0,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ア</p>
        <p>収益は「実現主義の原則」、費用は「発生主義の原則」「費用収益対応の原則」に基づきます。</p>
        <p>12月31日の時点において、セミナーは6回分終了しているため、収益は 50,000円 × 6回 ＝ 300,000円 となります。</p>
        <p>また、テキスト作成費は費用収益対応の原則に基づき、6回分に対応する部分だけ費用として計上します。250,000円 ÷ 10回 × 6回 ＝ 150,000円 となります。</p>
      </div>
    )
  },
  {
    id: "q9",
    year: "平成29年 第4問",
    title: "会計基準の計算",
    question: "20X1年度に工事契約を締結し開始。20X3年度に完成。工事収益は工事進行基準、工事進捗度は原価比例法。工事収益総額は240,000千円、当初の工事原価総額見積額は180,000千円。\n20X1年の工事原価: 90,000千円、次期から完成までの見積額: 90,000千円\n20X1年度の工事収益として最も適切なものはどれか。",
    options: [
      "90,000千円",
      "108,000千円",
      "120,000千円",
      "180,000千円"
    ],
    answerIndex: 2,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：ウ</p>
        <p>原価比例法による工事進捗度 ＝ 決算日までに発生した工事原価累計額 ÷ 工事原価総額</p>
        <p>20X1年の工事進捗度 ＝ 90,000 ÷ 180,000 ＝ 50%</p>
        <p>20X1年における工事収益 ＝ 工事収益総額 240,000 × 50% ＝ 120,000千円</p>
      </div>
    )
  },
  {
    id: "q10",
    year: "平成25年 第3問",
    title: "株主資本",
    question: "株主資本等変動計算書に基づいて、当期末純資産合計として最も適切なものを選べ。\n前期末残高 純資産合計: 60,900千円\n当期変動額 剰余金の配当: 利益剰余金合計 △6,000\n当期純利益: 利益剰余金合計 9,600",
    options: [
      "56,000千円",
      "59,100千円",
      "60,900千円",
      "64,500千円"
    ],
    answerIndex: 3,
    explanation: (
      <div className="space-y-4 text-sm">
        <p>解答：エ</p>
        <p>当期末純資産合計 ＝ 前期末残高 ＋ 当期変動額合計</p>
        <p>当期変動額合計 ＝ 剰余金の配当(△6,000) ＋ 当期純利益(9,600) ＝ 3,600</p>
        <p>当期末純資産合計 ＝ 60,900 ＋ 3,600 ＝ 64,500千円</p>
      </div>
    )
  }
];

export default function App() {
  const [view, setView] = useState('login'); // login, loading, start, resume, quiz, history, result
  const [userId, setUserId] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [userHistory, setUserHistory] = useState({});
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressMode, setProgressMode] = useState('');
  const [currentMode, setCurrentMode] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 初回匿名ログイン
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
        console.log("Anonymous auth successful");
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async () => {
    if (!inputKey.trim()) return;
    setView('loading');
    setUserId(inputKey);
    try {
      const docRef = doc(db, `${APP_ID}_Users`, inputKey);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserHistory(data.history || {});
        
        const savedIndex = data.progressIndex || 0;
        const savedMode = data.progressMode || '';
        
        if (savedIndex > 0 && savedMode) {
          setProgressIndex(savedIndex);
          setProgressMode(savedMode);
          console.log("Found saved progress:", { index: savedIndex, mode: savedMode });
          setView('resume');
        } else {
          setView('start');
        }
      } else {
        setUserHistory({});
        setView('start');
      }
      console.log("Login successful, history loaded");
    } catch (e) {
      console.error("Fetch error:", e);
      setUserHistory({});
      setView('start');
    }
  };

  const syncData = async (newHistory, pIndex = null, pMode = null) => {
    if (!userId) return;
    try {
      const docRef = doc(db, `${APP_ID}_Users`, userId);
      const updateData = { history: newHistory || userHistory };
      if (pIndex !== null) updateData.progressIndex = pIndex;
      if (pMode !== null) updateData.progressMode = pMode;
      
      await setDoc(docRef, updateData, { merge: true });
      console.log("Data synced:", updateData);
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  const startQuiz = (mode, startIndex = 0) => {
    let list = [];
    if (mode === 'all') {
      list = quizData;
    } else if (mode === 'wrong') {
      list = quizData.filter(q => userHistory[q.id]?.status === 'incorrect');
    } else if (mode === 'review') {
      list = quizData.filter(q => userHistory[q.id]?.needsReview === true);
    }

    if (list.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    setCurrentMode(mode);
    setFilteredQuestions(list);
    setCurrentIndex(startIndex);
    setSelectedOption(null);
    setShowExplanation(false);
    setView('quiz');
  };

  const handleResume = (shouldResume) => {
    if (shouldResume) {
      startQuiz(progressMode, progressIndex);
    } else {
      syncData(userHistory, 0, ''); // reset progress
      setView('start');
    }
  };

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);

    const currentQ = filteredQuestions[currentIndex];
    const isCorrect = index === currentQ.answerIndex;
    
    const newHistory = {
      ...userHistory,
      [currentQ.id]: {
        ...(userHistory[currentQ.id] || {}),
        status: isCorrect ? 'correct' : 'incorrect',
      }
    };
    
    setUserHistory(newHistory);
    syncData(newHistory, currentIndex, currentMode);
  };

  const toggleReview = () => {
    const currentQ = filteredQuestions[currentIndex];
    const newHistory = {
      ...userHistory,
      [currentQ.id]: {
        ...(userHistory[currentQ.id] || {}),
        needsReview: !userHistory[currentQ.id]?.needsReview,
      }
    };
    setUserHistory(newHistory);
    syncData(newHistory);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < filteredQuestions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowExplanation(false);
      syncData(userHistory, nextIndex, currentMode);
    } else {
      syncData(userHistory, 0, ''); // Reset progress on completion
      setView('result');
    }
  };

  const goHome = () => {
    if (view === 'quiz') {
      syncData(userHistory, currentIndex, currentMode);
    }
    setView('start');
  };

  // --- Screens ---

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">財務諸表マスター</h1>
          <p className="text-sm text-gray-600 mb-4">同期用の合言葉（ユーザーID）を入力してください。</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="合言葉を入力"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
          >
            学習を始める
          </button>
        </div>
      </div>
    );
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (view === 'resume') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">続きから再開しますか？</h2>
          <p className="text-gray-600 mb-6">
            前回は「{progressMode === 'all' ? 'すべての問題' : progressMode === 'wrong' ? '前回不正解のみ' : '要復習のみ'}」モードの<br/>
            <span className="font-bold">【問題 {progressIndex + 1}】</span> まで進んでいます。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleResume(true)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              <Play className="w-5 h-5" />
              続きから再開する
            </button>
            <button
              onClick={() => handleResume(false)}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-300"
            >
              <RotateCcw className="w-5 h-5" />
              最初から始める
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'start') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">財務諸表マスター</h1>
          <p className="text-center text-gray-500 text-sm mb-8">ID: {userId}</p>
          
          <div className="space-y-4">
            <button onClick={() => startQuiz('all')} className="w-full bg-blue-50 text-blue-700 border border-blue-200 p-4 rounded-lg font-bold flex items-center justify-between hover:bg-blue-100">
              <span className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> すべての問題</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => startQuiz('wrong')} className="w-full bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg font-bold flex items-center justify-between hover:bg-red-100">
              <span className="flex items-center gap-2"><X className="w-5 h-5" /> 前回不正解の問題のみ</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => startQuiz('review')} className="w-full bg-orange-50 text-orange-700 border border-orange-200 p-4 rounded-lg font-bold flex items-center justify-between hover:bg-orange-100">
              <span className="flex items-center gap-2"><Save className="w-5 h-5" /> 要復習の問題のみ</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <hr className="my-4" />
            <button onClick={() => setView('history')} className="w-full bg-gray-100 text-gray-700 p-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
              <List className="w-5 h-5" /> 学習履歴を確認
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'history') {
    const total = quizData.length;
    const correctCount = quizData.filter(q => userHistory[q.id]?.status === 'correct').length;
    const wrongCount = quizData.filter(q => userHistory[q.id]?.status === 'incorrect').length;
    const unattempted = total - correctCount - wrongCount;

    const chartData = [
      { name: '正解', value: correctCount, color: '#10B981' },
      { name: '不正解', value: wrongCount, color: '#EF4444' },
      { name: '未解答', value: unattempted, color: '#D1D5DB' }
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={goHome} className="text-blue-600 flex items-center gap-1 font-bold">
            <Home className="w-5 h-5" /> ホーム
          </button>
          <h2 className="text-xl font-bold mx-auto">学習履歴</h2>
          <div className="w-16"></div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="text-lg font-bold text-center mb-4">全体正答率</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm font-bold">
            <span className="text-green-500">正解: {correctCount}</span>
            <span className="text-red-500">不正解: {wrongCount}</span>
            <span className="text-gray-500">未解答: {unattempted}</span>
          </div>
        </div>

        <div className="space-y-3">
          {quizData.map((q, idx) => {
            const h = userHistory[q.id] || {};
            return (
              <div key={q.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">第{idx + 1}問 ({q.year})</div>
                  <div className="font-bold text-sm line-clamp-1">{q.title}</div>
                </div>
                <div className="flex items-center gap-3">
                  {h.status === 'correct' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3"/> 正解</span>}
                  {h.status === 'incorrect' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><X className="w-3 h-3"/> 不正解</span>}
                  {!h.status && <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">未解答</span>}
                  {h.needsReview && <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold">要復習</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">完了しました！</h2>
          <p className="text-gray-600 mb-8">すべての問題に解答しました。</p>
          <button onClick={goHome} className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    const currentQ = filteredQuestions[currentIndex];
    const isCorrect = selectedOption === currentQ?.answerIndex;
    const needsReview = userHistory[currentQ?.id]?.needsReview || false;

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center justify-between">
          <button onClick={goHome} className="text-gray-500 hover:text-gray-800">
            <Home className="w-6 h-6" />
          </button>
          <div className="font-bold text-gray-700">
            問題 {currentIndex + 1} / {filteredQuestions.length}
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        <div className="p-4 max-w-2xl mx-auto mt-4">
          {/* Question */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{currentQ.title}</span>
              <span className="text-xs text-gray-500">{currentQ.year}</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{currentQ.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              if (!showExplanation) {
                btnClass += "border-gray-200 bg-white hover:border-blue-300";
              } else {
                if (idx === currentQ.answerIndex) {
                  btnClass += "border-green-500 bg-green-50";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50";
                } else {
                  btnClass += "border-gray-200 bg-white opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showExplanation}
                  className={btnClass}
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-6 mt-0.5 font-bold text-gray-400">{idx + 1}.</div>
                    <div className="text-sm text-gray-800">{opt}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-8 animate-fade-in">
              <div className={`p-4 rounded-t-xl text-white font-bold flex items-center justify-between ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className="flex items-center gap-2">
                  {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  <span className="text-lg">{isCorrect ? '正解！' : '不正解'}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition">
                  <input type="checkbox" checked={needsReview} onChange={toggleReview} className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300" />
                  <span className="text-sm">要復習</span>
                </label>
              </div>
              <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-6 shadow-sm">
                <div className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">解説</div>
                <div className="text-gray-700">{currentQ.explanation}</div>
              </div>

              <button
                onClick={handleNext}
                className="mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition"
              >
                次の問題へ <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}