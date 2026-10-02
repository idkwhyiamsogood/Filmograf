export { BaseHttpClient } from "./http/axios"

export { authApi } from "./api/auth.api";
export { TokenApi } from "./api/token.api";
export { USE_MOCKS, resetMockDb } from "./mock/adapter";

// utils
export { getValidURL } from "./utils/validURL";
export { getDaysFromReg } from "./utils/getDaysFromReg";
export { pluralize, pluralWord } from "./utils/pluralize";
export { formatRating } from "./utils/formatRating";
export { formatDuration } from "./utils/formatDuration";
export { formatRelative } from "./utils/formatRelative";
export { optimizeImage, imageSrcSet } from "./utils/optimizeImage";
export { getAverageGrade } from "./utils/getAvgGrade";
export { getApiErrorStatus } from "./utils/getApiErrorStatus";