/* Service worker สำหรับแจ้งเตือน (Firebase Cloud Messaging) — ค่า config ส่งมาทาง query string */
const q = new URL(self.location.href).searchParams;
const cfg = { apiKey: q.get('k'), projectId: q.get('p'), messagingSenderId: q.get('s'), appId: q.get('a') };
if (cfg.apiKey && cfg.projectId) {
  importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
                'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
  firebase.initializeApp(cfg);
  firebase.messaging(); // ข้อความที่มี notification จะถูกแสดงโดยอัตโนมัติ
}
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && (e.notification.data.FCM_MSG && e.notification.data.FCM_MSG.fcmOptions && e.notification.data.FCM_MSG.fcmOptions.link)) || './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) { if ('focus' in c) return c.focus(); }
    return clients.openWindow(url);
  }));
});
