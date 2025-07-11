# Authentication API

API hệ thống xác thực người dùng với OTP verification được xây dựng bằng Node.js, Express.js và TypeScript.

## 🚀 Tính năng

- ✅ Đăng ký tài khoản với email và password
- ✅ Xác thực email qua OTP (6 số)
- ✅ Đăng nhập với JWT token
- ✅ Validation middleware với Joi
- ✅ Swagger API documentation
- ✅ Error handling middleware
- ✅ CORS support


## 📋 Yêu cầu hệ thống

- Node.js (v14 trở lên)
- PostgreSQL database
- Gmail account (để gửi email OTP)

## 🛠️ Cài đặt

1. **Clone repository và cài đặt dependencies:**
```bash
cd product_api
npm install
```

2. **Tạo file .env:**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d

# Email (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

3. **Tạo database schema:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    otp VARCHAR(6),
    otp_expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

4. **Chạy ứng dụng:**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📚 API Documentation

Sau khi chạy server, truy cập Swagger UI tại: `http://localhost:3000/api-docs`

### Endpoints

#### 1. Đăng ký tài khoản
```
POST /api/auth/register
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "OTP đã được gửi đến email của bạn"
}
```

#### 2. Xác thực OTP
```
POST /api/auth/verify-otp
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "otp": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Tài khoản đã được xác thực thành công"
}
```

#### 3. Đăng nhập
```
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```



## 🔧 Validation Rules

### Register
- `email`: Phải là email hợp lệ
- `password`: Tối thiểu 6 ký tự

### Verify OTP
- `email`: Phải là email hợp lệ
- `otp`: Đúng 6 ký tự số

### Login
- `email`: Phải là email hợp lệ
- `password`: Bắt buộc

## 🛡️ Bảo mật

- Password được hash với bcrypt (salt rounds = 10)
- JWT tokens với secret key
- OTP có thời gian hết hạn (10 phút)
- Validation đầu vào với Joi
- CORS protection

## 📁 Cấu trúc dự án

```
product_api/
├── index.ts                 # Entry point
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── README.md               # Documentation
└── src/
    ├── config/
    │   ├── mailer.ts       # Email configuration
    │   └── swagger.ts      # Swagger configuration
    ├── controllers/
    │   └── auth.controller.ts # HTTP handlers
    ├── middleware/
    │   ├── validation.ts   # Request validation
    │   └── errorHandler.ts # Error handling
    ├── routes/
    │   └── auth.route.ts   # Route definitions
    ├── services/
    │   └── auth.service.ts # Business logic
    ├── utils/
    │   ├── jwt.ts          # JWT utilities
    │   └── otp.ts          # OTP generation
    └── db.ts               # Database connection
```

## 🚨 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Authentication Failed |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🔍 Debugging

Để xem chi tiết lỗi trong development mode, set `NODE_ENV=development` trong file .env.

## 📝 Scripts

```bash
npm run dev      # Chạy development server với nodemon
npm run build    # Build TypeScript thành JavaScript
npm start        # Chạy production server
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

ISC License 