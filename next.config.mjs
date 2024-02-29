/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'lh3.googleusercontent.com',
              port: ''
            },
            {
              protocol: 'https',
              hostname: 'firebasestorage.googleapis.com',
              port:''
            }
          ],
    }
};


export default nextConfig;
