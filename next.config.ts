const nextConfig = {
    typescript: {
        // !! ВНИМАНИЕ !!
        // Это позволит билду завершиться успешно, даже если есть ошибки типов
        ignoreBuildErrors: true,
    },
    eslint: {
        // Игнорируем ошибки линтера при сборке
        ignoreDuringBuilds: true,
    },
    // Твои остальные настройки...
};

export default nextConfig;