export interface UserStats {
  name: string;
  avatar: string;
  role: string;
  targetToeic: number;
  currentToeic: number;
  streakDays: number;
  wordsLearned: number;
  wordsTarget: number;
  todayMinutes: number;
  targetMinutes: number;
  weeklyGoalCompleted: number; // percentage
}

export interface DayActivity {
  day: string;
  dayShort: string;
  minutes: number;
  accuracy: number;
  isToday?: boolean;
}

export interface RecommendedLesson {
  id: string;
  title: string;
  category: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  duration: string;
  badgeColor: string;
  description: string;
  tabTarget: 'transcript' | 'listening' | 'speaking' | 'grammar' | 'toeic' | 'vocabulary' | 'flashcard';
  aiTag: string;
}

export interface TranscriptLine {
  id: number;
  timeStart: string;
  timeSeconds: number;
  en: string;
  vi: string;
  keyWords?: string[];
}

export interface TranscriptLesson {
  id: string;
  title: string;
  speaker: string;
  topic: string;
  level: string;
  duration: string;
  audioUrl?: string;
  lines: TranscriptLine[];
  summary: string;
  tags: string[];
}

export interface VocabWord {
  id: string;
  word: string;
  type: string;
  ipa: string;
  vietnamese: string;
  definitionEn: string;
  exampleEn: string;
  exampleVi: string;
  topic: string;
  status: 'new' | 'learning' | 'mastered';
  toeicLevel: '550+' | '650+' | '750+' | '900+';
  category?: 'basic' | 'toeic' | 'ielts' | 'other';
}

export interface FlashcardItem {
  id: string;
  word: string;
  ipa: string;
  type: string;
  meaning: string;
  collocations: string[];
  example: string;
  exampleVi: string;
  reviewCount: number;
  intervalDays: number;
}

export interface GrammarQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  tag: string;
  summary: string;
  rules: string[];
  sampleQuiz: GrammarQuiz;
}

export interface ToeicPartStat {
  part: number;
  title: string;
  type: 'Listening' | 'Reading';
  totalQuestions: number;
  accuracy: number;
  color: string;
}

// ----------------------------------------------------
// DỮ LIỆU MẪU CHUẨN
// ----------------------------------------------------

export const mockUserStats: UserStats = {
  name: 'Nguyễn Quốc Huy',
  avatar: 'H',
  role: 'Học viên TOEIC Mục tiêu 750+',
  targetToeic: 750,
  currentToeic: 685,
  streakDays: 7,
  wordsLearned: 348,
  wordsTarget: 600,
  todayMinutes: 45,
  targetMinutes: 60,
  weeklyGoalCompleted: 75,
};

export const mockWeeklyActivity: DayActivity[] = [
  { day: 'Thứ 2', dayShort: 'T2', minutes: 50, accuracy: 88 },
  { day: 'Thứ 3', dayShort: 'T3', minutes: 65, accuracy: 92 },
  { day: 'Thứ 4', dayShort: 'T4', minutes: 40, accuracy: 85 },
  { day: 'Thứ 5', dayShort: 'T5', minutes: 70, accuracy: 95 },
  { day: 'Thứ 6', dayShort: 'T6', minutes: 55, accuracy: 89 },
  { day: 'Thứ 7', dayShort: 'T7', minutes: 45, accuracy: 90 },
  { day: 'Chủ nhật', dayShort: 'CN', minutes: 45, accuracy: 92, isToday: true },
];

export const mockRecentLesson = {
  title: 'TOEIC Part 3 - Cuộc đàm phán hợp đồng cung ứng thiết bị',
  moduleName: 'Học qua Transcript',
  progressPercent: 68,
  timeLeft: '10 phút còn lại',
  targetTab: 'transcript' as const,
};

