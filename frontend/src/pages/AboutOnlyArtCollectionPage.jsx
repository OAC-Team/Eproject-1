import React from 'react';
import '../themes/AboutOnlyArtCollectionPage.css'; // Import đúng đường dẫn CSS

const AboutOnlyArtCollection = () => {
  // Dữ liệu phần thống kê (Stats)
  const stats = [
    { id: 1, value: "15K+", label: "Tác phẩm nghệ thuật" },
    { id: 2, value: "800+", label: "Họa sĩ & Nghệ sĩ" },
    { id: 3, value: "30M+", label: "Lượt tương tác" },
    { id: 4, value: "50+", label: "Triển lãm ảo" }
  ];

  // Dữ liệu giá trị cốt lõi (Core Values)
  const coreValues = [
    {
      id: 1,
      icon: "🎨",
      title: "Tôn Vinh Bản Sắc",
      description: "Chúng tôi tin rằng mỗi bức tranh là một câu chuyện riêng, phản chiếu tâm hồn và góc nhìn độc đáo của người nghệ sĩ."
    },
    {
      id: 2,
      icon: "✨",
      title: "Sáng Tạo Không Giới Hạn",
      description: "Không gian mở kết nối từ những tác phẩm sơn dầu truyền thống, tranh màu nước cổ điển cho đến nghệ thuật số hiện đại."
    },
    {
      id: 3,
      icon: "🤝",
      title: "Cầu Nối Đam Mê",
      description: "Đưa những tài năng nghệ thuật trẻ tuổi đến gần hơn với công chúng, các nhà sưu tầm và giới mộ điệu trên toàn cầu."
    }
  ];

  return (
    <section className="about-section">
      <div className="about-container">
        
        {/* Phần đầu trang (Header) */}
        <div className="about-header">
          <span className="brand-badge">Giới thiệu</span>
          <h1>OnlyArtCollection</h1>
          <p className="subtitle">Nơi giao thoa của những tâm hồn đồng điệu và thế giới sắc màu nghệ thuật</p>
          <div className="accent-line"></div>
        </div>

        {/* Phần nội dung chính (Story Section) */}
        <div className="about-content">
          {/* Cột hình ảnh minh họa nghệ thuật */}
          <div className="about-image-wrapper">
            <div className="image-frame">
              <img 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop" 
                alt="OnlyArt Gallery Space" 
              />
            </div>
          </div>

          {/* Cột văn bản giới thiệu */}
          <div className="about-text-details">
            <h2>Hành Trình Kiến Tạo <span className="highlight-text">Không Gian Nghệ Thuật</span></h2>
            <p>
              Được thành lập từ tình yêu cháy bỏng dành cho hội họa, <strong>OnlyArtCollection</strong> không chỉ đơn thuần là một trang web trưng bày—đây là một không gian triển lãm số sống động, nơi xóa nhòa ranh giới địa lý giữa nghệ sĩ và người yêu nghệ thuật.
            </p>
            <p>
              Chúng tôi tin rằng nghệ thuật không nên bị giới hạn trong bốn bức tường của phòng triển lãm truyền thống. Tại đây, bạn có thể tự do đắm mình vào những nét cọ tinh tế, khám phá các trào lưu nghệ thuật mới, và tìm thấy nguồn cảm hứng sáng tạo mỗi ngày.
            </p>
            
            {/* Các con số thống kê nổi bật */}
            <div className="about-stats-grid">
              {stats.map(stat => (
                <div key={stat.id} className="stat-card">
                  <span className="stat-number">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phần giá trị cốt lõi */}
        <div className="about-values-section">
          <div className="section-title-center">
            <h2>Giá Trị Cốt Lõi</h2>
            <p>Những nguyên tắc định hình và dẫn dắt sứ mệnh của chúng tôi</p>
          </div>
          
          <div className="values-grid">
            {coreValues.map(item => (
              <div key={item.id} className="value-card-premium">
                <div className="value-icon-circle">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutOnlyArtCollection;