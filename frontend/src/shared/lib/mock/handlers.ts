import { db, nextId, now, persist } from "./db";
import {
  MOCK_GUEST_ID,
  MOCK_MEMBER_ID,
  type MockCollection,
  type MockComment,
  type MockMovie,
  type MockUser,
} from "./seed";

export class MockHttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = "MOCK_ERROR",
  ) {
    super(message);
  }
}

export interface MockRequest {
  method: string;
  params: Record<string, string>;
  query: URLSearchParams;
  body: any;
  token: string | null;
}

type Handler = (req: MockRequest) => unknown;

// --- токены -----------------------------------------------------------------
// Токен — просто строка с id пользователя, никакой криптографии.

const MEMBER_TOKEN = `mock-jwt.${MOCK_MEMBER_ID}`;
const GUEST_TOKEN = `mock-jwt.${MOCK_GUEST_ID}`;

const userIdFromToken = (token: string | null) =>
  token?.startsWith("mock-jwt.") ? token.slice("mock-jwt.".length) : null;

const currentUser = (req: MockRequest): MockUser | undefined => {
  const id = userIdFromToken(req.token);
  return db.users.find((u) => u.id === id);
};

const requireUser = (req: MockRequest) => {
  const user = currentUser(req);
  if (!user) throw new MockHttpError(401, "Необходима авторизация", "UNAUTHORIZED");
  return user;
};

// --- сериализация -----------------------------------------------------------

const toMovieDto = (movie: MockMovie, userId: string | null) => {
  const { imdb, kinopoisk, popularity: _p, ...rest } = movie;
  const userRate = db.rates.find((r) => r.movieId === movie.id && r.userId === userId)?.rate;
  const allRates = db.rates.filter((r) => r.movieId === movie.id).map((r) => r.rate);
  const filmRate = allRates.length
    ? allRates.reduce((a, b) => a + b, 0) / allRates.length
    : kinopoisk;

  return {
    ...rest,
    // Порядок важен: MovieCover выводит Object.values(rates)[0].
    rates: {
      IMDb: imdb,
      Kinopoisk: kinopoisk,
      Film: Number(filmRate.toFixed(1)),
      ByUser: userRate ?? 0,
    },
  };
};

const toCollectionDto = (c: MockCollection) => {
  const { popularity: _p, ...rest } = c;
  return {
    ...rest,
    moviePreviews: c.movies
      .slice(0, 3)
      .map((id) => db.movies.find((m) => m.id === id)?.imageUrl)
      .filter(Boolean),
  };
};

const childrenOf = (id: string) => db.comments.filter((c) => c.parentId === id);

const toCommentDto = (c: MockComment, withChilds = false): any => {
  const { entityId: _e, entityType: _t, parentId: _p, ...rest } = c;
  const childs = childrenOf(c.id);
  return {
    ...rest,
    text: c.isDeleted ? "Комментарий удалён" : c.text,
    childsCount: childs.length,
    childs: withChilds ? childs.map((ch) => toCommentDto(ch)) : null,
  };
};

const requireAdmin = (req: MockRequest) => {
  const user = requireUser(req);
  if (!user.isAdmin) throw new MockHttpError(403, "Доступно только администраторам", "FORBIDDEN");
  return user;
};

const pushHistory = (userId: string, movieId: string) => {
  const history = (db.history[userId] ?? []).filter((id) => id !== movieId);
  db.history[userId] = [movieId, ...history].slice(0, 100);
};

const toUserLight = (u: MockUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  avatarUrl: u.avatarUrl,
  isAdmin: u.isAdmin,
  isDeleted: u.isDeleted,
});

// --- утилиты ----------------------------------------------------------------

const paginate = <T>(items: T[], query: URLSearchParams) => {
  const page = Number(query.get("Page") ?? 0);
  const count = Number(query.get("Count") ?? 21);
  return items.slice(page * count, page * count + count);
};

const byIds = <T extends { id: string }>(items: T[], ids: string[] = []) =>
  ids.map((id) => items.find((i) => i.id === id)).filter((i): i is T => !!i);

const findOr404 = <T extends { id: string }>(items: T[], id: string, what: string) => {
  const item = items.find((i) => i.id === id);
  if (!item) throw new MockHttpError(404, `${what} не найден(а)`, "NOT_FOUND");
  return item;
};

const matchesQuery = (name: string, query: string | null) =>
  !query || name.toLowerCase().includes(query.trim().toLowerCase());

interface IncludeExclude {
  include?: string[];
  exclude?: string[];
}