export const mockRecommendedLessons: RecommendedLesson[] = [
  {
    id: 'rec-1',
    title: 'Xử lý bẫy phát âm TOEIC Part 3 & 4 (Nối âm & Nuốt âm)',
    category: 'Luyện nghe chuyên sâu',
    level: 'Trung cấp',
    duration: '15 phút',
    badgeColor: 'badge-info',
    description: 'AI phát hiện bạn thường chọn nhầm đáp án do bẫy nối âm consonant-to-vowel.',
    tabTarget: 'listening',
    aiTag: 'Khuyên học từ AI',
  },
  {
    id: 'rec-2',
    title: '30 Cụm từ công sở (Phrasal Verbs) xuất hiện 90% trong đề thi',
    category: 'Từ vựng cốt lõi',
    level: 'Trung cấp',
    duration: '12 phút',
    badgeColor: 'badge-purple',
    description: 'Bổ sung ngay vốn collocations để cải thiện tốc độ đọc hiểu TOEIC Part 5 & 6.',
    tabTarget: 'vocabulary',
    aiTag: 'Tần suất xuất hiện cao',
  },
  {
    id: 'rec-3',
    title: 'Luyện nói phản xạ: Thuyết trình báo cáo doanh số Quý 3',
    category: 'Luyện nói Shadowing',
    level: 'Nâng cao',
    duration: '20 phút',
    badgeColor: 'badge-success',
    description: 'Thực hành ngữ điệu thương mại chuyên nghiệp với hệ thống chấm điểm phát âm AI.',
    tabTarget: 'speaking',
    aiTag: 'Kỹ năng ứng dụng',
  },
];

export const mockTranscripts: TranscriptLesson[] = [
  {
    id: 'trans-1',
    title: 'Hội thoại Part 3: Thương thảo hợp đồng cung ứng phần mềm',
    speaker: 'Alex (Giám đốc dự án) & Sarah (Đại diện đối tác)',
    topic: 'Business & Negotiation',
    level: 'TOEIC 650 - 750',
    duration: '03:45',
    summary: 'Cuộc trao đổi giữa khách hàng và nhà cung cấp về chi phí triển khai giải pháp CRM và điều khoản bảo hành hàng năm.',
    tags: ['Part 3', 'Contract', 'Budget', 'Negotiation'],
    lines: [
      {
        id: 1,
        timeStart: '00:04',
        timeSeconds: 4,
        en: 'Good morning Sarah, thank you for making time to meet with our procurement team today.',
        vi: 'Chào buổi sáng Sarah, cảm ơn cô đã dành thời gian gặp gỡ đội ngũ thu mua của chúng tôi hôm nay.',
        keyWords: ['procurement', 'making time'],
      },
      {
        id: 2,
        timeStart: '00:10',
        timeSeconds: 10,
        en: 'My pleasure, Alex. We have reviewed your updated software specifications thoroughly.',
        vi: 'Rất hân hạnh, Alex. Chúng tôi đã xem xét kỹ lưỡng các thông số kỹ thuật phần mềm mới nhất của bạn.',
        keyWords: ['specifications', 'thoroughly'],
      },
      {
        id: 3,
        timeStart: '00:16',
        timeSeconds: 16,
        en: 'Great. Our main concern remains the implementation timeline and the annual maintenance fees.',
        vi: 'Tuyệt vời. Mối quan tâm chính của chúng tôi vẫn là thời gian triển khai và phí bảo trì hàng năm.',
        keyWords: ['implementation', 'timeline', 'maintenance'],
      },
      {
        id: 4,
        timeStart: '00:23',
        timeSeconds: 23,
        en: 'We can offer a five percent discount on the licensing cost if we sign the contract before Friday.',
        vi: 'Chúng tôi có thể giảm giá 5% trên chi phí bản quyền nếu hai bên ký hợp đồng trước thứ Sáu.',
        keyWords: ['discount', 'licensing', 'contract'],
      },
      {
        id: 5,
        timeStart: '00:30',
        timeSeconds: 30,
        en: 'That sounds very reasonable. I will discuss this proposal with our chief financial officer.',
        vi: 'Nghe rất hợp lý. Tôi sẽ thảo luận đề xuất này với giám đốc tài chính của chúng tôi.',
        keyWords: ['reasonable', 'proposal', 'chief financial officer'],
      },
    ],
  },
  {
    id: 'trans-2',
    title: 'Steve Jobs: "Stay Hungry, Stay Foolish" (Stanford Speech)',
    speaker: 'Steve Jobs',
    topic: 'Inspiration & Life Lessons',
    level: 'TOEIC 750+',
    duration: '04:12',
    summary: 'Bài diễn văn kinh điển truyền cảm hứng về việc tìm kiếm đam mê đích thực và không ngừng học hỏi.',
    tags: ['TED/Speech', 'Passion', 'Inspiration'],
    lines: [
      {
        id: 1,
        timeStart: '00:03',
        timeSeconds: 3,
        en: 'Your time is limited, so do not waste it living someone else life.',
        vi: 'Thời gian của bạn là hữu hạn, vì vậy đừng lãng phí nó để sống cuộc đời của người khác.',
      },
      {
        id: 2,
        timeStart: '00:09',
        timeSeconds: 9,
        en: 'Do not let the noise of others opinions drown out your own inner voice.',
        vi: 'Đừng để tiếng ồn từ định kiến của người khác nhấn chìm tiếng nói bên trong bạn.',
      },
      {
        id: 3,
        timeStart: '00:16',
        timeSeconds: 16,
        en: 'And most importantly, have the courage to follow your heart and intuition.',
        vi: 'Và quan trọng nhất, hãy có can đảm đi theo trái tim và trực giác của chính mình.',
      },
    ],
  },
];

