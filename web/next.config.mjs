/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/v1/users/:path*',
                destination: 'http://localhost:8081/api/v1/users/:path*',
            },
            {
                source: '/api/v1/exercises/:path*',
                destination: 'http://localhost:8082/api/v1/exercises/:path*',
            },
            {
                source: '/api/v1/workouts/:path*',
                destination: 'http://localhost:8083/api/v1/workouts/:path*',
            },
            {
                source: '/api/v1/diet/:path*',
                destination: 'http://localhost:8084/api/v1/diet/:path*',
            },
            {
                source: '/api/v1/media/:path*',
                destination: 'http://localhost:8085/api/v1/media/:path*',
            },
            {
                source: '/api/v1/social/:path*',
                destination: 'http://localhost:8086/api/v1/social/:path*',
            },
        ];
    },
};

export default nextConfig;
