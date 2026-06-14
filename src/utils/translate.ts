export type LanguageCode =
  | 'en'
  | 'id'
  | 'zh'
  | 'ar'
  | 'ko'
  | 'vi'
  | 'th'
  | 'hi'
  | 'de'
  | 'ru'
  | 'es'
  | 'fr'
  | 'pt'
  | 'af';

export const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'ru', label: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
  { code: 'pt', label: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'af', label: 'Afrikaans', flag: '🇿🇦' },
];

export const TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  appName: {
    en: 'World Soccer™',
    id: 'World Soccer™',
    zh: '世界足球™',
    ar: 'كأس العالم لكرة القدم™',
    ko: '월드 사커™',
    vi: 'World Soccer™',
    th: 'เวิลด์ ซอกเกอร์™',
    hi: 'वर्ल्ड सॉकर™',
    de: 'World Soccer™',
    ru: 'Мировой Футбол™',
    es: 'Mundial Fútbol™',
    fr: 'World Soccer™',
    pt: 'World Soccer™',
    af: 'Wêreld Sokker™',
  },
  selectTeam: {
    en: 'SELECT YOUR TEAM',
    id: 'PILIH TIM ANDA',
    zh: '选择你的球队',
    ar: 'اختر فريقك',
    ko: '팀 선택',
    vi: 'CHỌN ĐỘI CỦA BẠN',
    th: 'เลือกทีมของคุณ',
    hi: 'अपनी टीम चुनें',
    de: 'WÄHLEN SIE IHR TEAM',
    ru: 'ВЫБЕРИТЕ КОМАНДУ',
    es: 'SELECCIONA TU EQUIPO',
    fr: 'CHOISISSEZ VOTRE ÉQUIPE',
    pt: 'SELECIONE SUA EQUIPE',
    af: 'KIES JOU SPAN',
  },
  levelEasy: {
    en: 'Easy', id: 'Mudah', zh: '简单', ar: 'سهل', ko: '쉬움', vi: 'Dễ', th: 'ง่าย', hi: 'आसान', de: 'Einfach', ru: 'Легко', es: 'Fácil', fr: 'Facile', pt: 'Fácil', af: 'Maklik'
  },
  levelMedium: {
    en: 'Medium', id: 'Sedang', zh: '中等', ar: 'متوسط', ko: '보통', vi: 'Trung bình', th: 'ปานกลาง', hi: 'मध्यम', de: 'Mittel', ru: 'Средне', es: 'Medio', fr: 'Moyen', pt: 'Médio', af: 'Gemiddeld'
  },
  levelDifficult: {
    en: 'Difficult', id: 'Sulit', zh: '困难', ar: 'صعب', ko: '어려움', vi: 'Khó', th: 'ยาก', hi: 'कठिन', de: 'Schwierig', ru: 'Сложно', es: 'Difícil', fr: 'Difficile', pt: 'Difícil', af: 'Moeilik'
  },
  levelHard: {
    en: 'Hard Difficult', id: 'Sangat Sulit', zh: '极度困难', ar: 'صعب جداً', ko: '매우 어려움', vi: 'Rất Khó', th: 'ยากมาก', hi: 'अत्यधिक कठिन', de: 'Extrem Schwer', ru: 'Очень Сложно', es: 'Extremo', fr: 'Très Difficile', pt: 'Muito Difícil', af: 'Uiters Moeilik'
  },
  guestTitle: {
    en: 'Guest Mode', id: 'Mode Tamu', zh: '访客模式', ar: 'وضع الضيف', ko: '게스트 모드', vi: 'Chế độ khách', th: 'โหมดผู้เยี่ยมชม', hi: 'अतिथि मोड', de: 'Gastmodus', ru: 'Гостевой режим', es: 'Modo Invitado', fr: 'Mode Invité', pt: 'Modo Convidado', af: 'Gaste Modus'
  },
  guestLimitWarning: {
    en: 'Guest limit: 1 game per 24 hours. Sign in to Pi to play unlimited!',
    id: 'Batas Tamu: 1 game per 24 jam. Masuk ke Pi untuk main tanpa batas!',
    zh: '访客限制：24小时内只能玩1场。登录Pi以无限畅玩！',
    ar: 'حد الضيف: مباراة واحدة كل ٢٤ ساعة. سجّل الدخول إلى باى للعب بغير حدود!',
    ko: '게스트 제한: 24시간당 1게임만 가능합니다. 무제한 플레이를 위해 Pi 로그인 해보세요!',
    vi: 'Giới hạn khách: 1 trận trong 24 giờ. Đăng nhập Pi để chơi không giới hạn!',
    th: 'จำกัดสำหรับเกสท์: 1 เกมต่อ 24 ชั่วโมง เข้าสู่ระบบ Pi เพื่อเล่นไม่อั้น!',
    hi: 'अतिथि सीमा: 24 घंटे में 1 गेम। असीमित खेलने के लिए पाई से साइन इन करें!',
    de: 'Gästebeschränkung: 1 Spiel alle 24 Std. Melden Sie sich bei Pi an, um unbegrenzt zu spielen!',
    ru: 'Лимит гостя: 1 матч в 24 часа. Войдите через Pi, чтобы играть без ограничений!',
    es: 'Límite de Invitado: 1 partido por 24 horas. ¡Inicia sesión en Pi para jugar sin límites!',
    fr: 'Limite invité : 1 match par 24h. Connectez-vous à Pi pour jouer en illimité !',
    pt: 'Limite de convidado: 1 partida a cada 24 horas. Entre com Pi para jogar sem limites!',
    af: 'Gastebeperking: 1 wedstryd per 24 uur. Teken in met Pi om onbeperk te speel!',
  },
  upgradePrompt: {
    en: 'Upgrade to Pi User',
    id: 'Tingkatkan ke Pengguna Pi',
    zh: '升级为 Pi 用户',
    ar: 'الترقية لمستخدم Pi',
    ko: 'Pi 회원으로 업그레이드',
    vi: 'Nâng cấp lên thành viên Pi',
    th: 'อัพเกรดเป็นผู้ใช้ Pi',
    hi: 'पाई उपयोगकर्ता में अपग्रेड करें',
    de: 'Auf Pi-Benutzer upgraden',
    ru: 'Стать пользователем Pi',
    es: 'Subir a Usuario Pi',
    fr: 'Devenir utilisateur Pi',
    pt: 'Atualizar para usuário Pi',
    af: 'Gradeer op na Pi-gebruiker',
  },
  signIn: {
    en: 'Sign In', id: 'Masuk', zh: '登录', ar: 'تسجيل الدخول', ko: '로그인', vi: 'Đăng nhập', th: 'เข้าสู่ระบบ', hi: 'साइन इन करें', de: 'Einloggen', ru: 'Войти', es: 'Iniciar Sesión', fr: 'Se Connecter', pt: 'Entrar', af: 'Teken In'
  },
  shopTitle: {
    en: 'PI STORE', id: 'Toko PI', zh: 'PI 商店', ar: 'متجر Pi', ko: 'Pi 상점', vi: 'Cửa hàng Pi', th: 'ร้านค้า Pi', hi: 'पाई स्टोर', de: 'Pi Shop', ru: 'Магазин Pi', es: 'Tienda Pi', fr: 'Boutique Pi', pt: 'Loja Pi', af: 'Pi Winkel'
  },
  lives: {
    en: 'Lives', id: 'Nyawa', zh: '生命值', ar: 'القلوب', ko: '하트', vi: 'Mạng', th: 'หัวใจ', hi: 'जीवन', de: 'Leben', ru: 'Жизни', es: 'Vidas', fr: 'Vies', pt: 'Vidas', af: 'Lewens'
  },
  boosters: {
    en: 'Boosters', id: 'Booster', zh: '助推器', ar: 'المسرعات', ko: '부스터', vi: 'Booster', th: 'บูสเตอร์', hi: 'बूस्टर', de: 'Booster', ru: 'Бустеры', es: 'Potenciadores', fr: 'Boosters', pt: 'Impulsionadores', af: 'Boosters'
  },
  shoesItem: {
    en: 'Power Boot Booster', id: 'Booster Sepatu Bola', zh: '金靴助推器', ar: 'مسرع حذاء القوة', ko: '황금 축구화 부스터', vi: 'Giày sút bóng uy lực', th: 'รองเท้าเพิ่มพลังเตะ', hi: 'पावर बूट बूस्टर', de: 'Schuh-Booster', ru: 'Бустер Бутсы', es: 'Booster Botas de Fútbol', fr: 'Booster Chaussures', pt: 'Impulsionador Chuteira', af: 'Skoen Booster'
  },
  glovesItem: {
    en: 'Gloves Save Booster', id: 'Booster Sarung Tangan', zh: '手套守门助推器', ar: 'مسرع قفازات الحارس', ko: '골키퍼 장갑 부스터', vi: 'Găng tay thủ môn đỉnh cao', th: 'ถุงมือมือเหนียว', hi: 'ग्लव्स सेव बूस्टर', de: 'Handschuh-Booster', ru: 'Бустер Перчатки', es: 'Booster Guantes Goalkeeper', fr: 'Booster Gants Keeper', pt: 'Impulsionador Luvas de Goleiro', af: 'Hanskoene Booster'
  },
  playBtn: {
    en: 'PLAY', id: 'MAIN', zh: '开始游戏', ar: 'لعب', ko: '플레이', vi: 'CHƠI', th: 'เล่น', hi: 'खेलें', de: 'SPIELEN', ru: 'ИГРАТЬ', es: 'JUGAR', fr: 'JOUER', pt: 'JOGAR', af: 'SPEEL'
  },
  leaderboardBtn: {
    en: 'LEADERBOARD', id: 'LEVEL PAPAN SKOR', zh: '排行榜', ar: 'لوحة الصدارة', ko: '리더보드', vi: 'BẢNG XẾP HẠNG', th: 'กระดานผู้นำ', hi: 'लीडरबोर्ड', de: 'BESTENLISTE', ru: 'ТАБЛИЦА', es: 'RANKING', fr: 'CLASSEMENT', pt: 'CLASSIFICAÇÃO', af: 'LEIERBORD'
  },
  chatBtn: {
    en: 'CHATROOM', id: 'FOTUM OBROLAN', zh: '聊天室', ar: 'غرفة الدردشة', ko: '채팅방', vi: 'PHÒNG CHÁT', th: 'ห้องแชท', hi: 'चैट रूम', de: 'CHATROOM', ru: 'ЧАТ', es: 'FORO CHAT', fr: 'CHAT', pt: 'CHAT', af: 'KLETSKAMER'
  },
  versus: {
    en: 'VS', id: 'Lawan', zh: '对战', ar: 'ضد', ko: '대', vi: 'VS', th: 'ปะทะ', hi: 'बनाम', de: 'VS', ru: 'ПРОТИВ', es: 'VS', fr: 'VS', pt: 'VS', af: 'TEEN'
  },
  whistleWait: {
    en: 'Preparing shot... Whistle triggers in 3s!',
    id: 'Bersiap-siap menendang... Peluit berbunyi dalam 3s!',
    zh: '准备射门... 3秒后鸣哨！',
    ar: 'الاستعداد للتسديد... يطلق الحكم الصفارة خلال ٣ ثوانٍ!',
    ko: '슛 준비 중... 3초 후 휘슬 소리!',
    vi: 'Chuẩn bị sút... Còi sẽ thổi sau 3 giây!',
    th: 'เตรียมเตะ... เป่านกหวีดใน 3 วินาที!',
    hi: 'शॉट तैयार किया जा रहा है... 3 सेकंड में सीटी बजेगी!',
    de: 'Schuss wird vorbereitet... Anpfiff in 3 Sekunden!',
    ru: 'Подготовка к удару... Свисток через 3 секунды!',
    es: 'Preparando tiro... ¡Silbato en 3 segundos!',
    fr: 'Préparation du tir... Coup de sifflet dans 3 s !',
    pt: 'Preparando chute... Apito em 3 segundos!',
    af: 'Berei skoot voor... Fluitjie blaas oor 3 sekondes!',
  },
  swipeToKick: {
    en: 'SWIPE left, right, or up to KICK!',
    id: 'GESER (SWIPE) kiri, kanan, atau atas untuk MENENDANG!',
    zh: '左右或向上滑动射门！',
    ar: 'اسحب لليسار أو اليمين أو لأعلى للتسديد!',
    ko: '왼쪽, 오른쪽 또는 위쪽으로 드래그하여 슛하세요!',
    vi: 'VUỐT sang trái, phải hoặc lên trên để SÚT BÓNG!',
    th: 'ปัดซ้าย ขวา หรือขึ้น เพื่อเตะบอล!',
    hi: 'किक मारने के लिए बाएं, दाएं या ऊपर स्वाइप करें!',
    de: 'WISCHEN Sie nach links, rechts oder oben, um zu SCHIESSEN!',
    ru: 'ПРОВЕДИТЕ влево, вправо или вверх для УДАРА!',
    es: '¡DESLIZA a la izquierda, derecha o arriba para PATEAR!',
    fr: 'GLISSEZ vers la gauche, la droite ou le haut pour TIRER !',
    pt: 'DESLIZE para a esquerda, direita ou acima para CHUTAR!',
    af: 'SWIPE links, regs of op om te SKOP!',
  },
  swipeToSave: {
    en: 'SWIPE left or right to SAVE!',
    id: 'GESER (SWIPE) kiri atau kanan untuk MENANGKAP BOLA!',
    zh: '左右滑动扑球！',
    ar: 'اسحب لليسار أو اليمين للتصدي!',
    ko: '왼쪽이나 오른쪽으로 움직여 공을 막으세요!',
    vi: 'VUỐT sang trái hoặc phải để THỦ MÔN CẢN PHÁ!',
    th: 'ปัดซ้ายหรือขวาเพื่อรับลูก!',
    hi: 'बचाने के लिए बाएं या दाएं स्वाइप करें!',
    de: 'WISCHEN Sie nach links oder rechts, um zu HALTEN!',
    ru: 'ПРОВЕДИТЕ влево или вправо для СЕЙВА!',
    es: '¡DESLIZA a la izquierda o derecha para ATRAJAR!',
    fr: 'GLISSEZ vers la gauche ou la droite pour ARRÊTER !',
    pt: 'DESLIZE para a esquerda ou direita para DEFENDER!',
    af: 'SWIPE links of regs om te KEER!',
  },
  goal: {
    en: 'GOAL!', id: 'GOL!', zh: '进球！', ar: 'هدف!', ko: '골인!', vi: 'VÀO!', th: 'เข้าประตู!', hi: 'गोल!', de: 'TOOR!', ru: 'ГОЛ!', es: '¡GOL!', fr: 'BUT !', pt: 'GOL!', af: 'DOEL!'
  },
  saved: {
    en: 'SAVED!', id: 'DISELAMATKAN!', zh: '被扑！', ar: 'تصدي رائع!', ko: '선방!', vi: 'CẢN PHÁ THÀNH CÔNG!', th: 'เซฟได้!', hi: 'बचा लिया!', de: 'GEHALTEN!', ru: 'СЕЙВ!', es: '¡ATRAPADO!', fr: 'ARRÊTÉ !', pt: 'DEFENDEU!', af: 'GEKEER!'
  },
  missed: {
    en: 'MISSED!', id: 'GAGAL / MELENCENG!', zh: '打偏！', ar: 'ضاعت خارج المرمى!', ko: '빗나감!', vi: 'SÚT TRƯỢT!', th: 'พลาดเป้า!', hi: 'मिस!', de: 'VORBEI!', ru: 'МИМО!', es: '¡FUERA!', fr: 'RATE !', pt: 'PARA FORA!', af: 'MIS!'
  },
  timeExpired: {
    en: 'Timer expired! Automatic kick triggered.',
    id: 'Waktu habis! Tendangan otomatis dipicu.',
    zh: '时间到！触发自动射门。',
    ar: 'انتهى الوقت! تم التسديد تلقائياً.',
    ko: '시간 초과! 자동 슛이 실행되었습니다.',
    vi: 'Hết giờ! Sút tự động được kích hoạt.',
    th: 'หมดเวลา! เตะอัตโนมัติทำงาน',
    hi: 'समय समाप्त! स्वचालित किक सक्रिय हुई।',
    de: 'Zeit abgelaufen! Automatischer Schuss.',
    ru: 'Время вышло! Автоматический удар.',
    es: '¡Tiempo agotado! Tiro automático activado.',
    fr: 'Temps écoulé ! Tir automatique.',
    pt: 'Tempo esgotado! Chute automático ativado.',
    af: 'Tyd verstreke! Outomatiese skop geaktiveer.',
  },
  matchResultWon: {
    en: 'VICTORY!', id: 'KEMENANGAN!', zh: '胜利！', ar: 'فوز ساحق!', ko: '승리!', vi: 'CHIẾN THẮNG!', th: 'ชัยชนะ!', hi: 'विजय!', de: 'SIEG!', ru: 'ПОБЕДА!', es: '¡VICTORIA!', fr: 'VICTOIRE !', pt: 'VITÓRIA!', af: 'OORWINNING!'
  },
  matchResultLost: {
    en: 'DEFEAT!', id: 'KEKALAHAN!', zh: '失败！', ar: 'هزيمة!', ko: '패배!', vi: 'THẤT BẠI!', th: 'พ่ายแพ้!', hi: 'हार!', de: 'NIEDERLAGE!', ru: 'ПОРАЖЕНИЕ!', es: '¡DERROTA!', fr: 'DÉFAITE !', pt: 'DERROTA!', af: 'ALEXANDER!'
  },
  ratingTitle: {
    en: 'Achievements Rated',
    id: 'Penghargaan Diperoleh',
    zh: '获得成就',
    ar: 'الجوائز المحصلة',
    ko: '달성 업적 평가',
    vi: 'Thành tích đạt được',
    th: 'รางวัลที่ได้รับ',
    hi: 'उपलब्धियां प्राप्त कीं',
    de: 'Erfolge erzielt',
    ru: 'Рейтинг достижений',
    es: 'Logros Valorados',
    fr: 'Succès obtenus',
    pt: 'Conquistas obtidas',
    af: 'Prestasies Behaal',
  },
  offlineMode: {
    en: 'Offline Mode (Auto-Syncing later)',
    id: 'Mode Offline (Sinkronisasi Otomatis Nanti)',
    zh: '离线模式（稍后自同步）',
    ar: 'وضع عدم الاتصال (المزامنة لاحقاً)',
    ko: '오프라인 모드 (추후 자동 동기화)',
    vi: 'Chế độ ngoại tuyến (Tự đồng bộ sau)',
    th: 'โหมดออฟไลน์ (จะซิงค์ใหม่อัตโนมัติ)',
    hi: 'ऑफ़लाइन मोड (बाद में ऑटो-सिंक)',
    de: 'Offline-Modus (Später automatische Synchronisierung)',
    ru: 'Офлайн-режим (Автосинхронизация позже)',
    es: 'Modo Offline (Auto-Sincronización luego)',
    fr: 'Mode hors ligne (synchro auto plus tard)',
    pt: 'Modo Offline (Auto-sincronização posterior)',
    af: 'Vanlyn modus (Sinkroniseer later outomaties)',
  },
  reconnecting: {
    en: 'Reconnecting to game cloud sync...',
    id: 'Menghubungkan kembali ke sinkronisasi awan...',
    zh: '正在重连到游戏云同步...',
    ar: 'إعادة الاتصال بمزامنة السحاب لمجتمع اللعبة...',
    ko: '클라우드 동기화 재접속 중...',
    vi: 'Đang kết nối lại với dịch vụ đồng bộ đám mây...',
    th: 'กำลังเชื่อมต่อระบบซิงค์คลาวด์...',
    hi: 'क्लाउड सिंक से पुनः कनेक्ट किया जा रहा है...',
    de: 'Verbindung zur Cloud-Synchronisierung wird wiederhergestellt...',
    ru: 'Повторное подключение к облачной синхронизации...',
    es: 'Reconectando a la sincronización en la nube...',
    fr: 'Reconnexion à la synchro cloud...',
    pt: 'Reconectando à sincronização em nuvem...',
    af: 'Koppel weer aan wolk-sinkronisering...',
  },
};

export function translate(key: string, lang: LanguageCode): string {
  const dict = TRANSLATIONS[key];
  if (!dict) return key;
  return dict[lang] || dict['en'] || key;
}
