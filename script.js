/**
 * ==============================================================================
 * INVITATION & HEADLESS GOOGLE FORM RSVP SCRIPT
 * ==============================================================================
 */

// ==============================================================================
// 1. CONFIGURATION (Edit this section to connect your Google Form & Event details)
// ==============================================================================
const CONFIG = {
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeuGOZEprJ-fde9eobor1W5ol8d4emlpzRWNzpoz0PgdPRTqw/formResponse",

  entries: {
    guestId: "entry.1000092928",      // Chức vụ
    guestName: "entry.1260950142",    // Tên khách mời
    attendance: "entry.679443011",    // Xác nhận tham gia
    notes: "entry.562253103"          // Ghi chú
  },

  event: {
    title: "Lễ Kỷ Niệm 20/11 • NURTURER",
    subtitle: "Ươm mầm tri thức — Vươn tầm tương lai",
    host: "WESET English Center",
    dateISO: "2026-11-18T17:00:00+07:00",
    endDateISO: "2026-11-18T21:30:00+07:00",
    displayDate: "17:00 – 21:20 • 18/11/2026",
    venue: "Khách sạn Đồng Khánh",
    address: "Số 2 Trần Hưng Đạo B, Phường An Đông, TP. Hồ Chí Minh",
    mapUrl: "https://maps.app.goo.gl/CDC8GUV7KNxxcJUL8",
    deadlineText: "17/11/2026",
  },

  audio: {
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-moment-113524.mp3",
    autoplay: true
  },

  storagePrefix: "rsvp_submitted_"
};

// ==============================================================================
// 2. STATE MANAGEMENT
// ==============================================================================
const state = {
  guestId: "",
  guestRole: "",
  guestName: "",
  selectedAttendance: "Tham gia",
  isSubmitting: false,
  hasSubmitted: false,
  isPlayingAudio: false
};

// ==============================================================================
// 3. DOM ELEMENTS CACHE
// ==============================================================================
const DOM = {
  // Personalization
  guestNameDisplay: document.getElementById("guest-name-display"),
  guestIdDisplay: document.getElementById("guest-id-display"),
  guestSalutationBox: document.getElementById("guest-salutation-box"),
  previewGuestName: document.getElementById("preview-guest-name"),
  previewGuestId: document.getElementById("preview-guest-id"),
  
  // Hidden inputs
  inputGuestId: document.getElementById("input-guest-id"),
  inputGuestName: document.getElementById("input-guest-name"),
  inputAttendanceStatus: document.getElementById("input-attendance-status"),

  // Form controls
  rsvpForm: document.getElementById("rsvp-form"),
  btnAccept: document.getElementById("btn-rsvp-accept"),
  btnDecline: document.getElementById("btn-rsvp-decline"),
  textareaNotes: document.getElementById("textarea-notes"),
  charCount: document.getElementById("char-count"),
  btnSubmit: document.getElementById("btn-submit-rsvp"),
  formFeedback: document.getElementById("form-feedback"),
  submittedBanner: document.getElementById("rsvp-submitted-banner"),
  submittedTitle: document.getElementById("submitted-title"),
  submittedSummary: document.getElementById("submitted-summary"),
  btnReEdit: document.getElementById("btn-re-edit"),

  // Event details
  eventTitle: document.getElementById("event-title"),
  eventSubtitle: document.getElementById("event-subtitle"),
  eventDate: document.getElementById("event-date"),
  eventTime: document.getElementById("event-time"),
  eventVenue: document.getElementById("event-venue"),
  eventAddress: document.getElementById("event-address"),
  eventDresscode: document.getElementById("event-dresscode"),
  rsvpDeadline: document.getElementById("rsvp-deadline"),
  eventHost: document.getElementById("event-host"),
  btnMap: document.getElementById("btn-map"),
  btnCalendar: document.getElementById("btn-calendar"),

  // Countdown
  cdDays: document.getElementById("cd-days"),
  cdHours: document.getElementById("cd-hours"),
  cdMinutes: document.getElementById("cd-minutes"),
  cdSeconds: document.getElementById("cd-seconds"),

  // Audio
  audioEl: document.getElementById("bg-audio"),
  audioToggleBtn: document.getElementById("audio-toggle-btn"),
  audioTooltip: document.getElementById("audio-tooltip"),

  // Modal
  modalBackdrop: document.getElementById("confirmation-modal"),
  modalCloseBtn: document.getElementById("modal-close-btn"),
  modalGuestName: document.getElementById("modal-guest-name"),
  modalStatusBox: document.getElementById("modal-status-box"),
  modalBtnCalendar: document.getElementById("modal-btn-calendar"),
  modalBtnDone: document.getElementById("modal-btn-done"),

  // Toast
  toastContainer: document.getElementById("toast-container")
};

