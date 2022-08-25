export type Route = 'ideas' | 'notes' | 'main' | 'profile' | 'start' | 'login' | 'signup' | 'tags' | 'journal' | 'trades' | 'trade' | 'newJournalItem'

const routes: Record<Route,any> = {
    ideas: '/ideas',
    notes: '/notes',
    main: '/main',
    profile: '/profile',
    journal: '/journal',
    newJournalItem: (date?: string) => `/journal/new${date ? `?date=${date}` : ''}`,
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags',
    trades: '/trades',
    trade: (id?: string) => `/trade/${id ? id : ':id'}`
};

export default routes;