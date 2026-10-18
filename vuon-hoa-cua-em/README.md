# Khu vườn của em

Món quà kỷ niệm ngày Thiện gặp Minh Hân: **18.10.2025**. Biểu tượng: **Vợ Cún & Chó Béo**.

Website: https://thienp-nguyen.github.io/vuon-hoa-cua-em/

## Trải nghiệm

### Bản kỷ niệm có mở màn

Màn đêm → những đốm sáng → rừng hoa nở → chữ hiện dần → nút **Nắm tay anh nhé**. Không tự chuyển sang trang chủ hoặc chương kế tiếp. Nút **Đi dạo cùng anh nhé** mở rừng hoa riêng, rồi người xem chủ động chọn các chương kỷ niệm, lá thư và đèn ước. Có bỏ qua và xem lại mở màn; thiết lập giảm chuyển động được tôn trọng.

Rừng hoa có **30 loài**. Mỗi loài có tranh Canvas riêng, ý nghĩa có nguồn tham khảo, và một lời thương viết riêng. Sổ hoa hỗ trợ tìm tên không dấu, lọc theo cảm xúc, theo dõi các lời đã đọc trong lượt xem. Đây là tuyển chọn tiêu biểu, không khẳng định bao gồm mọi loài hoa hay một ý nghĩa duy nhất cho mọi nền văn hóa.

Thư trong `noidung.js` được thay bằng nguyên văn nội dung chủ website cung cấp, với câu chuyện Phúc Long. Dữ liệu hoa và nguồn nằm trong `flowers.js`; tranh ở `botanica.js`; mở màn ở `intro.js`; trình tự chương ở `app.js`, `journey.css`.

- Khu vườn 2D được vẽ bằng Canvas: hoa hồng, tulip, cúc, lavender, sao nhái, đôi cún, bướm, ngôi nhà nhỏ và đèn treo.
- Chạng vạng / ánh trăng, hoa đung đưa, đom đóm, sao nhấp nháy, cánh hoa bay.
- Chạm vào bãi cỏ hoặc nhấn Enter trên vùng gieo hoa để trồng thêm hoa.
- Năm loài hoa mở năm lời thương, album ảnh xem lớn và vuốt trên điện thoại.
- Phong bì mở lá thư, thả đèn ước, bộ đếm ngày theo lịch Việt Nam.
- Phép Màu: trình phát chính thức MAYDAYs ft. Minh Tốc (YouTube), chỉ tải sau khi bấm Bật nhạc. Trình phát cần Internet; nếu trình duyệt chặn tự phát, bấm nút Play trong khung hoặc dùng liên kết YouTube bên dưới.
- Hỗ trợ bàn phím, đóng hộp thoại bằng Escape, khôi phục tiêu điểm, giảm chuyển động theo thiết lập hệ điều hành và nút trên trang.

## Sửa nội dung

Sửa `noidung.js` để đổi ngày gặp (`firstMet`, định dạng YYYY-MM-DD), `letter` hoặc bài hát (`song.youtubeId`). Sửa `flowers.js` để đổi nội dung hoa. Không sử dụng lời bài hát trong nội dung thư.

Ảnh và font italic dùng lại các tệp sẵn có trong `../sinh-nhat-minh-han/assets/`. Giữ thư mục đó để ảnh và font tiếp tục hoạt động. Các font Google có font hệ thống dự phòng. Không có framework, bước build hoặc thư viện JavaScript ngoài.

Điều ước chỉ dùng cho hiệu ứng trên thiết bị, không được truyền lên máy chủ hay gửi cho người khác. Website không có analytics. `noindex` giúp hạn chế lập chỉ mục; đây vẫn là URL công khai trên GitHub Pages, không phải vùng có mật khẩu.

## Tham khảo ý tưởng

Tham khảo cách dẫn chuyện bằng thư, vườn tương tác và ảnh kỷ niệm ở [Open Your Letter](https://openyourletter.com/en/event/love-letter), [2luv](https://www.2-luv.com/en) và [Loveletter](https://www.loveletter.digital/your-love-page). Bố cục, mã nguồn và tranh Canvas của khu vườn này được vẽ riêng, không sao chép mã nguồn các mẫu tham khảo.

Bản nhạc chính thức: https://www.youtube.com/watch?v=HhcTaxixdSI
