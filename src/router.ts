export type Route = 'ideas' | 'notes' | 'notesItem' | 'main' | 'profile' |
 'start' | 'login' | 'signup' | 'tags' | 'tagsItem' | 'journal' | 'trades' | 'trade' | 
 'journalItem' | 'journalItemNew' | 'transactions' | 'ideasItem';

const routes: Record<Route,any> = {
    ideas: '/ideas',
    ideasItem: (id: string  = ':id') => `/ideas/${id}`,
    notes: '/notes',
    notesItem: (id: string  = ':id') => `/notes/${id}`,
    main: '/main',
    profile: '/profile',
    journal: '/journal',
    journalItemNew: (date?: string) => `/journal/item/new${date ? `?date=${date}` : ''}`,
    journalItem: (id: string) => `/journal/item/${id ? id : ':id'}`,
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags',
    tagsItem: (id: string  = ':id') => `/tags/${id}`,
    trades: '/trades',
    transactions: '/transactions',
    trade: (id?: string) => `/trade/${id ? id : ':id'}`
};

export default routes;