// ==============================================================================
// 4. URL PARSING & INITIALIZATION
// ==============================================================================
function parseUrlParameters() {
  const searchParams = new URLSearchParams(window.location.search);
  
  let id = searchParams.get("id") || "";
  id = id.trim();

  let role = searchParams.get("role") || "";
  role = role.trim();

  let name = searchParams.get("name") || "";
  name = name.trim();

  try {
    name = decodeURIComponent(name.replace(/\+/g, " "));
    role = decodeURIComponent(role.replace(/\+/g, " "));
  } catch (err) {
    console.warn("Could not URI decode parameter:", err);
  }

  if (!name) name = "Quý Khách";
  if (!role) role = "Khách mời";
  if (!id) id = "VIP-GUEST";

  return { id, role, name };
}

function initializeGuestData() {
  const { id, role, name } = parseUrlParameters();
  state.guestId = id;
  state.guestRole = role;
  state.guestName = name;

  // Cập nhật tên và chức vụ lên thiệp
  if (DOM.guestNameDisplay) DOM.guestNameDisplay.textContent = name;
  if (DOM.guestIdDisplay) DOM.guestIdDisplay.textContent = role; // Hiển thị chức vụ thay vì ID

  // Cập nhật form
  if (DOM.previewGuestName) DOM.previewGuestName.textContent = name;
  if (DOM.previewGuestId) DOM.previewGuestId.textContent = `(${role})`;

  if (DOM.inputGuestId) DOM.inputGuestId.value = role; // Gửi chức vụ về form thay cho ID
  if (DOM.inputGuestName) DOM.inputGuestName.value = name;
  if (DOM.inputAttendanceStatus) DOM.inputAttendanceStatus.value = state.selectedAttendance;
}

function initializeEventDetails() {
  if (DOM.eventTitle) DOM.eventTitle.textContent = CONFIG.event.title;
  if (DOM.eventSubtitle) DOM.eventSubtitle.textContent = CONFIG.event.subtitle;
  if (DOM.eventDate) DOM.eventDate.textContent = CONFIG.event.displayDate;
  if (DOM.eventTime) DOM.eventTime.textContent = CONFIG.event.displayTime;
  if (DOM.eventVenue) DOM.eventVenue.textContent = CONFIG.event.venue;
  if (DOM.eventAddress) DOM.eventAddress.textContent = CONFIG.event.address;
  if (DOM.eventDresscode) DOM.eventDresscode.textContent = CONFIG.event.dressCode;
  if (DOM.rsvpDeadline) DOM.rsvpDeadline.textContent = CONFIG.event.deadlineText;
  if (DOM.eventHost) DOM.eventHost.textContent = CONFIG.event.host;

  if (DOM.btnMap && CONFIG.event.mapUrl) DOM.btnMap.href = CONFIG.event.mapUrl;
}

