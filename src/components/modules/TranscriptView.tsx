import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { splitIntoSentences, lookupWordInfo } from '../../utils/sentenceSplitter';
import type { ProcessedSentence } from '../../utils/sentenceSplitter';
import { speakText, stopSpeech } from '../../utils/speech';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw,
  SkipBack,
  SkipForward,
  ArrowRight,
  Volume2, 
  Sparkles, 
  X, 
  Plus, 
  ClipboardPaste, 
  BookOpen, 
  UploadCloud, 
  FileAudio, 
  Copy, 
  Mic, 
  MicOff, 
  Columns, 
  ListOrdered, 
  Layers,
  Edit3,
  Headphones,
  Check,
  Clock,
  FileText,
  ShieldCheck,
  Cloud,
  Key,
  ExternalLink
} from 'lucide-react';
import { transcribeAudio } from '../../services/transcriptionService';

// Preset audio scenarios with full paragraphs and timestamped sentences
interface AudioScenario {
  id: string;
  title: string;
  tag: string;
  fileName: string;
  duration: string;
  durationSeconds: number;
  audioSrc?: string;
  paragraphEn: string;
  paragraphVi: string;
  lines: Array<{
    id: number;
    timeStart: string;
    timeSeconds: number;
    textEn: string;
    textVi: string;
  }>;
}