export const mockVocabList: VocabWord[] = [
  {
    id: 'v-1',
    word: 'procurement',
    type: 'noun',
    ipa: '/prəˈkjʊəmənt/',
    vietnamese: 'sự thu mua, mua sắm trang thiết bị',
    definitionEn: 'The process of obtaining services, supplies, and equipment in a business.',
    exampleEn: 'The procurement department negotiated a significant volume discount.',
    exampleVi: 'Phòng thu mua đã thương lượng được mức chiết khấu số lượng lớn đáng kể.',
    topic: 'Contracts & Office',
    status: 'learning',
    toeicLevel: '750+',
  },
  {
    id: 'v-2',
    word: 'specifications',
    type: 'noun',
    ipa: '/ˌspesɪfɪˈkeɪʃnz/',
    vietnamese: 'thông số kỹ thuật, đặc tính chi tiết',
    definitionEn: 'Detailed description of the design and materials used to make something.',
    exampleEn: 'The product was manufactured strictly according to client specifications.',
    exampleVi: 'Sản phẩm được sản xuất hoàn toàn theo đúng thông số kỹ thuật của khách hàng.',
    topic: 'Technical & Production',
    status: 'mastered',
    toeicLevel: '650+',
  },
  {
    id: 'v-3',
    word: 'comply',
    type: 'verb',
    ipa: '/kəmˈplaɪ/',
    vietnamese: 'tuân thủ, làm theo (luật lệ/hợp đồng)',
    definitionEn: 'To act according to an order, set of rules, or request (usually followed by with).',
    exampleEn: 'All employees are strictly required to comply with workplace safety regulations.',
    exampleVi: 'Tất cả nhân viên được yêu cầu nghiêm ngặt phải tuân thủ các quy định an toàn nơi làm việc.',
    topic: 'Human Resources & Law',
    status: 'learning',
    toeicLevel: '550+',
  },
  {
    id: 'v-4',
    word: 'reimburse',
    type: 'verb',
    ipa: '/ˌriːɪmˈbɜːs/',
    vietnamese: 'hoàn tiền, bồi hoàn chi phí công tác',
    definitionEn: 'To pay back money to someone who has spent it for you.',
    exampleEn: 'The company will reimburse travel expenses within five business days.',
    exampleVi: 'Công ty sẽ hoàn trả các chi phí công tác trong vòng 5 ngày làm việc.',
    topic: 'Finance & Accounting',
    status: 'new',
    toeicLevel: '750+',
  },
  {
    id: 'v-5',
    word: 'feasible',
    type: 'adjective',
    ipa: '/ˈfiːzəbl/',
    vietnamese: 'khả thi, có thể thực hiện được',
    definitionEn: 'Possible to do easily or conveniently.',
    exampleEn: 'After the market research, the board concluded that the expansion plan is feasible.',
    exampleVi: 'Sau nghiên cứu thị trường, hội đồng quản trị kết luận kế hoạch mở rộng là khả thi.',
    topic: 'Management & Strategy',
    status: 'mastered',
    toeicLevel: '750+',
  },
  {
    id: 'v-6',
    word: 'invoice',
    type: 'noun / verb',
    ipa: '/ˈɪnvɔɪs/',
    vietnamese: 'hóa đơn bán hàng / gửi hóa đơn',
    definitionEn: 'A commercial document that itemizes and records a transaction between a buyer and a seller.',
    exampleEn: 'Please settle this invoice before the end of the payment grace period.',
    exampleVi: 'Vui lòng thanh toán hóa đơn này trước khi hết thời hạn ân hạn thanh toán.',
    topic: 'Finance & Accounting',
    status: 'mastered',
    toeicLevel: '550+',
  },
];

