export type Route = 'ideas' | 'notes' | 'notesItem' | 'main' | 'profile' |
 'start' | 'login' | 'signup' | 'tags' | 'tagsItem' | 'journal' | 'trades' | 'trade' | 
 'journalItem' | 'journalItemNew' | 'transactions' | 'ideasItem' | 'images' | 'imagesItem' | 'diary' | 'diaryItem' | 'diaryItemNew';

const routes: Record<Route,((arg?: string) => string)> = {
    ideas: () => '/ideas',
    ideasItem: (id  = ':id') => `${routes.ideas()}/${id}`,
    notes: () => '/notes',
    notesItem: (id  = ':id') => `${routes.notes()}/${id}`,
    main: () => '/main',
    profile: () => '/profile',
    journal: () => '/journal',
    journalItemNew: (date) => `/journal/item/new${date ? `?date=${date}` : ''}`,
    journalItem: (id) => `/journal/item/${id ? id : ':id'}`,
    start: () => '/start',
    login: () => '/start/login',
    signup: () => '/start/signup',
    tags: () => '/tags',
    tagsItem: (id = ':id') => `${routes.tags()}/${id}`,
    trades: () => '/trades',
    transactions: () => '/transactions',
    trade: (id?: string) => `/trade/${id ? id : ':id'}`,
    images: () => '/images',
    imagesItem: (id  = ':id') => `${routes.images()}/${id}`,
    diary: () => '/diary',
    diaryItemNew: (date) => `/diary/item/new${date ? `?date=${date}` : ''}`,
    diaryItem: (id = ':id') => `${routes.diary()}/${id}`,
};

export default routes;