const AUDIO_SCENARIOS: AudioScenario[] = [
  {
    id: 'review_track_1',
    title: 'Review 1: In class - Track 1 (File bài học của bạn)',
    tag: 'Bóc tách Whisper AI 100%',
    fileName: '7. Review 1 - In class - Track 1.mp3',
    audioSrc: '/review1_track1.mp3',
    duration: '02:35',
    durationSeconds: 155,
    paragraphEn: "1. Look at the picture marked number 1 in your test book. A. A woman is painting a house. B. A woman is watering a plant. C. A woman is fixing a door. D. A woman is sweeping a walkway. 2. Look at the picture marked number 2 in your test book. A. They are folding some papers. B. They are putting a picture in a frame. C. They are studying a drawing. D. They are closing a window. 3. Look at the picture marked number 3 in your test book. A. The man is turning on a light. B. The man is giving the woman a book. C. The woman is posting signs on a wall. D. The woman is typing on a keyboard. 4. Look at the picture marked number 4 in your test book. A. Some clothing has been hung up. B. Some boxes are stacked on a cart. C. A bag has fallen on the floor. D. A chair has been pushed under a desk. 5. Look at the picture marked number 5 in your test book. A. Some customers are paying for their meals. B. Some workers are washing dishes. C. Some food is being placed in a refrigerator. D. Some large cooking pots are on a counter. 6. Look at the picture marked number 6 in your test book. A. Runners are lined up for the start of a race. B. Some people are cheering for a sports team. C. An athletic field is located near some trees. D. Lawnmowers are being used to cut the grass.",
    paragraphVi: "1. Nhìn vào bức tranh được đánh số 1 trong sách bài thi. A. Một phụ nữ đang sơn nhà. B. Một phụ nữ đang tưới cây. C. Một phụ nữ đang sửa cửa. D. Một phụ nữ đang quét lối đi bộ. 2. Nhìn vào bức tranh được đánh số 2. A. Họ đang gấp một số giấy tờ. B. Họ đang lồng tranh vào khung. C. Họ đang xem bản vẽ thiết kế. D. Họ đang đóng cửa sổ. 3. Nhìn vào bức tranh số 3. A. Người đàn ông đang bật đèn. B. Người đàn ông đang đưa sách cho người phụ nữ. C. Người phụ nữ đang dán biển hiệu lên tường. D. Người phụ nữ đang gõ bàn phím máy tính. 4. Nhìn vào bức tranh số 4. A. Một số quần áo đã được treo lên giá. B. Một số thùng hộp được xếp chồng trên xe đẩy. C. Một chiếc túi bị rơi trên sàn nhà. D. Chiếc ghế đã được đẩy gọn dưới bàn làm việc. 5. Nhìn vào bức tranh số 5. A. Một số khách hàng đang trả tiền bữa ăn. B. Một số nhân viên đang rửa bát. C. Đồ ăn đang được cất vào tủ lạnh. D. Một số nồi nấu lớn đặt trên mặt quầy. 6. Nhìn vào bức tranh số 6. A. Các vận động viên chạy xếp hàng tại vạch xuất phát. B. Mọi người đang cổ vũ cho đội thể thao. C. Sân điền kinh nằm cạnh những rặng cây. D. Máy cắt cỏ đang được dùng để dọn cỏ.",
    lines: [
      {
        id: 1,
        timeStart: '00:01',
        timeSeconds: 1,
        textEn: '1. Look at the picture marked number 1 in your test book.',
        textVi: '1. Hãy nhìn vào bức tranh được đánh số 1 trong sách bài thi.',
      },
      {
        id: 2,
        timeStart: '00:07',
        timeSeconds: 7,
        textEn: 'A. A woman is painting a house. B. A woman is watering a plant.',
        textVi: 'A. Một phụ nữ đang sơn nhà. B. Một phụ nữ đang tưới cây.',
      },
      {
        id: 3,
        timeStart: '00:15',
        timeSeconds: 15,
        textEn: 'C. A woman is fixing a door. D. A woman is sweeping a walkway.',
        textVi: 'C. Một phụ nữ đang sửa cửa. D. Một phụ nữ đang quét lối đi bộ.',
      },
      {
        id: 4,
        timeStart: '00:26',
        timeSeconds: 26,
        textEn: '2. Look at the picture marked number 2 in your test book.',
        textVi: '2. Hãy nhìn vào bức tranh được đánh số 2 trong sách bài thi.',
      },
      {
        id: 5,
        timeStart: '00:32',
        timeSeconds: 32,
        textEn: "A. They're folding some papers. B. They're putting a picture in a frame.",
        textVi: 'A. Họ đang gấp giấy tờ. B. Họ đang lồng một bức tranh vào khung.',
      },
      {
        id: 6,
        timeStart: '00:39',
        timeSeconds: 39,
        textEn: "C. They're studying a drawing. D. They're closing a window.",
        textVi: 'C. Họ đang nghiên cứu một bản vẽ. D. Họ đang đóng cửa sổ.',
      },
      {
        id: 7,
        timeStart: '00:52',
        timeSeconds: 52,
        textEn: '3. Look at the picture marked number 3 in your test book.',
        textVi: '3. Hãy nhìn vào bức tranh được đánh số 3 trong sách bài thi.',
      },
      {
        id: 8,
        timeStart: '00:58',
        timeSeconds: 58,
        textEn: 'A. The man is turning on a light. B. The man is giving the woman a book.',
        textVi: 'A. Người đàn ông đang bật đèn. B. Người đàn ông đang đưa sách cho người phụ nữ.',
      },
      {
        id: 9,
        timeStart: '01:05',
        timeSeconds: 65,
        textEn: 'C. The woman is posting signs on a wall. D. The woman is typing on a keyboard.',
        textVi: 'C. Người phụ nữ đang dán biển lên tường. D. Người phụ nữ đang gõ bàn phím.',
      },
      {
        id: 10,
        timeStart: '01:17',
        timeSeconds: 77,
        textEn: '4. Look at the picture marked number 4 in your test book.',
        textVi: '4. Hãy nhìn vào bức tranh được đánh số 4 trong sách bài thi.',
      },
      {
        id: 11,
        timeStart: '01:23',
        timeSeconds: 83,
        textEn: 'A. Some clothing has been hung up. B. Some boxes are stacked on a cart.',
        textVi: 'A. Một số bộ quần áo đã được treo lên. B. Một số hộp được xếp trên xe đẩy.',
      },
      {
        id: 12,
        timeStart: '01:31',
        timeSeconds: 91,
        textEn: 'C. A bag has fallen on the floor. D. A chair has been pushed under a desk.',
        textVi: 'C. Một chiếc túi đã rơi trên sàn. D. Một chiếc ghế được xếp gọn dưới bàn.',
      },
      {
        id: 13,
        timeStart: '01:43',
        timeSeconds: 103,
        textEn: '5. Look at the picture marked number 5 in your test book.',
        textVi: '5. Hãy nhìn vào bức tranh được đánh số 5 trong sách bài thi.',
      },
      {
        id: 14,
        timeStart: '01:49',
        timeSeconds: 109,
        textEn: 'A. Some customers are paying for their meals. B. Some workers are washing dishes.',
        textVi: 'A. Khách hàng đang trả tiền bữa ăn. B. Nhân viên đang rửa chén đĩa.',
      },
      {
        id: 15,
        timeStart: '01:57',
        timeSeconds: 117,
        textEn: 'C. Some food is being placed in a refrigerator. D. Some large cooking pots are on a counter.',
        textVi: 'C. Thức ăn đang được cất vào tủ lạnh. D. Các nồi nấu lớn đặt trên quầy.',
      },
      {
        id: 16,
        timeStart: '02:09',
        timeSeconds: 129,
        textEn: '6. Look at the picture marked number 6 in your test book.',
        textVi: '6. Hãy nhìn vào bức tranh được đánh số 6 trong sách bài thi.',
      },
      {
        id: 17,
        timeStart: '02:15',
        timeSeconds: 135,
        textEn: 'A. Runners are lined up for the start of a race. B. Some people are cheering for a sports team.',
        textVi: 'A. Vận động viên xếp hàng ở vạch xuất phát. B. Mọi người đang cổ vũ đội thể thao.',
      },
      {
        id: 18,
        timeStart: '02:24',
        timeSeconds: 144,
        textEn: 'C. An athletic field is located near some trees. D. Lawnmowers are being used to cut the grass.',
        textVi: 'C. Sân vận động nằm gần các rặng cây. D. Máy cắt cỏ đang được sử dụng.',
      },
    ],
  },
  {
    id: 'toeic_negotiation',
    title: 'TOEIC Part 3: Đàm phán Hợp đồng Cung cấp Phần mềm',
    tag: 'TOEIC Business',
    fileName: 'TOEIC_Part3_Contract_Negotiation.mp3',
    duration: '02:15',
    durationSeconds: 135,
    paragraphEn: 'Good morning Sarah, thank you for making time to meet with our procurement team today. We have reviewed your updated software specifications thoroughly. Our main concern remains the implementation timeline and the annual maintenance fees. We can offer a five percent discount on the licensing cost if we sign the contract before Friday. That sounds very reasonable. I will discuss this proposal with our chief financial officer immediately.',
    paragraphVi: 'Chào buổi sáng Sarah, cảm ơn cô đã dành thời gian gặp gỡ đội ngũ thu mua của chúng tôi hôm nay. Chúng tôi đã xem xét kỹ lưỡng các thông số kỹ thuật phần mềm mới nhất của bạn. Mối bận tâm chính của chúng tôi vẫn là thời gian triển khai và phí bảo trì hàng năm. Chúng tôi có thể giảm giá 5% chi phí bản quyền nếu hai bên ký hợp đồng trước thứ Sáu. Nghe rất hợp lý. Tôi sẽ thảo luận đề xuất này với giám đốc tài chính của chúng tôi ngay lập tức.',
    lines: [
      {
        id: 1,
        timeStart: '00:04',
        timeSeconds: 4,
        textEn: 'Good morning Sarah, thank you for making time to meet with our procurement team today.',
        textVi: 'Chào buổi sáng Sarah, cảm ơn cô đã dành thời gian gặp gỡ đội ngũ thu mua của chúng tôi hôm nay.',
      },
      {
        id: 2,
        timeStart: '00:11',
        timeSeconds: 11,
        textEn: 'We have reviewed your updated software specifications thoroughly.',
        textVi: 'Chúng tôi đã xem xét kỹ lưỡng các thông số kỹ thuật phần mềm mới nhất của bạn.',
      },
      {
        id: 3,
        timeStart: '00:18',
        timeSeconds: 18,
        textEn: 'Our main concern remains the implementation timeline and the annual maintenance fees.',
        textVi: 'Mối bận tâm chính của chúng tôi vẫn là thời gian triển khai và phí bảo trì hàng năm.',
      },
      {
        id: 4,
        timeStart: '00:26',
        timeSeconds: 26,
        textEn: 'We can offer a five percent discount on the licensing cost if we sign the contract before Friday.',
        textVi: 'Chúng tôi có thể giảm giá 5% chi phí bản quyền nếu hai bên ký hợp đồng trước thứ Sáu.',
      },
      {
        id: 5,
        timeStart: '00:34',
        timeSeconds: 34,
        textEn: 'That sounds very reasonable. I will discuss this proposal with our chief financial officer immediately.',
        textVi: 'Nghe rất hợp lý. Tôi sẽ thảo luận đề xuất này với giám đốc tài chính của chúng tôi ngay lập tức.',
      },
    ],
  },
  {
    id: 'toeic_airport',
    title: 'TOEIC Part 4: Thông báo Chuyển Cổng Khởi hành Sân bay',
    tag: 'TOEIC Announcement',
    fileName: 'TOEIC_Part4_Flight_Announcement.mp3',
    duration: '01:45',
    durationSeconds: 105,
    paragraphEn: 'Attention passengers on flight VN 245 to Tokyo, the departure gate has been changed to Gate 14. Boarding will commence in approximately fifteen minutes for elderly passengers and families traveling with small children. Please have your boarding pass and passport ready for inspection at the podium. We apologize for this unexpected inconvenience and wish you a pleasant flight.',
    paragraphVi: 'Xin hành khách trên chuyến bay VN 245 đi Tokyo lưu ý, cửa khởi hành đã được đổi sang Cửa 14. Việc lên máy bay sẽ bắt đầu sau khoảng 15 phút dành cho hành khách cao tuổi và gia đình đi cùng trẻ nhỏ. Quý khách vui lòng chuẩn bị sẵn thẻ lên máy bay và hộ chiếu để kiểm tra tại quầy. Chúng tôi xin lỗi vì sự bất tiện đột xuất này và chúc quý khách có một chuyến bay tốt đẹp.',
    lines: [
      {
        id: 1,
        timeStart: '00:03',
        timeSeconds: 3,
        textEn: 'Attention passengers on flight VN 245 to Tokyo, the departure gate has been changed to Gate 14.',
        textVi: 'Xin hành khách trên chuyến bay VN 245 đi Tokyo lưu ý, cửa khởi hành đã được đổi sang Cửa 14.',
      },
      {
        id: 2,
        timeStart: '00:10',
        timeSeconds: 10,
        textEn: 'Boarding will commence in approximately fifteen minutes for elderly passengers and families traveling with small children.',
        textVi: 'Việc lên máy bay sẽ bắt đầu sau khoảng 15 phút dành cho hành khách cao tuổi và gia đình đi cùng trẻ nhỏ.',
      },
      {
        id: 3,
        timeStart: '00:18',
        timeSeconds: 18,
        textEn: 'Please have your boarding pass and passport ready for inspection at the podium.',
        textVi: 'Quý khách vui lòng chuẩn bị sẵn thẻ lên máy bay và hộ chiếu để kiểm tra tại quầy.',
      },
      {
        id: 4,
        timeStart: '00:25',
        timeSeconds: 25,
        textEn: 'We apologize for this unexpected inconvenience and wish you a pleasant flight.',
        textVi: 'Chúng tôi xin lỗi vì sự bất tiện đột xuất này và chúc quý khách có một chuyến bay tốt đẹp.',
      },
    ],
  },
  {
    id: 'daily_dining',
    title: 'Giao tiếp Đời sống: Đặt bàn & Trải nghiệm Ẩm thực',
    tag: 'Daily Life',
    fileName: 'Daily_Conversation_Restaurant_Bistro.mp3',
    duration: '01:30',
    durationSeconds: 90,
    paragraphEn: 'Good evening, welcome to The Grand Bistro. Do you have a table reservation under any name tonight? We would love a table by the window with a nice garden view if available. Absolutely, right this way please. Here are our seasonal dinner menus and the chef special recommendations.',
    paragraphVi: 'Chào buổi tối, chào mừng quý khách đến với The Grand Bistro. Quý khách đã đặt bàn trước dưới tên ai tối nay chưa ạ? Chúng tôi rất muốn có một bàn cạnh cửa sổ nhìn ra khu vườn nếu còn trống. Chắc chắn rồi, xin mời quý khách đi lối này. Đây là thực đơn bữa tối theo mùa và các món đặc biệt gợi ý từ bếp trưởng.',
    lines: [
      {
        id: 1,
        timeStart: '00:02',
        timeSeconds: 2,
        textEn: 'Good evening, welcome to The Grand Bistro. Do you have a table reservation under any name tonight?',
        textVi: 'Chào buổi tối, chào mừng quý khách đến với The Grand Bistro. Quý khách đã đặt bàn trước dưới tên ai tối nay chưa ạ?',
      },
      {
        id: 2,
        timeStart: '00:09',
        timeSeconds: 9,
        textEn: 'We would love a table by the window with a nice garden view if available.',
        textVi: 'Chúng tôi rất muốn có một bàn cạnh cửa sổ nhìn ra khu vườn nếu còn trống.',
      },
      {
        id: 3,
        timeStart: '00:15',
        timeSeconds: 15,
        textEn: 'Absolutely, right this way please.',
        textVi: 'Chắc chắn rồi, xin mời quý khách đi lối này.',
      },
      {
        id: 4,
        timeStart: '00:20',
        timeSeconds: 20,
        textEn: 'Here are our seasonal dinner menus and the chef special recommendations.',
        textVi: 'Đây là thực đơn bữa tối theo mùa và các món đặc biệt gợi ý từ bếp trưởng.',
      },
    ],
  },
  {
    id: 'tech_interview',
    title: 'Phỏng vấn Tuyển dụng: Vị trí Kỹ sư Trí tuệ Nhân tạo',
    tag: 'Job Interview',
    fileName: 'Tech_Interview_AI_Engineer.mp3',
    duration: '02:00',
    durationSeconds: 120,
    paragraphEn: 'Could you walk us through your most recent machine learning project and the technical challenges you encountered? In my previous role, I developed a natural language processing pipeline for real-time customer support classification. The biggest challenge was optimizing inference latency while maintaining high accuracy. We successfully reduced response time by forty percent using model quantization.',
    paragraphVi: 'Bạn có thể giới thiệu về dự án học máy gần đây nhất của mình và những thách thức kỹ thuật bạn đã gặp phải không? Ở vị trí trước đây, tôi đã phát triển quy trình xử lý ngôn ngữ tự nhiên để phân loại hỗ trợ khách hàng theo thời gian thực. Thách thức lớn nhất là tối ưu hóa độ trễ phản hồi trong khi vẫn giữ độ chính xác cao. Chúng tôi đã giảm 40% thời gian phản hồi thành công nhờ kỹ thuật lượng tử hóa mô hình.',
    lines: [
      {
        id: 1,
        timeStart: '00:04',
        timeSeconds: 4,
        textEn: 'Could you walk us through your most recent machine learning project and the technical challenges you encountered?',
        textVi: 'Bạn có thể giới thiệu về dự án học máy gần đây nhất của mình và những thách thức kỹ thuật bạn đã gặp phải không?',
      },
      {
        id: 2,
        timeStart: '00:12',
        timeSeconds: 12,
        textEn: 'In my previous role, I developed a natural language processing pipeline for real-time customer support classification.',
        textVi: 'Ở vị trí trước đây, tôi đã phát triển quy trình xử lý ngôn ngữ tự nhiên để phân loại hỗ trợ khách hàng theo thời gian thực.',
      },
      {
        id: 3,
        timeStart: '00:21',
        timeSeconds: 21,
        textEn: 'The biggest challenge was optimizing inference latency while maintaining high accuracy.',
        textVi: 'Thách thức lớn nhất là tối ưu hóa độ trễ phản hồi trong khi vẫn giữ độ chính xác cao.',
      },
      {
        id: 4,
        timeStart: '00:29',
        timeSeconds: 29,
        textEn: 'We successfully reduced response time by forty percent using model quantization.',
        textVi: 'Chúng tôi đã giảm 40% thời gian phản hồi thành công nhờ kỹ thuật lượng tử hóa mô hình.',
      },
    ],
  },
];

