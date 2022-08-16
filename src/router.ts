export type Route = 'ideas' | 'notes' | 'main' | 'profile' | 'start' | 'login' | 'signup' | 'tags' | 'calendar' | 'trades' | 'trade'

const routes: Record<Route,string> = {
    ideas: '/ideas',
    notes: '/notes',
    main: '/main',
    profile: '/profile',
    calendar: '/calendar',
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags',
    trades: '/trades',
    trade: '/trade'
};

export default routes;