// ==============================================================================
// 5. AUDIO AUTOPLAY & PLAYBACK FALLBACK
// ==============================================================================
function setupAudio() {
  if (!DOM.audioEl || !DOM.audioToggleBtn) return;
  DOM.audioEl.src = CONFIG.audio.src;

  const updateAudioUI = (playing) => {
    state.isPlayingAudio = playing;
    if (playing) {
      DOM.audioToggleBtn.classList.add("is-playing");
      DOM.audioToggleBtn.setAttribute("aria-label", "Tạm dừng nhạc");
      if (DOM.audioTooltip) DOM.audioTooltip.textContent = "Đang phát";
    } else {
      DOM.audioToggleBtn.classList.remove("is-playing");
      DOM.audioToggleBtn.setAttribute("aria-label", "Bật nhạc nền");
      if (DOM.audioTooltip) DOM.audioTooltip.textContent = "Bật nhạc";
    }
  };

  const tryPlay = () => {
    DOM.audioEl.play().then(() => {
      updateAudioUI(true);
      removeInteractionListeners();
    }).catch(() => updateAudioUI(false));
  };

  if (CONFIG.audio.autoplay) tryPlay();

  const onUserGesture = () => { if (!state.isPlayingAudio) tryPlay(); };
  const addInteractionListeners = () => {
    window.addEventListener("click", onUserGesture, { once: true });
    window.addEventListener("touchstart", onUserGesture, { once: true });
    window.addEventListener("keydown", onUserGesture, { once: true });
  };
  const removeInteractionListeners = () => {
    window.removeEventListener("click", onUserGesture);
    window.removeEventListener("touchstart", onUserGesture);
    window.removeEventListener("keydown", onUserGesture);
  };

  addInteractionListeners();

  DOM.audioToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (DOM.audioEl.paused) {
      DOM.audioEl.play().then(() => updateAudioUI(true)).catch(err => {
        playWebAudioChime();
        updateAudioUI(true);
      });
    } else {
      DOM.audioEl.pause();
      updateAudioUI(false);
    }
  });
}

function playWebAudioChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 2.6);
    });
  } catch (e) {}
}

// ==============================================================================
// 6. COUNTDOWN TIMER
// ==============================================================================
function setupCountdown() {
  const targetDate = new Date(CONFIG.event.dateISO).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (DOM.cdDays) DOM.cdDays.textContent = "00";
      if (DOM.cdHours) DOM.cdHours.textContent = "00";
      if (DOM.cdMinutes) DOM.cdMinutes.textContent = "00";
      if (DOM.cdSeconds) DOM.cdSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (DOM.cdDays) DOM.cdDays.textContent = String(days).padStart(2, "0");
    if (DOM.cdHours) DOM.cdHours.textContent = String(hours).padStart(2, "0");
    if (DOM.cdMinutes) DOM.cdMinutes.textContent = String(minutes).padStart(2, "0");
    if (DOM.cdSeconds) DOM.cdSeconds.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ==============================================================================
// 7. CALENDAR EXPORT
// ==============================================================================
function downloadIcsCalendar() {
  const startDate = new Date(CONFIG.event.dateISO);
  const endDate = new Date(CONFIG.event.endDateISO || (startDate.getTime() + 4 * 3600 * 1000));
  const formatICS = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WESET//NURTURER 2011//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:weset-2011-${(state.guestId || 'guest').replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}@weset.edu.vn`,
    `DTSTAMP:${formatICS(new Date())}`,
    `DTSTART:${formatICS(startDate)}`,
    `DTEND:${formatICS(endDate)}`,
    `SUMMARY:${CONFIG.event.title}`,
    `DESCRIPTION:${CONFIG.event.subtitle}\\nĐịa điểm: ${CONFIG.event.address}`,
    `LOCATION:${CONFIG.event.venue}, ${CONFIG.event.address}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Thiep_Moi_20_11_WESET.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setupCalendarButtons() {
  const handleCalendar = () => {
    const isAppleDevice = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    if (isAppleDevice && !window.MSStream) {
      downloadIcsCalendar();
      showToast("Đã tải lịch nhắc sự kiện (.ics)!", "success");
      return;
    }

    const startDate = new Date(CONFIG.event.dateISO);
    const endDate = new Date(CONFIG.event.endDateISO || (startDate.getTime() + 4 * 3600 * 1000));
    const formatGCal = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.event.title)}&dates=${formatGCal(startDate)}/${formatGCal(endDate)}&details=${encodeURIComponent(CONFIG.event.subtitle + "\nĐịa chỉ: " + CONFIG.event.address)}&location=${encodeURIComponent(CONFIG.event.venue + ", " + CONFIG.event.address)}`;

    window.open(gCalUrl, "_blank", "noopener,noreferrer");
  };

  if (DOM.btnCalendar) DOM.btnCalendar.addEventListener("click", handleCalendar);
  if (DOM.modalBtnCalendar) DOM.modalBtnCalendar.addEventListener("click", handleCalendar);
}

