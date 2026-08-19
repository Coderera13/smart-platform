const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || "Something went wrong";

    throw new Error(message);
  }

  return data;
}

export async function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function registerUser({
  name,
  email,
  password,
  gender,
  branch,
  section,
  rollNo,
}) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      gender,
      branch,
      section,
      rollNo,
    }),
  });
}

export async function forgotPassword(email) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

export async function resetPassword(token, newPassword) {
  return request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });
}

export function saveToken(token, rememberMe) {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  if (rememberMe) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

export function getToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

export function logoutUser() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

export async function apiFetch(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function getMyAttendance() {
  return apiFetch("/api/attendance/my");
}

// ============================================================
// PROGRAMMING APIs
// ============================================================

export async function getProgrammingQuestion(id) {
  return apiFetch(`/api/programming/questions/${id}`);
}

export async function runProgrammingCode({
  programmingQuestionId,
  language,
  sourceCode,
}) {
  return apiFetch("/api/programming/submissions/run", {
    method: "POST",
    body: JSON.stringify({
      programmingQuestionId,
      language,
      sourceCode,
    }),
  });
}

export async function submitProgrammingCode({
  programmingQuestionId,
  language,
  sourceCode,
}) {
  return apiFetch("/api/programming/submissions/submit", {
    method: "POST",
    body: JSON.stringify({
      programmingQuestionId,
      language,
      sourceCode,
    }),
  });
}

export async function getMyProgrammingSubmissions() {
  return apiFetch("/api/programming/submissions/my");
}