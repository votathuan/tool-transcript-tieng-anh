export interface ExternalWord {
  word: string;
  ipa: string;
  type: string;
  vietnamese: string;
  exampleEn: string;
  topic: string;
  category: 'basic' | 'toeic' | 'ielts';
}

export interface WordPack {
  id: string;
  name: string;
  category: 'basic' | 'toeic' | 'ielts';
  level: string;
  badgeColor: string;
  description: string;
  words: ExternalWord[];
}

export const EXTERNAL_WORD_PACKS: WordPack[] = [
  {
    id: 'pack-basic',
    name: 'Gói Từ vựng Cơ bản (Giao tiếp Oxford 3000)',
    category: 'basic',
    level: 'A2 - B1',
    badgeColor: 'badge-success',
    description: 'Bộ từ vựng giao tiếp cốt lõi thiết yếu hàng ngày dành cho người mới bắt đầu.',
    words: [
      {
        word: 'communicate',
        ipa: '/kəˈmjuːnɪkeɪt/',
        type: 'verb',
        vietnamese: 'giao tiếp, truyền đạt thông tin',
        exampleEn: 'We can communicate easily through social media.',
        topic: 'Giao tiếp hàng ngày',
        category: 'basic',
      },
      {
        word: 'appreciate',
        ipa: '/əˈpriːʃieɪt/',
        type: 'verb',
        vietnamese: 'cảm kích, trân trọng biết ơn',
        exampleEn: 'I really appreciate your kind support.',
        topic: 'Giao tiếp hàng ngày',
        category: 'basic',
      },
      {
        word: 'ambitious',
        ipa: '/æmˈbɪʃəs/',
        type: 'adj',
        vietnamese: 'có nhiều hoài bão, khát vọng lớn',
        exampleEn: 'She is an ambitious student with big goals.',
        topic: 'Tính cách con người',
        category: 'basic',
      },
      {
        word: 'convenient',
        ipa: '/kənˈviːniənt/',
        type: 'adj',
        vietnamese: 'thuận tiện, tiện lợi cho việc sử dụng',
        exampleEn: 'The metro station is very convenient for commuters.',
        topic: 'Đời sống',
        category: 'basic',
      },
      {
        word: 'hesitate',
        ipa: '/ˈhezɪteɪt/',
        type: 'verb',
        vietnamese: 'do dự, ngập ngừng phân vân',
        exampleEn: 'Do not hesitate to ask if you have any questions.',
        topic: 'Hành động',
        category: 'basic',
      },
      {
        word: 'comfortable',
        ipa: '/ˈkʌmftəbl/',
        type: 'adj',
        vietnamese: 'thoải mái, dễ chịu',
        exampleEn: 'These running shoes are extremely comfortable.',
        topic: 'Cảm giác',
        category: 'basic',
      },
    ],
  },
  {
    id: 'pack-toeic',
    name: 'Gói Từ vựng TOEIC (Thương mại & Công sở)',
    category: 'toeic',
    level: 'TOEIC 650 - 850',
    badgeColor: 'badge-info',
    description: 'Các từ vựng xuất hiện với tần suất trên 85% trong các đề thi TOEIC Part 5, 6, 7.',
    words: [
      {
        word: 'negotiate',
        ipa: '/nɪˈɡəʊʃieɪt/',
        type: 'verb',
        vietnamese: 'đàm phán, thương lượng hợp đồng',
        exampleEn: 'The manager is negotiating the price with suppliers.',
        topic: 'Hợp đồng & Đàm phán',
        category: 'toeic',
      },
      {
        word: 'warranty',
        ipa: '/ˈwɒrənti/',
        type: 'noun',
        vietnamese: 'phiếu bảo hành, cam kết bảo hành',
        exampleEn: 'The electronic device comes with a two-year warranty.',
        topic: 'Mua sắm & Dịch vụ',
        category: 'toeic',
      },
      {
        word: 'inventory',
        ipa: '/ˈɪnvəntri/',
        type: 'noun',
        vietnamese: 'hàng tồn kho, bản kiểm kê hàng hóa',
        exampleEn: 'The warehouse performs a monthly inventory check.',
        topic: 'Kho vận & Sản xuất',
        category: 'toeic',
      },
      {
        word: 'personnel',
        ipa: '/ˌpɜːsəˈnel/',
        type: 'noun',
        vietnamese: 'nhân sự, đội ngũ nhân viên công ty',
        exampleEn: 'All sales personnel must attend the training workshop.',
        topic: 'Nhân sự & Tuyển dụng',
        category: 'toeic',
      },
      {
        word: 'allocate',
        ipa: '/ˈæləkeɪt/',
        type: 'verb',
        vietnamese: 'phân bổ ngân sách, chia chỉ tiêu',
        exampleEn: 'The board voted to allocate more funds to marketing.',
        topic: 'Tài chính & Kế hoạch',
        category: 'toeic',
      },
      {
        word: 'confidential',
        ipa: '/ˌkɒnfɪˈdenʃl/',
        type: 'adj',
        vietnamese: 'bảo mật, tuyệt mật nội bộ',
        exampleEn: 'Please keep all client financial records confidential.',
        topic: 'Quy định công ty',
        category: 'toeic',
      },
    ],
  },
  {
    id: 'pack-ielts',
    name: 'Gói Từ vựng IELTS (Academic Band 7.0+)',
    category: 'ielts',
    level: 'IELTS 6.5 - 8.0',
    badgeColor: 'badge-purple',
    description: 'Từ vựng học thuật cao cấp giúp nâng band điểm Writing Task 2 và Speaking.',
    words: [
      {
        word: 'ubiquitous',
        ipa: '/juːˈbɪkwɪtəs/',
        type: 'adj',
        vietnamese: 'phổ biến ở khắp mọi nơi, nhan nhản',
        exampleEn: 'Smartphones have become ubiquitous in modern society.',
        topic: 'Học thuật & Xã hội',
        category: 'ielts',
      },
      {
        word: 'mitigate',
        ipa: '/ˈmɪtɪɡeɪt/',
        type: 'verb',
        vietnamese: 'giảm nhẹ, làm dịu bớt mức độ nghiêm trọng',
        exampleEn: 'Governments must take swift actions to mitigate climate change.',
        topic: 'Môi trường & Khoa học',
        category: 'ielts',
      },
      {
        word: 'substantiate',
        ipa: '/səbˈstænʃieɪt/',
        type: 'verb',
        vietnamese: 'chứng minh, cung cấp bằng chứng xác thực',
        exampleEn: 'The researcher failed to substantiate his controversial claims.',
        topic: 'Nghiên cứu khoa học',
        category: 'ielts',
      },
      {
        word: 'paramount',
        ipa: '/ˈpærəmaʊnt/',
        type: 'adj',
        vietnamese: 'tối quan trọng, có ý nghĩa sống còn',
        exampleEn: 'Ensuring passenger safety is of paramount importance.',
        topic: 'Bài luận Writing',
        category: 'ielts',
      },
      {
        word: 'dilemma',
        ipa: '/dɪˈlemə/',
        type: 'noun',
        vietnamese: 'tình thế tiến thoái lưỡng nan, khó xử',
        exampleEn: 'Policymakers face an ethical dilemma regarding AI regulations.',
        topic: 'Xã hội & Đạo đức',
        category: 'ielts',
      },
      {
        word: 'inevitable',
        ipa: '/ɪnˈevɪtəbl/',
        type: 'adj',
        vietnamese: 'không thể tránh khỏi, tất yếu sẽ xảy ra',
        exampleEn: 'Technological advancement makes automated work inevitable.',
        topic: 'Công nghệ & Tương lai',
        category: 'ielts',
      },
    ],
  },
];