// ==============================================================================
// 8. ONE-TAP RSVP & HEADLESS SUBMISSION
// ==============================================================================
function setupRsvpForm() {
  checkExistingSubmission();

  if (DOM.textareaNotes && DOM.charCount) {
    DOM.textareaNotes.addEventListener("input", () => {
      DOM.charCount.textContent = DOM.textareaNotes.value.length;
    });
  }

  if (DOM.btnAccept) {
    DOM.btnAccept.addEventListener("click", () => {
      setActiveAttendance("Tham gia");
      submitRsvpForm("Tham gia", DOM.btnAccept);
    });
  }

  if (DOM.btnDecline) {
    DOM.btnDecline.addEventListener("click", () => {
      setActiveAttendance("Không thể tham gia");
      submitRsvpForm("Không thể tham gia", DOM.btnDecline);
    });
  }

  if (DOM.rsvpForm) {
    DOM.rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitRsvpForm(state.selectedAttendance, DOM.btnSubmit);
    });
  }

  if (DOM.btnReEdit) {
    DOM.btnReEdit.addEventListener("click", () => {
      enableFormInputs();
      if (DOM.submittedBanner) DOM.submittedBanner.classList.add("hidden");
      if (DOM.rsvpForm) DOM.rsvpForm.classList.remove("hidden");
      showToast("Anh/Chị vẫn có thể thay đổi và xác nhận lại.", "info");
    });
  }

  if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener("click", closeModal);
  if (DOM.modalBtnDone) DOM.modalBtnDone.addEventListener("click", closeModal);
  if (DOM.modalBackdrop) {
    DOM.modalBackdrop.addEventListener("click", (e) => {
      if (e.target === DOM.modalBackdrop) closeModal();
    });
  }
}

function setActiveAttendance(status) {
  state.selectedAttendance = status;
  if (DOM.inputAttendanceStatus) DOM.inputAttendanceStatus.value = status;
  if (status === "Tham gia") {
    DOM.btnAccept?.classList.add("is-selected");
    DOM.btnDecline?.classList.remove("is-selected");
  } else {
    DOM.btnDecline?.classList.add("is-selected");
    DOM.btnAccept?.classList.remove("is-selected");
  }
}

