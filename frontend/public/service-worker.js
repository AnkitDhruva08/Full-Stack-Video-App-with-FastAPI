// const CACHE_NAME = "video-cache-v1";

// self.addEventListener("install", (event) => {
//   // Activate immediately
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener("fetch", (event) => {
//   const url = new URL(event.request.url);

//   // Cache only video requests (adjust the path if needed)
//   if (url.pathname.startsWith("/videos/")) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then((cache) =>
//         cache.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) {
//             // Serve cached video
//             return cachedResponse;
//           }
//           // Fetch video and cache it
//           return fetch(event.request).then((response) => {
//             cache.put(event.request, response.clone());
//             return response;
//           });
//         })
//       )
//     );
//   }
// });
