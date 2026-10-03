// Стартовые данные мок-бэкенда. Формы повторяют DTO реальных сервисов,
// но хранятся «плоско» (комментарии — списком с parentId), а в ответ
// собираются в db.ts/handlers.ts.

export const MOCK_MEMBER_ID = "mock-user";
export const MOCK_GUEST_ID = "mock-guest";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  googleId: string;
  userType: "Guest" | "Member";
  isAdmin: boolean;
  isBanned: boolean;
  isDeleted: boolean;
  createDate: string;
  updateDate: string;
}

export interface MockGenre {
  id: string;
  name: string;
  createDate: string;
  updateDate: string;
}

export interface MockMovie {
  id: string;
  name: string;
  description: string;
  year: string;
  ageLimit: number;
  time: string;
  imageUrl: string;
  previewImageLink: string;
  movieLink: string;
  genreIds: string[];
  imdb: number;
  kinopoisk: number;
  popularity: number;
  createDate: string;
  updateDate: string;
}

export interface MockCollection {
  id: string;
  name: string;
  sourceCollectionId: string;
  userId: string;
  movies: string[];
  tags: string[];
  isPublic: boolean;
  isCommentable: boolean;
  isCopiable: boolean;
  isByFilmograf: boolean;
  isDeleted: boolean;
  popularity: number;
  createDate: string;
  updateDate: string;
}

export interface MockTag {
  id: string;
  name: string;
  createData: string;
}

export interface MockComment {
  id: string;
  entityId: string;
  entityType: "Movie" | "Collection";
  parentId: string | null;
  userId: string;
  text: string;
  isDeleted: boolean;
  likes: string[];
  dislikes: string[];
  createDate: string;
  updateDate: string;
}

export interface MockRate {
  userId: string;
  movieId: string;
  rate: number;
  createDate: string;
  updateDate: string;
}

export interface MockDb {
  version: number;
  users: MockUser[];
  genres: MockGenre[];
  movies: MockMovie[];
  collections: MockCollection[];
  tags: MockTag[];
  comments: MockComment[];
  rates: MockRate[];
  pins: Record<string, string[]>;
  /** userId → id фильмов, последние просмотренные первыми */
  history: Record<string, string[]>;
  seq: number;
}