async function submitRsvpForm(attendanceStatus, triggeringButton) {
  if (state.isSubmitting) return;

  const guestRole = state.guestRole;
  const guestName = state.guestName;
  const notes = DOM.textareaNotes?.value.trim() || "";
  const formAttendanceValue = (attendanceStatus === "Tham gia") ? "Tham gia" : "Không th\u1ec3 tham gia";

  const payload = { guestRole, guestName, attendance: formAttendanceValue, notes };
  setSubmittingState(true, triggeringButton);

  try {
    const formData = new URLSearchParams();
    formData.append(CONFIG.entries.guestId, guestRole);
    formData.append(CONFIG.entries.guestName, guestName);
    formData.append(CONFIG.entries.attendance, formAttendanceValue);
    formData.append(CONFIG.entries.notes, notes);

    await fetch(CONFIG.formActionUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    onSubmissionSuccess(payload);
  } catch (error) {
    showToast("Không thể gửi phản hồi. Vui lòng thử lại hoặc liên hệ hotline!", "error");
    if (DOM.formFeedback) {
      DOM.formFeedback.className = "form-feedback is-visible is-error";
      DOM.formFeedback.textContent = "Có lỗi xảy ra trong quá trình gửi. Vui lòng kiểm tra lại kết nối mạng!";
    }
  } finally {
    setSubmittingState(false, triggeringButton);
  }
}

function onSubmissionSuccess(data) {
  state.hasSubmitted = true;
  saveSubmissionState(data);
  disableFormInputs();
  renderSubmittedBanner(data);
  openConfirmationModal(data);
  showToast("Cảm ơn Anh/Chị đã xác nhận phản hồi!", "success");
}

function setSubmittingState(isSubmitting, triggeringButton) {
  state.isSubmitting = isSubmitting;
  if (triggeringButton) {
    isSubmitting ? triggeringButton.classList.add("is-loading") : triggeringButton.classList.remove("is-loading");
  }
  if (DOM.btnAccept) DOM.btnAccept.disabled = isSubmitting;
  if (DOM.btnDecline) DOM.btnDecline.disabled = isSubmitting;
  if (DOM.btnSubmit) DOM.btnSubmit.disabled = isSubmitting;
  if (DOM.textareaNotes) DOM.textareaNotes.disabled = isSubmitting;
}

function disableFormInputs() {
  if (DOM.btnAccept) DOM.btnAccept.disabled = true;
  if (DOM.btnDecline) DOM.btnDecline.disabled = true;
  if (DOM.btnSubmit) DOM.btnSubmit.disabled = true;
  if (DOM.textareaNotes) DOM.textareaNotes.disabled = true;
}

function enableFormInputs() {
  if (DOM.btnAccept) DOM.btnAccept.disabled = false;
  if (DOM.btnDecline) DOM.btnDecline.disabled = false;
  if (DOM.btnSubmit) DOM.btnSubmit.disabled = false;
  if (DOM.textareaNotes) DOM.textareaNotes.disabled = false;
}

function renderSubmittedBanner(data) {
  if (!DOM.submittedBanner) return;
  const isAttending = data.attendance === "Tham gia";
  
  if (DOM.submittedTitle) DOM.submittedTitle.textContent = isAttending ? "Đã Xác Nhận Tham Gia" : "Đã Ghi Nhận Phản Hồi";
  if (DOM.submittedSummary) {
    DOM.submittedSummary.innerHTML = isAttending
      ? `Cảm ơn <strong>${escapeHtml(data.guestName)}</strong>! Chúng tôi rất vinh hạnh được đón tiếp Anh/Chị tại Lễ Kỷ Niệm 20/11.`
      : `Cảm ơn <strong>${escapeHtml(data.guestName)}</strong> đã phản hồi. Chúng tôi rất tiếc vì Anh/Chị không thể tham dự lần này.`;
  }
  DOM.submittedBanner.classList.remove("hidden");
  if (DOM.rsvpForm) DOM.rsvpForm.classList.add("hidden");
}

function openConfirmationModal(data) {
  if (!DOM.modalBackdrop) return;
  const isAttending = data.attendance === "Tham gia";

  if (DOM.modalGuestName) DOM.modalGuestName.textContent = `Kính gửi: ${data.guestName}`;
  if (DOM.modalStatusBox) {
    DOM.modalStatusBox.innerHTML = `
      <div class="status-row">
        <span class="status-label">Trạng thái:</span>
        <span class="status-value" style="color: ${isAttending ? '#059669' : '#e11d48'};">
          ${isAttending ? '✓ Xác nhận tham gia' : '✗ Không thể tham gia'}
        </span>
      </div>
      <div class="status-row">
        <span class="status-label">Chức vụ:</span>
        <span class="status-value">${escapeHtml(data.guestRole)}</span>
      </div>
      ${data.notes ? `
        <div class="status-row" style="flex-direction: column; gap: 2px; margin-top: 6px;">
          <span class="status-label">Ghi chú:</span>
          <span class="status-value" style="font-weight: normal; font-style: italic;">"${escapeHtml(data.notes)}"</span>
        </div>
      ` : ''}
    `;
  }
  DOM.modalBackdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!DOM.modalBackdrop) return;
  DOM.modalBackdrop.classList.add("hidden");
  document.body.style.overflow = "";
}

// ==============================================================================
// 9. LOCAL STORAGE PERSISTENCE
// ==============================================================================
function getStorageKey() {
  return CONFIG.storagePrefix + (state.guestId || "default");
}

function saveSubmissionState(data) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify({ ...data, timestamp: new Date().toISOString() }));
  } catch (err) {}
}

function checkExistingSubmission() {
  try {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      const data = JSON.parse(saved);
      state.hasSubmitted = true;
      disableFormInputs();
      renderSubmittedBanner(data);
    }
  } catch (err) {}
}

// ==============================================================================
// 10. TOAST NOTIFICATION UTILITY
// ==============================================================================
function showToast(message, type = "info") {
  if (!DOM.toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconSvg = type === "success" 
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `${iconSvg}<span class="toast-text">${escapeHtml(message)}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==============================================================================
// 11. BOOTSTRAP ON DOM READY
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeGuestData();
  initializeEventDetails();
  setupCountdown();
  setupCalendarButtons();
  setupAudio();
  setupRsvpForm();
});
