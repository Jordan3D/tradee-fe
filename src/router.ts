export type Routes = 'ideas' | 'notes' | 'main' | 'profile' | 'start' | 'login' | 'signup' | 'tags'

const routes: Record<Routes,string> = {
    ideas: '/ideas',
    notes: '/notes',
    main: '/main',
    profile: '/profile',
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags'
};

export default routes;