import { Article, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Trang chủ', slug: 'all' },
  { id: '2', name: 'Công nghệ', slug: 'technology', group: 'Thể loại' },
  { id: '3', name: 'Kinh doanh', slug: 'business', group: 'Thể loại' },
  { id: '4', name: 'Khoa học', slug: 'science', group: 'Thể loại' },
  { id: '5', name: 'Sức khỏe', slug: 'health', group: 'Thể loại' },
  { id: '6', name: 'Thể thao', slug: 'sports', group: 'Thể loại' },
  { id: '7', name: 'Giải trí', slug: 'entertainment', group: 'Thể loại' },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Tương lai của Trí tuệ Nhân tạo trong Y tế',
    excerpt: 'Khám phá cách AI đang cách mạng hóa chẩn đoán và điều trị y tế, từ phát hiện sớm đến y học cá nhân hóa.',
    content: 'Trí tuệ nhân tạo đang thay đổi ngành y tế theo những cách chưa từng có. Từ hình ảnh chẩn đoán đến phát triển thuốc, các công nghệ AI giúp chăm sóc y tế chính xác, nhanh chóng và cá nhân hóa hơn. Thuật toán học máy có thể phát hiện bệnh như ung thư sớm hơn phương pháp truyền thống, trong khi xử lý ngôn ngữ tự nhiên giúp bác sĩ phân tích lượng lớn tài liệu y khoa để đưa ra quyết định.',
    author: 'Bác sĩ Sarah Chen',
    publishedAt: '15/01/2024',
    category: 'technology',
    readTime: 8,
    imageUrl: 'https://images.pexels.com/photos/3912468/pexels-photo-3912468.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Y tế', 'AI', 'Y học', 'Công nghệ'],
    featured: true
  },
  {
    id: '2',
    title: 'Giải pháp Năng lượng Bền vững cho Thế giới Hiện đại',
    excerpt: 'Những cách tiếp cận đổi mới về năng lượng tái tạo đang thay đổi cách chúng ta cung cấp điện cho thành phố và công nghiệp.',
    content: 'Chuyển đổi sang năng lượng bền vững đang tăng tốc trên toàn cầu. Công nghệ năng lượng mặt trời và gió ngày càng hiệu quả và tiết kiệm, trong khi giải pháp lưu trữ năng lượng giúp khắc phục thách thức về tính gián đoạn của nguồn tái tạo.',
    author: 'Michael Rodriguez',
    publishedAt: '14/01/2024',
    category: 'science',
    readTime: 6,
    imageUrl: 'https://images.pexels.com/photos/421888/pexels-photo-421888.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Môi trường', 'Năng lượng', 'Bền vững'],
    featured: true
  },
  {
    id: '3',
    title: 'Sự phát triển của Ngân hàng số và Fintech',
    excerpt: 'Công nghệ đang thay đổi ngành dịch vụ tài chính và tạo ra nhiều cơ hội mới.',
    content: 'Ngân hàng số và các công ty fintech đang cách mạng hóa cách chúng ta quản lý tiền bạc. Từ thanh toán di động đến tiền mã hóa, những đổi mới này giúp dịch vụ tài chính trở nên dễ tiếp cận và hiệu quả hơn.',
    author: 'Jennifer Kim',
    publishedAt: '13/01/2024',
    category: 'business',
    readTime: 5,
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Tài chính', 'Công nghệ', 'Ngân hàng'],
    featured: true
  },
  {
    id: '4',
    title: 'Sức khỏe Tâm thần trong Kỷ nguyên Số',
    excerpt: 'Tìm hiểu tác động của công nghệ đến sức khỏe tâm thần và các chiến lược đối phó.',
    content: 'Khi cuộc sống ngày càng số hóa, các chuyên gia tâm lý nghiên cứu ảnh hưởng của thời gian sử dụng thiết bị, mạng xã hội và làm việc từ xa đến sức khỏe tâm thần của chúng ta.',
    author: 'Bác sĩ Alex Thompson',
    publishedAt: '12/01/2024',
    category: 'health',
    readTime: 7,
    imageUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Tâm thần', 'Công nghệ', 'Sức khỏe']
  },
  {
    id: '5',
    title: 'Sự phát triển của Văn hóa Làm việc Từ xa',
    excerpt: 'Cách các công ty thích nghi với thực tế mới của đội nhóm phân tán và mô hình làm việc kết hợp.',
    content: 'Làm việc từ xa đã thay đổi căn bản cách doanh nghiệp vận hành. Các công ty phát triển chiến lược mới cho hợp tác, giao tiếp và duy trì văn hóa doanh nghiệp trong môi trường phân tán.',
    author: 'Lisa Wang',
    publishedAt: '11/01/2024',
    category: 'business',
    readTime: 6,
    imageUrl: 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Làm việc từ xa', 'Kinh doanh', 'Công nghệ']
  },
  {
    id: '6',
    title: 'Bước đột phá trong Máy tính lượng tử',
    excerpt: 'Các nhà khoa học đạt được cột mốc mới trong máy tính lượng tử có thể cách mạng hóa công nghệ.',
    content: 'Các nhà nghiên cứu đã đạt tiến bộ lớn trong máy tính lượng tử, đưa chúng ta đến gần hơn với ứng dụng thực tiễn trong mật mã, phát triển thuốc và giải quyết các vấn đề phức tạp.',
    author: 'Tiến sĩ Robert Einstein',
    publishedAt: '10/01/2024',
    category: 'science',
    readTime: 9,
    imageUrl: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Máy tính lượng tử', 'Khoa học', 'Công nghệ']
  },
  {
    id: '7',
    title: 'Tương lai của Khám phá Vũ trụ',
    excerpt: 'Các công ty tư nhân và cơ quan nhà nước đang mở rộng giới hạn của du hành không gian.',
    content: 'Ngành công nghiệp vũ trụ đang phát triển mạnh mẽ với các sứ mệnh mới tới Sao Hỏa, Mặt Trăng và xa hơn nữa. Các công ty tư nhân giúp du hành không gian trở nên dễ tiếp cận và tiết kiệm hơn.',
    author: 'Đại úy Maria Santos',
    publishedAt: '09/01/2024',
    category: 'science',
    readTime: 8,
    imageUrl: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Vũ trụ', 'Khám phá', 'Công nghệ']
  },
  {
    id: '8',
    title: 'An ninh mạng trong Doanh nghiệp hiện đại',
    excerpt: 'Bảo vệ doanh nghiệp khỏi các mối đe dọa mạng ngày càng tinh vi đòi hỏi cách tiếp cận và công nghệ mới.',
    content: 'Khi các mối đe dọa mạng ngày càng phức tạp, tổ chức cần áp dụng chiến lược bảo mật toàn diện bao gồm đào tạo nhân viên, phát hiện mối đe dọa nâng cao và kiến trúc zero-trust.',
    author: 'David Security',
    publishedAt: '08/01/2024',
    category: 'technology',
    readTime: 7,
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['An ninh mạng', 'Công nghệ', 'Kinh doanh']
  },
  {
    id: '9',
    title: 'Biến đổi khí hậu và Nông nghiệp toàn cầu',
    excerpt: 'Nông dân thích nghi với biến đổi khí hậu và phát triển các phương pháp bền vững.',
    content: 'Biến đổi khí hậu buộc ngành nông nghiệp phải thay đổi. Nông dân áp dụng công nghệ và phương pháp mới để duy trì năng suất đồng thời giảm tác động môi trường.',
    author: 'Tiến sĩ Green Field',
    publishedAt: '07/01/2024',
    category: 'science',
    readTime: 6,
    imageUrl: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Biến đổi khí hậu', 'Nông nghiệp', 'Môi trường']
  },
  {
    id: '10',
    title: 'Olympic: Lễ hội của Thành tựu Con người',
    excerpt: 'Khám phá lịch sử và tác động của Thế vận hội đối với văn hóa và thể thao toàn cầu.',
    content: 'Thế vận hội Olympic tiếp tục truyền cảm hứng cho vận động viên và khán giả toàn thế giới, thúc đẩy hợp tác quốc tế và tôn vinh tiềm năng con người.',
    author: 'Phóng viên Thể thao',
    publishedAt: '06/01/2024',
    category: 'sports',
    readTime: 5,
    imageUrl: 'https://images.pexels.com/photos/68704/pexels-photo-68704.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Olympic', 'Thể thao', 'Văn hóa']
  },
  {
    id: '11',
    title: 'Sự phát triển của Giải trí Trực tuyến',
    excerpt: 'Các nền tảng streaming đang thay đổi ngành giải trí và thói quen người xem.',
    content: 'Dịch vụ streaming đã cách mạng hóa cách chúng ta thưởng thức giải trí, tạo ra các hình thức sáng tạo và phân phối nội dung mới.',
    author: 'Chuyên gia Giải trí',
    publishedAt: '05/01/2024',
    category: 'entertainment',
    readTime: 6,
    imageUrl: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Streaming', 'Giải trí', 'Công nghệ']
  },
  {
    id: '12',
    title: 'Khoa học Dinh dưỡng: Nghiên cứu và Xu hướng mới nhất',
    excerpt: 'Những phát hiện mới trong khoa học dinh dưỡng đang thay đổi cách chúng ta nghĩ về ăn uống lành mạnh.',
    content: 'Nghiên cứu gần đây trong khoa học dinh dưỡng tiết lộ nhiều hiểu biết mới về mối liên hệ giữa chế độ ăn, sức khỏe và tuổi thọ.',
    author: 'Tiến sĩ Dinh dưỡng',
    publishedAt: '04/01/2024',
    category: 'health',
    readTime: 7,
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Dinh dưỡng', 'Sức khỏe', 'Khoa học']
  }
];

// Function to simulate API calls with pagination
export const fetchArticles = (page: number = 1, limit: number = 6, category: string = 'all'): Promise<{ articles: Article[], hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredArticles = category === 'all'
        ? articles
        : articles.filter(article => article.category.toLowerCase() === category.toLowerCase());

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
      const hasMore = endIndex < filteredArticles.length;

      resolve({ articles: paginatedArticles, hasMore });
    }, 500); // Simulate network delay
  });
};

export const searchArticles = (query: string): Promise<Article[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(filtered);
    }, 300);
  });
};