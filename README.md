# iLab Warranty App

> A smart warranty management application that helps users register, track, and claim product warranties — all from their phone.

## About
Built for iLab, this app solves the mess of paper warranty cards and forgotten expiry dates. Users register their products, get reminders before warranties expire, and can raise claims directly from the app.

## Features
- 📱 Register product warranties by scanning receipt or entering manually
- ⏰ Expiry reminders — push notifications 30 & 7 days before expiry
- 📋 Claim management — raise, track, and follow up on warranty claims
- 🏪 Service centre locator — find nearest authorised repair centres
- 📂 Document vault — store bills, invoices & warranty cards as PDFs/photos
- 👨‍💼 Admin panel — manage products, claims, and service centres
- 📊 Analytics dashboard — claim trends, product failure rates, SLA tracking

## Tech Stack
```
FlutterFlow | Flutter/Dart | Firebase Firestore | Firebase Auth
Firebase Storage | Cloud Functions | FCM | Google Maps API
```

## App Flow
```
User registers product
    → scans receipt / enters serial number
    → warranty details auto-fetched from product database
    → reminders scheduled via FCM
    → claim raised if needed
    → claim status tracked in real time
    → admin processes & updates status
    → user notified at every step
```

## Screens
| Screen | Description |
|--------|-------------|
| Home | Dashboard — active warranties, expiring soon, recent claims |
| Register | Add new product with receipt photo & warranty details |
| My Products | All registered products with warranty status |
| Claims | Raise new claim, track existing claims |
| Service Centres | Map view of nearest authorised centres |
| Documents | Stored bills, invoices, warranty cards |
| Admin Panel | Manage products, claims, service data |

## Database Structure (Firestore)
```
users/
  {userId}/
    products/       ← registered products
    claims/         ← warranty claims
    notifications/  ← notification preferences

products_master/    ← product database (admin-managed)
service_centres/    ← authorised repair centres
claims/             ← all claims (admin view)
```

## Built By
**Shebin S Illikkal** — Freelance Flutter & FlutterFlow Developer
📧 [Shebinsillikkl@gmail.com](mailto:Shebinsillikkl@gmail.com)
📞 +91 9745461686
💬 [WhatsApp](https://wa.me/919745461686)