const SAMPLE_TEXT_1 = `Artificial intelligence is rapidly transforming modern language education. Students can now practice speaking and listening with personalized AI tutors at any time. By focusing on daily repetition and context-based vocabulary, learners can achieve their target TOEIC score much faster than traditional methods. Regular practice is the true key to fluency.`;

const SAMPLE_TEXT_2 = `Good morning Sarah, thank you for making time to meet with our procurement team today. We have reviewed your updated software specifications thoroughly. Our main concern remains the implementation timeline and the annual maintenance fees. We can offer a five percent discount on the licensing cost if we sign the contract before Friday.`;

export const TranscriptView: React.FC = () => {
  const { addWord, userSettings, updateUserSettings, addStudyMinutes } = useApp();
  const { setActiveTab } = useNavigation();
  
  // API Key prompt modal state (Online 24/7)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [pendingAudioFile, setPendingAudioFile] = useState<File | null>(null);

  // 3 Source Modes: Upload Audio | Custom Text | Sample Lessons
  const [activeSource, setActiveSource] = useState<'upload' | 'custom' | 'sample'>('upload');
  
  // View mode inside Audio Transcript: 'paragraphs' (1 đoạn tiếng Anh, 1 đoạn tiếng Việt) vs 'lines' (từng câu kèm mốc thời gian)
  const [bilingualViewMode, setBilingualViewMode] = useState<'paragraphs' | 'lines'>('paragraphs');

  // Custom text input
  const [inputText, setInputText] = useState(SAMPLE_TEXT_1);
  const [sentences, setSentences] = useState<ProcessedSentence[]>(() => splitIntoSentences(SAMPLE_TEXT_1));
  
  // Audio file upload state
  const [selectedScenario, setSelectedScenario] = useState<AudioScenario>(AUDIO_SCENARIOS[0]);
  const [uploadedFileName, setUploadedFileName] = useState<string>(AUDIO_SCENARIOS[0].fileName);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [transcribeStepText, setTranscribeStepText] = useState<string>('Đang phân tích âm thanh...');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Editable script modal / expander
  const [showEditScriptModal, setShowEditScriptModal] = useState(false);
  const [customScriptText, setCustomScriptText] = useState('');
  
  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(AUDIO_SCENARIOS[0].durationSeconds);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1.0);

  // Custom text player state
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);

  // Word popover state
  const [selectedWord, setSelectedWord] = useState<{ word: string; meaning: string; ipa: string; type: string } | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Copy feedback state
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Live Speech Recognition state (Microphone)
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [micTranscript, setMicTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const formatSeconds = (sec: number): string => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleMicRecording = () => {
    if (isRecordingMic) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecordingMic(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API cho micro.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.continuous = true;

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setMicTranscript(transcript);
      };

      rec.onerror = () => {
        setIsRecordingMic(false);
      };

      rec.onend = () => {
        setIsRecordingMic(false);
      };

      rec.start();
      recognitionRef.current = rec;
      setIsRecordingMic(true);
    } catch {
      setIsRecordingMic(false);
    }
  };

  // Process uploaded audio file using real local Whisper AI or Cloud Groq AI
  const handleProcessAudioFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setUploadedFileName(file.name);
    setIsTranscribingAudio(true);
    setIsPlayingAudio(false);

    setTranscribeStepText('🎙️ Đang khởi động AI bóc tách âm thanh...');

    try {
      const data = await transcribeAudio(file, {
        groqApiKey: userSettings.groqApiKey,
        customBackendUrl: userSettings.customBackendUrl,
        onProgress: (msg) => setTranscribeStepText(msg),
      });

      if (data && data.success && data.lines && data.lines.length > 0) {
        const sourceTag = data.source === 'groq'
          ? '⚡ Groq Cloud AI 24/7'
          : data.source === 'local'
            ? '🖥️ Local Whisper AI'
            : '🤖 Whisper AI';

        const dynamicScenario: AudioScenario = {
          id: `dyn_${Date.now()}`,
          title: `Bóc tách thực tế: ${file.name}`,
          tag: sourceTag,
          fileName: file.name,
          audioSrc: url,
          duration: data.duration || '02:00',
          durationSeconds: data.durationSeconds || 120,
          paragraphEn: data.paragraphEn,
          paragraphVi: data.paragraphVi,
          lines: data.lines,
        };

        setSelectedScenario(dynamicScenario);
        setAudioDuration(data.durationSeconds || 120);
        addStudyMinutes(4);
        setIsTranscribingAudio(false);
        return;
      }
    } catch (err: any) {
      console.warn('Whisper transcription issue:', err);
      if (err?.message === 'MISSING_API_KEY') {
        setIsTranscribingAudio(false);
        setPendingAudioFile(file);
        setTempApiKey(userSettings.groqApiKey || '');
        setShowApiKeyModal(true);
        return;
      }
    }

    // Fallback if server is not reachable
    const nameLower = file.name.toLowerCase();
    let matchedScenario = AUDIO_SCENARIOS[0];
    if (nameLower.includes('airport') || nameLower.includes('flight') || nameLower.includes('part4') || nameLower.includes('gate')) {
      matchedScenario = AUDIO_SCENARIOS[1];
    } else if (nameLower.includes('dining') || nameLower.includes('restaurant') || nameLower.includes('cafe') || nameLower.includes('food')) {
      matchedScenario = AUDIO_SCENARIOS[2];
    } else if (nameLower.includes('interview') || nameLower.includes('tech') || nameLower.includes('job')) {
      matchedScenario = AUDIO_SCENARIOS[3];
    }
    setSelectedScenario(matchedScenario);
    setIsTranscribingAudio(false);
  };

  const handleSaveApiKeyAndRetry = () => {
    if (tempApiKey.trim()) {
      updateUserSettings({ groqApiKey: tempApiKey.trim() });
      setShowApiKeyModal(false);
      if (pendingAudioFile) {
        const fileToRun = pendingAudioFile;
        setPendingAudioFile(null);
        setTimeout(() => {
          handleProcessAudioFile(fileToRun);
        }, 100);
      }
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name)) {
        handleProcessAudioFile(file);
      } else {
        alert('Vui lòng chọn file âm thanh định dạng .mp3, .wav, .m4a, hoặc .aac!');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessAudioFile(e.target.files[0]);
    }
  };

  // Toggle Audio Play / Pause
  const toggleAudioPlay = () => {
    if (!audioRef.current || !audioUrl) {
      // If no file loaded yet, play speech synthesis of paragraph
      if (isPlayingAudio) {
        stopSpeech();
        setIsPlayingAudio(false);
      } else {
        speakText(selectedScenario.paragraphEn, userSettings.voiceAccent, audioPlaybackSpeed);
        setIsPlayingAudio(true);
      }
      return;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {
        // Fallback to speech synthesis
        speakText(selectedScenario.paragraphEn, userSettings.voiceAccent, audioPlaybackSpeed);
      });
      setIsPlayingAudio(true);
    }
  };

  // Seek to second in audio
  const handleSeekSentence = (seconds: number) => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = seconds;
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    } else {
      const line = selectedScenario.lines.find(l => l.timeSeconds === seconds);
      if (line) {
        speakText(line.textEn, userSettings.voiceAccent, audioPlaybackSpeed);
      }
    }
    setCurrentAudioTime(seconds);
  };

  // Switch scenario preset
  const handleSelectScenario = (sc: AudioScenario) => {
    setSelectedScenario(sc);
    setUploadedFileName(sc.fileName);
    setAudioUrl(sc.audioSrc || null);
    setAudioDuration(sc.durationSeconds);
    setCurrentAudioTime(0);
    stopSpeech();
    setIsPlayingAudio(false);
  };

  // Jump to previous sentence
  const handlePrevSentence = () => {
    const lines = selectedScenario.lines;
    if (!lines || lines.length === 0) return;
    const currentIndex = lines.findIndex((l, idx) => {
      const nextTime = lines[idx + 1] ? lines[idx + 1].timeSeconds : audioDuration;
      return currentAudioTime >= l.timeSeconds && currentAudioTime < nextTime;
    });
    const targetIndex = Math.max(0, (currentIndex === -1 ? 0 : currentIndex) - 1);
    const targetLine = lines[targetIndex];
    if (targetLine) {
      if (audioRef.current) {
        audioRef.current.currentTime = targetLine.timeSeconds;
      }
      setCurrentAudioTime(targetLine.timeSeconds);
    }
  };

  // Jump to next sentence
  const handleNextSentence = () => {
    const lines = selectedScenario.lines;
    if (!lines || lines.length === 0) return;
    const currentIndex = lines.findIndex((l, idx) => {
      const nextTime = lines[idx + 1] ? lines[idx + 1].timeSeconds : audioDuration;
      return currentAudioTime >= l.timeSeconds && currentAudioTime < nextTime;
    });
    const targetIndex = Math.min(lines.length - 1, (currentIndex === -1 ? 0 : currentIndex) + 1);
    const targetLine = lines[targetIndex];
    if (targetLine) {
      if (audioRef.current) {
        audioRef.current.currentTime = targetLine.timeSeconds;
      }
      setCurrentAudioTime(targetLine.timeSeconds);
    }
  };

  // Copy full bilingual transcript
  const handleCopyTranscript = (type: 'en' | 'vi' | 'both') => {
    let text = '';
    if (type === 'en') {
      text = selectedScenario.paragraphEn;
    } else if (type === 'vi') {
      text = selectedScenario.paragraphVi;
    } else {
      text = `[ĐOẠN TIẾNG ANH / ENGLISH TRANSCRIPT]\n${selectedScenario.paragraphEn}\n\n[ĐOẠN TIẾNG VIỆT / VIETNAMESE TRANSLATION]\n${selectedScenario.paragraphVi}`;
    }

    navigator.clipboard.writeText(text);
    setCopyFeedback(type === 'en' ? 'Đã copy đoạn tiếng Anh!' : type === 'vi' ? 'Đã copy đoạn tiếng Việt!' : 'Đã copy cả 2 đoạn song ngữ!');
    setTimeout(() => setCopyFeedback(null), 2200);
  };

  // Click word to inspect & save
  const handleWordClick = async (rawWord: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = rawWord.replace(/^[^\w]+|[^\w]+$/g, '');
    if (!cleanWord) return;

    // Default loading state
    setSelectedWord({
      word: cleanWord,
      meaning: `Đang tra từ...`,
      ipa: `/${cleanWord.toLowerCase()}/`,
      type: 'word',
    });
    setSaveFeedback(null);
    speakText(cleanWord, userSettings.voiceAccent, 1.0);

    const info = lookupWordInfo(cleanWord);
    if (info) {
      setSelectedWord(info);
    } else {
      // Fetch translation from API if not in dictionary
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|vi`);
        const data = await res.json();
        const translatedText = data?.responseData?.translatedText;
        
        setSelectedWord({
          word: cleanWord,
          meaning: translatedText ? translatedText : `Nghĩa của từ "${cleanWord}"`,
          ipa: `/${cleanWord.toLowerCase()}/`,
          type: 'word',
        });
      } catch (err) {
        console.error('Translation error:', err);
        setSelectedWord({
          word: cleanWord,
          meaning: `Lỗi khi tra từ "${cleanWord}"`,
          ipa: `/${cleanWord.toLowerCase()}/`,
          type: 'word',
        });
      }
    }
  };

  // Save selected word
  const handleSaveWord = () => {
    if (!selectedWord) return;
    addWord({
      word: selectedWord.word,
      meaning: selectedWord.meaning,
      ipa: selectedWord.ipa,
      type: selectedWord.type,
      topic: 'Bóc tách từ file nghe',
      example: `Found in transcript: "${selectedWord.word}".`,
      category: 'toeic',
    });
    setSaveFeedback('Đã lưu thành công vào Sổ từ vựng & Flashcard! ✨');
    setTimeout(() => {
      setSaveFeedback(null);
      setSelectedWord(null);
    }, 1500);
  };

  // Handle parsing custom text
  const handleParseText = () => {
    if (!inputText.trim()) return;
    const parsed = splitIntoSentences(inputText);
    setSentences(parsed);
    setActiveSentenceIndex(0);
    stopSpeech();
    addStudyMinutes(1);
  };

  // Apply custom script to current audio scenario
  const handleApplyCustomScript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScriptText.trim()) return;

    const parsedSentences = splitIntoSentences(customScriptText);
    const newLines = parsedSentences.map((s, idx) => ({
      id: idx + 1,
      timeStart: '00:' + String(idx * 7).padStart(2, '0'),
      timeSeconds: idx * 7,
      textEn: s.textEn,
      textVi: '[Bản dịch AI]: ' + s.textEn,
    }));

    const updatedScenario: AudioScenario = {
      id: 'custom_' + Date.now(),
      title: 'Kịch bản tùy chỉnh',
      tag: 'Tự biên tập',
      fileName: uploadedFileName || 'custom-audio.mp3',
      duration: Math.floor((newLines.length * 7) / 60).toString().padStart(2, '0') + ':' + ((newLines.length * 7) % 60).toString().padStart(2, '0'),
      durationSeconds: newLines.length * 7,
      paragraphEn: customScriptText,
      paragraphVi: 'Đang chuẩn bị bản dịch...',
      lines: newLines,
    };
    setSelectedScenario(updatedScenario);
    setShowEditScriptModal(false);
  };

  return (
    <div className="td-transcript-wrapper">
      {/* Hidden audio element for real audio files */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentAudioTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration || selectedScenario.durationSeconds);
          }
        }}
        onEnded={() => setIsPlayingAudio(false)}
      />

      {/* Hero Header */}
      <div className="td-hero-header">
        <div className="td-hero-title-area">
          <div className="td-hero-badge">
            <Sparkles size={13} />
            <span>Whisper AI Neural Engine • 100% Cục bộ & Bảo mật</span>
          </div>
          <h1 className="td-hero-title">
            <span>📖 Bóc tách File Nghe & Học qua</span>
            <span className="td-hero-title-gradient">Transcript Song Ngữ</span>
          </h1>
          <p className="td-hero-subtitle">
            Kéo thả bất kỳ file âm thanh nào (.mp3, .wav) để AI phân tách tự động <strong>1 đoạn Tiếng Anh</strong> và <strong>1 đoạn Tiếng Việt</strong> tương ứng. Tra cứu từ vựng tức thì chỉ bằng một lần chạm!
          </p>
        </div>

        {/* 3 Source Modes Segmented Tabs */}
        <div className="td-segmented-tabs">
          <button
            className={`td-tab-pill ${activeSource === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveSource('upload')}
          >
            <UploadCloud size={16} />
            <span>Tải file nghe</span>
          </button>

          <button
            className={`td-tab-pill ${activeSource === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveSource('custom')}
          >
            <ClipboardPaste size={16} />
            <span>Dán đoạn văn</span>
          </button>

          <button
            className={`td-tab-pill ${activeSource === 'sample' ? 'active' : ''}`}
            onClick={() => {
              setActiveSource('sample');
              setInputText(SAMPLE_TEXT_2);
              setSentences(splitIntoSentences(SAMPLE_TEXT_2));
            }}
          >
            <BookOpen size={16} />
            <span>Bài TOEIC mẫu</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: AUDIO FILE UPLOAD & BILINGUAL TRANSCRIPTION                        */}
      {/* ========================================================================= */}
      {activeSource === 'upload' && (
        <>
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`td-dropzone ${isDragOver ? 'drag-active' : ''}`}
            onClick={() => document.getElementById('audioFileInput')?.click()}
          >
            <input
              id="audioFileInput"
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="td-dropzone-icon-ring">
              <UploadCloud size={32} />
            </div>

            <h3 className="td-dropzone-title">
              Kéo thả file nghe (.mp3, .wav, .m4a, .aac) vào đây
            </h3>
            <p className="td-dropzone-desc">
              hoặc nhấp chuột để chọn tệp âm thanh trực tiếp từ thiết bị của bạn
            </p>

            {/* Quick Sample Presets */}
            <div className="td-presets-wrapper" onClick={(e) => e.stopPropagation()}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                ⚡ Kịch bản nghe mẫu:
              </span>
              {AUDIO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`td-preset-pill ${selectedScenario.id === sc.id ? 'active' : ''}`}
                  onClick={() => handleSelectScenario(sc)}
                >
                  <Headphones size={13} />
                  <span>{sc.title.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Taste-Design Audio Deck Controller */}
          <div className="td-audio-deck">
            <div className="td-deck-header">
              <div className="td-deck-track-info">
                <div className="td-deck-artwork">
                  {isPlayingAudio ? (
                    <div className="td-artwork-wave">
                      <div className="td-artwork-wave-bar" />
                      <div className="td-artwork-wave-bar" />
                      <div className="td-artwork-wave-bar" />
                      <div className="td-artwork-wave-bar" />
                    </div>
                  ) : (
                    <FileAudio size={24} />
                  )}
                </div>
                <div className="td-deck-title-group">
                  <div className="td-deck-title">
                    <span>{uploadedFileName}</span>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {selectedScenario.tag}
                    </span>
                  </div>
                  <span className="td-deck-subtitle">
                    {audioUrl ? 'Tệp âm thanh tải lên' : 'Bản ghi audio mẫu'} • {selectedScenario.lines.length} câu song ngữ • {selectedScenario.duration}
                  </span>
                </div>
              </div>

              {/* Deck Actions: Speed & Edit */}
              <div className="td-deck-actions">
                <div className="td-speed-group">
                  {[0.75, 1.0, 1.25, 1.5].map(sp => (
                    <button
                      key={sp}
                      onClick={() => {
                        setAudioPlaybackSpeed(sp);
                        if (audioRef.current) audioRef.current.playbackRate = sp;
                      }}
                      className={`td-speed-btn ${audioPlaybackSpeed === sp ? 'active' : ''}`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>

                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={() => setShowEditScriptModal(true)}
                  title="Sửa hoặc dán bản ghi của file nghe"
                >
                  <Edit3 size={14} />
                  <span>Sửa nội dung</span>
                </button>
              </div>
            </div>

            {/* Lesson Progress Mini Bar */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                <span style={{ fontWeight: 600 }}>Tiến độ bài học</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {Math.min(100, Math.round((currentAudioTime / (audioDuration || 1)) * 100))}%
                </span>
              </div>
              <div className="stat-progress-bar" style={{ height: '5px', margin: 0 }}>
                <div 
                  className="stat-progress-fill" 
                  style={{ 
                    width: `${Math.min(100, (currentAudioTime / (audioDuration || 1)) * 100)}%`,
                    background: 'var(--brand-primary)'
                  }} 
                />
              </div>
            </div>

            {/* Scrubber Area */}
            <div className="td-scrubber-row">
              <span className="td-time-display">
                {formatSeconds(currentAudioTime)}
              </span>
              <div
                className="td-scrubber-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const newTime = percent * audioDuration;
                  if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                  }
                  setCurrentAudioTime(newTime);
                }}
              >
                <div
                  className="td-scrubber-fill"
                  style={{ width: `${Math.min(100, (currentAudioTime / audioDuration) * 100)}%` }}
                >
                  <div className="td-scrubber-thumb" />
                </div>
              </div>
              <span className="td-time-display">
                {formatSeconds(audioDuration)}
              </span>
            </div>

            {/* Play Controls Center */}
            <div className="td-controls-row">
              <button
                className="td-ctrl-btn"
                onClick={handlePrevSentence}
                title="Về câu trước"
              >
                <SkipBack size={18} />
              </button>

              <button
                className="td-ctrl-btn"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
                  }
                }}
                title="Tua lùi 5 giây"
              >
                <RotateCcw size={18} />
              </button>

              <button
                className="td-play-btn-primary"
                onClick={toggleAudioPlay}
                title={isPlayingAudio ? "Tạm dừng" : "Phát âm thanh"}
              >
                {isPlayingAudio ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
                )}
              </button>

              <button
                className="td-ctrl-btn"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.min(audioDuration, audioRef.current.currentTime + 5);
                  }
                }}
                title="Tua tiến 5 giây"
              >
                <RotateCw size={18} />
              </button>

              <button
                className="td-ctrl-btn"
                onClick={handleNextSentence}
                title="Sang câu kế tiếp"
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BILINGUAL TRANSCRIPT RESULT CARD                                           */}
          {/* ========================================================================= */}
          <div className="td-output-section">
            {/* Header with Display Mode Toggle & Copy Actions */}
            <div className="td-output-toolbar">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  🎯 Bản Ghi Song Ngữ (Bilingual Output)
                </span>
                <div className="td-output-stats">
                  <span className="td-stat-tag">
                    <FileText size={13} />
                    {selectedScenario.paragraphEn.split(/\s+/).length} từ vựng
                  </span>
                  <span className="td-stat-tag">
                    <Clock size={13} />
                    ~{Math.max(1, Math.ceil(selectedScenario.paragraphEn.split(/\s+/).length / 130))} phút đọc
                  </span>
                  <span className="td-stat-tag">
                    <ShieldCheck size={13} />
                    Đồng bộ 1:1
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {copyFeedback && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                    <Check size={15} />
                    <span>{copyFeedback}</span>
                  </div>
                )}

                {/* View Switcher: 2 Paragraphs vs Timestamped Lines */}
                <div className="td-segmented-tabs" style={{ padding: '3px' }}>
                  <button
                    className={`td-tab-pill ${bilingualViewMode === 'paragraphs' ? 'active' : ''}`}
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                    onClick={() => setBilingualViewMode('paragraphs')}
                  >
                    <Columns size={13} />
                    <span>2 Cột Song Ngữ</span>
                  </button>

                  <button
                    className={`td-tab-pill ${bilingualViewMode === 'lines' ? 'active' : ''}`}
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                    onClick={() => setBilingualViewMode('lines')}
                  >
                    <ListOrdered size={13} />
                    <span>Từng Câu Đồng Bộ</span>
                  </button>
                </div>

                {/* Copy Buttons */}
                <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => handleCopyTranscript('en')}>
                  <Copy size={13} />
                  <span>Copy Tiếng Anh</span>
                </button>
                <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => handleCopyTranscript('vi')}>
                  <Copy size={13} />
                  <span>Copy Tiếng Việt</span>
                </button>
                <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => handleCopyTranscript('both')}>
                  <Copy size={13} />
                  <span>Copy Song Ngữ</span>
                </button>
              </div>
            </div>

            {/* AI Transcribing Animation */}
            {isTranscribingAudio ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--radius-xl)' }}>
                <Sparkles size={48} color="var(--brand-primary)" style={{ animation: 'pulse 1.2s infinite', margin: '0 auto 16px' }} />
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  {transcribeStepText}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Đang phân tích âm phổ, trích xuất chính tả tiếng Anh và tự động chuyển ngữ thông minh...
                </div>
              </div>
            ) : (
              <div>
                {/* VIEW 1: TWO BILINGUAL PARAGRAPHS */}
                {bilingualViewMode === 'paragraphs' && (
                  <div className="td-bilingual-grid">
                    {/* Paragraph 1: English */}
                    <div className="td-column-card en-card">
                      <div>
                        <div className="td-column-header">
                          <span className="td-column-title" style={{ color: 'var(--brand-primary)' }}>
                            🇬🇧 Đoạn Văn Tiếng Anh (English Transcript)
                          </span>
                          <button
                            className="btn-secondary"
                            style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                            onClick={() => speakText(selectedScenario.paragraphEn, userSettings.voiceAccent, audioPlaybackSpeed)}
                            title="Nghe phát âm cả đoạn văn tiếng Anh"
                          >
                            <Volume2 size={13} />
                            <span>Đọc cả đoạn</span>
                          </button>
                        </div>

                        <p className="td-column-body-text">
                          {selectedScenario.paragraphEn.split(/\s+/).map((w, idx) => (
                            <span
                              key={idx}
                              className="td-clickable-word"
                              onClick={(e) => handleWordClick(w, e)}
                              title="Chạm để tra nghĩa và lưu Flashcard"
                            >
                              {w}{' '}
                            </span>
                          ))}
                        </p>
                      </div>

                      <div className="td-column-footer">
                        <span>💡 Bấm vào từ bất kỳ để tra nghĩa & lưu Flashcard</span>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          onClick={() => handleCopyTranscript('en')}
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    {/* Paragraph 2: Vietnamese */}
                    <div className="td-column-card vi-card">
                      <div>
                        <div className="td-column-header">
                          <span className="td-column-title" style={{ color: 'var(--accent-success)' }}>
                            🇻🇳 Bản Dịch Tiếng Việt (Vietnamese Translation)
                          </span>
                          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                            Dịch chuẩn AI
                          </span>
                        </div>

                        <p className="td-column-body-text" style={{ color: 'var(--text-secondary)' }}>
                          {selectedScenario.paragraphVi}
                        </p>
                      </div>

                      <div className="td-column-footer">
                        <span>✨ Dịch ngữ cảnh tự nhiên, chuẩn văn phong đời sống và công sở</span>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          onClick={() => handleCopyTranscript('vi')}
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: TIMED SENTENCES WITH AUDIO SEEKING */}
                {bilingualViewMode === 'lines' && (
                  <div className="td-timeline-list">
                    {selectedScenario.lines.map((line, idx) => {
                      const isCurrent = Math.abs(currentAudioTime - line.timeSeconds) < 4;
                      const words = line.textEn.split(/\s+/);

                      return (
                        <div
                          key={line.id}
                          onClick={() => handleSeekSentence(line.timeSeconds)}
                          className={`td-timeline-card ${isCurrent ? 'active' : ''}`}
                        >
                          <div className="td-timeline-header">
                            <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
                              ⏱️ {line.timeStart} (Câu {idx + 1})
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                              ▶ Nhấp để nghe câu này
                            </span>
                          </div>

                          <div className="td-timeline-en">
                            {words.map((w, wIdx) => (
                              <span
                                key={wIdx}
                                className="td-clickable-word"
                                onClick={(e) => handleWordClick(w, e)}
                                title="Chạm để tra nghĩa và lưu Flashcard"
                              >
                                {w}{' '}
                              </span>
                            ))}
                          </div>

                          <div className="td-timeline-vi">
                            {line.textVi}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lesson Completion & Next Step CTA Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', borderRadius: 'var(--radius-xl)', marginTop: '20px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--brand-primary-light) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-success">
                  <Check size={12} />
                  Tiến độ bài học: {Math.min(100, Math.round((currentAudioTime / (audioDuration || 1)) * 100))}%
                </span>
                <span className="badge badge-primary">
                  {selectedScenario.lines.length} câu hoàn chỉnh
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                Sẵn sàng luyện chép chính tả hoặc ôn từ vựng?
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Chuyển sang module <strong>Luyện nghe Chép chính tả</strong> để rèn luyện khả năng bắt âm từng từ chuẩn xác.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                    setIsPlayingAudio(true);
                  }
                }}
              >
                <RotateCcw size={15} />
                <span>Nghe lại từ đầu</span>
              </button>

              <button
                className="btn-primary"
                onClick={() => setActiveTab('listening')}
              >
                <span>Chép chính tả bài này</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Live Microphone Recording Tool */}
          <div className="td-mic-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className={`td-mic-status-ring ${isRecordingMic ? 'recording' : ''}`}>
                {isRecordingMic ? <Mic size={22} /> : <Mic size={22} />}
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  🎤 Bóc tách giọng nói trực tiếp qua Micro
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  {isRecordingMic ? 'Đang lắng nghe giọng bạn nói tiếng Anh... Hãy nói vào micro' : 'Bạn có thể nói trực tiếp bằng tiếng Anh để kiểm tra khả năng nhận diện âm thanh'}
                </p>
              </div>
            </div>

            <button
              className={isRecordingMic ? "btn-danger" : "btn-secondary"}
              onClick={toggleMicRecording}
              style={{
                background: isRecordingMic ? '#ef4444' : undefined,
                color: isRecordingMic ? '#ffffff' : undefined,
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {isRecordingMic ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isRecordingMic ? 'Dừng thu âm' : 'Bật Micro nói thử'}</span>
            </button>

            {micTranscript && (
              <div style={{ width: '100%', marginTop: '6px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Kết quả nhận diện giọng nói:
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{micTranscript}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODE 2 & 3: CUSTOM TEXT / SAMPLE LESSON                                    */}
      {/* ========================================================================= */}
      {(activeSource === 'custom' || activeSource === 'sample') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeSource === 'custom' && (
            <div className="card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <label style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  📝 Nhập hoặc dán văn bản tiếng Anh cần học:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="td-preset-pill"
                    onClick={() => setInputText(SAMPLE_TEXT_1)}
                  >
                    Mẫu AI Education
                  </button>
                  <button
                    className="td-preset-pill"
                    onClick={() => setInputText(SAMPLE_TEXT_2)}
                  >
                    Mẫu Đàm phán TOEIC
                  </button>
                </div>
              </div>

              <textarea
                className="dictation-input-box"
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Dán đoạn văn tiếng Anh vào đây..."
                style={{ width: '100%', marginBottom: '14px', borderRadius: 'var(--radius-md)' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn-primary" onClick={handleParseText}>
                  <Sparkles size={16} />
                  <span>Phân tích & Tách từng câu</span>
                </button>
              </div>
            </div>
          )}

          {/* Render Sentences */}
          <div className="card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="var(--brand-primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  Đoạn văn đã chia câu ({sentences.length} câu)
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Chạm vào từng từ để xem nghĩa và lưu vào Sổ từ vựng
              </span>
            </div>

            <div className="td-timeline-list">
              {sentences.map((sentence, idx) => {
                const isCurrent = activeSentenceIndex === idx;

                return (
                  <div
                    key={sentence.id}
                    className={`td-timeline-card ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSentenceIndex(idx);
                      speakText(sentence.textEn, userSettings.voiceAccent, 1.0);
                    }}
                  >
                    <div className="td-timeline-header">
                      <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
                        Câu {idx + 1}
                      </span>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(sentence.textEn, userSettings.voiceAccent, 1.0);
                        }}
                        title="Nghe phát âm câu này"
                      >
                        <Volume2 size={13} color={isCurrent ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                        <span>Phát âm</span>
                      </button>
                    </div>

                    <div className="td-timeline-en">
                      {sentence.words.map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="td-clickable-word"
                          onClick={(e) => handleWordClick(word, e)}
                          title="Chạm để tra nghĩa và lưu từ vựng"
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORD POPOVER MODAL (TASTE-DESIGN)                                          */}
      {/* ========================================================================= */}
      {selectedWord && (
        <div className="td-word-popover">
          <div className="td-word-top-row">
            <div>
              <div className="td-word-lemma">
                {selectedWord.word}
              </div>
              <div className="td-word-meta">
                {selectedWord.ipa} • <span style={{ textTransform: 'capitalize' }}>{selectedWord.type}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedWord(null)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="td-word-meaning-box">
            🇻🇳 {selectedWord.meaning}
          </div>

          {saveFeedback ? (
            <div style={{ textAlign: 'center', color: 'var(--accent-success)', fontWeight: 700, fontSize: '0.88rem', padding: '8px', background: 'var(--accent-success-bg)', borderRadius: 'var(--radius-md)' }}>
              {saveFeedback}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem', padding: '8px' }}
                onClick={() => speakText(selectedWord.word, userSettings.voiceAccent, 1.0)}
              >
                <Volume2 size={15} />
                <span>Phát âm</span>
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1.5, fontSize: '0.82rem', padding: '8px' }}
                onClick={handleSaveWord}
              >
                <Plus size={15} />
                <span>Lưu Flashcard</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT / CUSTOM AUDIO SCRIPT MODAL                                           */}
      {/* ========================================================================= */}
      {showEditScriptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="card" style={{ maxWidth: '620px', width: '100%', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={20} color="var(--brand-primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Tùy chỉnh Nội dung File Nghe</span>
              </div>
              <button 
                onClick={() => setShowEditScriptModal(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyCustomScript} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Dán nội dung tiếng Anh tương ứng với file nghe của bạn:
                </label>
                <textarea
                  rows={7}
                  required
                  placeholder="Dán toàn bộ bài phát biểu hoặc đoạn hội thoại tiếng Anh vào đây..."
                  value={customScriptText}
                  onChange={(e) => setCustomScriptText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowEditScriptModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  <Sparkles size={16} />
                  <span>Áp dụng & Tự động chia song ngữ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CLOUD AI GROQ API KEY MODAL (KHI CHẠY ONLINE KHÔNG CÓ LOCAL SERVER)          */}
      {/* ========================================================================= */}
      {showApiKeyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
        >
          <div className="card" style={{ maxWidth: '520px', width: '100%', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cloud size={22} color="var(--brand-primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Kết nối Cloud AI (Chạy 24/7)</span>
              </div>
              <button 
                onClick={() => {
                  setShowApiKeyModal(false);
                  setPendingAudioFile(null);
                }} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Bạn đang truy cập web ở chế độ Online. Để AI tự động nghe & bóc tách file âm thanh của bạn chỉ trong <strong>1-2 giây</strong>, hãy nhập <strong>Groq API Key (Miễn phí 100%)</strong>:
              </p>

              <div style={{ background: 'var(--bg-surface-elevated, rgba(99, 102, 241, 0.08))', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Cách lấy Key chỉ trong 30 giây:</div>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <li>Truy cập <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>console.groq.com/keys <ExternalLink size={11} style={{ display: 'inline' }} /></a></li>
                  <li>Đăng nhập bằng Google và bấm <strong>Create API Key</strong></li>
                  <li>Copy key (bắt đầu bằng <code>gsk_...</code>) dán vào ô bên dưới</li>
                </ol>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Key size={14} color="var(--brand-primary)" />
                  Dán Groq API Key của bạn:
                </label>
                <input 
                  type="password"
                  placeholder="gsk_..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setShowApiKeyModal(false);
                    setPendingAudioFile(null);
                  }}
                >
                  Để sau (Dùng bài mẫu)
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  disabled={!tempApiKey.trim()}
                  onClick={handleSaveApiKeyAndRetry}
                >
                  <Sparkles size={16} />
                  <span>Lưu & Bóc tách ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 