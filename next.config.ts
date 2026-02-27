import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. Agregar Cloudinary (Esta es la clave para que funcionen tus imágenes en producción)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Permite cualquier ruta de imagen dentro de Cloudinary
      },
      // 2. Tus configuraciones de Render (por si alguna imagen se sirve directo de ahí)
      {
        protocol: 'https',
        hostname: 'back-hughes-1.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'back-hughes-1.onrender.com',
        pathname: '/uploads/**',
      },
      // 3. Tus configuraciones locales
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
    // Desactivar optimización en desarrollo para evitar el bloqueo de localhost
    unoptimized: isDevelopment,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;