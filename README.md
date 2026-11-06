# 🎟️ Interactive RSVP Invitation Web App (GitHub Pages + Headless Google Form)

Một ứng dụng web thiệp mời tĩnh (static web app), thiết kế chuẩn **Mobile-First**, giao diện ánh sáng thiên đường & vàng kim (Luminous Sky Blue, Sunlight Gold & Glassmorphism) đồng bộ hoàn hảo với bộ nhận diện **WESET 20/11 - "NURTURER"** (`img/KEY VISUAL 2011.png`), tối ưu cho các chiến dịch gửi email/tin nhắn hàng loạt (Bulk Email Campaign, Zalo, SMS).

Ứng dụng cho phép khách mời xác nhận tham dự (RSVP) chỉ với **1 chạm (One-Tap)** và tự động đồng bộ câu trả lời trực tiếp về **Google Sheets** thông qua **Google Form Headless Submission**.

---

## ✨ Tính Năng Nổi Bật

1. **Phân Tích URL Động (Dynamic URL Query Parsing):**
   - Tự động trích xuất `?id=` và `?name=` từ thanh địa chỉ.
   - Hỗ trợ giải mã đầy đủ ký tự tiếng Việt UTF-8 (ví dụ: `?id=VIP-01&name=Nguy%E1%BB%85n%20V%C4%83n%20An` hoặc `?id=VIP-01&name=Nguyen+Van+An`).
   - Hiển thị trang trọng tên khách mời và mã thiệp trên thiệp mời.
   - Tự động điền dữ liệu ẩn vào form RSVP.

2. **Xác Nhận Tham Dự 1 Chạm (One-Tap RSVP):**
   - 2 nút thao tác nhanh: **"✨ Xác nhận tham gia"** và **"💌 Tiếc quá, không thể tham gia"**.
   - Trường tùy chọn thông minh: Dropdown chọn số người tham dự (1 - 4 người) và Lời chúc / Ghi chú ăn uống, dị ứng.
   - Tự động ẩn số người đi kèm khi khách chọn không thể tham dự.

3. **Gửi Dữ Liệu Ngầm Về Google Form (Headless Submission):**
   - Sử dụng `fetch()` bất đồng bộ với cơ chế `mode: 'no-cors'`.
   - Lưu trực tiếp vào Google Form -> Tự động đổ về bảng tính Google Sheets của bạn.
   - Có cơ chế **Mô phỏng (Demo Mode)** khi chưa cấu hình Google Form ID, giúp xem trước giao diện và trải nghiệm mượt mà.

4. **Trạng Thái Giao Diện & Chống Gửi Trùng (Anti-Double Submission):**
   - Hiển thị hiệu ứng tải xoay tròn (Loading Spinner) ngay trên nút bấm.
   - Cửa sổ xác nhận trang trọng (Confirmation Modal) và thông báo Toast nổi.
   - Vô hiệu hóa form và lưu trạng thái vào `localStorage` theo mã khách mời (`guestId`), ngăn chặn việc bấm gửi nhiều lần.
   - Cung cấp nút *"Thay đổi lựa chọn"* nếu khách muốn cập nhật lại.

5. **Âm Nhạc Nền Với Cơ Chế Autoplay Fallback:**
   - Hỗ trợ phát nhạc nền du dương (Ambient Piano).
   - Tự động kích hoạt phát nhạc ngay khi người dùng chạm/tương tác đầu tiên trên màn hình (vượt qua chính sách chặn autoplay của Safari iOS và Chrome Android).
   - Nút điều khiển âm thanh đĩa than xoay tròn tinh tế góc trên màn hình.

6. **Đếm Ngược Thời Gian & Lưu Vào Lịch:**
   - Bộ đếm ngược thời gian thực (Ngày, Giờ, Phút, Giây) đến ngày diễn ra sự kiện.
   - Nút **"Lưu vào lịch"** tự động tạo sự kiện trên **Google Calendar**.
   - Nút **"Xem bản đồ"** liên kết trực tiếp tới vị trí sự kiện trên Google Maps.

