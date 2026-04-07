// iLab Warranty App — Warranty Model
// Author: Shebin S Illikkal

import 'package:cloud_firestore/cloud_firestore.dart';

class WarrantyProduct {
  final String id;
  final String productName;
  final String brand;
  final String modelNumber;
  final String serialNumber;
  final DateTime purchaseDate;
  final DateTime warrantyExpiry;
  final String purchaseStore;
  final double purchasePrice;
  final String receiptImageUrl;
  final String status; // active | expired | claimed
  final bool notified30;
  final bool notified7;

  WarrantyProduct({
    required this.id,
    required this.productName,
    required this.brand,
    required this.modelNumber,
    required this.serialNumber,
    required this.purchaseDate,
    required this.warrantyExpiry,
    required this.purchaseStore,
    required this.purchasePrice,
    required this.receiptImageUrl,
    this.status = 'active',
    this.notified30 = false,
    this.notified7 = false,
  });

  int get daysLeft => warrantyExpiry.difference(DateTime.now()).inDays;
  bool get isExpired => DateTime.now().isAfter(warrantyExpiry);
  bool get expiringSoon => daysLeft <= 30 && daysLeft > 0;

  Map<String, dynamic> toFirestore() => {
    'productName': productName,
    'brand': brand,
    'modelNumber': modelNumber,
    'serialNumber': serialNumber,
    'purchaseDate': Timestamp.fromDate(purchaseDate),
    'warrantyExpiry': Timestamp.fromDate(warrantyExpiry),
    'purchaseStore': purchaseStore,
    'purchasePrice': purchasePrice,
    'receiptImageUrl': receiptImageUrl,
    'status': status,
    'notified30': notified30,
    'notified7': notified7,
    'createdAt': FieldValue.serverTimestamp(),
  };

  factory WarrantyProduct.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return WarrantyProduct(
      id: doc.id,
      productName: d['productName'] ?? '',
      brand: d['brand'] ?? '',
      modelNumber: d['modelNumber'] ?? '',
      serialNumber: d['serialNumber'] ?? '',
      purchaseDate: (d['purchaseDate'] as Timestamp).toDate(),
      warrantyExpiry: (d['warrantyExpiry'] as Timestamp).toDate(),
      purchaseStore: d['purchaseStore'] ?? '',
      purchasePrice: (d['purchasePrice'] ?? 0).toDouble(),
      receiptImageUrl: d['receiptImageUrl'] ?? '',
      status: d['status'] ?? 'active',
      notified30: d['notified30'] ?? false,
      notified7: d['notified7'] ?? false,
    );
  }
}

class WarrantyClaim {
  final String id;
  final String productId;
  final String productName;
  final String brand;
  final String userId;
  final String issueDescription;
  final List<String> issueImageUrls;
  final String status; // pending | assigned | in_progress | resolved | rejected
  final String? assignedCentre;
  final DateTime createdAt;
  final String city;

  WarrantyClaim({
    required this.id,
    required this.productId,
    required this.productName,
    required this.brand,
    required this.userId,
    required this.issueDescription,
    required this.issueImageUrls,
    required this.city,
    this.status = 'pending',
    this.assignedCentre,
    required this.createdAt,
  });
}
