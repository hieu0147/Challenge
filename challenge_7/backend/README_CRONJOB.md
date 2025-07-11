# Cronjob Service - Thu thập dữ liệu từ Tuổi Trẻ Online

## Mô tả
Hệ thống cronjob tự động thu thập bài viết từ [Tuổi Trẻ Online](https://tuoitre.vn/) mỗi 30 phút và lưu vào database.

## Tính năng
- ✅ Thu thập bài viết từ trang chủ Tuổi Trẻ Online
- ✅ Thu thập từ các chuyên mục: Thời sự, Thế giới, Kinh doanh, Công nghệ, Giải trí, Thể thao, Sức khỏe, Giáo dục
- ✅ Tự động chạy mỗi 30 phút
- ✅ Tránh lưu trùng bài viết (dựa trên source_url)
- ✅ API để quản lý bài viết
- ✅ Thống kê bài viết theo category

## Cài đặt

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình database
Đảm bảo file `.env` có cấu hình DATABASE_URL:
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### 3. Khởi động server
```bash
npm run dev
```

## API Endpoints

### Bài viết
- `GET /api/articles` - Lấy tất cả bài viết (có phân trang)
- `GET /api/articles/search?keyword=...` - Tìm kiếm bài viết
- `GET /api/articles/category/:category` - Lấy bài viết theo category
- `GET /api/articles/:id` - Lấy bài viết theo ID
- `GET /api/articles/stats` - Lấy thống kê bài viết
- `POST /api/articles/scrape` - Chạy thu thập dữ liệu thủ công

### Ví dụ sử dụng API

#### Lấy bài viết với phân trang
```bash
curl "http://localhost:5000/api/articles?page=1&limit=10"
```

#### Tìm kiếm bài viết
```bash
curl "http://localhost:5000/api/articles/search?keyword=Việt Nam"
```

#### Lấy bài viết theo category
```bash
curl "http://localhost:5000/api/articles/category/Thời sự"
```

#### Chạy thu thập dữ liệu thủ công
```bash
curl -X POST "http://localhost:5000/api/articles/scrape"
```

## Cấu trúc Database

### Bảng articles
```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    summary TEXT,
    image_url TEXT,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(200),
    published_date TIMESTAMP,
    source_url TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Cronjob Schedule
- **Tần suất**: Mỗi 30 phút
- **Cron expression**: `*/30 * * * *`
- **Múi giờ**: Asia/Ho_Chi_Minh

## Logs
Hệ thống sẽ hiển thị logs trong console:
- 🔄 Bắt đầu thu thập dữ liệu
- 📰 Số lượng bài viết thu thập được
- 💾 Bài viết mới được lưu
- ✅ Hoàn thành thu thập
- ❌ Lỗi nếu có

## Lưu ý
1. Hệ thống chỉ thu thập bài viết mới, không lưu trùng
2. Có thể chạy thu thập thủ công qua API
3. Dữ liệu được lưu với source_url để tránh trùng lặp
4. Hệ thống có timeout 10 giây cho mỗi request để tránh treo

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra DATABASE_URL trong file .env
- Đảm bảo PostgreSQL đang chạy

### Lỗi thu thập dữ liệu
- Kiểm tra kết nối internet
- Có thể website Tuổi Trẻ thay đổi cấu trúc HTML
- Kiểm tra logs để xem lỗi cụ thể

### Cronjob không chạy
- Kiểm tra timezone trong cấu hình
- Đảm bảo server đang chạy
- Kiểm tra logs khởi động 