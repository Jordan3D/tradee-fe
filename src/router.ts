export type Route = 'ideas' | 'notes' | 'main' | 'profile' | 'start' | 'login' | 'signup' | 'tags' | 'journal' | 'trades' | 'trade' | 'journalItem' | 'journalItemNew' | 'transactions'

const routes: Record<Route,any> = {
    ideas: '/ideas',
    notes: '/notes',
    main: '/main',
    profile: '/profile',
    journal: '/journal',
    journalItemNew: (date?: string) => `/journal/item/new${date ? `?date=${date}` : ''}`,
    journalItem: (id: string) => `/journal/item/${id ? id : ':id'}`,
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags',
    trades: '/trades',
    transactions: '/transactions',
    trade: (id?: string) => `/trade/${id ? id : ':id'}`
};

export default routes;