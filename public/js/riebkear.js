// --- 1. UTILS (Khmer Date & Number to Text) ---
const toKhmerNum = (num) =>
  num
    .toString()
    .replace(
      /[0-9]/g,
      (d) => ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"][d]
    );
const khmerMonths = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

const formatKhmerDate = (timestamp, isMobile = false) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const day = toKhmerNum(date.getDate().toString().padStart(2, "0"));
  const month = khmerMonths[date.getMonth()];
  const fullYear = toKhmerNum(date.getFullYear());
  const shortYear = toKhmerNum(date.getFullYear().toString().slice(-2));
  let hours = date.getHours();
  const minutes = toKhmerNum(date.getMinutes().toString().padStart(2, "0"));
  let suffix = "ព្រឹក";
  if (hours >= 12) {
    suffix = hours >= 18 ? "យប់" : "រសៀល";
    if (hours > 12) hours -= 12;
  } else if (hours === 0) {
    hours = 12;
    suffix = "យប់";
  } else if (hours < 5) {
    suffix = "ទាបភ្លឺ";
  }
  const khmerHour = toKhmerNum(hours);
  return isMobile
    ? `${day}-${month}-${shortYear} | ${khmerHour}ៈ${minutes}${suffix}`
    : `${day}-${month}-${fullYear} | ${khmerHour}ៈ${minutes}នាទី${suffix}`;
};

const convertMoneyToKhmerText = (amount) => {
  if (!amount || isNaN(amount)) return "";
  const num = parseInt(amount);
  if (num === 0) return "សូន្យ";
  const digits = [
    "", "មួយ", "ពីរ", "បី", "បួន", "ប្រាំ", "ប្រាំមួយ", "ប្រាំពីរ", "ប្រាំបី", "ប្រាំបួន",
  ];
  let result = "";
  if (num >= 1000000) {
    let millions = Math.floor(num / 1000000);
    let remainder = num % 1000000;
    result += convertMoneyToKhmerText(millions) + "លាន";
    if (remainder > 0) result += " " + convertMoneyToKhmerText(remainder);
    return result;
  }
  const readGroup = (n) => {
    if (n === 0) return "";
    if (n < 10) return digits[n];
    if (n < 20) return "ដប់" + digits[n % 10];
    if (n < 100) {
      let tens = Math.floor(n / 10);
      let unit = n % 10;
      return (tens === 2 ? "ម្ភៃ" : digits[tens] + "សិប") + digits[unit];
    }
    if (n < 1000)
      return digits[Math.floor(n / 100)] + "រយ" + readGroup(n % 100);
    if (n < 10000)
      return digits[Math.floor(n / 1000)] + "ពាន់" + readGroup(n % 1000);
    if (n < 100000)
      return digits[Math.floor(n / 10000)] + "ម៉ឺន" + readGroup(n % 10000);
    if (n < 1000000)
      return digits[Math.floor(n / 100000)] + "សែន" + readGroup(n % 100000);
  };
  return readGroup(num);
};

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyBjbRQBlCq41KcxI_R-iZmo-sX3hUL6E5M",
  authDomain: "reabka-7d971.firebaseapp.com",
  databaseURL: "https://reabka-7d971-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reabka-7d971",
  storageBucket: "reabka-7d971.firebasestorage.app",
  messagingSenderId: "729240906282",
  appId: "1:729240906282:web:0c0b0f2124dbff55283153",
  measurementId: "G-HKE7BXD2WE",
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- TELEGRAM SERVICE ---
const BOT_TOKEN = "8421968751:AAFpD9dTQggghW2r43uD3NfJzM0TJJdkMOw";
const sendTelegramOTP = async (chatId, otpCode) => {
  const message = `🔐 <b>ReabKa OTP</b>\n\nលេខកូដសម្ងាត់របស់អ្នកគឺ: <code>${otpCode}</code>\n\nសូមកុំចែករំលែកលេខនេះទៅកាន់អ្នកផ្សេង។`;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Telegram Error:", error);
    return false;
  }
};

// --- REACT COMPONENTS ---

