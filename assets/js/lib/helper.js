import fetch from "unfetch";

const headers = {
  "Content-Type": "application/json"
};

const mutate = (url, data, method = "POST") =>
  fetch(url, {
    method,
    headers,
    body: JSON.stringify(data)
  });

const deletor = url => fetch(url, { method: "DELETE" }).then(r => r.json());

const creator = (url, data) =>
  fetch(url, { method: "POST", headers, body: JSON.stringify(data) }).then(r =>
    r.json()
  );

const updater = (url, data) =>
  fetch(url, { method: "PUT", headers, body: JSON.stringify(data) }).then(r =>
    r.json()
  );

const jsonFetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

export {
  mutate,
  jsonFetcher,
  jsonFetcher as fetcher,
  deletor,
  updater,
  creator
};
