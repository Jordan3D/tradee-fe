export type Route = 'ideas' | 'notes' | 'notesItem' | 'main' | 'profile' |
 'start' | 'login' | 'signup' | 'tags' | 'tagsItem' | 'journal' | 'trades' | 'trade' | 
 'journalItem' | 'journalItemNew' | 'transactions' | 'ideasItem' | 'images' | 'imagesItem' | 'diary' | 'diaryItem' | 'diaryItemNew';

const routes: Record<Route,any> = {
    ideas: '/ideas',
    ideasItem: (id: string  = ':id') => `${routes.ideas}/${id}`,
    notes: '/notes',
    notesItem: (id: string  = ':id') => `${routes.notes}/${id}`,
    main: '/main',
    profile: '/profile',
    journal: '/journal',
    journalItemNew: (date?: string) => `/journal/item/new${date ? `?date=${date}` : ''}`,
    journalItem: (id: string) => `/journal/item/${id ? id : ':id'}`,
    start: '/start',
    login: '/start/login',
    signup: '/start/signup',
    tags: '/tags',
    tagsItem: (id: string  = ':id') => `${routes.tags}/${id}`,
    trades: '/trades',
    transactions: '/transactions',
    trade: (id?: string) => `/trade/${id ? id : ':id'}`,
    images: '/images',
    imagesItem: (id: string  = ':id') => `${routes.images}/${id}`,
    diary: '/diary',
    diaryItemNew: (date?: string) => `/diary/item/new${date ? `?date=${date}` : ''}`,
    diaryItem: (id: string  = ':id') => `${routes.diary}/${id}`,
};

export default routes;