7. **Chuẩn OpenGraph & Mobile-First:**
   - Tối ưu kích thước cảm ứng trên điện thoại (min-height 48px).
   - Đầy đủ thẻ OpenGraph (Facebook, Zalo, Twitter) phục vụ gửi xem trước thiệp đẹp mắt trong tin nhắn.

---

## 📁 Cấu Trúc Dự Án

```
InviteTicketWebApp/
├── index.html        # Khung giao diện HTML5 semantic, OpenGraph meta tags, Modal, RSVP card
├── style.css         # Bảng màu Midnight Gold, Glassmorphism, Responsive Mobile-First
├── script.js         # URL Parsing, CONFIG Google Form, Audio Fallback, Fetch No-CORS, Countdown
└── README.md         # Hướng dẫn chi tiết thiết lập & triển khai
```

---

## 🚀 Hướng Dẫn Cấu Hình Google Form & Google Sheets (Chỉ Mất 3 Phút)

Để dữ liệu RSVP của khách tự động lưu vào Google Sheets:

### Bước 1: Tạo Google Form
1. Truy cập [Google Forms](https://forms.google.com/) và tạo một biểu mẫu mới.
2. Đặt các câu hỏi với kiểu dữ liệu sau:
   - **Mã khách mời** (Câu trả lời ngắn / Short answer)
   - **Tên khách mời** (Câu trả lời ngắn / Short answer)
   - **Xác nhận tham gia** (Trắc nghiệm / Multiple choice: *"Tham gia"*, *"Không thể tham gia"*)
   - **Số người tham dự** (Trắc nghiệm hoặc Hộp kiểm: *"1"*, *"2"*, *"3"*, *"4"*)
   - **Lời chúc / Ghi chú** (Đoạn / Paragraph)
3. Chuyển sang tab **"Câu trả lời" (Responses)** -> Nhấp vào biểu tượng **"Liên kết với Trang tính" (Link to Sheets)** để tạo Google Sheet tự động nhận dữ liệu.

### Bước 2: Lấy Entry IDs (`entry.XXXXX`) và Form URL
1. Ở góc trên cùng bên phải Google Form, bấm vào biểu tượng dấu 3 chấm `⋮` -> Chọn **"Nhận đường liên kết được điền sẵn" (Get pre-filled link)**.
2. Điền các giá trị mẫu bất kỳ vào từng ô:
   - Mã khách mời: `VIP001`
   - Tên khách mời: `Nguyen Van A`
   - Xác nhận tham gia: chọn `Tham gia`
   - Số người: chọn `1`
   - Lời chúc: `Chuc mung`
3. Cuộn xuống cuối trang bấm **"Nhận đường liên kết" (Get link)** -> Bấm **"Sao chép đường liên kết" (Copy link)**.
4. Dán link vừa sao chép vào trình soạn thảo. Link sẽ có dạng:
   ```text
   https://docs.google.com/forms/d/e/1FAIpQLScABC...XYZ/viewform?usp=pp_url&entry.123456789=VIP001&entry.987654321=Nguyen+Van+A&entry.112233445=Tham+gia&entry.556677889=1&entry.998877665=Chuc+mung
   ```
5. Bạn thu thập các thông tin sau:
   - **URL gửi dữ liệu:** Đổi phần đuôi `/viewform...` thành `/formResponse`:
     ```text
     https://docs.google.com/forms/d/e/1FAIpQLScABC...XYZ/formResponse
     ```
   - **Các mã entry tương ứng:**
     - Mã khách mời: `entry.123456789`
     - Tên khách mời: `entry.987654321`
     - Trạng thái tham gia: `entry.112233445`
     - Số người: `entry.556677889`
     - Lời chúc: `entry.998877665`

### Bước 3: Cập nhật vào `script.js`
Mở tệp [script.js](file:///d:/InviteTicketWebApp/script.js) và dán các thông tin vào khối `CONFIG` ngay đầu tệp:

```javascript
const CONFIG = {
  // Đã cấu hình sẵn URL Google Form thật của bạn:
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeuGOZEprJ-fde9eobor1W5ol8d4emlpzRWNzpoz0PgdPRTqw/formResponse",

  // 4 mã entry thực tế từ Form "Thống kê khách mời tham gia":
  entries: {
    guestId: "entry.1000092928",      // Mã khách mời
    guestName: "entry.1260950142",    // Tên khách mời
    attendance: "entry.679443011",    // Xác nhận tham gia ("Tham gia" / "Không thể tham gia")
    notes: "entry.562253103"          // Ghi chú
  },

  // Cập nhật thông tin sự kiện của bạn:
  event: {
    title: "Lễ Kỷ Niệm 20/11 • NURTURER",
    subtitle: "Ươm mầm tri thức — Vươn tầm tương lai",
    host: "WESET English Center",
    dateISO: "2026-11-20T17:30:00+07:00",
    displayDate: "Thứ Sáu, ngày 20 tháng 11 năm 2026",
    displayTime: "Đón khách: 17:30 | Khai mạc: 18:30",
    venue: "Grand Ballroom • Khách sạn Sheraton Saigon",
    address: "88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    mapUrl: "https://maps.google.com/?q=Sheraton+Saigon+Hotel",
    deadlineText: "17/11/2026",
    dressCode: "Lịch sự / Trang trọng (Xanh WESET, Trắng, Vàng Gold)"
  }
};
```

---

## 🧪 Cách Thử Nghiệm Với Tham Số URL (URL Parameters)

Bạn có thể mở tệp `index.html` trong bất kỳ trình duyệt nào và thêm các tham số `?id=...&name=...`:

| Trường hợp thử nghiệm | Ví dụ đường dẫn URL |
|---|---|
| **Khách mời VIP có dấu tiếng Việt** | `index.html?id=VIP-888&name=Nguy%E1%BB%85n%20V%C4%83n%20An` |
| **Khách mời sử dụng dấu `+`** | `index.html?id=VIP-999&name=Tran+Thi+Mai` |
| **Khách mời đối tác quốc tế** | `index.html?id=EXP-102&name=Michael+Johnson` |
| **Không truyền tham số (Dùng mặc định)** | `index.html` *(Tự động hiển thị: "Quý Khách" & mã "VIP-GUEST")* |

---

## 📧 Tích Hợp Vào Chiến Dịch Bulk Email Hàng Loạt

Khi gửi qua các nền tảng email marketing (Mailchimp, SendGrid, Brevo, Gmail Mail Merge), bạn chỉ cần gán thẻ biến (merge tag) vào nút **"Xác Nhận Tham Dự"**:

### Ví dụ mẫu link theo từng nền tảng:
- **Mailchimp:**
  ```text
  https://yourusername.github.io/InviteTicketWebApp/?id=*|GUEST_ID|*&name=*|URL:NAME|*
  ```
- **SendGrid:**
  ```text
  https://yourusername.github.io/InviteTicketWebApp/?id={{guest_id}}&name={{guest_name}}
  ```
- **Google Sheets Mail Merge (YAMM / Mailmeteor):**
  ```text
  https://yourusername.github.io/InviteTicketWebApp/?id={{Mã Khách}}&name={{Họ Và Tên}}
  ```

---

## 🌐 Triển Khai Miễn Phí Lên GitHub Pages

1. Đẩy mã nguồn lên kho lưu trữ GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "feat: initial interactive invitation web app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/InviteTicketWebApp.git
   git push -u origin main
   ```
2. Trên GitHub, vào kho lưu trữ của bạn -> Chọn tab **Settings** (Cài đặt).
3. Ở menu bên trái, nhấp vào **Pages**.
4. Tại mục **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`
   - **Branch**: Chọn `main` và thư mục `/ (root)`
   - Nhấp **Save**.
5. Sau 1 - 2 phút, trang web sẽ chính thức hoạt động tại:
   `https://<your-username>.github.io/InviteTicketWebApp/`

