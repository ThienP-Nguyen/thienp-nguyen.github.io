/* =============================================================
   CHỈ CẦN SỬA FILE NÀY để thêm ảnh và thư.
   Mở bằng Notepad / VS Code, lưu UTF-8, rồi tải lại trang.
   Xem HUONG_DAN.html để được hướng dẫn từng bước.
   ============================================================= */
window.SINH_NHAT = {
  hoTen: "Đỗ Hoàng Minh Hân",
  ten: "Minh Hân",
  bietDanh: "Vợ Cún yêu",
  bietDanhThuHai: "Cún húi của Chó Béo",
  nguoiGui: "Chó Béo",
  ngaySinh: "2005-09-29",
  namSinhNhat: 2026,

  loiMoThu: "Gửi Vợ Cún yêu,",
  loiKetThu: "Thương em thật nhiều,",

  // Dán thư của bạn GIỮA hai dấu ` bên dưới.
  // Xuống dòng trống để chia đoạn. Giữ nguyên hai dấu `.
  // Nếu thư có ký tự ` hoặc ${ thì thêm dấu \ ngay trước ký tự đó.
  thu: ``,

  // Thêm ảnh vào thư mục assets/anh/, rồi điền đường dẫn vào tep.
  // Ví dụ: tep: "assets/anh/anh-chinh.jpg"
  // Giữ tep: "" nếu muốn để trống khung.
  // viTri điều chỉnh vùng ảnh được nhìn thấy; "50% 30%" đưa khung lên cao.
  anh: [
    {
      tep: "",
      chuThich: "Nụ cười anh thương",
      moTa: "Ảnh chân dung của Minh Hân",
      viTri: "50% 50%"
    },
    {
      tep: "",
      chuThich: "Một ngày có em",
      moTa: "Kỷ niệm đầu tiên của hai đứa",
      viTri: "50% 50%"
    },
    {
      tep: "",
      chuThich: "Một chút bình yên",
      moTa: "Khoảnh khắc bình yên bên nhau",
      viTri: "50% 50%"
    },
    {
      tep: "",
      chuThich: "Và nhiều ngày sau nữa…",
      moTa: "Một kỷ niệm đáng yêu của hai đứa",
      viTri: "50% 50%"
    }
  ]
};