const matchesIncludeExclude = (
  values: string[],
  filter: IncludeExclude | undefined,
  strict: boolean,
) => {
  if (!filter) return true;
  const include = filter.include ?? [];
  const exclude = filter.exclude ?? [];
  if (exclude.some((id) => values.includes(id))) return false;
  if (include.length === 0) return true;
  return strict
    ? include.every((id) => values.includes(id))
    : include.some((id) => values.includes(id));
};

const visibleCollections = (userId: string | null) =>
  db.collections.filter((c) => !c.isDeleted && (c.isPublic || c.userId === userId));

const mutate = <T>(fn: () => T): T => {
  const result = fn();
  persist();
  return result;
};

const ownCollection = (req: MockRequest, id: string) => {
  const user = requireUser(req);
  const col = findOr404(db.collections, id, "Коллекция");
  if (col.userId !== user.id) throw new MockHttpError(403, "Нет доступа к коллекции", "FORBIDDEN");
  return col;
};

// --- права доступа (как UserTypePolicy на бэке) ------------------------------

const PUBLIC_ROUTES = new Set([
  "GET api/auth/temporary",
  "POST api/auth/google-native",
  "POST api/auth/verify-idempotence-code",
  "PATCH api/auth/refresh-token",
]);

// [UserTypePolicy(Guest = false)]
const MEMBER_ONLY_ROUTES = new Set([
  "GET api/collections/pins/my",
  "PUT api/collections/pins/:id",
  "DELETE api/collections/pins/:id",
  "GET api/collections/recommended",
  "POST api/collections",
  "PATCH api/collections/:id",
  "DELETE api/collections/:id",
  "POST api/collections/:id/copy",
  "PUT api/collections/:id/movie/:movieId",
  "DELETE api/collections/:id/movie/:movieId",
  "POST api/collections/tags/batch-many",
  "POST api/collections/tags",
  "POST api/comments/:id/comment",
  "PATCH api/comments/:id",
  "DELETE api/comments/:id",
  "PUT api/comments/:id/reaction",
  "POST api/comments/entities/:entityId/comment",
  "GET api/movies/rate/my",
  "PUT api/movies/rate/:id",
]);

export const guardRoute = (method: string, pattern: string, req: MockRequest) => {
  const key = `${method} ${pattern}`;
  if (PUBLIC_ROUTES.has(key)) return;
  const user = requireUser(req);
  if (MEMBER_ONLY_ROUTES.has(key) && user.userType === "Guest") {
    throw new MockHttpError(403, "Доступно только после входа", "FORBIDDEN");
  }
};

// --- роуты ------------------------------------------------------------------
// Порядок важен: более специфичные пути должны идти раньше `:id`.

