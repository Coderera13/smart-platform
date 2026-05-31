const BASE_URL = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${path}`);
  }

  return res.json();
}

export function fetchAttemptHistory() {
  return request("/api/attempts/my-history");
}

export function fetchAttemptResult(attemptId) {
  return request(`/api/attempts/${attemptId}/result`);
}

export function fetchAttemptReview(attemptId) {
  return request(`/api/attempts/${attemptId}/review`);
}