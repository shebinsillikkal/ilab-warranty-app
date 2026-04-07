/**
 * iLab Warranty App — Firebase Cloud Functions
 * Author: Shebin S Illikkal
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Schedule daily check for expiring warranties
exports.checkExpiringWarranties = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const now = new Date();
    const in30 = new Date(now); in30.setDate(in30.getDate() + 30);
    const in7  = new Date(now); in7.setDate(in7.getDate() + 7);

    const snap30 = await db.collectionGroup('products')
      .where('warrantyExpiry', '>=', now)
      .where('warrantyExpiry', '<=', in30)
      .where('notified30', '==', false).get();

    const snap7 = await db.collectionGroup('products')
      .where('warrantyExpiry', '>=', now)
      .where('warrantyExpiry', '<=', in7)
      .where('notified7', '==', false).get();

    const batch = db.batch();
    for (const doc of [...snap30.docs, ...snap7.docs]) {
      const product = doc.data();
      const is7 = snap7.docs.find(d => d.id === doc.id);
      const days = is7 ? 7 : 30;
      const userId = doc.ref.parent.parent.id;
      const userDoc = await db.collection('users').doc(userId).get();
      const token = userDoc.data()?.fcmToken;
      if (token) {
        await admin.messaging().send({
          token,
          notification: {
            title: '⚠️ Warranty Expiring Soon',
            body: `${product.productName} warranty expires in ${days} days. Raise a claim if needed.`
          },
          data: { productId: doc.id, daysLeft: String(days) }
        });
      }
      batch.update(doc.ref, { [`notified${days}`]: true });
    }
    await batch.commit();
    console.log(`Notified ${snap30.size + snap7.size} users`);
    return null;
  });

// On claim created — notify admin + send confirmation to user
exports.onClaimCreated = functions.firestore
  .document('claims/{claimId}')
  .onCreate(async (snap, context) => {
    const claim = snap.data();
    // Notify user
    const userDoc = await db.collection('users').doc(claim.userId).get();
    const token = userDoc.data()?.fcmToken;
    if (token) {
      await admin.messaging().send({
        token,
        notification: {
          title: '✅ Claim Registered',
          body: `Your warranty claim for ${claim.productName} has been registered. Claim ID: ${context.params.claimId.slice(0,8).toUpperCase()}`
        }
      });
    }
    // Auto-assign to nearest service centre
    const centres = await db.collection('service_centres')
      .where('city', '==', claim.city)
      .where('brands', 'array-contains', claim.brand)
      .limit(1).get();
    if (!centres.empty) {
      await snap.ref.update({
        assignedCentre: centres.docs[0].id,
        status: 'assigned',
        assignedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    return null;
  });

// On claim status updated — notify user
exports.onClaimStatusUpdate = functions.firestore
  .document('claims/{claimId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after  = change.after.data();
    if (before.status === after.status) return null;
    const userDoc = await db.collection('users').doc(after.userId).get();
    const token = userDoc.data()?.fcmToken;
    if (!token) return null;
    const messages = {
      assigned:   'Your claim has been assigned to a service centre.',
      in_progress:'Your device is being repaired.',
      resolved:   'Your warranty claim has been resolved! ✅',
      rejected:   'Your claim was reviewed. Please contact support for details.'
    };
    const msg = messages[after.status];
    if (msg) {
      await admin.messaging().send({
        token,
        notification: { title: 'iLab Warranty — Claim Update', body: msg },
        data: { claimId: change.after.id, status: after.status }
      });
    }
    return null;
  });
