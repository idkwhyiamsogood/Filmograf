export { BaseHttpClient } from "./http/axios"

export { authApi } from "./api/auth.api";
export { TokenApi } from "./api/token.api";
export { USE_MOCKS, resetMockDb } from "./mock/adapter";

// utils
export { getValidURL } from "./utils/validURL";
export { getDaysFromReg } from "./utils/getDaysFromReg";
export { getAverageGrade } from "./utils/getAvgGrade";
export { getApiErrorStatus } from "./utils/getApiErrorStatus";