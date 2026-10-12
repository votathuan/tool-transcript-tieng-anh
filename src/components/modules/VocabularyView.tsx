import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/speech';
import { lookupWordInfo } from '../../utils/sentenceSplitter';
import { parseWebVocabList } from '../../utils/vocabParser';
import { EXTERNAL_WORD_PACKS } from '../../data/externalWordPacks';
import { 
  Search, 
  Volume2, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  X, 
  BookOpen, 
  Sparkles, 
  Download, 
  Globe, 
  ClipboardPaste,
  Check
} from 'lucide-react';

export const VocabularyView: React.FC = () => {
  const { 
    vocabList, 
    addWord, 
    addWordsBulk, 
    deleteWord, 
    updateWordStatus, 
    userSettings, 
    searchFilter, 
    setSearchFilter 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState(searchFilter);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'toeic' | 'ielts'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState<'single' | 'bulk' | 'packs'>('single');
  
  // Single word form state
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newType, setNewType] = useState('noun');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState<'basic' | 'toeic' | 'ielts'>('toeic');
  const [isFetchingOnline, setIsFetchingOnline] = useState(false);
  const [onlineFetchMsg, setOnlineFetchMsg] = useState<string | null>(null);

  // Bulk paste state
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState<'basic' | 'toeic' | 'ielts'>('toeic');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  // Pack import feedback state
  const [packSuccessId, setPackSuccessId] = useState<string | null>(null);

  // Sync with global header search if set
  useEffect(() => {
    if (searchFilter) {
      setSearchTerm(searchFilter);
    }
  }, [searchFilter]);

  // Counts by category
  const basicCount = vocabList.filter(w => w.category === 'basic' || (w.topic && (w.topic.toLowerCase().includes('cơ bản') || w.topic.toLowerCase().includes('đời sống')))).length;
  const toeicCount = vocabList.filter(w => w.category === 'toeic' || w.toeicLevel || (w.topic && (w.topic.toLowerCase().includes('office') || w.topic.toLowerCase().includes('contract') || w.topic.toLowerCase().includes('finance')))).length;
  const ieltsCount = vocabList.filter(w => w.category === 'ielts' || (w.topic && (w.topic.toLowerCase().includes('ielts') || w.topic.toLowerCase().includes('học thuật')))).length;

  const filteredList = vocabList.filter(item => {
    const wordStr = item.word || '';
    const viStr = item.vietnamese || item.definitionEn || '';
    const matchesSearch = wordStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          viStr.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory === 'basic') {
      matchesCategory = item.category === 'basic' || Boolean(item.topic && (item.topic.toLowerCase().includes('cơ bản') || item.topic.toLowerCase().includes('đời sống')));
    } else if (selectedCategory === 'toeic') {
      matchesCategory = item.category === 'toeic' || (!item.category && !(item.topic && item.topic.toLowerCase().includes('ielts')));
    } else if (selectedCategory === 'ielts') {
      matchesCategory = item.category === 'ielts' || Boolean(item.topic && item.topic.toLowerCase().includes('ielts'));
    }

    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handlePlayAudio = (word: string) => {
    speakText(word, userSettings.voiceAccent, 0.95);
  };

  const handleToggleMastered = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'mastered' ? 'learning' : 'mastered';
    updateWordStatus(id, nextStatus);
  };

  const handleDelete = (id: string, word: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa từ "${word}" khỏi Sổ từ vựng?`)) {
      deleteWord(id);
    }
  };

  // Online Dictionary Lookup (Free Dictionary API + Fallback)
  const handleFetchOnline = async () => {
    const clean = newWord.trim().toLowerCase();
    if (!clean) return;

    setIsFetchingOnline(true);
    setOnlineFetchMsg(null);

    try {
      // 1. Check local DB first for instant response
      const local = lookupWordInfo(clean);
      if (local && local.meaning && !local.meaning.includes('nhấn để lưu')) {
        setNewIpa(local.ipa);
        setNewType(local.type);
        setNewMeaning(local.meaning);
        setOnlineFetchMsg('⚡ Đã tìm thấy thông tin từ điển!');
        setIsFetchingOnline(false);
        return;
      }

      // 2. Fetch from Free Dictionary API
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          const entry = data[0];
          const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || `/${clean}/`;
          const firstMeaning = entry.meanings?.[0];
          const partOfSpeech = firstMeaning?.partOfSpeech || 'word';
          const def = firstMeaning?.definitions?.[0]?.definition || '';
          const ex = firstMeaning?.definitions?.[0]?.example || '';

          setNewIpa(phonetic);
          setNewType(partOfSpeech);
          if (!newMeaning) {
            setNewMeaning(local?.meaning || def || clean);
          }
          if (ex && !newExample) {
            setNewExample(ex);
          }
          setOnlineFetchMsg('✅ Đã tải thông tin từ điển online thành công!');
        }
      } else {
        // Fallback info
        const fallback = lookupWordInfo(clean);
        setNewIpa(fallback?.ipa || `/${clean}/`);
        setOnlineFetchMsg('ℹ️ Đã khởi tạo cấu trúc phiên âm.');
      }
    } catch {
      const fallback = lookupWordInfo(clean);
      setNewIpa(fallback?.ipa || `/${clean}/`);
      setOnlineFetchMsg('ℹ️ Đã tự động tạo phiên âm.');
    } finally {
      setIsFetchingOnline(false);
    }
  };

  // Submit single word
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    addWord({
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      ipa: newIpa.trim() || `/${newWord.trim().toLowerCase()}/`,
      type: newType,
      example: newExample.trim() || `Example using "${newWord.trim()}".`,
      category: newCategory,
      topic: newCategory === 'basic' ? 'Từ vựng Cơ bản' : newCategory === 'ielts' ? 'Từ vựng IELTS' : 'Từ vựng TOEIC',
    });

    // Reset and close
    setNewWord('');
    setNewMeaning('');
    setNewIpa('');
    setNewExample('');
    setShowAddModal(false);
  };

  // Submit bulk words using intelligent web parser
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const parsedList = parseWebVocabList(bulkText);
    if (parsedList.length === 0) {
      alert('Không nhận diện được từ vựng nào trong văn bản. Vui lòng kiểm tra lại định dạng!');
      return;
    }

    const parsedWords = parsedList.map(item => ({
      word: item.word,
      meaning: item.meaning,
      ipa: item.ipa,
      category: bulkCategory,
      topic: bulkCategory === 'basic' ? 'Từ vựng Cơ bản' : bulkCategory === 'ielts' ? 'Từ vựng IELTS' : 'Từ vựng TOEIC',
    }));

    const addedCount = addWordsBulk(parsedWords);
    setBulkSuccessMsg(`🎉 Đã nhận diện và nhập thành công ${addedCount} từ vựng mới vào Sổ!`);
    setBulkText('');

    setTimeout(() => {
      setBulkSuccessMsg(null);
      setShowAddModal(false);
    }, 1800);
  };

  // Import curated word pack
  const handleImportPack = (pack: typeof EXTERNAL_WORD_PACKS[0]) => {
    const formattedWords = pack.words.map(w => ({
      word: w.word,
      meaning: w.vietnamese,
      ipa: w.ipa,
      type: w.type,
      topic: w.topic,
      example: w.exampleEn,
      category: w.category,
    }));
    addWordsBulk(formattedWords);
    setPackSuccessId(pack.id);
    setTimeout(() => {
      setPackSuccessId(null);
    }, 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            📚 Sổ từ vựng & Phân loại học tập
          </h1>
          <p className="section-subtitle">
            Hỗ trợ phân loại Từ vựng Cơ bản, TOEIC, IELTS; nhập từ bên ngoài hoặc tải các bộ từ vựng chọn lọc
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Thêm từ từ bên ngoài</span>
          </button>
        </div>
      </div>

      {/* 3 Main Category Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <button
          className="card"
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '14px 18px',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: selectedCategory === 'all' ? 'var(--brand-primary)' : undefined,
            background: selectedCategory === 'all' ? 'var(--brand-primary-light)' : undefined,
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tất cả kho từ</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {vocabList.length} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>từ</span>
          </div>
        </button>

        <button
          className="card"
          onClick={() => setSelectedCategory('basic')}
          style={{
            padding: '14px 18px',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: selectedCategory === 'basic' ? 'var(--accent-success)' : undefined,
            background: selectedCategory === 'basic' ? 'var(--accent-success-bg)' : undefined,
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-success)', fontWeight: 700 }}>🟢 Từ vựng Cơ bản</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {basicCount} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>từ</span>
          </div>
        </button>

        <button
          className="card"
          onClick={() => setSelectedCategory('toeic')}
          style={{
            padding: '14px 18px',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: selectedCategory === 'toeic' ? 'var(--accent-info)' : undefined,
            background: selectedCategory === 'toeic' ? 'var(--accent-info-bg)' : undefined,
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-info)', fontWeight: 700 }}>🔵 Từ vựng TOEIC</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {toeicCount} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>từ</span>
          </div>
        </button>

        <button
          className="card"
          onClick={() => setSelectedCategory('ielts')}
          style={{
            padding: '14px 18px',
            textAlign: 'left',
            cursor: 'pointer',
            borderColor: selectedCategory === 'ielts' ? 'var(--accent-purple)' : undefined,
            background: selectedCategory === 'ielts' ? 'var(--accent-purple-bg)' : undefined,
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', fontWeight: 700 }}>🟣 Từ vựng IELTS</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {ieltsCount} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>từ</span>
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search box */}
          <div className="search-box" style={{ maxWidth: '360px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Tìm kiếm từ tiếng Anh hoặc tiếng Việt..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchFilter(e.target.value);
              }}
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSearchFilter(''); }} style={{ color: 'var(--text-muted)' }}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'new', 'learning', 'mastered'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: selectedStatus === st ? 'var(--brand-primary-light)' : undefined,
                  borderColor: selectedStatus === st ? 'var(--brand-primary)' : undefined,
                  color: selectedStatus === st ? 'var(--brand-primary)' : undefined,
                }}
              >
                {st === 'all' && 'Tất cả'}
                {st === 'new' && 'Mới lưu'}
                {st === 'learning' && 'Đang học'}
                {st === 'mastered' && 'Đã thuộc'}
              </button>
            ))}
          </div>

          <span className="badge badge-purple" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Hiển thị: {filteredList.length} / {vocabList.length} từ
          </span>
        </div>
      </div>

      {/* Words Grid */}
      {filteredList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <BookOpen size={48} color="var(--brand-primary)" style={{ opacity: 0.4, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Chưa có từ vựng nào trong mục này</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px' }}>
            Bạn có thể thêm từ vựng mới hoặc nhấn vào nút bên dưới để tải các gói từ vựng có sẵn (Cơ bản, TOEIC, IELTS)!
          </p>
          <button className="btn-primary" onClick={() => { setShowAddModal(true); setModalTab('packs'); }}>
            <Download size={16} />
            <span>Mở kho tải Gói từ vựng có sẵn</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredList.map((w) => {
            const isBasic = w.category === 'basic' || w.topic?.toLowerCase().includes('cơ bản');
            const isIelts = w.category === 'ielts' || w.topic?.toLowerCase().includes('ielts');

            return (
              <div 
                key={w.id} 
                className="card card-interactive" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderLeft: isBasic 
                    ? '4px solid var(--accent-success)' 
                    : isIelts 
                    ? '4px solid var(--accent-purple)' 
                    : '4px solid var(--brand-primary)'
                }}
              >
                <div>
                  {/* Header of Word Card */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                          {w.word}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          ({w.type})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {w.ipa}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {/* Audio pronunciation */}
                      <button 
                        className="icon-btn" 
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handlePlayAudio(w.word)}
                        title="Phát âm từ vựng"
                      >
                        <Volume2 size={16} color="var(--brand-primary)" />
                      </button>

                      {/* Mastered toggle */}
                      <button 
                        className="icon-btn"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handleToggleMastered(w.id, w.status)}
                        title={w.status === 'mastered' ? "Đã thuộc (chạm để chuyển lại Đang học)" : "Đánh dấu Đã thuộc"}
                      >
                        <CheckCircle2 size={16} color={w.status === 'mastered' ? 'var(--accent-success)' : 'var(--text-muted)'} />
                      </button>

                      {/* Delete button */}
                      <button 
                        className="icon-btn"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handleDelete(w.id, w.word)}
                        title="Xóa từ khỏi Sổ"
                      >
                        <Trash2 size={16} color="var(--accent-danger)" />
                      </button>
                    </div>
                  </div>

                  {/* Vietnamese meaning */}
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {w.vietnamese}
                  </div>

                  {/* Example sentence */}
                  {w.exampleEn && (
                    <div style={{ background: 'var(--bg-surface-hover)', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: '12px', fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                        "{w.exampleEn}"
                      </div>
                      {w.exampleVi && (
                        <div style={{ color: 'var(--text-muted)' }}>
                          {w.exampleVi}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <span className={`badge ${isBasic ? 'badge-success' : isIelts ? 'badge-purple' : 'badge-info'}`} style={{ fontSize: '0.72rem' }}>
                    {isBasic ? 'Cơ bản' : isIelts ? 'IELTS' : 'TOEIC'} • {w.topic}
                  </span>

                  <span 
                    className={`badge ${w.status === 'mastered' ? 'badge-success' : w.status === 'learning' ? 'badge-warning' : 'badge-info'}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {w.status === 'mastered' ? 'Đã thuộc' : w.status === 'learning' ? 'Đang học' : 'Mới lưu'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Advanced Add / Import Word Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div className="card" style={{ maxWidth: '640px', width: '100%', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)', animation: 'slideUp 0.25s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--brand-primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Thêm từ vựng từ bên ngoài</span>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* 3 Tabs inside Modal */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                className="btn-secondary"
                onClick={() => setModalTab('single')}
                style={{
                  flex: 1,
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  background: modalTab === 'single' ? 'var(--brand-primary-light)' : undefined,
                  borderColor: modalTab === 'single' ? 'var(--brand-primary)' : undefined,
                  color: modalTab === 'single' ? 'var(--brand-primary)' : undefined,
                  fontWeight: modalTab === 'single' ? 700 : 500,
                }}
              >
                <Globe size={15} />
                <span>Thêm 1 từ (Tra Online)</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => setModalTab('bulk')}
                style={{
                  flex: 1,
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  background: modalTab === 'bulk' ? 'var(--brand-primary-light)' : undefined,
                  borderColor: modalTab === 'bulk' ? 'var(--brand-primary)' : undefined,
                  color: modalTab === 'bulk' ? 'var(--brand-primary)' : undefined,
                  fontWeight: modalTab === 'bulk' ? 700 : 500,
                }}
              >
                <ClipboardPaste size={15} />
                <span>Nhập danh sách hàng loạt</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => setModalTab('packs')}
                style={{
                  flex: 1,
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  background: modalTab === 'packs' ? 'var(--brand-primary-light)' : undefined,
                  borderColor: modalTab === 'packs' ? 'var(--brand-primary)' : undefined,
                  color: modalTab === 'packs' ? 'var(--brand-primary)' : undefined,
                  fontWeight: modalTab === 'packs' ? 700 : 500,
                }}
              >
                <Download size={15} />
                <span>Gói từ có sẵn</span>
              </button>
            </div>

            {/* TAB 1: Single Word with Auto-fetch */}
            {modalTab === 'single' && (
              <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Phân loại từ vựng:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setNewCategory('basic')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: `2px solid ${newCategory === 'basic' ? 'var(--accent-success)' : 'var(--border-color)'}`,
                        background: newCategory === 'basic' ? 'var(--accent-success-bg)' : 'var(--bg-surface)',
                        color: newCategory === 'basic' ? 'var(--accent-success)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      🟢 Từ vựng Cơ bản
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewCategory('toeic')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: `2px solid ${newCategory === 'toeic' ? 'var(--accent-info)' : 'var(--border-color)'}`,
                        background: newCategory === 'toeic' ? 'var(--accent-info-bg)' : 'var(--bg-surface)',
                        color: newCategory === 'toeic' ? 'var(--accent-info)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      🔵 Từ vựng TOEIC
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewCategory('ielts')}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: `2px solid ${newCategory === 'ielts' ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                        background: newCategory === 'ielts' ? 'var(--accent-purple-bg)' : 'var(--bg-surface)',
                        color: newCategory === 'ielts' ? 'var(--accent-purple)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      🟣 Từ vựng IELTS
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Từ tiếng Anh (*):
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: ubiquitous, sustainable, terminate..."
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '0.95rem',
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleFetchOnline}
                      disabled={isFetchingOnline || !newWord.trim()}
                      style={{ padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                    >
                      <Globe size={15} />
                      <span>{isFetchingOnline ? 'Đang tra...' : 'Tra từ điển online'}</span>
                    </button>
                  </div>
                  {onlineFetchMsg && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', marginTop: '4px', fontWeight: 600 }}>
                      {onlineFetchMsg}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Nghĩa tiếng Việt (*):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: phổ biến rộng rãi, bền vững, chấm dứt..."
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                      Phiên âm IPA:
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: /juːˈbɪkwɪtəs/"
                      value={newIpa}
                      onChange={(e) => setNewIpa(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                      Từ loại:
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    >
                      <option value="noun">Danh từ (noun)</option>
                      <option value="verb">Động từ (verb)</option>
                      <option value="adj">Tính từ (adjective)</option>
                      <option value="adv">Trạng từ (adverb)</option>
                      <option value="phrase">Cụm từ (phrase)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Câu ví dụ tiếng Anh (tùy chọn):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Smartphones have become ubiquitous in daily life."
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    <Plus size={16} />
                    <span>Lưu từ vào Sổ & Flashcard</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Bulk Paste List */}
            {modalTab === 'bulk' && (
              <form onSubmit={handleBulkSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Chọn phân loại cho danh sách từ này:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setBulkCategory('basic')}
                      className={`badge ${bulkCategory === 'basic' ? 'badge-success' : 'badge-info'}`}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      🟢 Từ vựng Cơ bản
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkCategory('toeic')}
                      className={`badge ${bulkCategory === 'toeic' ? 'badge-primary' : 'badge-info'}`}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      🔵 Từ vựng TOEIC
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkCategory('ielts')}
                      className={`badge ${bulkCategory === 'ielts' ? 'badge-purple' : 'badge-info'}`}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      🟣 Từ vựng IELTS
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      Dán danh sách từ vựng (mỗi từ một dòng):
                    </label>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                      onClick={() => {
                        setBulkText(`• Accountant /ə'kaʊnt.ənt/: Kế toán\n• Artist /'ɑː.tɪst/: Nghệ sĩ\n• Banker /'bæŋ.kər/: Nhân viên ngân hàng\n• Builder /'bɪl.dər/: Thợ xây\n• Cleaner /'kliː.nər/: Người dọn dẹp\n• Designer /dɪ'zaɪ.nər/: Nhà thiết kế\n• Doctor /'dɒk.tər/: Bác sĩ\n• Driver /'draɪ.vər/: Tài xế\n• Engineer /ˌen.dʒɪ'nɪər/: Kỹ sư\n• Hairdresser /'heərˌdres.ər/: Thợ làm tóc\n• Lawyer /'lɔɪ.ər/: Luật sư\n• Librarian /laɪ'brer.i.ən/: Thủ thư\n• Nurse /nɜːs/: Y tá`);
                      }}
                    >
                      📋 Dán mẫu Wall Street English (như trong ảnh)
                    </button>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    💡 Hệ thống tự động bóc tách từ các trang web: <code>• Word /IPA/: Nghĩa</code>, <code>- Word: Nghĩa</code>, hoặc <code>Word - Nghĩa</code>.
                  </div>

                  <textarea
                    rows={7}
                    required
                    placeholder={`• Accountant /ə'kaʊnt.ənt/: Kế toán\n• Artist /'ɑː.tɪst/: Nghệ sĩ\n• Doctor /'dɒk.tər/: Bác sĩ`}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />

                  {/* Live Parsed Preview */}
                  {bulkText.trim() && (() => {
                    const parsed = parseWebVocabList(bulkText);
                    return (
                      <div style={{ marginTop: '10px', padding: '12px', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--brand-primary)' }}>
                            ✨ Đã nhận diện được: {parsed.length} từ vựng
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Xem trước dữ liệu bóc tách</span>
                        </div>

                        <div style={{ maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {parsed.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-surface)', fontSize: '0.8rem' }}>
                              <div>
                                <strong style={{ color: 'var(--brand-primary)' }}>{item.word}</strong>
                                <span style={{ color: 'var(--text-muted)', marginLeft: '6px', fontStyle: 'italic', fontSize: '0.75rem' }}>{item.ipa}</span>
                              </div>
                              <div style={{ color: 'var(--text-secondary)' }}>
                                {item.meaning}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {bulkSuccessMsg && (
                  <div style={{ padding: '10px 14px', background: 'var(--accent-success-bg)', color: 'var(--accent-success)', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
                    {bulkSuccessMsg}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={!bulkText.trim()}>
                    <ClipboardPaste size={16} />
                    <span>⚡ Nhập toàn bộ vào Sổ từ vựng</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: Curated Word Packs */}
            {modalTab === 'packs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Chọn bộ từ vựng chuẩn hóa có sẵn từ bên ngoài để nạp nhanh vào Sổ từ vựng và luyện tập Flashcard:
                </p>

                {EXTERNAL_WORD_PACKS.map(pack => {
                  const isImported = packSuccessId === pack.id;
                  return (
                    <div
                      key={pack.id}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        background: 'var(--bg-surface-elevated)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className={`badge ${pack.badgeColor}`} style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                            {pack.level}
                          </span>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                            {pack.name}
                          </div>
                        </div>

                        <button
                          className="btn-primary"
                          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                          onClick={() => handleImportPack(pack)}
                        >
                          {isImported ? (
                            <>
                              <Check size={15} />
                              <span>Đã nạp thành công!</span>
                            </>
                          ) : (
                            <>
                              <Download size={15} />
                              <span>Tải gói (+{pack.words.length} từ)</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {pack.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {pack.words.map((w, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--bg-surface-hover)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {w.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
