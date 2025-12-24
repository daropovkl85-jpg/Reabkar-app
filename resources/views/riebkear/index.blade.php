<!DOCTYPE html>
<html lang="km">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Riebkear Dashboard</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet"/>
    
    <style>
        body {
  font-family: "Battambang", cursive;
  background-color: #f8f9fa;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  background-color: white;
  height: 100vh;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}
.nav-link {
  color: #64748b;
  padding: 15px 20px;
  margin: 5px 10px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-link:hover {
  background-color: #fff1f2;
  color: #db2777;
  transform: translateX(5px);
}
.nav-link.active {
  background-color: #db2777;
  color: white;
  box-shadow: 0 4px 10px rgba(219, 39, 119, 0.3);
}

/* Main Content */
.main-content {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 100px;
}

/* Components */
.quick-entry-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
}
.form-control:focus,
.form-select:focus {
  border-color: #db2777;
  box-shadow: 0 0 0 0.25rem rgba(219, 39, 119, 0.25);
}
.recent-item {
  background: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
}

/* Stats Cards */
.stat-card {
  border: none;
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.stat-card:hover {
  transform: translateY(-5px);
}
.bg-gradient-pink {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}
.bg-gradient-blue {
  background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
}
.bg-gradient-green {
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
}
.card-icon-bg {
  position: absolute;
  right: -10px;
  bottom: -10px;
  font-size: 5rem;
  opacity: 0.2;
  transform: rotate(-15deg);
}

/* --- MOBILE FAB (NEW POSITION: RIGHT SIDE) --- */
.fab-container {
  position: fixed; /* ប្រើ Fixed ដើម្បីឱ្យនៅជាប់អេក្រង់ */
  bottom: 60px;    /* កម្ពស់ពីបាតឡើងលើ (ផុត Menu Bar បន្តិច) */
  right: 10px;     /* ឃ្លាតពីខាងស្តាំ 20px */
  z-index: 1050;   /* ឱ្យនៅពីលើគេ */
  transform: none; /* លុបចោលការតម្រឹម Center ចាស់ */
  left: auto;      /* លុបចោល left ចាស់ */
  top: auto;       /* លុបចោល top ចាស់ */
}

.fab-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(219, 39, 119, 0.5);
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.fab-btn:active {
  transform: scale(0.9);
}


/* --- TOAST NOTIFICATION (សារដំណឹង) --- */
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px; /* បង្ហាញនៅខាងស្តាំផ្នែកខាងលើ */
    z-index: 9999;
    min-width: 300px;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    font-family: 'Battambang', cursive;
    font-weight: bold;
    animation: slideIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards; /* ចូលមក 0.5s, បាត់ទៅវិញក្រោយ 2.5s */
}

/* ពណ៌សម្រាប់ជោគជ័យ */
.toast-success {
    background-color: #d1e7dd;
    color: #0f5132;
    border-left: 5px solid #198754;
}

/* ពណ៌សម្រាប់បរាជ័យ */
.toast-error {
    background-color: #f8d7da;
    color: #842029;
    border-left: 5px solid #dc3545;
}

/* ចលនា */
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; pointer-events: none; }
}

/* សម្រាប់អេក្រង់ទូរស័ព្ទ ឱ្យនៅកណ្តាល */
@media (max-width: 768px) {
    .toast-notification {
        left: 50%;
        transform: translateX(-50%);
        right: auto;
        width: 90%;
        min-width: auto;
        animation: slideInMobile 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
    }
    @keyframes slideInMobile {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
}
/* ធ្វើឱ្យ SVG QR Code នៅកណ្តាល */
svg {
    width: 100% !important;
    height: auto !important;
    max-width: 250px;
}


    </style>
</head>
<body>

    <div id="root"></div>

    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    
    <script type="text/babel" src="{{ asset('js/riebkear.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.min.js"></script>

</body>
</html>