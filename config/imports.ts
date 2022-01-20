export default {
  "js": {
    "$bootstrap_bundle": "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    "$jquery": "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"
  },
  "css": {
    "$bootstrap": "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "$w3css": "https://www.w3schools.com/w3css/4/w3.css"
  }
} as Placeholders;

interface Placeholders {
  js: Record<string, string>,
  css: Record<string, string>,
}