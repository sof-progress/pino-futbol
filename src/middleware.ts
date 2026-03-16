import { withAuth } from 'next-auth/middleware';

// Middleware que protege todas las rutas /admin/* excepto /admin/login
export default withAuth({
    pages: {
        signIn: '/admin/login',
    },
});

export const config = {
    // Proteger todas las rutas /admin excepto /admin/login
    matcher: ['/admin/((?!login).*)'],
};
