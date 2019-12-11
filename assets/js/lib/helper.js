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

const jsonFetcher = url => fetch(url, { method: "GET" }).then(r => r.json());

export { mutate, jsonFetcher };
