export type Route = 'ideas' | 'notes' | 'main' | 'profile' | 'start' | 'login' | 'signup' | 'tags' | 'journal' | 'trades' | 'trade' | 'journalItem' | 'transactions'

const routes: Record<Route,any> = {
    ideas: '/ideas',
    notes: '/notes',
    main: '/main',
    profile: '/profile',
    journal: '/journal',
    journalItem: ({id, date}: {id?: string, date?: string}) => `/journal/item/${id ? id : 'new'}${date ? `?date=${date}` : ''}`,
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags',
    trades: '/trades',
    transactions: '/transactions',
    trade: (id?: string) => `/trade/${id ? id : ':id'}`
};

export default routes;