const SEED_DATE = "2025-09-01T12:00:00.000Z";

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(seed)}`;

// Постеры и кадры из фильмов — CDN TMDB (image.tmdb.org).
const TMDB_IMG = "https://image.tmdb.org/t/p";
const poster = (path: string) => `${TMDB_IMG}/w500/${path}.jpg`;
const preview = (path: string) => `${TMDB_IMG}/w1280/${path}.jpg`;

const USERS: MockUser[] = [
  [MOCK_MEMBER_ID, "Вы (мок)", "member@filmograf.mock", "Member"],
  [MOCK_GUEST_ID, "Гость", "guest@filmograf.mock", "Guest"],
  ["u-anna", "Анна Киноманова", "anna@filmograf.mock", "Member"],
  ["u-oleg", "Олег Сериалов", "oleg@filmograf.mock", "Member"],
  ["u-masha", "Маша Попкорн", "masha@filmograf.mock", "Member"],
  ["u-filmograf", "Filmograf", "team@filmograf.mock", "Member"],
].map(([id, name, email, userType]) => ({
  id,
  name,
  email,
  userType: userType as MockUser["userType"],
  avatarUrl: avatar(id),
  googleId: `google-${id}`,
  isAdmin: id === "u-filmograf" || id === MOCK_MEMBER_ID,
  isBanned: false,
  isDeleted: false,
  createDate: SEED_DATE,
  updateDate: SEED_DATE,
}));

const GENRES: MockGenre[] = [
  ["g-drama", "Драма"],
  ["g-comedy", "Комедия"],
  ["g-thriller", "Триллер"],
  ["g-scifi", "Фантастика"],
  ["g-crime", "Криминал"],
  ["g-adventure", "Приключения"],
  ["g-animation", "Мультфильм"],
  ["g-fantasy", "Фэнтези"],
  ["g-action", "Боевик"],
  ["g-horror", "Ужасы"],
  ["g-romance", "Мелодрама"],
  ["g-history", "История"],
].map(([id, name]) => ({ id, name, createDate: SEED_DATE, updateDate: SEED_DATE }));

// [name, year, ageLimit, time, genres, imdb, kinopoisk, popularity, description, [tmdbPoster, tmdbBackdrop]]
type MovieRow = [string, string, number, string, string[], number, number, number, string, [string, string]];

const MOVIE_ROWS: MovieRow[] = [
  ["Побег из Шоушенка", "1994", 16, "142 мин", ["g-drama"], 9.3, 9.1, 98, "Банкир Энди Дюфрейн попадает в тюрьму Шоушенк по обвинению в убийстве жены и годами хранит надежду на свободу.", ["yvmKPlTIi0xdcFQIFcQKQJcI63W", "pNjh59JSxChQktamG3LMp9ZoQzp"]],
  ["Крёстный отец", "1972", 18, "175 мин", ["g-drama", "g-crime"], 9.2, 8.7, 95, "Стареющий глава мафиозного клана передаёт управление империей своему младшему сыну.", ["hoowzozsn0XQGtgH8nyivAMZfPN", "ejdD20cdHNFAYAN2DlqPToXKyzx"]],
  ["Тёмный рыцарь", "2008", 16, "152 мин", ["g-action", "g-crime", "g-drama"], 9.0, 8.5, 97, "Бэтмен вступает в противостояние с Джокером, который погружает Готэм в хаос.", ["aPtN76OjnNKLqCJ2FJBnQOIL031", "9FE5eD92WfVCiivM9Pq9GVSrlWk"]],
  ["Список Шиндлера", "1993", 16, "195 мин", ["g-drama", "g-history"], 9.0, 8.8, 80, "Немецкий промышленник спасает более тысячи евреев во время Холокоста.", ["dB7edCQIuExWErWXFVqR7ORnZRS", "zb6fM1CX41D9rF9hdgclu0peUmy"]],
  ["Властелин колец: Возвращение короля", "2003", 12, "201 мин", ["g-fantasy", "g-adventure"], 9.0, 8.7, 93, "Финальная битва за Средиземье и последний путь Фродо к Роковой горе.", ["60q19ii6RRIWHzVREeLtXUEM42B", "ctiw6FZK4N36LmkjSklWEbuvlq9"]],
  ["Криминальное чтиво", "1994", 18, "154 мин", ["g-crime", "g-drama"], 8.9, 8.6, 92, "Несколько переплетённых историй из жизни лос-анджелесских бандитов.", ["qvbfoyW2zaI15c0quUfF6CRGH4H", "suaEOtk1N1sgg2MTM7oZd2cfVp3"]],
  ["Бойцовский клуб", "1999", 18, "139 мин", ["g-drama", "g-thriller"], 8.8, 8.7, 94, "Офисный работник и харизматичный торговец мылом создают подпольный бойцовский клуб.", ["66RvLrRJTm4J8l3uHXWF09AICol", "c6OLXfKAk5BKeR6broC8pYiCquX"]],
  ["Форрест Гамп", "1994", 12, "142 мин", ["g-drama", "g-romance", "g-comedy"], 8.8, 8.9, 96, "Простодушный Форрест невольно оказывается в центре важнейших событий американской истории.", ["6fAVi5Iic2I1mvTW8vfp5kZPJjJ", "66Kn4XWhkuPkJxOJyPEx4U2CUfN"]],
  ["Начало", "2010", 12, "148 мин", ["g-scifi", "g-action", "g-thriller"], 8.8, 8.7, 97, "Вор, крадущий идеи из снов, получает задание внедрить мысль в подсознание.", ["piQXcdOGgv1O9HQ07pI0tnjkGJw", "8ZTVqvKDQ8emSGUEMjsS4yHAwrp"]],
  ["Матрица", "1999", 16, "136 мин", ["g-scifi", "g-action"], 8.7, 8.5, 95, "Хакер Нео узнаёт, что привычный мир — симуляция, созданная машинами.", ["kEDbym5htJgDQNenjUtSJxAHysB", "tlm8UkiQsitc8rSuIAscQDCnP8d"]],
  ["Интерстеллар", "2014", 12, "169 мин", ["g-scifi", "g-drama", "g-adventure"], 8.7, 8.6, 99, "Группа исследователей отправляется через червоточину в поисках нового дома для человечества.", ["vReLRjDV9XPhiOSEW7QWow4DXwf", "8sNiAPPYU14PUepFNeSNGUTiHW"]],
  ["Зелёная миля", "1999", 16, "189 мин", ["g-drama", "g-fantasy", "g-crime"], 8.6, 9.1, 96, "Надзиратель блока смертников знакомится с заключённым, обладающим необычным даром.", ["lHxe8t4B0CKv4DO0C0B4rsuiG95", "amZavErrjrdgDwhsIdpWxHNenIx"]],
  ["Унесённые призраками", "2001", 6, "125 мин", ["g-animation", "g-fantasy", "g-adventure"], 8.6, 8.4, 88, "Девочка Тихиро попадает в мир духов и пытается спасти родителей.", ["txaVo4whnSduKuczZiJexhLDVQC", "dyJvKsNs2KP8qQnAXbRwDjblViy"]],
  ["Паразиты", "2019", 18, "132 мин", ["g-drama", "g-thriller", "g-comedy"], 8.5, 8.0, 86, "Бедная семья хитростью устраивается на работу к богатым Пакам.", ["9xL2PwIOerz8jld06J9cxwuJfoD", "TU9NIjwzjoKPwQHoHshkFcQUCG"]],
  ["Гладиатор", "2000", 16, "155 мин", ["g-action", "g-drama", "g-history"], 8.5, 8.6, 90, "Преданный римский генерал становится гладиатором, чтобы отомстить императору.", ["1wjNqlfsuHNTXTpCt2ZOV2iPxaf", "Ar7QuJ7sJEiC0oP3I8fKBKIQD9u"]],
  ["Остров проклятых", "2010", 18, "138 мин", ["g-thriller", "g-drama"], 8.2, 8.5, 89, "Маршал расследует исчезновение пациентки из психиатрической клиники на острове.", ["3UVMyefkUBiktshtKIEnNXvOFKH", "rbZvGN1A1QyZuoKzhCw8QPmf2q0"]],
  ["Престиж", "2006", 12, "130 мин", ["g-drama", "g-thriller", "g-scifi"], 8.5, 8.5, 85, "Соперничество двух иллюзионистов перерастает в опасную одержимость.", ["cynfEpFBHGkdBIVpdnx8Od2TQNj", "yaExZh6qE2cfyK3o4kAMEq0mkgy"]],
  ["Леон", "1994", 18, "133 мин", ["g-crime", "g-drama", "g-action"], 8.5, 8.7, 91, "Профессиональный киллер берёт под опеку двенадцатилетнюю девочку.", ["yyjNn3Ly7ChAT2V9yOlx8QyFs82", "fj0hwDJEOOHllRim2BMt5L7tbjf"]],
  ["Король Лев", "1994", 0, "88 мин", ["g-animation", "g-drama", "g-adventure"], 8.5, 8.8, 87, "Львёнок Симба должен принять своё место в круге жизни.", ["4Ihe9QcxPnsrnZuBLY2Stzh5tWF", "bqFxtuGNsz30HTk5mzgGs8m9Po"]],
  ["1+1", "2011", 16, "112 мин", ["g-drama", "g-comedy"], 8.5, 8.8, 94, "Аристократ-паралитик нанимает в помощники парня из неблагополучного района.", ["zQsq95pYgjhJwYKqoFdeXlVse88", "q6OGlZ1KMEb14AC8KbPCxyNOal6"]],
  ["Джанго освобождённый", "2012", 18, "165 мин", ["g-action", "g-drama"], 8.5, 8.2, 84, "Освобождённый раб вместе с охотником за головами спасает свою жену.", ["9TqgGueg974s9Vw3U1rCYK30QP3", "2oZklIzUbvZXXzIFzv7Hi68d6xf"]],
  ["Одержимость", "2014", 16, "107 мин", ["g-drama"], 8.5, 8.4, 82, "Молодой барабанщик попадает в класс жестокого и требовательного дирижёра.", ["nq3mYsTXx6086nFXxzDReQI0J1S", "fRGxZuo7jJUWQsVg9PREb98Aclp"]],
  ["Назад в будущее", "1985", 12, "116 мин", ["g-scifi", "g-comedy", "g-adventure"], 8.5, 8.6, 88, "Подросток случайно попадает в 1955 год на машине времени из DeLorean.", ["eSaVxwfwl2KmcewzCve657ITDXk", "5bzPWQ2dFUl2aZKkp7ILJVVkRed"]],
  ["Чужой", "1979", 18, "117 мин", ["g-horror", "g-scifi"], 8.5, 8.0, 76, "Экипаж космического буксира сталкивается со смертоносным инопланетным существом.", ["zg4fcO8IuYRllK9wWVNqNlYpueL", "AmR3JG1VQVxU8TfAvljUhfSFUOx"]],
  ["Сияние", "1980", 18, "146 мин", ["g-horror", "g-drama"], 8.4, 8.0, 79, "Писатель с семьёй присматривает за пустым отелем в горах зимой.", ["la6J4ygr4Z8G81yLJBLsAH8ZCct", "AdKA2F1SzYPhSZdEbjH1Zh75UVQ"]],
  ["ВАЛЛ·И", "2008", 0, "98 мин", ["g-animation", "g-scifi", "g-romance"], 8.4, 8.0, 83, "Маленький робот-уборщик влюбляется и отправляется в космос.", ["uR79KoBwDMz1qbxwmuY0bpcDYtf", "nYs4ZwnJBK4AgljhvzwNz7fpr3E"]],
  ["Бегущий по лезвию 2049", "2017", 18, "163 мин", ["g-scifi", "g-drama", "g-thriller"], 8.0, 7.7, 81, "Офицер-репликант раскрывает тайну, способную погрузить общество в хаос.", ["fnIJeT9GZvscKm5PbmAvhTYDsLh", "gNdLJU9TxrpGx4dkZidjys3fyy0"]],
  ["Дюна", "2021", 12, "155 мин", ["g-scifi", "g-adventure", "g-drama"], 8.0, 7.7, 92, "Наследник знатного дома оказывается на самой опасной планете во Вселенной.", ["3hbXNclcHaj5KiF6kK41GBMjyFr", "zRKQW58MBEY078AxkHxEJzUskCl"]],
  ["Безумный Макс: Дорога ярости", "2015", 18, "120 мин", ["g-action", "g-scifi", "g-adventure"], 8.1, 7.7, 86, "Постапокалиптическая погоня через пустыню за свободой.", ["8FM6AhLMX3X6OcZjfmH24F4rKMI", "gqrnQA6Xppdl8vIb2eJc58VC1tW"]],
  ["Ла-Ла Ленд", "2016", 16, "128 мин", ["g-romance", "g-drama", "g-comedy"], 8.0, 7.9, 85, "Джазовый пианист и начинающая актриса влюбляются в Лос-Анджелесе.", ["g7f8GdnJKS0Z3QJ5G6P9BZrqs36", "nlPCdZlHtRNcF6C9hzUH4ebmV1w"]],
  ["Однажды в… Голливуде", "2019", 18, "161 мин", ["g-comedy", "g-drama"], 7.6, 7.5, 78, "Актёр и его дублёр пытаются найти себя в меняющемся Голливуде 1969 года.", ["nHg4GLAPjo8rhRkzv6lLfGwuRJq", "kKTPv9LKKs5L3oO1y5FNObxAPWI"]],
  ["Остров собак", "2018", 12, "101 мин", ["g-animation", "g-comedy", "g-adventure"], 7.8, 7.6, 65, "Мальчик ищет своего пса на острове, куда сослали всех собак Японии.", ["phspK8CoyEoVWDmxCdU3QzUWf4P", "goMGTcitprGu7YD6VZS4lUUwzRA"]],
  ["Отель «Гранд Будапешт»", "2014", 18, "99 мин", ["g-comedy", "g-crime", "g-adventure"], 8.1, 7.9, 80, "Консьерж легендарного отеля и его протеже оказываются втянуты в историю с картиной.", ["5qFxj03eBrkI0bUiGIonb4e0AI4", "jK65srQczOKTpW62wPxwwKztGgE"]],
  ["Брат", "1997", 18, "100 мин", ["g-crime", "g-drama", "g-action"], 7.9, 8.3, 88, "Демобилизованный Данила приезжает в Петербург к старшему брату.", ["1QTgAkpnPnlS6vDpA90cBL6OcRi", "g5821JEdxqj8bUBDV1FDhHbZkRa"]],
  ["Москва слезам не верит", "1979", 12, "150 мин", ["g-drama", "g-romance", "g-comedy"], 8.1, 8.3, 74, "История трёх подруг, приехавших покорять Москву.", ["gt2un5LYmp7G3J3UZL43RqYEv4R", "eVbDEVjNIj2fRBiWObMTcuI5bI3"]],
  ["Иван Васильевич меняет профессию", "1973", 0, "88 мин", ["g-comedy", "g-scifi", "g-adventure"], 8.2, 8.8, 90, "Машина времени меняет местами управдома и Ивана Грозного.", ["zdchIYA46WPazYjLywUREvmQwIA", "z8125Gm4hadwQZOcFiZ7uor77E4"]],
  ["Сталкер", "1979", 12, "163 мин", ["g-scifi", "g-drama"], 8.0, 8.1, 68, "Проводник ведёт двоих путников через Зону к комнате, исполняющей желания.", ["mzJxTxIODATNaYUwyJ2C2XPkhXW", "6yrbWzzrPp7pwz6zHdifspJk8t3"]],
  ["Джентльмены", "2019", 18, "113 мин", ["g-crime", "g-comedy", "g-action"], 7.8, 8.6, 93, "Американский наркобарон пытается продать свою империю в Лондоне.", ["vWxVVECgYDPSg5o0Rhw5u7KFa7X", "hClLP88yMIuhslwSVxtYrvWmxfp"]],
  ["Достать ножи", "2019", 16, "130 мин", ["g-comedy", "g-crime", "g-thriller"], 7.9, 8.0, 84, "Детектив расследует смерть известного автора детективов.", ["mGfb75tcFWxuT8esS1isHrNFE90", "4HWAQu28e2yaWrtupFPGFkdNU7V"]],
  ["Оппенгеймер", "2023", 18, "180 мин", ["g-drama", "g-history"], 8.3, 8.1, 95, "История создателя атомной бомбы и цены, которую пришлось за неё заплатить.", ["8OQzw8keE6sDNH25sOqPRTxhFTO", "neeNHeXjMF5fXoCJRsOmkNGC7q"]],
  ["Мальчик и птица", "2023", 12, "124 мин", ["g-animation", "g-fantasy", "g-drama"], 7.5, 7.3, 70, "Подросток следует за говорящей цаплей в загадочный мир.", ["oTmSnrE9MuQMhZkosZRE5bYvstK", "75nSb1fbWooipwcSU5bUttiOriI"]],
  ["Пираты Карибского моря: Проклятие Чёрной жемчужины", "2003", 12, "143 мин", ["g-adventure", "g-fantasy", "g-action"], 8.1, 8.4, 91, "Кузнец и эксцентричный капитан спасают дочь губернатора от проклятых пиратов.", ["70xRYK8orGWA7NfxvzhtkjpZAD6", "uRNgkJSkNBFbbn9fPsEjDIy8Sh3"]],
  ["Прочь", "2017", 18, "104 мин", ["g-horror", "g-thriller"], 7.8, 7.0, 72, "Знакомство с родителями девушки оборачивается кошмаром.", ["hkchWNmGfcgow2Jivyxv83JqHCy", "bBQHALHRAaaORlPNXv7fNcRXYdx"]],
  ["Титаник", "1997", 12, "194 мин", ["g-romance", "g-drama", "g-history"], 7.9, 8.4, 89, "Любовная история на борту обречённого лайнера.", ["r3sYKBtoNHPyS9vkaA8dJyh8grG", "xXCuto8YVp5RFqBJ7yKmVmLOWpF"]],
  ["Жизнь Пи", "2012", 12, "127 мин", ["g-adventure", "g-drama", "g-fantasy"], 7.9, 8.1, 77, "Юноша оказывается в шлюпке посреди океана вместе с бенгальским тигром.", ["sKfOdwKRDoVROHg9B7suyKM82I9", "21YsCNMub5455NQCn3jh9SmRFyG"]],
  ["Тайна Коко", "2017", 6, "105 мин", ["g-animation", "g-fantasy", "g-comedy"], 8.4, 8.7, 86, "Мальчик-музыкант попадает в Страну мёртвых и узнаёт тайну своей семьи.", ["jvYsGaUqN8ymH696kRfVJjJ3GIl", "g7CHF8gTLGooTbP4GznIGwaqAGL"]],
];

const MOVIES: MockMovie[] = MOVIE_ROWS.map(
  ([name, year, ageLimit, time, genreIds, imdb, kinopoisk, popularity, description, [posterPath, backdropPath]], i) => {
    const id = `m${i + 1}`;
    return {
      id,
      name,
      description,
      year,
      ageLimit,
      time,
      imageUrl: poster(posterPath),
      previewImageLink: preview(backdropPath),
      movieLink: "",
      genreIds,
      imdb,
      kinopoisk,
      popularity,
      createDate: SEED_DATE,
      updateDate: SEED_DATE,
    };
  },
);

const TAGS: MockTag[] = [
  "классика", "вечер с друзьями", "до мурашек", "на выходные", "для семьи",
  "нолан", "аниме", "советское", "мозговыносящее", "атмосферное",
  "на один раз", "пересматриваю", "оскар", "уютное", "сюжетный твист",
].map((name, i) => ({ id: `t${i + 1}`, name, createData: SEED_DATE }));

const collection = (
  id: string,
  name: string,
  userId: string,
  movies: string[],
  tags: string[],
  popularity: number,
  extra: Partial<MockCollection> = {},
): MockCollection => ({
  id,
  name,
  sourceCollectionId: "",
  userId,
  movies,
  tags,
  isPublic: true,
  isCommentable: true,
  isCopiable: true,
  isByFilmograf: userId === "u-filmograf",
  isDeleted: false,
  popularity,
  createDate: SEED_DATE,
  updateDate: SEED_DATE,
  ...extra,
});

const COLLECTIONS: MockCollection[] = [
  collection("c1", "Мои любимые", MOCK_MEMBER_ID, ["m1", "m8", "m11", "m20"], ["t12", "t14"], 40),
  collection("c2", "Посмотреть позже", MOCK_MEMBER_ID, ["m28", "m40", "m14"], ["t4"], 10, { isPublic: false, isCommentable: false }),
  collection("c3", "Нолан", "u-filmograf", ["m3", "m9", "m11", "m17", "m40"], ["t6", "t9"], 95),
  collection("c4", "Топ-10 всех времён", "u-filmograf", ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10"], ["t1", "t13"], 99),
  collection("c5", "Аниме и анимация", "u-anna", ["m13", "m19", "m26", "m32", "m41", "m46"], ["t7", "t5", "t14"], 70),
  collection("c6", "Советская классика", "u-oleg", ["m35", "m36", "m37"], ["t8", "t1"], 60),
  collection("c7", "Взорвать мозг", "u-masha", ["m9", "m16", "m17", "m27", "m10"], ["t9", "t15"], 85),
  collection("c8", "Страшно, очень страшно", "u-oleg", ["m24", "m25", "m43"], ["t3", "t10"], 55),
  collection("c9", "Посмеяться с друзьями", "u-masha", ["m33", "m36", "m38", "m39", "m31"], ["t2", "t4"], 75),
  collection("c10", "Эпические приключения", "u-anna", ["m5", "m28", "m29", "m42", "m45"], ["t10", "t4"], 80),
  collection("c11", "Оскароносцы", "u-filmograf", ["m14", "m15", "m22", "m40", "m44"], ["t13"], 88),
];

const comment = (
  id: string,
  entityType: MockComment["entityType"],
  entityId: string,
  parentId: string | null,
  userId: string,
  text: string,
  likes: string[] = [],
  dislikes: string[] = [],
  date = SEED_DATE,
): MockComment => ({
  id,
  entityId,
  entityType,
  parentId,
  userId,
  text,
  isDeleted: false,
  likes,
  dislikes,
  createDate: date,
  updateDate: date,
});

const COMMENTS: MockComment[] = [
  comment("cm1", "Movie", "m1", null, "u-anna", "Пересматриваю каждый год, и каждый раз как в первый.", ["u-oleg", "u-masha"], [], "2025-09-02T10:00:00.000Z"),
  comment("cm2", "Movie", "m1", "cm1", "u-oleg", "Согласен, финал — один из лучших в истории кино.", ["u-anna"], [], "2025-09-02T11:00:00.000Z"),
  comment("cm3", "Movie", "m1", "cm2", "u-masha", "А мне больше нравится сцена с пластинкой.", [], [], "2025-09-02T12:00:00.000Z"),
  comment("cm4", "Movie", "m1", null, "u-masha", "Немного затянуто в середине, но в целом шедевр.", [], ["u-anna"], "2025-09-03T09:00:00.000Z"),
  comment("cm5", "Movie", "m9", null, "u-oleg", "Волчок в конце упал или нет?", ["u-anna", "u-masha", MOCK_MEMBER_ID], [], "2025-09-04T20:00:00.000Z"),
  comment("cm6", "Movie", "m9", "cm5", "u-anna", "Это не важно — Кобб уже не смотрит на него :)", ["u-oleg"], [], "2025-09-04T21:00:00.000Z"),
  comment("cm7", "Movie", "m11", null, "u-anna", "Саундтрек Циммера — отдельный вид искусства.", ["u-oleg"], [], "2025-09-05T18:00:00.000Z"),
  comment("cm8", "Collection", "c3", null, "u-masha", "Не хватает «Помни», а так отличная подборка!", ["u-anna"], [], "2025-09-06T15:00:00.000Z"),
  comment("cm9", "Collection", "c3", "cm8", "u-filmograf", "Спасибо, добавим в следующем обновлении.", ["u-masha"], [], "2025-09-06T16:00:00.000Z"),
  comment("cm10", "Collection", "c4", null, "u-oleg", "Спорный топ, но смотреть всё обязательно.", [], [], "2025-09-07T12:00:00.000Z"),
];

const RATES: MockRate[] = [
  { userId: MOCK_MEMBER_ID, movieId: "m1", rate: 10, createDate: SEED_DATE, updateDate: SEED_DATE },
  { userId: MOCK_MEMBER_ID, movieId: "m9", rate: 9, createDate: SEED_DATE, updateDate: SEED_DATE },
  { userId: MOCK_MEMBER_ID, movieId: "m14", rate: 8, createDate: SEED_DATE, updateDate: SEED_DATE },
];

// Бампать при изменении сида — старые сохранённые в localStorage данные сбросятся.
export const SEED_VERSION = 3;

export const createSeed = (): MockDb =>
  structuredClone({
    version: SEED_VERSION,
    users: USERS,
    genres: GENRES,
    movies: MOVIES,
    collections: COLLECTIONS,
    tags: TAGS,
    comments: COMMENTS,
    rates: RATES,
    pins: { [MOCK_MEMBER_ID]: ["c3"] },
    history: { [MOCK_MEMBER_ID]: ["m9", "m1", "m14"] },
    seq: 1000,
  });