const HomePage = ({ totalGuests, totalRiel, totalUsd, recentGuests }) => (
  <div className="fade-in">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 className="fw-bold m-0 text-dark">ផ្ទាំងគ្រប់គ្រង</h4>
        <small className="text-muted">ទិន្នន័យសរុបគិតត្រឹមថ្ងៃនេះ</small>
      </div>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <div className="stat-card bg-gradient-pink p-4 h-100">
          <div className="position-relative z-1">
            <div className="text-white-50 small fw-bold text-uppercase">
              ភ្ញៀវសរុប
            </div>
            <h1 className="fw-bold mt-2 display-5">
              {toKhmerNum(totalGuests)}
            </h1>
          </div>
          <i className="fas fa-users card-icon-bg"></i>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <div className="stat-card bg-gradient-blue p-3 p-md-4 h-100">
          <div className="position-relative z-1">
            <div className="text-white-50 small fw-bold text-uppercase">
              ប្រាក់រៀល
            </div>
            <h3 className="fw-bold mt-2 mb-0">
              {toKhmerNum(totalRiel.toLocaleString())} ៛
            </h3>
          </div>
          <i className="fas fa-money-bill-wave card-icon-bg"></i>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <div className="stat-card bg-gradient-green p-3 p-md-4 h-100">
          <div className="position-relative z-1">
            <div className="text-white-50 small fw-bold text-uppercase">
              ប្រាក់ដុល្លារ
            </div>
            <h3 className="fw-bold mt-2 mb-0">
              ${toKhmerNum(totalUsd.toFixed(2))}
            </h3>
          </div>
          <i className="fas fa-dollar-sign card-icon-bg"></i>
        </div>
      </div>
    </div>
    <h6 className="fw-bold text-secondary mb-3 mt-5">
      សកម្មភាពថ្មីៗ (៥ នាក់ចុងក្រោយ)
    </h6>
    <div className="recent-list">
      {recentGuests.length > 0 ? (
        recentGuests.slice(0, 5).map((g) => (
          <div key={g.id} className="recent-item">
            <div className="d-flex align-items-center">
              <div
                className={`rounded-circle p-3 me-3 ${
                  g.currency === "USD"
                    ? "bg-success bg-opacity-10 text-success"
                    : "bg-info bg-opacity-10 text-info"
                }`}
              >
                <i
                  className={
                    g.currency === "USD"
                      ? "fas fa-dollar-sign"
                      : "fas fa-money-bill"
                  }
                ></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark">{g.name}</h6>
                <small
                  className="text-muted d-block"
                  style={{ fontSize: "0.75rem" }}
                >
                  {formatKhmerDate(g.timestamp, true)}
                </small>
              </div>
            </div>
            <div
              className={`fw-bold ${
                g.currency === "USD" ? "text-success" : "text-info"
              }`}
            >
              +{toKhmerNum(g.amount.toLocaleString())}{" "}
              {g.currency === "USD" ? "$" : "៛"}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted py-5">មិនទាន់មានទិន្នន័យ</div>
      )}
    </div>
  </div>
);


// --- NEW COMPONENT: PAYMENT MODAL (SCAN QR) ---
const PaymentModal = ({ data, onSuccess, onClose }) => {
  const [status, setStatus] = React.useState("waiting"); // waiting, success
   
  React.useEffect(() => {
      // ទាញយក CSRF Token
      const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
      const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : "";
      
      // Polling: ឆែកមើលរាល់ 2 វិនាទី
      const interval = setInterval(() => {
          // *** កែតម្រូវ URL ត្រង់នេះ (ថែម /api និងដូរឈ្មោះ route) ***
          fetch('/api/verify-payment', { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json', // ថែមនេះដើម្បីឱ្យច្បាស់ថាជា API
                  'X-CSRF-TOKEN': csrfToken
              },
              body: JSON.stringify({ md5: data.md5 })
          })
          .then(res => res.json())
          .then(resData => {
              console.log("Payment Status:", resData);
              // responseCode 0 = ជោគជ័យ (Bakong Standard)
              if (resData.responseCode === 0) { 
                  clearInterval(interval);
                  setStatus("success");
                  setTimeout(() => {
                      onSuccess(); // ហៅទៅ Save Firebase
                  }, 1500); 
              }
          })
          .catch(err => console.error("Verify Error:", err));
      }, 2000);

      return () => clearInterval(interval);
  }, [data.md5, onSuccess]);

  return (
      <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
          <div className="card p-4 text-center shadow-lg border-0 rounded-4 animate__animated animate__zoomIn" style={{width: '380px', backgroundColor: 'white'}}>
              
              {status === 'waiting' ? (
                  <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="font-battambang text-primary fw-bold m-0"><i className="fas fa-qrcode me-2"></i>ស្កេនដើម្បីទូទាត់</h5>
                        <button onClick={onClose} className="btn-close"></button>
                      </div>
                      
                      <div className="bg-light p-3 rounded-3 mb-3">
                        <p className="text-muted small mb-1">ឈ្មោះភ្ញៀវ</p>
                        <h5 className="fw-bold text-dark">{data.name}</h5>
                        <hr className="my-2"/>
                        <p className="text-muted small mb-1">ចំនួនទឹកប្រាក់</p>
                        <h3 className={`fw-bold ${data.currency === 'USD' ? 'text-success' : 'text-info'}`}>
                          {data.amount} {data.currency === 'USD' ? '$' : '៛'}
                        </h3>
                      </div>
                      
                      {/* បង្ហាញរូប QR (SVG) */}
                      <div className="mb-3 d-flex justify-content-center bg-white p-2 border rounded" 
                           dangerouslySetInnerHTML={{ __html: data.qrImage }} 
                           style={{minHeight: '200px'}}
                      />
                      
                      <div className="d-flex justify-content-center align-items-center text-muted small">
                          <span className="spinner-border spinner-border-sm me-2 text-primary"></span>
                          កំពុងរង់ចាំការទូទាត់ពីធនាគារ...
                      </div>
                  </>
              ) : (
                  <div className="text-success py-5">
                      <div className="mb-3">
                        <i className="fas fa-check-circle fa-5x animate__animated animate__bounceIn"></i>
                      </div>
                      <h3 className="font-battambang fw-bold">ទូទាត់ជោគជ័យ!</h3>
                      <p className="text-muted">ទិន្នន័យត្រូវបានរក្សាទុក។</p>
                  </div>
              )}
          </div>
      </div>
  );
};



// --- LIST PAGE (FULL VERSION: SEARCH, PDF, EXCEL) ---
const ListPage = ({
  guests,
  invitedGuests = [],   
  entryMode = "manual", // 'manual' | 'search'
  onQuickAdd,
  totalRiel,
  totalUsd,
  groomName,
  brideName,
  weddingAddress,
  weddingDate,
  allowDelete,
  allowEdit,
  onUpdateStatus,     
  onPermanentDelete,  
  onEditGuest, 
  openConfirm
}) => {
  // --- 1. STATE ---
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = React.useState("active"); 
  const [selectedIds, setSelectedIds] = React.useState([]); 
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(window.innerWidth < 768 ? 24 : 60);
  
  // Quick Add Form
  const [name, setName] = React.useState("");
  const [rawAmount, setRawAmount] = React.useState("");
  const [displayAmount, setDisplayAmount] = React.useState("");
  const [currency, setCurrency] = React.useState("KHR");
  const [address, setAddress] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("cash"); 
  
  // Dropdown
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Refs
  const nameInputRef = React.useRef(null);
  const amountInputRef = React.useRef(null);

  // QR
  const [loadingQR, setLoadingQR] = React.useState(false);
  const [paymentModalData, setPaymentModalData] = React.useState(null);

  const TG_BOT_TOKEN = '7972811630:AAFqY1pPpuX_mTZo8Qt8zonyUJXc04JX4Kk';
  const TG_GROUP_MAP = { "daropovkl85@gmail.com": "-4988503312", "povdaroee@gmail.com": "-5091181215" };

  // --- 2. FUNCTIONS ---

  const sendToTelegram = async (data, methodType) => {
      const user = firebase.auth().currentUser;
      if (!user || !user.email) return;
      const chatId = TG_GROUP_MAP[user.email];
      if (!chatId) return;
      const dateStr = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
      const methodIcon = methodType === 'qr' ? '📲 <b>KHQR</b>' : '💵 <b>លុយសុទ្ធ</b>';
      const message = `🎉 <b>បានទទួលចំណងដៃថ្មី</b> (${methodIcon})\n--------------------------------\n👤 <b>ឈ្មោះភ្ញៀវ:</b> ${data.name}\n📍 <b>អាសយដ្ឋាន:</b> ${data.address || "មិនបានបញ្ជាក់"}\n💰 <b>ចំនួនទឹកប្រាក់:</b> ${data.amount} ${data.currency === 'USD' ? '$' : '៛'}\n🕒 <b>កាលបរិច្ឆេទ:</b> ${dateStr}`;
      try { await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }) }); } catch (error) { console.error("Telegram Error:", error); }
  };

  const isDuplicate = (checkName, checkAddress) => {
      return guests.some(g => !g.isDeleted && g.name.trim().toLowerCase() === checkName.trim().toLowerCase() && (g.address || "").trim().toLowerCase() === (checkAddress || "").trim().toLowerCase());
  };

  React.useEffect(() => { if (nameInputRef.current) nameInputRef.current.focus(); }, []);
  React.useEffect(() => { if (nameInputRef.current) nameInputRef.current.focus(); }, [paymentMethod]);
  React.useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 24 : 60);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, viewMode]);

  const filteredGuests = React.useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (viewMode === "active") return matchesSearch && !g.isDeleted;
      else return matchesSearch && g.isDeleted === true;
    });
  }, [guests, searchTerm, viewMode]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuests = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const activeGuestCount = guests.filter(g => !g.isDeleted).length;

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/,/g, "");
    if (!isNaN(val) && val !== "") { setRawAmount(val); setDisplayAmount(parseFloat(val).toLocaleString("en-US")); }
    else if (val === "") { setRawAmount(""); setDisplayAmount(""); }
  };

  const handleNameChange = (e) => {
      const val = e.target.value;
      setName(val);
      if (entryMode === "search") {
          const searchVal = val.toLowerCase();
          const matches = invitedGuests.filter(g => g.name.toLowerCase().includes(searchVal));
          setSuggestions(matches.slice(0, 10)); 
          setShowSuggestions(true);
          if (val === "") setAddress("");
      } else {
          setShowSuggestions(false);
      }
  };

  const handleNameFocus = () => {
      if (entryMode === "search") {
          const searchVal = name.toLowerCase();
          const matches = invitedGuests.filter(g => g.name.toLowerCase().includes(searchVal));
          setSuggestions(matches.slice(0, 10));
          setShowSuggestions(true);
      }
  };

  const selectSuggestion = (guest) => {
      setName(guest.name);
      setAddress(guest.address || ""); 
      setShowSuggestions(false);
      if (amountInputRef.current) amountInputRef.current.focus();
  };

  const handleBulkTrash = () => {
      openConfirm(`តើអ្នកចង់ដាក់ភ្ញៀវចំនួន ${selectedIds.length} នាក់ ចូលធុងសំរាមមែនទេ?`, () => {
          selectedIds.forEach(id => onUpdateStatus(id, true));
          setSelectedIds([]);
      });
  };
  const handleBulkRestore = () => { selectedIds.forEach(id => onUpdateStatus(id, false)); setSelectedIds([]); };
  const handleBulkPermanentDelete = () => {
      openConfirm(`⚠️ តើអ្នកចង់លុបភ្ញៀវចំនួន ${selectedIds.length} នាក់ ជាអចិន្ត្រៃយ៍មែនទេ?\n(មិនអាចយកមកវិញបានទេ)`, () => {
          selectedIds.forEach(id => onPermanentDelete(id));
          setSelectedIds([]);
      });
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!rawAmount || !name) return;

    if (entryMode === "search") {
        const isValidGuest = invitedGuests.some(g => g.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (!isValidGuest) {
            Swal.fire({ icon: 'warning', title: 'ឈ្មោះមិនត្រឹមត្រូវ!', text: 'ក្នុង "Search Mode" សូមជ្រើសរើសឈ្មោះដែលមានក្នុងបញ្ជី Dropdown ប៉ុណ្ណោះ។', confirmButtonText: 'យល់ព្រម', confirmButtonColor: '#f0ad4e' });
            return;
        }
    }

    if (isDuplicate(name, address)) {
        Swal.fire({ icon: 'error', title: 'ទិន្នន័យស្ទួន!', text: `ឈ្មោះ "${name}" និងអាសយដ្ឋាន "${address}" នេះមានក្នុងបញ្ជីរួចហើយ។`, confirmButtonText: 'យល់ព្រម', confirmButtonColor: '#d33' });
        return;
    }

    if (paymentMethod === 'cash') {
        const guestData = { name, amount: rawAmount, currency, address: typeof address !== 'undefined' ? address : '' };
        onQuickAdd(guestData, () => {
            setName(""); setRawAmount(""); setDisplayAmount(""); setAddress("");
            if (nameInputRef.current) nameInputRef.current.focus();
            sendToTelegram(guestData, 'cash');
        });
        return;
    }

    setLoadingQR(true);
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : "";
    try {
        const res = await fetch('/api/generate-qr', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken }, body: JSON.stringify({ amount: rawAmount, currency: currency }) });
        const data = await res.json();
        if (data.status === 'success') {
            setPaymentModalData({ name: name, amount: displayAmount, currency: currency, qrImage: data.qr_image, md5: data.md5, originalData: { name, amount: rawAmount, currency, address: typeof address !== 'undefined' ? address : '' } });
        } else { alert("បរាជ័យ៖ " + (data.message || "Unknown error")); }
    } catch (err) { console.error(err); alert("មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Server"); } finally { setLoadingQR(false); }
  };

  const handlePaymentSuccess = () => {
    if (!paymentModalData) return;
    onQuickAdd(paymentModalData.originalData, () => {
      setName(""); setRawAmount(""); setDisplayAmount(""); setAddress("");
      if (nameInputRef.current) nameInputRef.current.focus();
    });
    sendToTelegram(paymentModalData.originalData, 'qr');
    setPaymentModalData(null);
  };

  // --- EXPORT PDF (FULL CODE FROM YOU) ---
  const handleExportPDF = () => {
    // ប្រើ filteredGuests (បញ្ជីបច្ចុប្បន្ន) ឬ guests (ទាំងអស់) តាមចិត្ត
    // នៅទីនេះខ្ញុំប្រើ `guests.filter(g => !g.isDeleted)` ដើម្បីយកអ្នកមិនទាន់លុប
    const activeGuests = guests.filter(g => !g.isDeleted);
    
    // (Note: Template ខាងក្រោមនឹងប្រើ Variable ឈ្មោះ `filteredList` ដូច្នេះខ្ញុំបង្កើតវាឱ្យត្រូវគ្នា)
    const filteredList = activeGuests; 

    const element = document.getElementById('pdf-template');
    
    // បង្ហាញធាតុដែលលាក់សិន (ដើម្បីឱ្យ html2pdf ចាប់យកបាន)
    const hiddenDiv = document.getElementById('pdf-hidden-container'); 
    // (សម្រាប់កូដនេះ យើងមិនបាច់ប្រើ hiddenDiv ទេ ព្រោះយើង Render ផ្ទាល់ក្នុង DOM)

    const opt = {
      margin:       0, // ដាក់ 0 ព្រោះ CSS Template មាន padding ហើយ
      filename:     `Guest_List_Riebkear_${new Date().toISOString().slice(0, 10)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: true, scrollY: 0 }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save();
    } else {
        alert("Library html2pdf មិនទាន់ដំណើរការ! សូម Refresh ហើយសាកម្តងទៀត។");
    }
  };

  // --- EXPORT EXCEL (FULL CODE FROM YOU) ---
  const generateExcel = () => {
    const activeGuests = guests.filter(g => !g.isDeleted);
    let xlTotalRiel = 0, xlTotalUsd = 0;
    activeGuests.forEach((g) => {
      if (g.currency === "KHR") xlTotalRiel += Number(g.amount);
      else xlTotalUsd += Number(g.amount);
    });

    const styles = {
      title: { font: { name: "Khmer OS Muol Light", sz: 18, bold: true, color: { rgb: "DB2777" } }, alignment: { horizontal: "center", vertical: "center" } },
      subtitle: { font: { name: "Battambang", sz: 12, bold: true }, alignment: { horizontal: "center", vertical: "center" } },
      summaryLabel: { font: { name: "Battambang", sz: 11, bold: true }, fill: { fgColor: { rgb: "F3F4F6" } }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
      summaryValue: { font: { name: "Battambang", sz: 11, bold: true }, alignment: { horizontal: "right" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
      tableHeader: { font: { name: "Khmer OS Muol Light", sz: 11, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "DB2777" } }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
      cellCenter: { font: { name: "Battambang", sz: 11 }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
      cellLeft: { font: { name: "Battambang", sz: 11, bold: true }, alignment: { horizontal: "left", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
      cellCenterAlt: { font: { name: "Battambang", sz: 11 }, fill: { fgColor: { rgb: "FCE7F3" } }, alignment: { horizontal: "center", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } },
      cellLeftAlt: { font: { name: "Battambang", sz: 11, bold: true }, fill: { fgColor: { rgb: "FCE7F3" } }, alignment: { horizontal: "left", vertical: "center" }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } }
    };

    const workbook = XLSX.utils.book_new();
    const displayDate = weddingDate ? new Date(weddingDate).toLocaleDateString("km-KH") : new Date().toLocaleDateString("km-KH");
    const wsData = [
      [{ v: "បញ្ជីចំណងដៃអាពាហ៍ពិពាហ៍", s: styles.title }], 
      [{ v: `មង្គលការ: ${groomName || "..."} ❤️ ${brideName || "..."}`, s: styles.subtitle }], 
      [{ v: `កាលបរិច្ឆេទ: ${displayDate}`, s: styles.subtitle }], 
      [], 
      [{ v: "សង្ខេបភ្ញៀវសរុប:", s: styles.summaryLabel }, { v: "", s: styles.summaryLabel }, { v: `${activeGuests.length} នាក់`, s: styles.summaryValue }],
      [{ v: "សរុបប្រាក់រៀល:", s: styles.summaryLabel }, { v: "", s: styles.summaryLabel }, { v: `${xlTotalRiel.toLocaleString()} ៛`, s: { ...styles.summaryValue, font: { color: { rgb: "0000FF" }, name: "Battambang", bold: true } } }],
      [{ v: "សរុបប្រាក់ដុល្លារ:", s: styles.summaryLabel }, { v: "", s: styles.summaryLabel }, { v: `$${xlTotalUsd.toFixed(2)}`, s: { ...styles.summaryValue, font: { color: { rgb: "008000" }, name: "Battambang", bold: true } } }],
      [], 
      [{ v: "ល.រ", s: styles.tableHeader }, { v: "ឈ្មោះភ្ញៀវ", s: styles.tableHeader }, { v: "ចំនួនទឹកប្រាក់", s: styles.tableHeader }, { v: "ប្រភេទ", s: styles.tableHeader }, { v: "អាសយដ្ឋាន", s: styles.tableHeader }, { v: "ពេលវេលា", s: styles.tableHeader }]
    ];

    activeGuests.forEach((g, index) => {
      const isAlt = index % 2 !== 0;
      const sCenter = isAlt ? styles.cellCenterAlt : styles.cellCenter;
      const sLeft = isAlt ? styles.cellLeftAlt : styles.cellLeft;
      const moneyColor = g.currency === "USD" ? "008000" : "0000FF"; 
      const amountStyle = { ...sLeft, font: { ...sLeft.font, color: { rgb: moneyColor } } };
      wsData.push([
        { v: index + 1, s: sCenter },
        { v: g.name, s: sLeft },
        { v: Number(g.amount), s: amountStyle, t: 'n', z: '#,##0' },
        { v: g.currency, s: sCenter },
        { v: g.address || "-", s: sLeft },
        { v: formatKhmerDate(g.timestamp, true), s: sCenter },
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet([]); 
    XLSX.utils.sheet_add_aoa(worksheet, wsData, { origin: "A1" });
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } }, { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    ];
    worksheet["!cols"] = [{ wch: 8 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 35 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guest_List");
    XLSX.writeFile(workbook, `Rieabkear_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // --- RENDER UI ---
  return (
    <div className="fade-in pb-5">
      <div className="row">
        
        {/* === LEFT COLUMN: FORM === */}
        <div className="col-lg-4 d-none d-lg-block">
          <div className="quick-entry-panel p-4" style={{zIndex: 100}}>
            <h5 className="fw-bold text-primary mb-4"><i className="fas fa-pen-nib me-2"></i>បញ្ចូលទិន្នន័យរហ័ស</h5>
            <form onSubmit={handleQuickSubmit}>
               
               <div className="d-flex gap-2 mb-3 bg-white p-1 rounded-3 border">
                   <div className={`flex-grow-1 text-center py-2 rounded-2 fw-bold cursor-pointer transition-all ${paymentMethod === 'cash' ? 'bg-success text-white shadow-sm' : 'text-muted hover-bg-light'}`} onClick={() => setPaymentMethod('cash')}><i className="fas fa-money-bill-wave me-2"></i>លុយសុទ្ធ</div>
                   <div className={`flex-grow-1 text-center py-2 rounded-2 fw-bold cursor-pointer transition-all ${paymentMethod === 'qr' ? 'bg-primary text-white shadow-sm' : 'text-muted hover-bg-light'}`} onClick={() => setPaymentMethod('qr')}><i className="fas fa-qrcode me-2"></i>KHQR</div>
               </div>
               
               <div className="mb-3 position-relative">
                   <label className="form-label small fw-bold text-muted">
                       ឈ្មោះភ្ញៀវ {entryMode === "search" && <span className="badge bg-info text-dark ms-2">Search Mode</span>}
                   </label>
                   <input type="text" className="form-control form-control-lg bg-light border-0" placeholder={entryMode === "search" ? "វាយដើម្បីស្វែងរក ឬចុចរើស..." : "វាយឈ្មោះ..."} value={name} onChange={handleNameChange} onFocus={handleNameFocus} ref={nameInputRef} required autoComplete="off" />
                   {showSuggestions && suggestions.length > 0 && (
                       <ul className="list-group position-absolute w-100 shadow-lg animate__animated animate__fadeIn" style={{zIndex: 1000, marginTop: '5px', maxHeight: '200px', overflowY: 'auto'}}>
                           {suggestions.map((guest, idx) => (
                               <li key={idx} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style={{cursor: 'pointer'}} onClick={() => selectSuggestion(guest)}>
                                   <div><div className="fw-bold">{guest.name}</div><small className="text-muted">{guest.address}</small></div>
                                   <i className="fas fa-check text-success"></i>
                               </li>
                           ))}
                       </ul>
                   )}
               </div>

               <div className="row mb-3">
                 <div className="col-6">
                    <label className="form-label small fw-bold text-muted">ទឹកប្រាក់</label>
                    <input type="text" inputMode="numeric" className="form-control form-control-lg bg-light border-0" placeholder="0" value={displayAmount} onChange={handleAmountChange} ref={amountInputRef} required />
                    {rawAmount && <div className="text-danger small fw-bold mt-1 animate__animated animate__fadeIn">{convertMoneyToKhmerText(rawAmount)} {currency === "KHR" ? "រៀល" : "ដុល្លារ"}</div>}
                 </div>
                 <div className="col-6"><label className="form-label small fw-bold text-muted">ប្រភេទ</label><select className="form-select form-select-lg bg-light border-0" value={currency} onChange={(e) => setCurrency(e.target.value)}><option value="KHR">រៀល (៛)</option><option value="USD">ដុល្លារ ($)</option></select></div>
               </div>
               
               <div className="mb-4">
                   <label className="form-label small fw-bold text-muted">
                       អាសយដ្ឋាន {entryMode === 'search' && <span className="text-warning">(ស្វ័យប្រវត្តិ)</span>}
                   </label>
                   <input type="text" className={`form-control form-control-lg border-0 ${entryMode === 'search' ? 'bg-secondary bg-opacity-10 text-dark' : 'bg-light'}`} placeholder={entryMode === 'search' ? "បង្ហាញទិន្នន័យស្វ័យប្រវត្តិ..." : "ភូមិ/ឃុំ..."} value={address} onChange={(e) => setAddress(e.target.value)} readOnly={entryMode === "search"} style={entryMode === 'search' ? {cursor: 'not-allowed'} : {}} />
               </div>

               <button type="submit" className={`btn w-100 py-3 rounded-3 fw-bold shadow-sm ${paymentMethod === 'cash' ? 'btn-success' : 'btn-primary'}`} disabled={loadingQR}>
                 {loadingQR ? <span><i className="fas fa-spinner fa-spin me-2"></i>កំពុងបង្កើត QR...</span> : <span>{paymentMethod === 'cash' ? <i className="fas fa-save me-2"></i> : <i className="fas fa-qrcode me-2"></i>}{paymentMethod === 'cash' ? 'រក្សាទុក (Enter)' : 'បង្កើត QR & រក្សាទុក'}</span>}
               </button>
            </form>
          </div>
          
          <div className="mt-4 animate__animated animate__fadeInUp">
             <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-3">
                   <div className="d-flex align-items-center bg-primary bg-opacity-10 p-3 rounded-3 mb-2"><div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}><i className="fas fa-users fs-5"></i></div><div className="ms-3"><small className="text-muted fw-bold">ភ្ញៀវសរុប</small><h4 className="mb-0 fw-bold text-primary">{toKhmerNum(activeGuestCount)} នាក់</h4></div></div>
                   <div className="d-flex align-items-center bg-info bg-opacity-10 p-3 rounded-3 mb-2"><div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}><i className="fas fa-money-bill-wave fs-5"></i></div><div className="ms-3"><small className="text-muted fw-bold">ប្រាក់រៀល</small><h4 className="mb-0 fw-bold text-info">{toKhmerNum(totalRiel.toLocaleString())} ៛</h4></div></div>
                   <div className="d-flex align-items-center bg-success bg-opacity-10 p-3 rounded-3"><div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}><i className="fas fa-dollar-sign fs-5"></i></div><div className="ms-3"><small className="text-muted fw-bold">ប្រាក់ដុល្លារ</small><h4 className="mb-0 fw-bold text-success">${toKhmerNum(totalUsd.toFixed(2))}</h4></div></div>
                </div>
             </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: LIST === */}
        <div className="col-lg-8 col-12">
          <div className="d-flex flex-column gap-3 mb-3">
             <ul className="nav nav-pills bg-white p-1 rounded-pill shadow-sm border w-100 justify-content-center">
              <li className="nav-item flex-fill text-center"><button className={`nav-link w-100 rounded-pill px-3 small fw-bold ${viewMode === 'active' ? 'active' : 'text-muted'}`} onClick={() => { setViewMode('active'); setSelectedIds([]); setCurrentPage(1); }}><i className="fas fa-list me-2"></i>បញ្ជីឈ្មោះ</button></li>
              <li className="nav-item flex-fill text-center"><button className={`nav-link w-100 rounded-pill px-3 small fw-bold ${viewMode === 'trash' ? 'active bg-danger' : 'text-muted'}`} onClick={() => { setViewMode('trash'); setSelectedIds([]); setCurrentPage(1); }}><i className="fas fa-trash-alt me-2"></i>ធុងសំរាម {guests.filter(g => g.isDeleted).length > 0 && <span className="badge bg-white text-danger ms-2 rounded-pill">{guests.filter(g => g.isDeleted).length}</span>}</button></li>
             </ul>

             <div className="d-flex gap-2 align-items-center">
                <div className="input-group bg-white rounded-4 shadow-sm border p-1 flex-grow-1"><span className="input-group-text bg-transparent border-0 ps-3"><i className="fas fa-search text-muted"></i></span><input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="ស្វែងរក..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <button className="btn btn-danger text-white shadow-sm rounded-3" onClick={handleExportPDF} title="Export PDF"><i className="fas fa-file-pdf"></i></button>
                <button className="btn btn-success text-white shadow-sm rounded-3" onClick={generateExcel} title="Export Excel"><i className="fas fa-file-excel"></i></button>
             </div>

             {selectedIds.length > 0 && (
                <div className="d-flex justify-content-between align-items-center bg-white p-2 px-3 rounded-4 shadow-sm border border-2 border-primary animate__animated animate__fadeIn">
                    <div className="fw-bold text-primary"><i className="fas fa-check-circle me-2"></i>បានជ្រើសរើស {selectedIds.length} នាក់</div>
                    <div className="d-flex gap-2">
                        {viewMode === 'active' ? (
                            allowDelete && <button className="btn btn-danger btn-sm fw-bold rounded-pill px-3" onClick={handleBulkTrash}><i className="fas fa-trash-alt me-1"></i> លុបទាំងអស់</button>
                        ) : (
                            <>
                                <button className="btn btn-success btn-sm fw-bold rounded-pill px-3" onClick={handleBulkRestore}><i className="fas fa-trash-restore me-1"></i> ស្តារ</button>
                                <button className="btn btn-outline-danger btn-sm fw-bold rounded-pill px-3" onClick={handleBulkPermanentDelete}><i className="fas fa-times-circle me-1"></i> លុបចោល</button>
                            </>
                        )}
                    </div>
                </div>
             )}
          </div>
          
          <div className="position-relative" style={{minHeight: '60vh'}}>
            {filteredGuests.length > 0 ? (
               <div className="row g-2 g-md-3">
                 {currentGuests.map((g) => {
                   const isSelected = selectedIds.includes(g.id);
                   return (
                     <div key={g.id} className="col-12 col-md-6">
                        <div className={`card border-0 shadow-sm h-100 rounded-4 transition-all ${isSelected ? "ring-2 ring-primary bg-primary bg-opacity-10" : "bg-white"}`} style={{cursor: 'pointer', border: isSelected ? '2px solid #db2777' : '1px solid #f0f0f0'}} onClick={() => handleSelectOne(g.id)}>
                           <div className="card-body p-3 d-flex align-items-center justify-content-between">
                             <div className="d-flex align-items-center overflow-hidden">
                                 <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0 ${isSelected ? "bg-primary text-white" : "bg-light text-muted"}`} style={{width: '24px', height: '24px', border: '1px solid #ddd'}}>{isSelected && <i className="fas fa-check small"></i>}</div>
                                 <div className="overflow-hidden">
                                     <h6 className="fw-bold text-dark mb-0 text-truncate">{g.name}</h6>
                                     <div className="text-muted small d-flex align-items-center gap-2"><span><i className="far fa-clock me-1"></i>{formatKhmerDate(g.timestamp, true).split('|')[0]}</span>{g.address && <span><i className="fas fa-map-marker-alt me-1 text-danger"></i>{g.address}</span>}</div>
                                 </div>
                             </div>
                             <div className="text-end d-flex flex-column align-items-end justify-content-center ms-2">
                                 <span className={`badge rounded-pill ${g.currency === "USD" ? "bg-success" : "bg-info"} bg-opacity-10 text-dark border border-0 mb-1`}>{g.currency === "USD" ? "$" : ""} {toKhmerNum(g.amount.toLocaleString())} {g.currency === "KHR" ? "៛" : ""}</span>
                                 <div className="d-flex gap-2 mt-1">
                                    {viewMode === 'active' ? (
                                        <>
                                            {allowEdit && <button className="btn btn-sm btn-light text-warning p-1 rounded-circle" style={{width:'30px', height:'30px'}} onClick={(e) => { e.stopPropagation(); onEditGuest(g); }}><i className="fas fa-pen"></i></button>}
                                            {allowDelete && <button className="btn btn-sm btn-light text-danger p-1 rounded-circle" style={{width:'30px', height:'30px'}} onClick={(e) => { e.stopPropagation(); onUpdateStatus(g.id, true); }}><i className="fas fa-trash-alt"></i></button>}
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm btn-light text-success p-1 rounded-circle" style={{width:'30px', height:'30px'}} onClick={(e) => { e.stopPropagation(); onUpdateStatus(g.id, false); }} title="ស្តារឡើងវិញ"><i className="fas fa-trash-restore"></i></button>
                                            <button className="btn btn-sm btn-light text-danger p-1 rounded-circle" style={{width:'30px', height:'30px'}} onClick={(e) => { e.stopPropagation(); openConfirm("លុបជាអចិន្ត្រៃយ៍?", () => onPermanentDelete(g.id)); }} title="លុបចោល"><i className="fas fa-times"></i></button>
                                        </>
                                    )}
                                 </div>
                             </div>
                           </div>
                        </div>
                     </div>
                   );
                 })}
               </div>
            ) : (<div className="text-center py-5 text-muted">មិនមានទិន្នន័យ</div>)}
             
             {totalPages > 1 && (<div className="d-flex justify-content-center mt-4 gap-2"><button className="btn btn-light rounded-circle" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}><i className="fas fa-chevron-left"></i></button><span className="align-self-center fw-bold text-muted small">ទំព័រ {toKhmerNum(currentPage)} / {toKhmerNum(totalPages)}</span><button className="btn btn-light rounded-circle" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}><i className="fas fa-chevron-right"></i></button></div>)}
          </div>
        </div>
      </div>

      {/* ===================================================================================
          PDF TEMPLATE (UPDATED: 24 ROWS ON PAGE 1 - COMPACT STYLE)
      ==================================================================================== */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
         <div id="pdf-template" style={{ width: "210mm", backgroundColor: "white", color: "black", margin: 0, padding: 0 }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moul&display=swap');
                    .font-moul { font-family: 'Moul', cursive; }
                    .font-battambang { font-family: 'Battambang', sans-serif; }
                    .pdf-page { width: 210mm; height: 295mm; padding: 15mm 15mm 5mm 15mm; box-sizing: border-box; position: relative; display: flex; flex-direction: column; background: white; overflow: hidden; page-break-after: always; }
                    .last-page { page-break-after: avoid !important; height: 295mm; }
                `}
            </style>

            {/* LOGIC បំបែកទំព័រ */}
            {(() => {
                // ប្រើ guests ដែលមិនទាន់លុប (activeGuests) ជាទិន្នន័យ
                const activeGuests = guests.filter(g => !g.isDeleted);
                
                const rowsPage1 = 27;     
                const rowsPageOther = 28; 
                
                const pages = [];
                if (activeGuests.length <= rowsPage1) {
                    pages.push(activeGuests);
                } else {
                    pages.push(activeGuests.slice(0, rowsPage1));
                    let i = rowsPage1;
                    while (i < activeGuests.length) {
                        pages.push(activeGuests.slice(i, i + rowsPageOther));
                        i += rowsPageOther;
                    }
                }

                return pages.map((pageData, pageIndex) => {
                    const isFirstPage = pageIndex === 0;
                    const isLastPage = pageIndex === pages.length - 1;
                    const startNo = isFirstPage ? 0 : rowsPage1 + ((pageIndex - 1) * rowsPageOther);

                    return (
                        <div key={pageIndex} className={`pdf-page ${isLastPage ? 'last-page' : ''}`}>
                            <div style={{ flexGrow: 1 }}>
                                {isFirstPage ? (
                                    <div style={{ textAlign: "center", marginBottom: "15px", borderBottom: "2px solid #DB2777", paddingBottom: "10px" }}>
                                        <h1 className="font-moul" style={{ color: "#DB2777", fontSize: "20px", margin: 0, lineHeight: "1.5" }}>បញ្ជីចំណងដៃអាពាហ៍ពិពាហ៍</h1>
                                        <h3 className="font-moul" style={{ fontSize: "13px", margin: "5px 0 0 0", color: "#333" }}>មង្គលការ: {groomName || "..."} ❤️ {brideName || "..."}</h3>
                                        <p className="font-battambang" style={{ color: "#666", marginTop: "5px", fontSize: "10px" }}>
                                            កាលបរិច្ឆេទ: {weddingDate ? new Date(weddingDate).toLocaleDateString('km-KH') : new Date().toLocaleDateString('km-KH')}
                                        </p>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11px" }}>
                                            <div style={{ color: "#0000FF" }}>សរុបប្រាក់រៀល: <b>{totalRiel.toLocaleString()} ៛</b></div>
                                            <div style={{ color: "#008000" }}>សរុបប្រាក់ដុល្លារ: <b>${totalUsd.toFixed(2)}</b></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center", marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                                         <h4 className="font-moul" style={{ color: "#999", fontSize: "12px", margin: 0 }}>បញ្ជីចំណងដៃ (ត) - ទំព័រទី {pageIndex + 1}</h4>
                                    </div>
                                )}

                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#DB2777", color: "white" }}>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", width: "40px", textAlign: "center" }}>ល.រ</th>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", textAlign: "center" }}>ឈ្មោះភ្ញៀវ</th>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", textAlign: "center" }}>ចំនួនទឹកប្រាក់</th>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", textAlign: "center" }}>អាសយដ្ឋាន</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageData.map((g, idx) => {
                                            const globalIndex = startNo + idx;
                                            const moneyColor = g.currency === "USD" ? "#008000" : "#0000FF";
                                            return (
                                                <tr key={g.id || idx} style={{ backgroundColor: globalIndex % 2 === 0 ? "#fdf2f8" : "white" }}>
                                                    <td className="font-battambang" style={{ padding: "6px", border: "1px solid #ddd", textAlign: "center" }}>{globalIndex + 1}</td>
                                                    <td className="font-moul" style={{ padding: "6px", border: "1px solid #ddd", fontSize: "11px", color: "#000", textAlign: "left" }}>{g.name}</td>
                                                    <td className="font-battambang" style={{ padding: "6px", border: "1px solid #ddd", textAlign: "left", color: moneyColor, fontWeight: "bold" }}>
                                                        {Number(g.amount).toLocaleString()} {g.currency === "USD" ? "$" : "៛"}
                                                    </td>
                                                    <td className="font-battambang" style={{ padding: "6px", border: "1px solid #ddd", textAlign: "left" }}>{g.address || "-"}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginTop: "auto", paddingTop: "5px", borderTop: "1px solid #eee", textAlign: "center" }}>
                                <div className="font-battambang" style={{ fontSize: "9px", color: "#999" }}>
                                    ទំព័រ {pageIndex + 1} / {pages.length} | Created by Riebkear App System
                                </div>
                            </div>
                        </div>
                    );
                });
            })()}
         </div>
      </div>

      {paymentModalData && (
        <PaymentModal 
            data={paymentModalData}
            onSuccess={handlePaymentSuccess}
            onClose={() => setPaymentModalData(null)}
        />
      )}
    </div>
  );
};

// --- REPORT PAGE (MODERN GRAPHICAL DASHBOARD) ---
const ReportPage = ({ guests }) => {
  const chartRef1 = React.useRef(null);
  const chartRef2 = React.useRef(null);
  const chartInstance1 = React.useRef(null);
  const chartInstance2 = React.useRef(null);

  // 1. រៀបចំទិន្នន័យ (Data Processing)
  // ប្រសិនបើ guests មិនទាន់មាន (undefined) ឱ្យប្រើ array ទទេ
  const safeGuests = guests || [];
  const activeGuests = safeGuests.filter(g => !g.isDeleted);
  
  // គណនាសរុប
  const totalRiel = activeGuests.filter(g => g.currency === "KHR").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalUsd = activeGuests.filter(g => g.currency === "USD").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalGuestCount = activeGuests.length;
  
  // រកមធ្យមភាគ (Average Gift)
  const avgRiel = activeGuests.filter(g => g.currency === "KHR").length > 0 
    ? totalRiel / activeGuests.filter(g => g.currency === "KHR").length 
    : 0;
  const avgUsd = activeGuests.filter(g => g.currency === "USD").length > 0 
    ? totalUsd / activeGuests.filter(g => g.currency === "USD").length 
    : 0;

  // 2. ក្រាហ្វទិន្នន័យ (Chart Data)
  const countRiel = activeGuests.filter(g => g.currency === "KHR").length;
  const countUsd = activeGuests.filter(g => g.currency === "USD").length;

  // ភ្ញៀវមកតាមម៉ោង
  const hoursData = Array(24).fill(0);
  activeGuests.forEach(g => {
    const hour = new Date(g.timestamp).getHours();
    hoursData[hour]++;
  });
  
  const labelsTime = [];
  const dataTime = [];
  hoursData.forEach((count, hour) => {
    if (count > 0) {
      const suffix = hour >= 12 ? "PM" : "AM";
      const h = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      labelsTime.push(`${h} ${suffix}`);
      dataTime.push(count);
    }
  });

  // 3. Render Charts (ប្រើ useEffect)
  React.useEffect(() => {
    // ត្រូវប្រាកដថា Chart.js ត្រូវបាន Load
    if (typeof Chart === 'undefined') {
        console.error("Chart.js is not loaded!");
        return;
    }

    if (activeGuests.length === 0) return;

    // Destroy old charts if exists
    if (chartInstance1.current) chartInstance1.current.destroy();
    if (chartInstance2.current) chartInstance2.current.destroy();

    // --- PIE CHART (Currency) ---
    if (chartRef1.current) {
        const ctx1 = chartRef1.current.getContext('2d');
        chartInstance1.current = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['ប្រាក់រៀល (៛)', 'ប្រាក់ដុល្លារ ($)'],
            datasets: [{
            data: [countRiel, countUsd],
            backgroundColor: ['#0ea5e9', '#22c55e'],
            borderWidth: 0,
            hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Battambang' } } }
            },
            cutout: '70%',
        }
        });
    }

    // --- BAR CHART (Time) ---
    if (chartRef2.current) {
        const ctx2 = chartRef2.current.getContext('2d');
        chartInstance2.current = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: labelsTime,
            datasets: [{
            label: 'ចំនួនភ្ញៀវ',
            data: dataTime,
            backgroundColor: '#db2777',
            borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
            },
            plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw} នាក់` } }
            }
        }
        });
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
    };
  }, [guests]);

  // Top 5 Contributors
  const topGuests = [...activeGuests].sort((a, b) => {
     const valA = a.currency === 'USD' ? parseFloat(a.amount) * 4100 : parseFloat(a.amount);
     const valB = b.currency === 'USD' ? parseFloat(b.amount) * 4100 : parseFloat(b.amount);
     return valB - valA;
  }).slice(0, 5);

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
         <h4 className="fw-bold m-0 text-primary">របាយការណ៍វិភាគ</h4>
      </div>

      {/* 1. CARDS SUMMARY */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total USD */}
        <div className="col-12 col-md-4">
           <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <div className="card-body p-4 position-relative">
                 <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                       <i className="fas fa-dollar-sign fs-4"></i>
                    </div>
                    <div className="text-end">
                       <small className="text-muted fw-bold">មធ្យមភាគ/នាក់</small>
                       <div className="fw-bold text-success">${toKhmerNum(avgUsd.toFixed(2))}</div>
                    </div>
                 </div>
                 <h2 className="fw-bold mb-0">${toKhmerNum(totalUsd.toFixed(2))}</h2>
                 <small className="text-muted">សរុបប្រាក់ដុល្លារ</small>
              </div>
           </div>
        </div>

        {/* Card 2: Total Riel */}
        <div className="col-12 col-md-4">
           <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <div className="card-body p-4 position-relative">
                 <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle">
                       <i className="fas fa-money-bill-wave fs-4"></i>
                    </div>
                    <div className="text-end">
                       <small className="text-muted fw-bold">មធ្យមភាគ/នាក់</small>
                       <div className="fw-bold text-info">{toKhmerNum(Math.round(avgRiel).toLocaleString())} ៛</div>
                    </div>
                 </div>
                 <h2 className="fw-bold mb-0">{toKhmerNum(totalRiel.toLocaleString())} ៛</h2>
                 <small className="text-muted">សរុបប្រាក់រៀល</small>
              </div>
           </div>
        </div>

        {/* Card 3: Guests Count */}
        <div className="col-12 col-md-4">
           <div className="card border-0 shadow-sm rounded-4 h-100 bg-gradient-pink text-white">
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                 <div>
                    <div className="d-flex justify-content-between">
                       <div className="bg-white bg-opacity-25 p-3 rounded-circle mb-3" style={{width: 'fit-content'}}>
                          <i className="fas fa-users fs-4 text-white"></i>
                       </div>
                       <div className="text-end opacity-75">
                          <small>ចំនួនកត់ត្រា</small>
                       </div>
                    </div>
                    <h1 className="fw-bold display-4 mb-0">{toKhmerNum(totalGuestCount)}</h1>
                    <div className="mt-2 text-white-50 small">ភ្ញៀវចូលរួមសរុប</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="row g-3 mb-4">
         {/* Pie Chart */}
         <div className="col-12 col-md-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
               <div className="card-header bg-white border-0 pt-4 px-4">
                  <h6 className="fw-bold m-0">សមាមាត្ររូបិយប័ណ្ណ (Currency)</h6>
               </div>
               <div className="card-body d-flex align-items-center justify-content-center" style={{height: '300px'}}>
                  {totalGuestCount > 0 ? (
                     <canvas ref={chartRef1}></canvas>
                  ) : (
                     <div className="text-muted small">មិនទាន់មានទិន្នន័យ</div>
                  )}
               </div>
            </div>
         </div>

         {/* Bar Chart */}
         <div className="col-12 col-md-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
               <div className="card-header bg-white border-0 pt-4 px-4">
                  <h6 className="fw-bold m-0">សកម្មភាពភ្ញៀវចូលតាមម៉ោង</h6>
               </div>
               <div className="card-body" style={{height: '300px'}}>
                  {totalGuestCount > 0 ? (
                     <canvas ref={chartRef2}></canvas>
                  ) : (
                     <div className="text-muted small text-center pt-5">មិនទាន់មានទិន្នន័យ</div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* 3. TOP CONTRIBUTORS LIST */}
      <div className="card border-0 shadow-sm rounded-4 mb-5">
         <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold m-0"><i className="fas fa-crown text-warning me-2"></i>ចំណងដៃខ្ពស់បំផុត (Top 5)</h6>
         </div>
         <div className="card-body p-0">
            {topGuests.length > 0 ? (
               <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                     <thead className="bg-light text-muted small text-uppercase">
                        <tr>
                           <th className="ps-4 border-0">#</th>
                           <th className="border-0">ឈ្មោះ</th>
                           <th className="border-0">ចំនួនទឹកប្រាក់</th>
                           <th className="text-end pe-4 border-0">ពេលវេលា</th>
                        </tr>
                     </thead>
                     <tbody>
                        {topGuests.map((g, index) => (
                           <tr key={index}>
                              <td className="ps-4 fw-bold text-muted">{toKhmerNum(index + 1)}</td>
                              <td className="fw-bold text-primary">{g.name}</td>
                              <td>
                                 <span className={`badge rounded-pill ${g.currency === 'USD' ? 'bg-success' : 'bg-info'} bg-opacity-10 text-dark px-3 py-2`}>
                                    {g.currency === 'USD' ? '$' : ''} {toKhmerNum(g.amount.toLocaleString())} {g.currency === 'KHR' ? '៛' : ''}
                                 </span>
                              </td>
                              <td className="text-end pe-4 text-muted small">
                                 {formatKhmerDate(g.timestamp, true)}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            ) : (
               <div className="text-center py-5 text-muted">មិនទាន់មានទិន្នន័យ</div>
            )}
         </div>
      </div>
      <div style={{height: '50px'}}></div>
    </div>
  );
};

// --- SETTINGS PAGE (ពេញលេញ - រួមបញ្ចូលទាំងមុខងារថ្មី) ---
const SettingsPage = ({
  // User Info Props
  khmerName, setKhmerName,
  phone, setPhone,
  userAddress, setUserAddress,

  // App Info Props
  groomName, setGroomName,
  brideName, setBrideName,
  weddingAddress, setWeddingAddress,
  weddingDate, setWeddingDate,

  // Security Props
  allowDelete, setAllowDelete,
  allowEdit, setAllowEdit,

  // *** NEW PROPS (មុខងារថ្មី) ***
  entryMode, 
  onToggleEntryMode,

  // Save Function
  onSave // អ្នកត្រូវប្រាកដថាបានបញ្ជូន function នេះពី App.js (ដូចជា handleSaveSettings)
}) => {
  return (
    <div className="fade-in pb-5">
      <h4 className="fw-bold mb-4">ការកំណត់</h4>

      {/* 1. ព័ត៌មានម្ចាស់គណនី */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="text-success fw-bold mb-4 border-bottom pb-2">
          <i className="fas fa-id-card me-2"></i>ព័ត៌មានម្ចាស់គណនី (ដាច់ខាត)
        </h5>
        <div className="alert alert-warning small border-0 rounded-3 mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>សូមប្រើឈ្មោះពិតដែលមានក្នុងអត្តសញ្ញាណប័ណ្ណ ទើបអាចដកប្រាក់បាន។
        </div>
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">ឈ្មោះពេញ (ខ្មែរ) <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0" value={khmerName} onChange={e => setKhmerName(e.target.value)} required />
            </div>
            <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">លេខទូរស័ព្ទ <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="col-12">
                <label className="form-label small fw-bold text-muted">អាសយដ្ឋានបច្ចុប្បន្ន <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0" value={userAddress} onChange={e => setUserAddress(e.target.value)} />
            </div>
        </div>
      </div>

      {/* 2. ព័ត៌មានកម្មវិធី */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="text-primary fw-bold mb-4 border-bottom pb-2">
          <i className="fas fa-calendar-check me-2"></i>ព័ត៌មានកម្មវិធី (ដាច់ខាត)
        </h5>
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">ឈ្មោះកូនកំលោះ <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0" value={groomName} onChange={e => setGroomName(e.target.value)} />
            </div>
            <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">ឈ្មោះកូនក្រមុំ <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0" value={brideName} onChange={e => setBrideName(e.target.value)} />
            </div>
            <div className="col-12">
                <label className="form-label small fw-bold text-muted">ទីតាំងរៀបការ <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0" value={weddingAddress} onChange={e => setWeddingAddress(e.target.value)} />
            </div>
            <div className="col-12">
                <label className="form-label small fw-bold text-muted">កាលបរិច្ឆេទ <span className="text-danger">*</span></label>
                <input type="date" className="form-control bg-light border-0" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} />
            </div>
        </div>
      </div>

      {/* 3. ការកំណត់ការបញ្ចូលទិន្នន័យ (ផ្នែកថ្មីដែលបាត់) */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 animate__animated animate__fadeIn">
          <h5 className="text-info fw-bold mb-4 border-bottom pb-2">
              <i className="fas fa-keyboard me-2"></i>របៀបបញ្ចូលទិន្នន័យ (ថ្មី)
          </h5>
          
          <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
              <div>
                  <div className="fw-bold text-dark mb-1">
                      {entryMode === "search" ? "របៀបស្វែងរកឈ្មោះ (Search Mode)" : "របៀបសរសេរដៃ (Manual Mode)"}
                  </div>
                  <small className="text-muted d-block" style={{lineHeight: '1.4'}}>
                      {entryMode === "search" 
                          ? "វាយឈ្មោះដើម្បីទាញទិន្នន័យពី 'ភ្ញៀវអញ្ជើញ' មកកត់ត្រា (ការពារស្ទួន)" 
                          : "សរសេរឈ្មោះ និងអាសយដ្ឋានថ្មីរាល់ពេលកត់ត្រា (លឿនតែអាចស្ទួន)"
                      }
                  </small>
              </div>
              <div className="form-check form-switch ms-3">
                  <input 
                      className="form-check-input" 
                      type="checkbox" 
                      style={{width:"3.5em", height:"1.8em", cursor:'pointer'}} 
                      checked={entryMode === "search"} 
                      onChange={(e) => onToggleEntryMode(e.target.checked)} 
                  />
              </div>
          </div>
      </div>

      {/* 4. សុវត្ថិភាពទិន្នន័យ */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="text-danger fw-bold mb-4 border-bottom pb-2">
            <i className="fas fa-shield-alt me-2"></i>សុវត្ថិភាពទិន្នន័យ
        </h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
                <span className="fw-bold d-block">មុខងារលុបទិន្នន័យ</span>
                <small className="text-muted">អនុញ្ញាតឱ្យលុបឈ្មោះភ្ញៀវចេញពីបញ្ជី</small>
            </div>
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" style={{width:"3em", height:"1.5em"}} checked={allowDelete} onChange={e => setAllowDelete(e.target.checked)} />
            </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <span className="fw-bold d-block">មុខងារកែប្រែទិន្នន័យ</span>
                <small className="text-muted">អនុញ្ញាតឱ្យកែប្រែព័ត៌មានភ្ញៀវ</small>
            </div>
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" style={{width:"3em", height:"1.5em"}} checked={allowEdit} onChange={e => setAllowEdit(e.target.checked)} />
            </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm" onClick={onSave}>
          <i className="fas fa-save me-2"></i> រក្សាទុកការកំណត់
      </button>
    </div>
  );
};

// --- NEW LOGIN PAGE (កែតម្រូវ) ---
const LoginPage = () => {
  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    // គ្រាន់តែហៅ signInWithPopup គឺចប់។ មិនបាច់ហៅ onLoginSuccess ទេ។
    // App នឹងដឹងដោយខ្លួនឯងតាមរយៈ onAuthStateChanged។
    firebase.auth().signInWithPopup(provider)
      .catch((error) => {
        alert("បរាជ័យក្នុងការចូលប្រព័ន្ធ: " + error.message);
      });
  };


 


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ fontFamily: "Battambang" }}>
      <div className="card border-0 shadow-lg p-5 text-center" style={{ maxWidth: "400px", width: "90%", borderRadius: "20px" }}>
        <div className="mb-4">
          <h2 className="text-primary fw-bold display-6"><i className="fas fa-heart text-danger"></i> Riebkear</h2>
          <p className="text-muted small">ប្រព័ន្ធគ្រប់គ្រងចំណងដៃ (សុវត្ថិភាព)</p>
        </div>
        
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-white border shadow-sm w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3"
          style={{transition: 'all 0.2s'}}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '20px'}} />
          ចូលប្រើជាមួយ Google
        </button>

        <div className="mt-4 text-muted small" style={{fontSize: '0.8rem'}}>
          ទិន្នន័យរបស់អ្នកត្រូវបានការពារដោយសុវត្ថិភាព <i className="fas fa-shield-alt text-success ms-1"></i>
        </div>
      </div>
    </div>
  );
};

const { useState, useEffect, useRef } = React;

// --- MAIN APP COMPONENT ---
function App() {
  // --- 1. STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // ចាប់ផ្តើមដោយ Loading
  
  // Unauthorized Modal State
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState("");

  // Data State
  const [guests, setGuests] = useState([]);
  const [invitedGuests, setInvitedGuests] = useState([]); // សម្រាប់ភ្ញៀវអញ្ជើញ
  const [activePage, setActivePage] = useState("home");

  // Settings & Info State
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [weddingAddress, setWeddingAddress] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [khmerName, setKhmerName] = useState("");
  const [phone, setPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [allowDelete, setAllowDelete] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  // UI Totals
  const [totalGuests, setTotalGuests] = useState(0);
  const [totalRiel, setTotalRiel] = useState(0);
  const [totalUsd, setTotalUsd] = useState(0);

  // Modals & Forms State
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Add/Edit Guest Form Data
  const [mId, setMId] = useState(null);
  const [mName, setMName] = useState("");
  const [mRawAmount, setMRawAmount] = useState("");
  const [mDisplayAmount, setMDisplayAmount] = useState("");
  const [mCurrency, setMCurrency] = useState("KHR");
  const [mAddress, setMAddress] = useState("");

  // Admin Emails configuration
  const allowedEmails = [
    "daropovkl85@gmail.com",
    "povdaroee@gmail.com"
  ];


  const [entryMode, setEntryMode] = useState("manual"); // 'manual' (ធម្មតា) ឬ 'search' (ទាញពីភ្ញៀវអញ្ជើញ)
  // --- 2. USE EFFECTS (LISTENERS) ---

  // A. AUTH LISTENER
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (allowedEmails.includes(user.email)) {
           setCurrentUser(user.uid);
           setUserProfile({ name: user.displayName, photo: user.photoURL });
        } else {
           setUnauthorizedEmail(user.email);
           setShowUnauthorizedModal(true);
           firebase.auth().signOut();
           setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // B. DATA LISTENER (ភ្ញៀវចំណងដៃ + ភ្ញៀវអញ្ជើញ + ការកំណត់)
  useEffect(() => {
    if (!currentUser) return;

    const db = firebase.database();

    // 1. Guests (ភ្ញៀវចំណងដៃ)
    const guestsRef = db.ref("users/" + currentUser + "/guests");
    const guestsListener = guestsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const loadedGuests = [];
      let tRiel = 0, tUsd = 0;
      if (data) {
        Object.keys(data).forEach((key) => {
          const item = data[key];
          loadedGuests.push({ id: key, ...item });
          if (!item.isDeleted) {
            if (item.currency === "KHR") tRiel += Number(item.amount);
            else tUsd += Number(item.amount);
          }
        });
      }
      loadedGuests.reverse();
      setGuests(loadedGuests);
      setTotalGuests(loadedGuests.filter(g => !g.isDeleted).length);
      setTotalRiel(tRiel);
      setTotalUsd(tUsd);
    });

    // 2. Invited Guests (ភ្ញៀវអញ្ជើញ - សម្រាប់ Search Mode) *** (ថ្មី) ***
    const invitedRef = db.ref("users/" + currentUser + "/invited_guests");
    const invitedListener = invitedRef.on("value", (snapshot) => {
        const data = snapshot.val();
        const loadedInvited = [];
        if (data) {
            Object.keys(data).forEach((key) => {
                loadedInvited.push({ id: key, ...data[key] });
            });
        }
        // តម្រៀបតាមឈ្មោះ ឬតាមលំដាប់ (Optional)
        setInvitedGuests(loadedInvited.reverse());
    });

    // 3. Settings (ទាញយក Mode និងព័ត៌មានកម្មវិធី) *** (Update) ***
    const settingsRef = db.ref("users/" + currentUser + "/settings");
    const settingsListener = settingsRef.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      setGroomName(data.groomName || "");
      setBrideName(data.brideName || "");
      setWeddingAddress(data.weddingAddress || "");
      setWeddingDate(data.weddingDate || "");
      setAllowDelete(data.allowDelete || false);
      setAllowEdit(data.allowEdit || false);
      
      // ទាញយក Mode (Manual ឬ Search)
      setEntryMode(data.entryMode || "manual"); 
    });

    // 4. User Info
    const userRef = db.ref("users/" + currentUser + "/userinfo");
    const userListener = userRef.on("value", (snapshot) => {
      const data = snapshot.val() || {};
      setKhmerName(data.khmerName || "");
      setPhone(data.phone || "");
      setUserAddress(data.address || "");
    });

    // Cleanup Listeners
    return () => { 
        guestsRef.off("value", guestsListener); 
        invitedRef.off("value", invitedListener); // Clear Invited Listener
        settingsRef.off("value", settingsListener);
        userRef.off("value", userListener);
    };
  }, [currentUser]);

  // Function សម្រាប់ប្ដូរ Entry Mode (ហៅពី SettingsPage)
  const handleToggleEntryMode = (val) => {
      const mode = val ? "search" : "manual";
      // Update ចូល Firebase
      firebase.database().ref("users/" + currentUser + "/settings").update({ entryMode: mode });
  };

  // --- 3. HELPER FUNCTIONS ---
  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => { setToast({ show: false, message: "", type: "" }); }, 3000);
  };

  const validateProfile = () => {
    if (!khmerName || !phone || !userAddress) {
      showToastMessage("សូមបំពេញ 'ព័ត៌មានម្ចាស់គណនី' ជាមុនសិន!", "error");
      setActivePage("settings"); 
      return false;
    }
    if (!groomName || !brideName || !weddingAddress || !weddingDate) {
      showToastMessage("សូមបំពេញ 'ព័ត៌មានកម្មវិធី' ជាមុនសិន!", "error");
      setActivePage("settings"); 
      return false;
    }
    return true;
  };

  // --- 4. ACTION HANDLERS ---
  
  // Save Settings
  const handleSaveSettings = () => {
    if (!currentUser) return;
    const db = firebase.database();
    const p1 = db.ref("users/" + currentUser + "/settings").update({
      groomName, brideName, weddingAddress, weddingDate
    });
    const p2 = db.ref("users/" + currentUser + "/userinfo").update({
      khmerName, phone, address: userAddress
    });
    Promise.all([p1, p2])
      .then(() => showToastMessage("រក្សាទុកព័ត៌មានជោគជ័យ!", "success"))
      .catch((err) => showToastMessage("បរាជ័យ: " + err.message, "error"));
  };

  const handleToggleDeletePermission = (val) => firebase.database().ref("users/" + currentUser + "/settings").update({ allowDelete: val });
  const handleToggleEditPermission = (val) => firebase.database().ref("users/" + currentUser + "/settings").update({ allowEdit: val });

  // Guest List Actions
  const handleUpdateGuestStatus = (id, isDeleted) => { firebase.database().ref("users/" + currentUser + "/guests/" + id).update({ isDeleted }); showToastMessage(isDeleted ? "បានដាក់ចូលធុងសំរាម" : "បានស្រោចស្រង់វិញ"); };
  const handlePermanentDelete = (id) => { firebase.database().ref("users/" + currentUser + "/guests/" + id).remove(); showToastMessage("លុបជាអចិន្ត្រៃយ៍ជោគជ័យ"); };

  const handleQuickSubmit = (guestData, onSuccess) => { 
    if (!validateProfile()) return; 
    firebase.database().ref("users/" + currentUser + "/guests").push({
      ...guestData, isDeleted: false, timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      showToastMessage("កត់ត្រាជោគជ័យ");
      if(onSuccess) onSuccess();
    });
  };

  // Modal Actions
  const openAddModal = () => {
    if (!validateProfile()) return; 
    setMId(null); setMName(""); setMRawAmount(""); setMDisplayAmount(""); setMAddress("");
    setShowModal(true);
  };

  const openEditModal = (guest) => {
    setMId(guest.id); setMName(guest.name); setMRawAmount(guest.amount);
    setMDisplayAmount(Number(guest.amount).toLocaleString("en-US"));
    setMCurrency(guest.currency); setMAddress(guest.address || "");
    setShowModal(true);
  };

  const handleSubmitGuest = (e) => {
    e.preventDefault();
    if (!mRawAmount || !currentUser) return;
    const guestData = { name: mName, amount: mRawAmount, currency: mCurrency, address: mAddress };
    const db = firebase.database();
    if (mId) {
      db.ref("users/" + currentUser + "/guests/" + mId).update(guestData).then(() => showToastMessage("កែប្រែទិន្នន័យជោគជ័យ"));
    } else {
      db.ref("users/" + currentUser + "/guests").push({
        ...guestData, isDeleted: false, timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => showToastMessage("កត់ត្រាជោគជ័យ"));
    }
    setMName(""); setMRawAmount(""); setMDisplayAmount(""); setMAddress("");
    if (mId) { setShowModal(false); setMId(null); }
  };

  const handleAmountChange = (e) => {
      const val = e.target.value.replace(/,/g, "");
      if (!isNaN(val) && val !== "") { setMRawAmount(val); setMDisplayAmount(parseFloat(val).toLocaleString("en-US")); } 
      else if (val === "") { setMRawAmount(""); setMDisplayAmount(""); }
  };
  
  const openConfirmModal = (msg, act) => { setConfirmMessage(msg); setConfirmAction(() => act); setShowConfirmModal(true); };
  const handleConfirmAction = () => { if(confirmAction) confirmAction(); setShowConfirmModal(false); };
  const handleLogout = () => { firebase.auth().signOut().then(() => setShowLogoutModal(false)); };

  // --- INVITED GUESTS ACTIONS (មុខងារសម្រាប់ភ្ញៀវអញ្ជើញ) ---
  const handleAddInvitedGuest = (data) => {
    if (!currentUser) return;
    firebase.database().ref("users/" + currentUser + "/invited_guests").push(data)
      .then(() => showToastMessage("បានបន្ថែមភ្ញៀវអញ្ជើញជោគជ័យ"));
  };

  // *** បន្ថែមថ្មី៖ Function សម្រាប់ Update ភ្ញៀវអញ្ជើញ ***
  const handleUpdateInvitedGuest = (id, data) => {
    if (!currentUser) return;
    firebase.database().ref("users/" + currentUser + "/invited_guests/" + id).update(data)
      .then(() => showToastMessage("កែប្រែទិន្នន័យជោគជ័យ"));
  };

  const handleDeleteInvitedGuest = (id) => {
    if (!currentUser) return;
    openConfirmModal("តើអ្នកចង់លុបឈ្មោះភ្ញៀវអញ្ជើញនេះមែនទេ?", () => {
        firebase.database().ref("users/" + currentUser + "/invited_guests/" + id).remove()
        .then(() => showToastMessage("លុបឈ្មោះជោគជ័យ"));
    });
  };

  const handleImportInvitedGuests = (dataList) => {
    if (!currentUser) return;
    const updates = {};
    const db = firebase.database();
    dataList.forEach(item => {
        const newKey = db.ref("users/" + currentUser + "/invited_guests").push().key;
        updates["/users/" + currentUser + "/invited_guests/" + newKey] = item;
    });
    db.ref().update(updates).then(() => showToastMessage("Import ទិន្នន័យជោគជ័យ!"));
  };

  // --- 5. RENDER UI ---



// --- 1. FUNCTION: QUICK ADD GUEST (បន្ថែមភ្ញៀវថ្មី) ---
  const handleQuickAddGuest = (guestData, onSuccess) => {
    if (!currentUser) return;

    const newGuestRef = firebase.database().ref("users/" + currentUser + "/guests").push();
    
    newGuestRef.set({
      name: guestData.name,
      amount: guestData.amount, // លេខសុទ្ធ (String)
      currency: guestData.currency,
      address: guestData.address || "",
      timestamp: Date.now(),
      isDeleted: false
    }, (error) => {
      if (error) {
        alert("បរាជ័យ៖ " + error.message);
      } else {
        // បើជោគជ័យ ហៅ function onSuccess ដើម្បី Reset Form
        if (onSuccess) onSuccess();
        
        // បង្ហាញសារ Toast
        setToast({ show: true, message: "បានរក្សាទុកជោគជ័យ!", type: "success" });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
      }
    });
  };

  // --- 2. FUNCTION: UPDATE STATUS (ដាក់ចូលធុងសំរាម / ស្តារ) ---
  const handleUpdateStatus = (id, isDeleted) => {
      if (!currentUser) return;
      firebase.database().ref("users/" + currentUser + "/guests/" + id).update({ isDeleted: isDeleted }, (error) => {
          if (!error) {
              const msg = isDeleted ? "បានដាក់ចូលធុងសំរាម" : "បានស្តារឡើងវិញ";
              setToast({ show: true, message: msg, type: "success" });
              setTimeout(() => setToast({ ...toast, show: false }), 3000);
          }
      });
  };


  // --- 4. FUNCTION: EDIT GUEST (បើក Modal កែប្រែ) ---
  const handleEditGuest = (guest) => {
      setMId(guest.id);
      setMName(guest.name);
      setMRawAmount(guest.amount);
      setMDisplayAmount(Number(guest.amount).toLocaleString());
      setMCurrency(guest.currency);
      setMAddress(guest.address || "");
      setShowModal(true); // បើក Modal
  };

  
  // Loading State
  if (loadingAuth) return <div className="d-flex justify-content-center align-items-center vh-100"><i className="fas fa-spinner fa-spin fa-3x text-primary"></i></div>;
  
  // Login Page / Unauthorized
  if (!currentUser) return (
    <>
        {/* សូមដាក់ Component LoginPage របស់អ្នកនៅទីនេះ ប្រសិនបើវាដាច់ដោយឡែក */}
        <LoginPage onLoginSuccess={() => {}} /> 

        {showUnauthorizedModal && (
            <>
            <div className="modal-backdrop fade show" style={{zIndex: 2000}}></div>
            <div className="modal fade show d-block" style={{zIndex: 2050}} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow-lg text-center overflow-hidden">
                        <div className="modal-body p-5">
                            <div className="mb-4 mx-auto d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle" style={{width: '80px', height: '80px'}}>
                                <i className="fas fa-user-lock text-danger display-4"></i>
                            </div>
                            <h4 className="fw-bold text-danger mb-3">គ្មានសិទ្ធិប្រើប្រាស់!</h4>
                            <p className="text-muted mb-4">សុំទោស! អ៊ីមែល <span className="fw-bold text-dark">{unauthorizedEmail}</span> មិនមានសិទ្ធិប្រើប្រាស់កម្មវិធីនេះទេ។</p>
                            <button className="btn btn-danger w-100 py-3 rounded-3 fw-bold shadow-sm" onClick={() => setShowUnauthorizedModal(false)}>យល់ព្រម</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}
    </>
  );

  // Main App Interface
  return (
    <div className="container-fluid p-0">
      {toast.show && <div className={`toast-notification ${toast.type==="success"?"toast-success":"toast-error"}`}><i className={`fas ${toast.type==="success"?"fa-check-circle":"fa-exclamation-circle"} me-3 fs-4`}></i><div>{toast.message}</div></div>}

      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2 d-none d-lg-block sidebar shadow-sm z-3">
             <div className="p-4 d-flex align-items-center text-primary fw-bold fs-4 border-bottom"><i className="fas fa-heart me-2"></i> Riebkear</div>
             {userProfile && <div className="p-3 d-flex align-items-center border-bottom bg-light"><img src={userProfile.photo||"https://via.placeholder.com/40"} className="rounded-circle me-2" width="40"/><div className="overflow-hidden"><div className="fw-bold text-truncate" style={{fontSize:'0.9rem'}}>{userProfile.name}</div></div></div>}
             <div className="p-3 d-flex flex-column h-100">
                <div className={`nav-link ${activePage==="home"?"active":""}`} onClick={()=>setActivePage("home")}><i className="fas fa-home me-3"></i>ទំព័រដើម</div>
                <div className={`nav-link ${activePage==="list"?"active":""}`} onClick={()=>setActivePage("list")}><i className="fas fa-list me-3"></i>បញ្ជីឈ្មោះ</div>
                <div className={`nav-link ${activePage==="invited"?"active":""}`} onClick={()=>setActivePage("invited")}><i className="fas fa-envelope-open-text me-3"></i>ភ្ញៀវអញ្ជើញ</div>
                <div className={`nav-link ${activePage==="report"?"active":""}`} onClick={()=>setActivePage("report")}><i className="fas fa-chart-pie me-3"></i>របាយការណ៍</div>
                <div className={`nav-link ${activePage==="settings"?"active":""}`} onClick={()=>setActivePage("settings")}><i className="fas fa-cog me-3"></i>ការកំណត់</div>
                <hr className="my-3 opacity-25"/>
                <div className="nav-link text-danger" onClick={()=>setShowLogoutModal(true)} style={{cursor:"pointer"}}><i className="fas fa-sign-out-alt me-3"></i>ចាកចេញ</div>
             </div>
        </div>

        {/* Content Area */}
        <div className="col-12 col-lg-10 main-content bg-light">
           <div className="d-lg-none d-flex justify-content-between align-items-center mb-4 pt-2">
              <div className="d-flex align-items-center">{userProfile && <img src={userProfile.photo} className="rounded-circle me-2 border" width="35"/>}<h5 className="fw-bold text-primary m-0">Riebkear</h5></div>
              <button className="btn btn-sm btn-outline-danger border-0" onClick={()=>setShowLogoutModal(true)}><i className="fas fa-sign-out-alt"></i></button>
           </div>

           {activePage === "home" && <HomePage totalGuests={totalGuests} totalRiel={totalRiel} totalUsd={totalUsd} recentGuests={guests.filter(g=>!g.isDeleted)} />}
           
           {/* ផ្នែក List Page */}
      {activePage === "list" && (
        <ListPage 
           guests={guests}
           
           // ✅ ត្រូវប្រាកដថាអ្នកបានដាក់ ២ បន្ទាត់នេះ (សំខាន់បំផុត!)
           invitedGuests={invitedGuests} 
           entryMode={entryMode}         

           onQuickAdd={handleQuickAddGuest}
           totalRiel={totalRiel}
           totalUsd={totalUsd}
           groomName={groomName}
           brideName={brideName}
           weddingAddress={weddingAddress}
           weddingDate={weddingDate}
           allowDelete={allowDelete}
           allowEdit={allowEdit}
           onUpdateStatus={handleUpdateStatus}
           onPermanentDelete={handlePermanentDelete}
           onEditGuest={handleEditGuest}
           openConfirm={openConfirmModal}
        />
      )}

           {/* ភ្ញៀវអញ្ជើញ Page */}
           {activePage === "invited" && (
              <InvitedPage 
                guests={invitedGuests} 
                onAdd={handleAddInvitedGuest} 
                onDelete={handleDeleteInvitedGuest} 
                onImport={handleImportInvitedGuests}
                onUpdate={handleUpdateInvitedGuest} // <--- បញ្ជូន function ថ្មីទៅ
                invitedGuests={invitedGuests} // <--- បញ្ជូន
           entryMode={entryMode}         // <--- បញ្ជូន
              />
           )}

           {activePage === "report" && <ReportPage guests={guests} />}
           
           {activePage === "settings" && (
             <SettingsPage 
               groomName={groomName} setGroomName={setGroomName} 
               brideName={brideName} setBrideName={setBrideName} 
               weddingAddress={weddingAddress} setWeddingAddress={setWeddingAddress} 
               weddingDate={weddingDate} setWeddingDate={setWeddingDate}
               khmerName={khmerName} setKhmerName={setKhmerName}
               phone={phone} setPhone={setPhone}
               userAddress={userAddress} setUserAddress={setUserAddress}
               allowDelete={allowDelete} onToggleDelete={handleToggleDeletePermission}
               allowEdit={allowEdit} onToggleEdit={handleToggleEditPermission}
               entryMode={entryMode} 
               onToggleEntryMode={handleToggleEntryMode} 
               onSave={handleSaveSettings} // ត្រូវប្រាកដថាមាន function នេះ
             />
           )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="d-lg-none fixed-bottom bg-white border-top py-2 d-flex justify-content-around shadow-lg z-3" style={{borderRadius:"20px 20px 0 0"}}>
          <div className={`text-center ${activePage==="home"?"text-primary":"text-muted"}`} onClick={()=>setActivePage("home")}><i className="fas fa-home fs-5"></i><div style={{fontSize:"10px"}}>ដើម</div></div>
          <div className={`text-center ${activePage==="list"?"text-primary":"text-muted"}`} onClick={()=>setActivePage("list")}><i className="fas fa-list fs-5"></i><div style={{fontSize:"10px"}}>បញ្ជី</div></div>
          
          <div className="fab-container"><button className="fab-btn" onClick={openAddModal}><i className="fas fa-plus"></i></button></div>
          
          <div className={`text-center ${activePage==="invited"?"text-primary":"text-muted"}`} onClick={()=>setActivePage("invited")}><i className="fas fa-envelope-open-text fs-5"></i><div style={{fontSize:"10px"}}>អញ្ជើញ</div></div>
          <div className={`text-center ${activePage==="settings"?"text-primary":"text-muted"}`} onClick={()=>setActivePage("settings")}><i className="fas fa-cog fs-5"></i><div style={{fontSize:"10px"}}>កំណត់</div></div>
      </div>

      {/* Main Add/Edit Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                  <div className="modal-header bg-primary text-white border-0"><h5 className="modal-title fw-bold">{mId?"កែប្រែព័ត៌មាន":"កត់ត្រាថ្មី"}</h5><button type="button" className="btn-close btn-close-white" onClick={()=>setShowModal(false)}></button></div>
                  <div className="modal-body p-4 bg-light">
                     <form onSubmit={handleSubmitGuest}>
                        <div className="mb-3"><label className="small fw-bold">ឈ្មោះ</label><input type="text" className="form-control" required value={mName} onChange={(e)=>setMName(e.target.value)} autoFocus/></div>
                        <div className="row mb-3">
                           <div className="col-7"><label className="small fw-bold">ទឹកប្រាក់</label><input type="text" inputMode="numeric" className="form-control" required value={mDisplayAmount} onChange={handleAmountChange}/>{mRawAmount && <small className="text-danger d-block mt-1 fw-bold" style={{fontSize:"0.8rem"}}>{convertMoneyToKhmerText(mRawAmount)} {mCurrency==="KHR"?"រៀល":"ដុល្លារ"}</small>}</div>
                           <div className="col-5"><label className="small fw-bold">ប្រភេទ</label><select className="form-select" value={mCurrency} onChange={(e)=>setMCurrency(e.target.value)}><option value="KHR">រៀល</option><option value="USD">ដុល្លារ</option></select></div>
                        </div>
                        <div className="mb-4"><label className="small fw-bold">អាសយដ្ឋាន</label><input type="text" className="form-control" value={mAddress} onChange={(e)=>setMAddress(e.target.value)}/></div>
                        <button className="btn btn-primary w-100 fw-bold py-2">{mId?"រក្សាទុកការកែប្រែ":"រក្សាទុក"}</button>
                     </form>
                  </div>
               </div>
            </div>
          </div>
        </>
      )}

      {/* Logout & Confirm Modals */}
      {showLogoutModal && (<><div className="modal-backdrop fade show" style={{zIndex:1055}}></div><div className="modal fade show d-block" tabIndex="-1" style={{zIndex:1060}}><div className="modal-dialog modal-dialog-centered modal-sm"><div className="modal-content border-0 rounded-4 shadow-lg text-center overflow-hidden"><div className="modal-body p-4"><div className="mb-3 mx-auto d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle" style={{width:"60px",height:"60px"}}><i className="fas fa-sign-out-alt text-danger fs-3"></i></div><h5 className="fw-bold text-dark mb-2">ចាកចេញ?</h5><p className="text-muted small mb-4">តើអ្នកពិតជាចង់ចាកចេញពីគណនីនេះមែនទេ?</p><div className="d-flex gap-2 justify-content-center"><button className="btn btn-light w-50 fw-bold rounded-3 text-muted" onClick={()=>setShowLogoutModal(false)}>ទេ</button><button className="btn btn-danger w-50 fw-bold rounded-3 shadow-sm" onClick={handleLogout}>ចាកចេញ</button></div></div></div></div></div></>)}
      {showConfirmModal && (<><div className="modal-backdrop fade show" style={{zIndex:1060}}></div><div className="modal fade show d-block" style={{zIndex:1070}} tabIndex="-1"><div className="modal-dialog modal-dialog-centered modal-sm"><div className="modal-content border-0 rounded-4 shadow-lg text-center overflow-hidden"><div className="modal-body p-4"><div className="mb-3 mx-auto d-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle" style={{width:'60px',height:'60px'}}><i className="fas fa-question text-warning fs-3"></i></div><h5 className="fw-bold text-dark mb-2">បញ្ជាក់?</h5><p className="text-muted small mb-4" style={{whiteSpace:'pre-line'}}>{confirmMessage}</p><div className="d-flex gap-2 justify-content-center"><button className="btn btn-light w-50 fw-bold rounded-3 text-muted" onClick={()=>setShowConfirmModal(false)}>ទេ</button><button className="btn btn-primary w-50 fw-bold rounded-3 shadow-sm" onClick={handleConfirmAction}>យល់ព្រម</button></div></div></div></div></div></>)}
    </div>
  );
}

// --- SUB-COMPONENTS (ត្រូវនៅខាងក្រៅ App function) ---

// --- INVITED PAGE COMPONENT (UPDATED: DISABLE BUTTON IF EMPTY) ---
const InvitedPage = ({ guests, onAdd, onUpdate, onDelete, onImport }) => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [editingId, setEditingId] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const nameInputRef = React.useRef(null);
  const addressInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  const filteredList = guests.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // ពិនិត្យមើលថាតើទិន្នន័យបានបំពេញគ្រប់ឬនៅ? (សម្រាប់បិទ/បើក ប៊ូតុង)
  const isFormValid = name.trim() !== "" && address.trim() !== "";

  // Focus on load
  React.useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, []);

  // Key Handlers
  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (addressInputRef.current) addressInputRef.current.focus();
    }
  };

  const handleAddressKeyDown = (e) => {
    if (e.key === "Enter") {
       e.preventDefault();
       // ហៅ Submit តែម្តង ប្រសិនបើទិន្នន័យគ្រប់គ្រាន់
       if (isFormValid) {
           handleSubmit(e);
       }
    } else if (e.key === "ArrowUp") {
       e.preventDefault();
       if (nameInputRef.current) nameInputRef.current.focus();
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    if(e) e.preventDefault();
    if (!name.trim() || !address.trim()) return; // ការពារបន្ថែម

    if (editingId) {
      onUpdate(editingId, { name, address });
      setEditingId(null);
    } else {
      // Check duplicate manual entry
      const isDup = guests.some(g => g.name.trim() === name.trim() && g.address.trim() === address.trim());
      if(isDup) {
         Swal.fire({
            icon: 'warning',
            title: 'ទិន្នន័យស្ទួន!',
            text: 'ឈ្មោះ និងអាសយដ្ឋាននេះមានក្នុងបញ្ជីរួចហើយ។',
            confirmButtonText: 'យល់ព្រម',
            confirmButtonColor: '#db2777'
         });
         return;
      }
      onAdd({ name, address });
    }
    
    setName("");
    setAddress("");
    if (nameInputRef.current) nameInputRef.current.focus();
  };

  const handleRowDoubleClick = (guest) => {
     setEditingId(guest.id);
     setName(guest.name);
     setAddress(guest.address || "");
     if (nameInputRef.current) nameInputRef.current.focus();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setAddress("");
    if (nameInputRef.current) nameInputRef.current.focus();
  };

 // --- IMPORT EXCEL FUNCTION (UPDATED: NO SUCCESS ALERT) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const importedCandidates = [];
      data.forEach((row, index) => {
        if (index > 0 && row[0]) {
           importedCandidates.push({ 
               name: String(row[0]).trim(), 
               address: row[1] ? String(row[1]).trim() : "" 
           });
        }
      });

      if (importedCandidates.length === 0) {
        Swal.fire({ icon: 'info', title: 'ឯកសារទទេ', text: 'មិនមានទិន្នន័យត្រូវបានរកឃើញទេ។' });
        e.target.value = null; 
        return;
      }

      const newEntries = [];
      let duplicateCount = 0;

      importedCandidates.forEach(candidate => {
         const isDuplicate = guests.some(existing => 
             existing.name.trim() === candidate.name && 
             (existing.address || "").trim() === candidate.address
         );

         if (isDuplicate) {
             duplicateCount++;
         } else {
             newEntries.push(candidate);
         }
      });

      if (duplicateCount > 0) {
          if (newEntries.length === 0) {
             Swal.fire({
                icon: 'warning',
                title: 'ទិន្នន័យស្ទួនទាំងអស់!',
                html: `បានរកឃើញឈ្មោះចំនួន <b>${duplicateCount}</b> នាក់ មាននៅក្នុងបញ្ជីរួចហើយ។`,
                confirmButtonColor: '#db2777'
             });
          } else {
             // ករណីមានស្ទួនខ្លះ ថ្មីខ្លះ
             Swal.fire({
                icon: 'question',
                title: 'រកឃើញទិន្នន័យស្ទួន!',
                html: `
                   <div style="text-align: left; font-size: 0.95rem;">
                       រកឃើញសរុប: <b>${importedCandidates.length}</b> នាក់<br/>
                       <span style="color: red;">● ស្ទួនគ្នា: <b>${duplicateCount}</b> នាក់ (រំលង)</span><br/>
                       <span style="color: green;">● ទិន្នន័យថ្មី: <b>${newEntries.length}</b> នាក់ (បញ្ចូល)</span>
                   </div>
                   <br/>តើអ្នកចង់បន្តបញ្ចូលតែទិន្នន័យថ្មីដែរឬទេ?
                `,
                showCancelButton: true,
                confirmButtonText: 'យល់ព្រម',
                cancelButtonText: 'បោះបង់',
                confirmButtonColor: '#198754',
                cancelButtonColor: '#d33'
             }).then((result) => {
                if (result.isConfirmed) {
                   onImport(newEntries);
                   // កែសម្រួល៖ លុបសារជោគជ័យចេញត្រង់នេះ
                }
             });
          }
      } else {
          // ករណីថ្មីទាំងអស់ (មិនមានស្ទួន)
          Swal.fire({
            title: 'បញ្ជាក់ការ Import',
            text: `តើអ្នកចង់បញ្ចូលភ្ញៀវចំនួន ${newEntries.length} នាក់ មែនទេ?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'យល់ព្រម',
            cancelButtonText: 'បោះបង់'
          }).then((result) => {
            if (result.isConfirmed) {
              onImport(newEntries);
              // កែសម្រួល៖ លុបសារជោគជ័យចេញត្រង់នេះ
            }
          });
      }
      e.target.value = null; 
    };
    reader.readAsBinaryString(file);
  };

   const handleExportPDF = () => {
    const element = document.getElementById('pdf-template');
    
    const opt = {
      margin:       0, // <--- សំខាន់៖ ដាក់ 0 ដើម្បីឱ្យ CSS គ្រប់គ្រងទីតាំងវិញ
      filename:     `Invited_Guests_List.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0 }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary m-0"><i className="fas fa-envelope-open-text me-2"></i>ភ្ញៀវគោរពអញ្ជើញ</h4>
          <button className="btn btn-danger shadow-sm rounded-pill px-4 fw-bold" onClick={handleExportPDF}>
              <i className="fas fa-file-pdf me-2"></i> PDF
          </button>
      </div>

      <div className="row">
        {/* INPUT FORM */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{top: '20px'}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold m-0">{editingId ? "កែប្រែព័ត៌មាន" : "បញ្ចូលឈ្មោះភ្ញៀវ"}</h6>
                {editingId && <button className="btn btn-sm btn-light text-danger" onClick={handleCancelEdit}><i className="fas fa-times"></i></button>}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input type="text" className="form-control bg-light border-0 py-2" placeholder="ឈ្មោះភ្ញៀវ..." value={name} onChange={e => setName(e.target.value)} ref={nameInputRef} onKeyDown={handleNameKeyDown} required />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control bg-light border-0 py-2" placeholder="អាសយដ្ឋាន..." value={address} onChange={e => setAddress(e.target.value)} ref={addressInputRef} onKeyDown={handleAddressKeyDown} />
              </div>
              
              {/* BUTTON WITH DISABLED STATE */}
              <button 
                  type="submit" 
                  disabled={!isFormValid} // <--- ចំណុចសំខាន់៖ បិទប៊ូតុងបើមិនទាន់ពេញលេញ
                  className={`btn w-100 rounded-pill fw-bold mb-3 ${editingId ? "btn-warning" : "btn-primary"}`}
                  style={{ opacity: isFormValid ? 1 : 0.6, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
              >
                  <i className={`fas ${editingId ? "fa-save" : "fa-plus-circle"} me-2`}></i>
                  {editingId ? "រក្សាទុកការកែប្រែ" : "បញ្ចូលបញ្ជី"}
              </button>
            </form>
            
            <hr className="my-3"/>
            <h6 className="fw-bold mb-3 text-success">Import ពី Excel</h6>
            <input type="file" accept=".xlsx, .xls" className="d-none" ref={fileInputRef} onChange={handleFileChange} />
            <button className="btn btn-outline-success w-100 rounded-pill fw-bold" onClick={() => fileInputRef.current.click()}>
              <i className="fas fa-file-excel me-2"></i>ជ្រើសរើសឯកសារ Excel
            </button>
          </div>
        </div>

        {/* GUEST LIST TABLE */}
        <div className="col-md-8">
           <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                 <h6 className="fw-bold m-0">បញ្ជីឈ្មោះ ({filteredList.length} នាក់)</h6>
                 <div className="input-group" style={{maxWidth: '200px'}}>
                    <span className="input-group-text bg-light border-0"><i className="fas fa-search small"></i></span>
                    <input type="text" className="form-control bg-light border-0 small" placeholder="ស្វែងរក..." onChange={e => setSearchTerm(e.target.value)} />
                 </div>
              </div>
              <div className="card-body p-0">
                 {filteredList.length > 0 ? (
                    <div className="table-responsive" style={{maxHeight: '600px'}}>
                       <table className="table table-hover align-middle mb-0">
                          <thead className="bg-light text-muted small text-uppercase">
                             <tr>
                                <th className="ps-4 border-0">#</th>
                                <th className="border-0">ឈ្មោះ</th>
                                <th className="border-0">អាសយដ្ឋាន</th>
                                <th className="text-end pe-4 border-0">សកម្មភាព</th>
                             </tr>
                          </thead>
                          <tbody>
                             {filteredList.map((g, index) => (
                                <tr key={g.id} onDoubleClick={() => handleRowDoubleClick(g)} style={{cursor: 'pointer'}} className={editingId === g.id ? "table-warning" : ""}>
                                   <td className="ps-4 text-muted">{index + 1}</td>
                                   <td className="fw-bold">{g.name}</td>
                                   <td className="text-muted small">{g.address || "-"}</td>
                                   <td className="text-end pe-4">
                                      <button className="btn btn-link text-danger p-0" onClick={(e) => { e.stopPropagation(); onDelete(g.id); }}>
                                         <i className="fas fa-trash-alt"></i>
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 ) : (
                    <div className="text-center py-5 text-muted">មិនទាន់មានទិន្នន័យ</div>
                 )}
              </div>
           </div>
        </div>
      </div>
      

      {/* ===================================================================================
          PDF TEMPLATE (UPDATED: 24 ROWS ON PAGE 1 - COMPACT STYLE)
      ==================================================================================== */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
         <div id="pdf-template" style={{ width: "210mm", backgroundColor: "white", color: "black", margin: 0, padding: 0 }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moul&display=swap');
                    .font-moul { font-family: 'Moul', cursive; }
                    .font-battambang { font-family: 'Battambang', sans-serif; }
                    
                    .pdf-page {
                        width: 210mm;
                        height: 295mm; 
                        padding: 15mm 15mm 5mm 15mm; 
                        box-sizing: border-box;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        background: white;
                        overflow: hidden;
                        page-break-after: always;
                    }
                    
                    .last-page {
                        page-break-after: avoid !important;
                        height: 295mm; 
                    }
                `}
            </style>

            {/* LOGIC បំបែកទំព័រ */}
            {(() => {
                // --- កែសម្រួលចំនួនជួរត្រង់នេះ ---
                const rowsPage1 = 27;     // ទំព័រទី ១ បង្ហាញ ២៤ នាក់ (តាមសំណើ)
                const rowsPageOther = 28; // ទំព័របន្ទាប់ បង្ហាញ ២៨ នាក់ (Header តូចជាង)
                // -----------------------------

                const pages = [];

                if (filteredList.length <= rowsPage1) {
                    pages.push(filteredList);
                } else {
                    pages.push(filteredList.slice(0, rowsPage1));
                    let i = rowsPage1;
                    while (i < filteredList.length) {
                        pages.push(filteredList.slice(i, i + rowsPageOther));
                        i += rowsPageOther;
                    }
                }

                return pages.map((pageData, pageIndex) => {
                    const isFirstPage = pageIndex === 0;
                    const isLastPage = pageIndex === pages.length - 1;
                    const startNo = isFirstPage ? 0 : rowsPage1 + ((pageIndex - 1) * rowsPageOther);

                    return (
                        <div key={pageIndex} className={`pdf-page ${isLastPage ? 'last-page' : ''}`}>
                            
                            {/* --- CONTENT WRAPPER --- */}
                            <div style={{ flexGrow: 1 }}>
                                
                                {/* --- HEADER --- */}
                                {isFirstPage ? (
                                    <div style={{ textAlign: "center", marginBottom: "15px", borderBottom: "2px solid #0d6efd", paddingBottom: "10px" }}>
                                        <h1 className="font-moul" style={{ color: "#0d6efd", fontSize: "20px", margin: 0, lineHeight: "1.5" }}>បញ្ជីភ្ញៀវគោរពអញ្ជើញ</h1>
                                        <h3 className="font-moul" style={{ fontSize: "13px", margin: "5px 0 0 0", color: "#333" }}>Riebkear App</h3>
                                        <p className="font-battambang" style={{ color: "#666", marginTop: "5px", fontSize: "10px" }}>
                                            កាលបរិច្ឆេទ: {new Date().toLocaleDateString('km-KH')} &nbsp;|&nbsp; សរុប: <b>{filteredList.length}</b> នាក់
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center", marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                                         <h4 className="font-moul" style={{ color: "#999", fontSize: "12px", margin: 0 }}>បញ្ជីភ្ញៀវ (ត) - ទំព័រទី {pageIndex + 1}</h4>
                                    </div>
                                )}

                                {/* --- TABLE (Compact Style) --- */}
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#0d6efd", color: "white" }}>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", width: "40px", textAlign: "center" }}>ល.រ</th>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", textAlign: "center" }}>គោត្តនាម និង នាម</th>
                                            <th className="font-battambang" style={{ padding: "6px", border: "1px solid #999", textAlign: "center" }}>អាសយដ្ឋាន / ផ្សេងៗ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageData.map((g, idx) => {
                                            const globalIndex = startNo + idx;
                                            return (
                                                <tr key={g.id || idx} style={{ backgroundColor: globalIndex % 2 === 0 ? "#f2f6fc" : "white" }}>
                                                    {/* លេខរៀង */}
                                                    <td className="font-battambang" style={{ padding: "6px", border: "1px solid #ddd", textAlign: "center" }}>
                                                        {globalIndex + 1}
                                                    </td>
                                                    {/* ឈ្មោះ (Moul Font) */}
                                                    <td className="font-moul" style={{ padding: "6px", border: "1px solid #ddd", fontSize: "12px", color: "#000", textAlign: "center", backgroundColor: "white" }}>
                                                        {g.name}
                                                    </td>
                                                    {/* អាសយដ្ឋាន */}
                                                    <td className="font-battambang" style={{ padding: "6px", border: "1px solid #ddd" }}>
                                                        {g.address || ""}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- FOOTER --- */}
                            <div style={{ marginTop: "auto", paddingTop: "5px", borderTop: "1px solid #eee", textAlign: "center" }}>
                                <div className="font-battambang" style={{ fontSize: "9px", color: "#999" }}>
                                    ទំព័រ {pageIndex + 1} / {pages.length} | Created by Riebkear App System
                                </div>
                            </div>

                        </div>
                    );
                });
            })()}
         </div>
      </div>
     
      
    </div>
  );
};

// Render Application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