export const routes: [method: string, pattern: string, handler: Handler][] = [
  // auth / users
  ["GET", "api/auth/temporary", () => ({ jwt: GUEST_TOKEN })],
  ["POST", "api/auth/google-native", () => ({ jwt: MEMBER_TOKEN })],
  ["POST", "api/auth/verify-idempotence-code", () => ({ jwt: MEMBER_TOKEN })],
  ["PATCH", "api/auth/refresh-token", (req) => ({ jwt: req.token ?? GUEST_TOKEN })],
  ["GET", "api/auth/status", (req) => !!currentUser(req)],
  ["GET", "api/auth/fetch", (req) => {
    const { isDeleted: _d, ...user } = requireUser(req);
    return user;
  }],
  ["GET", "api/users/:id", (req) => toUserLight(findOr404(db.users, req.params.id, "Пользователь"))],

  // genres
  ["GET", "api/genres", () => db.genres],
  ["GET", "api/search/genres", (req) => ({
    entityIds: paginate(
      db.genres.filter((g) => matchesQuery(g.name, req.query.get("query"))),
      req.query,
    ).map((g) => g.id),
    type: 3,
  })],

  // movies
  ["GET", "api/movies/top", (req) => ({
    ids: paginate([...db.movies].sort((a, b) => b.imdb - a.imdb), req.query).map((m) => m.id),
  })],
  ["GET", "api/movies/popular", (req) => ({
    ids: paginate([...db.movies].sort((a, b) => b.popularity - a.popularity), req.query).map((m) => m.id),
  })],
  ["GET", "api/movies/recommended", (req) => {
    // «Рекомендации»: фильмы тех же жанров, что пользователь оценил высоко.
    const userId = userIdFromToken(req.token);
    const liked = db.rates.filter((r) => r.userId === userId && r.rate >= 7).map((r) => r.movieId);
    const likedGenres = new Set(
      db.movies.filter((m) => liked.includes(m.id)).flatMap((m) => m.genreIds),
    );
    const score = (m: MockMovie) =>
      m.genreIds.filter((g) => likedGenres.has(g)).length * 10 + m.kinopoisk;
    const sorted = db.movies.filter((m) => !liked.includes(m.id)).sort((a, b) => score(b) - score(a));
    return { ids: paginate(sorted, req.query).map((m) => m.id) };
  }],
  ["GET", "api/movies/history", (req) => ({
    ids: paginate(db.history[requireUser(req).id] ?? [], req.query),
  })],
  ["POST", "api/movies/batch-many", (req) =>
    byIds(db.movies, req.body?.ids).map((m) => toMovieDto(m, userIdFromToken(req.token)))],
  ["GET", "api/movies/rate/my", (req) => {
    const user = requireUser(req);
    return db.rates
      .filter((r) => r.userId === user.id)
      .map(({ userId: _u, ...rate }) => rate);
  }],
  ["PUT", "api/movies/rate/:id", (req) => mutate(() => {
    const user = requireUser(req);
    findOr404(db.movies, req.params.id, "Фильм");
    const rate = Number(req.body?.rate);
    const existing = db.rates.find((r) => r.userId === user.id && r.movieId === req.params.id);
    if (existing) {
      existing.rate = rate;
      existing.updateDate = now();
    } else {
      db.rates.push({ userId: user.id, movieId: req.params.id, rate, createDate: now(), updateDate: now() });
    }
    return null;
  })],
  ["GET", "api/movies/:id", (req) => {
    const movie = findOr404(db.movies, req.params.id, "Фильм");
    const user = currentUser(req);
    // Как на бэке: просмотр карточки фильма попадает в историю.
    if (user) mutate(() => pushHistory(user.id, movie.id));
    return toMovieDto(movie, user?.id ?? null);
  }],

  // movies feed (админка парсинга) — в моках ничего не парсим, только проверяем права
  ["POST", "api/movies/feed/parse-source-movie", (req) => {
    requireAdmin(req);
    if (!["IMDb", "Kinopoisk"].includes(req.body?.source) || !req.body?.url) {
      throw new MockHttpError(400, "Укажите source (IMDb|Kinopoisk) и url", "VALIDATION_ERROR");
    }
    return null;
  }],
  ["POST", "api/movies/feed/parse-source-collection", (req) => {
    requireAdmin(req);
    if (!["IMDb", "Kinopoisk"].includes(req.body?.source) || !req.body?.url) {
      throw new MockHttpError(400, "Укажите source (IMDb|Kinopoisk) и url", "VALIDATION_ERROR");
    }
    return null;
  }],
  ["POST", "api/movies/feed/compile-chart", (req) => {
    requireAdmin(req);
    return null;
  }],
  ["POST", "api/movies/feed/:id/re-parse-one-movie", (req) => {
    requireAdmin(req);
    findOr404(db.movies, req.params.id, "Фильм");
    return null;
  }],
  ["POST", "api/movies/feed/nahyi-parsing-bugs", (req) => {
    requireAdmin(req);
    return 0;
  }],

  // search
  ["POST", "api/search/movies", (req) => {
    const opts = req.body ?? {};
    const strict = !!opts.strictMatch;
    const [yearFrom, yearTo] = (opts.fromYearTo ?? []).map(Number);
    const [gradeFrom, gradeTo] = (opts.fromGradeTo ?? []).map(Number);
    const ages: number[] = opts.ageRating ?? [];

    const found = db.movies.filter((m) =>
      matchesQuery(m.name, req.query.get("query")) &&
      matchesIncludeExclude(m.genreIds, opts.genres, strict) &&
      (!yearFrom || Number(m.year) >= yearFrom) &&
      (!yearTo || Number(m.year) <= yearTo) &&
      (!gradeFrom || m.imdb >= gradeFrom) &&
      (!gradeTo || m.imdb <= gradeTo) &&
      (ages.length === 0 || ages.includes(m.ageLimit)),
    );
    return { entityIds: paginate(found, req.query).map((m) => m.id), type: 0 };
  }],
  ["POST", "api/search/collections", (req) => {
    const opts = req.body ?? {};
    const strict = !!opts.strictMatch;
    const found = visibleCollections(userIdFromToken(req.token)).filter((c) => {
      const genres = [...new Set(
        db.movies.filter((m) => c.movies.includes(m.id)).flatMap((m) => m.genreIds),
      )];
      return (
        matchesQuery(c.name, req.query.get("query")) &&
        matchesIncludeExclude(c.tags, opts.tags, strict) &&
        matchesIncludeExclude(genres, opts.genres, strict)
      );
    });
    return { entityIds: paginate(found, req.query).map((c) => c.id), type: 1 };
  }],
  ["GET", "api/search/tags", (req) => ({
    entityIds: paginate(
      db.tags.filter((t) => matchesQuery(t.name, req.query.get("query"))),
      req.query,
    ).map((t) => t.id),
    type: 2,
  })],

  // collection pins
  ["GET", "api/collections/pins/my", (req) => ({
    collectionIds: db.pins[requireUser(req).id] ?? [],
  })],
  ["PUT", "api/collections/pins/:id", (req) => mutate(() => {
    const user = requireUser(req);
    const pins = (db.pins[user.id] ??= []);
    if (!pins.includes(req.params.id)) pins.push(req.params.id);
    return { collectionIds: pins };
  })],
  ["DELETE", "api/collections/pins/:id", (req) => mutate(() => {
    const user = requireUser(req);
    db.pins[user.id] = (db.pins[user.id] ?? []).filter((id) => id !== req.params.id);
    return { collectionIds: db.pins[user.id] };
  })],

  // collection tags
  ["GET", "api/collections/tags", (req) => paginate(db.tags, req.query)],
  ["POST", "api/collections/tags/batch-many", (req) => byIds(db.tags, req.body?.ids)],
  ["POST", "api/collections/tags", (req) => mutate(() => {
    const tag = { id: nextId("t"), name: String(req.body?.name ?? ""), createData: now() };
    db.tags.push(tag);
    return tag;
  })],
  ["GET", "api/collections/tags/:id", (req) => findOr404(db.tags, req.params.id, "Тег")],
  ["PATCH", "api/collections/tags/:id", (req) => mutate(() => {
    findOr404(db.tags, req.params.id, "Тег").name = String(req.body?.name ?? "");
    return null;
  })],
  ["DELETE", "api/collections/tags/:id", (req) => mutate(() => {
    db.tags = db.tags.filter((t) => t.id !== req.params.id);
    return null;
  })],

  // collections
  // Как на бэке: Page/Count → skip/limit, «мои» — в порядке создания.
  ["GET", "api/collections/my", (req) => {
    const user = requireUser(req);
    return {
      ids: paginate(db.collections.filter((c) => !c.isDeleted && c.userId === user.id), req.query).map((c) => c.id),
    };
  }],
  ["GET", "api/collections/popular", (req) => ({
    ids: paginate(
      visibleCollections(userIdFromToken(req.token)).sort((a, b) => b.popularity - a.popularity),
      req.query,
    ).map((c) => c.id),
  })],
  ["GET", "api/collections/recommended", (req) => {
    const userId = userIdFromToken(req.token);
    return {
      ids: paginate(
        visibleCollections(userId)
          .filter((c) => c.userId !== userId)
          .sort((a, b) => Number(b.isByFilmograf) - Number(a.isByFilmograf) || b.popularity - a.popularity),
        req.query,
      ).map((c) => c.id),
    };
  }],
  ["POST", "api/collections/batch-many", (req) =>
    byIds(visibleCollections(userIdFromToken(req.token)), req.body?.ids).map(toCollectionDto)],
  ["POST", "api/collections", (req) => mutate(() => {
    const user = requireUser(req);
    const col: MockCollection = {
      id: nextId("c"),
      sourceCollectionId: "",
      userId: user.id,
      movies: [],
      isByFilmograf: false,
      isDeleted: false,
      popularity: 0,
      createDate: now(),
      updateDate: now(),
      name: "",
      tags: [],
      isPublic: true,
      isCommentable: true,
      isCopiable: true,
      ...req.body,
    };
    db.collections.push(col);
    return toCollectionDto(col);
  })],
  ["POST", "api/collections/:id/copy", (req) => mutate(() => {
    const user = requireUser(req);
    const source = findOr404(db.collections, req.params.id, "Коллекция");
    if (!source.isCopiable && source.userId !== user.id) {
      throw new MockHttpError(403, "Коллекцию нельзя копировать", "FORBIDDEN");
    }
    const col: MockCollection = {
      ...source,
      ...req.body,
      id: nextId("c"),
      sourceCollectionId: source.id,
      userId: user.id,
      movies: [...source.movies],
      isByFilmograf: false,
      popularity: 0,
      createDate: now(),
      updateDate: now(),
    };
    db.collections.push(col);
    return toCollectionDto(col);
  })],
  ["PUT", "api/collections/:id/movie/:movieId", (req) => mutate(() => {
    const col = ownCollection(req, req.params.id);
    findOr404(db.movies, req.params.movieId, "Фильм");
    if (!col.movies.includes(req.params.movieId)) col.movies.push(req.params.movieId);
    col.updateDate = now();
    return null;
  })],
  ["DELETE", "api/collections/:id/movie/:movieId", (req) => mutate(() => {
    const col = ownCollection(req, req.params.id);
    col.movies = col.movies.filter((id) => id !== req.params.movieId);
    col.updateDate = now();
    return null;
  })],
  ["GET", "api/collections/:id", (req) => {
    const col = findOr404(db.collections, req.params.id, "Коллекция");
    if (col.isDeleted || (!col.isPublic && col.userId !== userIdFromToken(req.token))) {
      throw new MockHttpError(404, "Коллекция не найдена", "NOT_FOUND");
    }
    return toCollectionDto(col);
  }],
  ["PATCH", "api/collections/:id", (req) => mutate(() => {
    const col = ownCollection(req, req.params.id);
    Object.assign(col, req.body, { updateDate: now() });
    return null;
  })],
  ["DELETE", "api/collections/:id", (req) => mutate(() => {
    ownCollection(req, req.params.id).isDeleted = true;
    return null;
  })],

  // comments
  ["GET", "api/comments/entities/:entityId", (req) => {
    const type = req.query.get("EntityType") ?? "Movie";
    const parents = db.comments
      .filter((c) => c.entityId === req.params.entityId && c.entityType === type && !c.parentId)
      .sort((a, b) => b.createDate.localeCompare(a.createDate));
    return paginate(parents, req.query).map((c) => toCommentDto(c));
  }],
  ["POST", "api/comments/entities/:entityId/comment", (req) => mutate(() => {
    const user = requireUser(req);
    const c: MockComment = {
      id: nextId("cm"),
      entityId: req.params.entityId,
      entityType: (req.query.get("EntityType") as MockComment["entityType"]) ?? "Movie",
      parentId: null,
      userId: user.id,
      text: String(req.body?.text ?? ""),
      isDeleted: false,
      likes: [],
      dislikes: [],
      createDate: now(),
      updateDate: now(),
    };
    db.comments.push(c);
    return toCommentDto(c);
  })],
  ["GET", "api/comments/:id", (req) =>
    toCommentDto(findOr404(db.comments, req.params.id, "Комментарий"))],
  ["GET", "api/comments/:id/full", (req) =>
    toCommentDto(findOr404(db.comments, req.params.id, "Комментарий"), true)],
  ["POST", "api/comments/:id/comment", (req) => mutate(() => {
    const user = requireUser(req);
    const parent = findOr404(db.comments, req.params.id, "Комментарий");
    const c: MockComment = {
      ...parent,
      id: nextId("cm"),
      parentId: parent.id,
      userId: user.id,
      text: String(req.body?.text ?? ""),
      isDeleted: false,
      likes: [],
      dislikes: [],
      createDate: now(),
      updateDate: now(),
    };
    db.comments.push(c);
    return toCommentDto(c);
  })],
  ["PUT", "api/comments/:id/reaction", (req) => mutate(() => {
    const user = requireUser(req);
    const c = findOr404(db.comments, req.params.id, "Комментарий");
    c.likes = c.likes.filter((id) => id !== user.id);
    c.dislikes = c.dislikes.filter((id) => id !== user.id);
    if (req.body?.reaction === 1) c.likes.push(user.id);
    if (req.body?.reaction === -1) c.dislikes.push(user.id);
    return null;
  })],
  ["PATCH", "api/comments/:id", (req) => mutate(() => {
    const user = requireUser(req);
    const c = findOr404(db.comments, req.params.id, "Комментарий");
    if (c.userId !== user.id) throw new MockHttpError(403, "Нельзя редактировать чужой комментарий", "FORBIDDEN");
    c.text = String(req.body?.text ?? "");
    c.updateDate = now();
    return null;
  })],
  ["DELETE", "api/comments/:id", (req) => mutate(() => {
    const user = requireUser(req);
    const c = findOr404(db.comments, req.params.id, "Комментарий");
    if (c.userId !== user.id) throw new MockHttpError(403, "Нельзя удалить чужой комментарий", "FORBIDDEN");
    c.isDeleted = true;
    return null;
  })],
];
