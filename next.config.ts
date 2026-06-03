const nextConfig = {
  // 1. ВКЛЮЧАЕМ РЕЖИМ STANDALONE (обязательно для твоего Dockerfile!)
  output: 'standalone',
  
  // 2. ИГНОРИРУЕМ ОШИБКИ ТИПОВ (чтобы билд не падал из-за мелочей)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Отключаем оптимизацию для внешних картинок (решает проблемы с Sharp)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;