export const mockFlashcards: FlashcardItem[] = [
  {
    id: 'fc-1',
    word: 'unprecedented',
    ipa: '/ʌnˈpresɪdentɪd/',
    type: 'adj',
    meaning: 'chưa từng có tiền lệ, chưa từng xảy ra',
    collocations: ['unprecedented growth', 'unprecedented demand'],
    example: 'The company achieved unprecedented revenue growth this year.',
    exampleVi: 'Công ty đã đạt mức tăng trưởng doanh thu chưa từng có trong năm nay.',
    reviewCount: 3,
    intervalDays: 4,
  },
  {
    id: 'fc-2',
    word: 'subsidize',
    ipa: '/ˈsʌbsɪdaɪz/',
    type: 'verb',
    meaning: 'trợ cấp, hỗ trợ kinh phí',
    collocations: ['heavily subsidized', 'government subsidized'],
    example: 'The local government agreed to subsidize public transportation for students.',
    exampleVi: 'Chính quyền địa phương đồng ý trợ cấp phương tiện công cộng cho sinh viên.',
    reviewCount: 2,
    intervalDays: 2,
  },
  {
    id: 'fc-3',
    word: 'delegate',
    ipa: '/ˈdelɪɡeɪt/',
    type: 'verb',
    meaning: 'ủy quyền, giao phó nhiệm vụ',
    collocations: ['delegate authority', 'delegate responsibilities'],
    example: 'An effective manager knows how to delegate tasks to capable subordinates.',
    exampleVi: 'Một nhà quản lý giỏi biết cách giao phó nhiệm vụ cho cấp dưới có năng lực.',
    reviewCount: 4,
    intervalDays: 7,
  },
  {
    id: 'fc-4',
    word: 'incentive',
    ipa: '/ɪnˈsentɪv/',
    type: 'noun',
    meaning: 'sự khuyến khích, đãi ngộ thúc đẩy làm việc',
    collocations: ['financial incentive', 'provide incentive'],
    example: 'Bonuses act as a strong incentive for the sales team to exceed their quota.',
    exampleVi: 'Tiền thưởng đóng vai trò là động lực mạnh mẽ để đội ngũ bán hàng vượt chỉ tiêu.',
    reviewCount: 1,
    intervalDays: 1,
  },
];

export const mockGrammarTopics: GrammarTopic[] = [
  {
    id: 'gr-1',
    title: '12 Thì trong tiếng Anh & Mẹo thi TOEIC',
    tag: 'Trọng tâm Part 5',
    summary: 'Nắm vững các thì thường xuyên xuất hiện nhất: Hiện tại hoàn thành, Hiện tại đơn, Tương lai gần và Quá khứ tiếp diễn.',
    rules: [
      'Dấu hiệu hiện tại hoàn thành: since, for, already, yet, recently, over the past 3 years.',
      'Mệnh đề chỉ thời gian (When, While, As soon as) ở tương lai dùng hiện tại đơn.',
      'Sự hòa hợp giữa Chủ ngữ và Động từ với các liên từ either...or, neither...nor, as well as.',
    ],
    sampleQuiz: {
      question: 'Ms. Peterson _______ at our regional branch for over eight years before moving to headquarters.',
      options: ['worked', 'has worked', 'had worked', 'working'],
      correctIndex: 2,
      explanation: 'Hành động làm việc diễn ra trước một hành động khác trong quá khứ (before moving), do đó sử dụng thì Quá khứ hoàn thành (had worked).',
    },
  },
  {
    id: 'gr-2',
    title: 'Mệnh đề quan hệ & Rút gọn mệnh đề',
    tag: 'Đạt điểm 700+',
    summary: 'Phân biệt Who/Whom/Which/That và cách rút gọn thành V-ing (chủ động) hoặc V-ed/V3 (bị động).',
    rules: [
      'Rút gọn chủ động: The man who stands there -> The man standing there.',
      'Rút gọn bị động: The report that was prepared by Anna -> The report prepared by Anna.',
      'Sau giới từ chỉ dùng Whom (cho người) và Which (cho vật), tuyệt đối không dùng That.',
    ],
    sampleQuiz: {
      question: 'The candidates _______ for the senior marketing position must possess at least five years of experience.',
      options: ['applying', 'applied', 'application', 'applies'],
      correctIndex: 0,
      explanation: 'Câu đã có động từ chính là "must possess". Chỗ trống là mệnh đề quan hệ rút gọn ở thể chủ động (who apply -> applying).',
    },
  },
  {
    id: 'gr-3',
    title: 'Câu điều kiện & Đảo ngữ câu điều kiện',
    tag: 'Câu hỏi phân loại',
    summary: 'Nhận biết cấu trúc câu điều kiện loại 1, 2, 3 và dạng đảo ngữ Should / Were / Had.',
    rules: [
      'Đảo ngữ loại 1: Should + S + V(bare), S + will + V.',
      'Đảo ngữ loại 2: Were + S + to V, S + would + V.',
      'Đảo ngữ loại 3: Had + S + V3/ed, S + would have + V3/ed.',
    ],
    sampleQuiz: {
      question: '_______ you have any questions regarding the new company policy, please feel free to email HR.',
      options: ['Should', 'Had', 'Were', 'Unless'],
      correctIndex: 0,
      explanation: 'Đây là dạng đảo ngữ của câu điều kiện loại 1: "Should you have..." tương đương với "If you have...".',
    },
  },
];

export const mockToeicParts: ToeicPartStat[] = [
  { part: 1, title: 'Photographs (Mô tả tranh)', type: 'Listening', totalQuestions: 6, accuracy: 88, color: '#38bdf8' },
  { part: 2, title: 'Question-Response (Hỏi đáp)', type: 'Listening', totalQuestions: 25, accuracy: 82, color: '#0ea5e9' },
  { part: 3, title: 'Conversations (Đoạn hội thoại)', type: 'Listening', totalQuestions: 39, accuracy: 71, color: '#6366f1' },
  { part: 4, title: 'Talks (Bài nói chuyện ngắn)', type: 'Listening', totalQuestions: 30, accuracy: 69, color: '#8b5cf6' },
  { part: 5, title: 'Incomplete Sentences (Điền câu)', type: 'Reading', totalQuestions: 30, accuracy: 78, color: '#10b981' },
  { part: 6, title: 'Text Completion (Điền đoạn văn)', type: 'Reading', totalQuestions: 16, accuracy: 74, color: '#f59e0b' },
  { part: 7, title: 'Reading Comprehension (Đọc hiểu)', type: 'Reading', totalQuestions: 54, accuracy: 67, color: '#ec4899' },
];
