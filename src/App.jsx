import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  List,
  Trophy
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- データ定義 (全10問: 2-1 財務諸表) ---

const problemData = [
  {
    id: 1,
    category: "計算書類",
    question: "会社法上の計算書類に関する記述として、最も適切なものはどれか。",
    options: [
      "会社法上の計算書類には、株主資本等変動計算書は含まれない。",
      "計算書類の作成と報告に当たっては、会社法のほかに財務諸表規則（財務諸表等の用語、様式および作成方法に関する規則）に準拠しなければならない。",
      "公開会社は、計算書類に加えて連結計算書類を作成し、定時株主総会に報告することが求められている。",
      "取締役会設置会社は、定時株主総会の招集の通知に際して、株主に計算書類を提供しなければならない。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2"><strong>ア ×：</strong> 計算書類には「貸借対照表」「損益計算書」「株主資本等変動計算書」「個別注記表」の4つが含まれます。</p>
      <p class="mb-2"><strong>イ ×：</strong> 財務諸表規則は「金融商品取引法」に基づく規則で、上場企業等が対象です。すべての会社法適用会社に義務付けられているわけではありません。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 連結計算書類の作成義務があるのは「大会社」かつ「有価証券報告書提出会社」等に限られます。単なる公開会社ではありません。</p>
      <p class="mb-2 text-red-600"><strong>エ ○：</strong> 取締役会設置会社では、招集通知に際して計算書類（事業報告等を含む）を提供する義務があります。</p>
    `
  },
  {
    id: 2,
    category: "企業会計原則",
    question: "企業会計原則に関する記述として、最も適切なものはどれか。",
    options: [
      "会計処理の原則および手続きを毎期継続して適用し、みだりに変更してはならない。",
      "株主総会提出のため、信用目的のため、租税目的のためなど種々の目的のために異なる形式の財務諸表を作成してはならない。",
      "すべての費用および収益は、その支出および収入の時点において認識し、損益計算書に計上しなければならない。",
      "予測される将来の危険に備えて、合理的な見積額を上回る費用を計上することは、保守的な会計処理として認められる。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2 text-red-600"><strong>ア ○：</strong> 「継続性の原則」に関する正しい記述です。</p>
      <p class="mb-2"><strong>イ ×：</strong> 「単一性の原則」は、二重帳簿を禁止するものであり、目的によって形式の異なる財務諸表を作成すること自体（実質一元・形式多元）は認めています。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 費用は発生主義、収益は実現主義で認識します。「支出および収入の時点（現金主義）」ではありません。</p>
      <p class="mb-2"><strong>エ ×：</strong> 過度に保守的な処理（利益操作につながる過大な引当金計上など）は認められません。</p>
    `
  },
  {
    id: 3,
    category: "無形固定資産",
    question: "無形固定資産の会計に関する記述として、最も適切なものはどれか。",
    options: [
      "自社が長年にわたり築き上げたブランドにより、同業他社に比べ高い収益性を獲得している場合には、これを無形固定資産に計上することができる。",
      "自社の研究開発活動により特許権を取得した場合には、それまでの年度に支出された研究開発費を戻し入れ、無形固定資産として計上しなければならない。",
      "受注制作のソフトウェアの制作費は、請負工事の会計処理に準じて処理され、無形固定資産に計上されない。",
      "のれんとして資産計上された金額は、最長10年にわたり、規則的に償却される。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>ア ×：</strong> 自社創設のブランド（自己創設のれん）は資産計上できません。</p>
      <p class="mb-2"><strong>イ ×：</strong> 研究開発費は発生時に費用処理します。資産への戻し入れは行いません。</p>
      <p class="mb-2 text-red-600"><strong>ウ ○：</strong> 受注制作ソフトは、顧客への提供（請負）が目的なので、制作費は売上原価などで処理され、固定資産にはなりません。</p>
      <p class="mb-2"><strong>エ ×：</strong> のれんの償却期間は最長20年です。</p>
    `
  },
  {
    id: 4,
    category: "計算書類(財務諸表)",
    question: "会社法における計算書類の作成、開示に関する記述として、最も適切なものはどれか。",
    options: [
      "計算書類とは、貸借対照表、損益計算書、キャッシュ・フロー計算書および株主資本等変動計算書のことである。",
      "子会社を有するすべての株式会社は、連結計算書類を作成しなければならない。",
      "すべての株式会社は、各事業年度に係る計算書類を作成しなければならない。",
      "すべての株式会社は、定時株主総会の終結後遅滞なく、貸借対照表と損益計算書を公告しなければならない。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>ア ×：</strong> 会社法の計算書類に「キャッシュ・フロー計算書」は含まれません（金商法では必要）。</p>
      <p class="mb-2"><strong>イ ×：</strong> 連結計算書類の作成は「大会社」等に限定されています。</p>
      <p class="mb-2 text-red-600"><strong>ウ ○：</strong> すべての株式会社に計算書類（B/S, P/L, 株主資本等変動計算書, 個別注記表）の作成義務があります。</p>
      <p class="mb-2"><strong>エ ×：</strong> 公告義務があるのは原則として「貸借対照表」のみです（大会社は損益計算書も必要）。</p>
    `
  },
  {
    id: 5,
    category: "資産・負債の部",
    question: "A、B、C店は資産2,000万、負債500万、純資産1,500万の状態である。各店が800万で店舗増築を行った。\n・A店：全額現金払い\n・B店：半額借入、半額現金\n・C店：全額借入\n増築後の各店の財政状態として適切なものはどれか。",
    options: [
      "A:純資産1500 / B:純資産1100 / C:純資産1500",
      "A:純資産1500 / B:純資産1500 / C:純資産1500",
      "A:純資産2800 / B:純資産2400 / C:純資産2000",
      "A:純資産1500 / B:純資産1500 / C:純資産2300"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="mb-2">増築（資産の増加）とその支払手段によるB/Sの変化を考えます。</p>
      <ul class="list-disc pl-5 space-y-2 mb-2">
        <li><strong>A店（全額現金）：</strong> 固定資産+800、現金-800 → 資産総額変わらず、負債変わらず → <strong>純資産変わらず(1500)</strong></li>
        <li><strong>B店（半額借入）：</strong> 固定資産+800、現金-400、借入+400 → 資産+400、負債+400 → <strong>純資産変わらず(1500)</strong></li>
        <li><strong>C店（全額借入）：</strong> 固定資産+800、借入+800 → 資産+800、負債+800 → <strong>純資産変わらず(1500)</strong></li>
      </ul>
      <p class="font-bold text-blue-600 mt-2">結論：すべての店の純資産は1,500万のままです。</p>
    `
  },
  {
    id: 6,
    category: "貸借対照表の表示",
    question: "貸借対照表の表示に関する記述として、最も適切なものはどれか。",
    options: [
      "売掛金は、代金が回収されるまでの期間の長短にかかわらず流動資産に分類される。",
      "株式は、その保有目的にかかわらず流動資産に分類される。",
      "棚卸資産は、決算日の翌日から起算して1年以内に販売されるものは流動資産に、1年を超えるものは固定資産に分類される。",
      "長期借入金は、時の経過により、返済期日が決算日の翌日から起算して1年以内となっても、固定負債に分類される。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2 text-red-600"><strong>ア ○：</strong> 営業サイクル内にある資産（売掛金、棚卸資産など）は、「正常営業循環基準」により、期間に関わらず流動資産になります。</p>
      <p class="mb-2"><strong>イ ×：</strong> 保有目的により、売買目的有価証券は流動、子会社株式などは固定資産になります。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 棚卸資産も正常営業循環基準により、原則としてすべて流動資産です。</p>
      <p class="mb-2"><strong>エ ×：</strong> 1年基準（ワン・イヤー・ルール）により、期限が1年以内になった長期借入金は「流動負債」に振り替えます。</p>
    `
  },
  {
    id: 7,
    category: "固定資産",
    question: "貸借対照表における無形固定資産に関する記述として、最も適切なものはどれか。",
    options: [
      "受注制作のソフトウェアについても償却を行う。",
      "人的資産は無形固定資産に含まれる。",
      "のれんは減損処理の対象となる。",
      "無形固定資産の償却には定額法と定率法がある。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>ア ×：</strong> 受注制作ソフトは無形固定資産に計上されず（売上原価扱い）、償却もしません。</p>
      <p class="mb-2"><strong>イ ×：</strong> 人的資産（従業員のスキルなど）は資産計上できません。</p>
      <p class="mb-2 text-red-600"><strong>ウ ○：</strong> のれん等の無形固定資産も、収益性が低下した場合は減損会計の対象になります。</p>
      <p class="mb-2"><strong>エ ×：</strong> 無形固定資産の償却は、原則として「定額法」のみです（定率法はありません）。</p>
    `
  },
  {
    id: 8,
    category: "収益・費用の認識",
    question: "セミナー事業（全10回、受講料50万、テキスト費25万）において、決算日までに6回終了した場合の収益・費用はいくらか。",
    options: [
      "収益：300,000円　費用：150,000円",
      "収益：300,000円　費用：250,000円",
      "収益：500,000円　費用：150,000円",
      "収益：500,000円　費用：250,000円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">実現主義（収益）と費用収益対応の原則に基づき、<strong>実施した6回分</strong>のみを計上します。</p>
      <div class="grid grid-cols-2 gap-4 text-center mt-2">
        <div class="bg-blue-50 p-2 rounded">
          <p class="font-bold">収益</p>
          <p>500,000 × (6/10)</p>
          <p class="text-lg font-bold text-blue-600">= 300,000</p>
        </div>
        <div class="bg-red-50 p-2 rounded">
          <p class="font-bold">費用</p>
          <p>250,000 × (6/10)</p>
          <p class="text-lg font-bold text-red-600">= 150,000</p>
        </div>
      </div>
    `
  },
  {
    id: 9,
    category: "工事進行基準",
    question: "工事収益総額240,000千円、工事原価総額180,000千円の工事で、1年目の発生原価が90,000千円だった場合、工事進行基準による1年目の工事収益はいくらか。",
    options: [
      "90,000千円",
      "108,000千円",
      "120,000千円",
      "180,000千円"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>① 進捗度の計算（原価比例法）：</strong></p>
      <p class="mb-2 pl-4">発生原価(90,000) ÷ 総原価(180,000) = <strong>50%</strong></p>
      <p class="mb-2"><strong>② 工事収益の計算：</strong></p>
      <p class="mb-2 pl-4">収益総額(240,000) × 50% = <span class="text-xl font-bold text-blue-600">120,000千円</span></p>
    `
  },
  {
    id: 10,
    category: "株主資本",
    question: "前期末純資産:60,900千円。当期変動として「配当:△6,000」「当期純利益:9,600」があった場合、当期末の純資産合計はいくらか。（別途積立金への振替などは純資産内での移動とする）",
    options: [
      "56,000千円",
      "59,100千円",
      "60,900千円",
      "64,500千円"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2">純資産の変動額を計算します。</p>
      <ul class="list-disc pl-5 mb-2">
        <li>配当による減少： <strong>△6,000</strong></li>
        <li>当期純利益による増加： <strong>+9,600</strong></li>
        <li>（積立金などは純資産内部の移動なので合計額は変わりません）</li>
      </ul>
      <div class="bg-gray-100 p-3 rounded text-center">
        <p>前期末(60,900) - 6,000 + 9,600</p>
        <p class="text-xl font-bold text-blue-600 mt-1">= 64,500千円</p>
      </div>
    `
  }
];

// --- コンポーネント実装 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu', 'quiz', 'result'
  const [quizMode, setQuizMode] = useState('all'); // 'all', 'wrong', 'review'
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // { problemId: { answerIndex, isCorrect, timestamp } }
  const [reviewFlags, setReviewFlags] = useState({}); // { problemId: boolean }
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // 初期ロード (localStorageキーを 'app_financial_2_1_new' に設定)
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('app_financial_2_1_new_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('app_financial_2_1_new_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem('app_financial_2_1_new_answers', JSON.stringify(userAnswers));
    localStorage.setItem('app_financial_2_1_new_reviews', JSON.stringify(reviewFlags));
  }, [userAnswers, reviewFlags]);

  // 問題セットアップ
  const startQuiz = (mode) => {
    let targets = [];
    if (mode === 'all') {
      targets = problemData;
    } else if (mode === 'wrong') {
      targets = problemData.filter(p => {
        const hist = userAnswers[p.id];
        return hist && !hist.isCorrect;
      });
    } else if (mode === 'review') {
      targets = problemData.filter(p => reviewFlags[p.id]);
    }

    if (targets.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    setQuizMode(mode);
    setFilteredProblems(targets);
    setCurrentProblemIndex(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const problem = filteredProblems[currentProblemIndex];
    const isCorrect = optionIndex === problem.correctAnswer;
    
    // 記録更新
    setUserAnswers(prev => ({
      ...prev,
      [problem.id]: {
        answerIndex: optionIndex,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
      }
    }));
    
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const toggleReview = (problemId) => {
    setReviewFlags(prev => {
      const newVal = !prev[problemId];
      return { ...prev, [problemId]: newVal };
    });
  };

  // 集計
  const stats = useMemo(() => {
    const total = problemData.length;
    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
    return { total, answeredCount, correctCount, reviewCount };
  }, [userAnswers, reviewFlags]);

  // --- 画面レンダリング ---

  if (currentScreen === 'menu') {
    const pieData = [
      { name: '正解', value: stats.correctCount, color: '#4ade80' },
      { name: '不正解/未回答', value: stats.total - stats.correctCount, color: '#f87171' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          <header className="text-center py-6">
            <h1 className="text-2xl font-bold text-slate-700">財務諸表 2-1</h1>
            <p className="text-slate-500 text-sm mt-1">過去問セレクト演習</p>
          </header>

          {/* ダッシュボード */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 w-full flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> 学習状況
            </h2>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center mt-2 w-full">
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.correctCount}<span className="text-sm text-gray-400">/{stats.total}</span></p>
                <p className="text-xs text-gray-500">正解数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{stats.reviewCount}</p>
                <p className="text-xs text-gray-500">要復習</p>
              </div>
            </div>
          </div>

          {/* モード選択 */}
          <div className="grid gap-3">
            <button 
              onClick={() => startQuiz('all')}
              className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">全ての問題を解く</div>
                  <div className="text-xs opacity-90">全{problemData.length}問</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => startQuiz('wrong')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition active:scale-95"
              >
                <RotateCcw className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">前回 × のみ</span>
              </button>
              <button 
                onClick={() => startQuiz('review')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-orange-100 text-orange-600 rounded-xl hover:bg-orange-50 transition active:scale-95"
              >
                <CheckSquare className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">要復習のみ</span>
              </button>
            </div>
          </div>

          {/* 問題一覧リスト */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
              <List className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-700 text-sm">問題一覧</h3>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y">
              {problemData.map((p, idx) => {
                const hist = userAnswers[p.id];
                const isReview = reviewFlags[p.id];
                return (
                  <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 font-mono">
                        {p.id}
                      </span>
                      <span className="truncate max-w-[200px] text-slate-600">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isReview && <AlertCircle className="w-4 h-4 text-orange-400" />}
                      {hist ? (
                        hist.isCorrect ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    const problem = filteredProblems[currentProblemIndex];
    const isLast = currentProblemIndex === filteredProblems.length - 1;
    const progress = ((currentProblemIndex + 1) / filteredProblems.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="h-1 bg-gray-200 w-full">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
            <button onClick={() => setCurrentScreen('menu')} className="text-sm text-gray-500 hover:text-gray-800">中断する</button>
            <span className="font-bold text-slate-700">Q. {currentProblemIndex + 1} / {filteredProblems.length}</span>
            <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-full">{problem.category}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* 問題文 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">{problem.question}</p>
          </div>

          {/* 選択肢 */}
          <div className="grid gap-3">
            {problem.options.map((opt, idx) => {
              let btnClass = "p-4 text-left rounded-xl border-2 transition-all ";
              if (showExplanation) {
                if (idx === problem.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-white border-transparent shadow-sm opacity-50";
                }
              } else {
                btnClass += "bg-white border-transparent shadow-sm hover:border-blue-200 active:scale-[0.99]";
              }

              return (
                <button 
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex gap-3">
                    <span className="font-bold font-mono text-gray-400">{['ア','イ','ウ','エ'][idx]}</span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 解説エリア */}
          {showExplanation && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-4 rounded-xl mb-4 text-center font-bold text-white shadow-md ${selectedOption === problem.correctAnswer ? 'bg-green-500' : 'bg-red-500'}`}>
                {selectedOption === problem.correctAnswer ? '正解！' : '不正解...'}
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm text-slate-800">
                <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold border-b border-blue-200 pb-2">
                  <BookOpen className="w-5 h-5" /> 解説
                </div>
                <div 
                  className="text-sm leading-relaxed explanation-content"
                  dangerouslySetInnerHTML={{ __html: problem.explanation }} 
                />
              </div>

              {/* 復習チェック */}
              <label className="flex items-center gap-3 p-4 bg-white mt-4 rounded-xl shadow-sm border border-orange-100 cursor-pointer hover:bg-orange-50 transition">
                <input 
                  type="checkbox" 
                  checked={!!reviewFlags[problem.id]} 
                  onChange={() => toggleReview(problem.id)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="font-bold text-slate-700">あとで復習する（チェック）</span>
              </label>

              {/* 次へボタン */}
              <button 
                onClick={nextProblem}
                className="w-full mt-6 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isLast ? '結果を見る' : '次の問題へ'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    const sessionCorrect = filteredProblems.filter(p => {
       const h = userAnswers[p.id];
       return h && h.isCorrect;
    }).length;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800">お疲れ様でした！</h2>
            <p className="text-slate-500 mt-2">今回の正解率</p>
            <div className="text-5xl font-black text-blue-600 mt-2">
              {Math.round((sessionCorrect / filteredProblems.length) * 100)}%
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {sessionCorrect} / {filteredProblems.length} 問正解
            </p>
          </div>

          <button 
            onClick={() => setCurrentScreen('menu')}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}