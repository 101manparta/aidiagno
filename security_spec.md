# Security Specification — AI Diagno Firestore Rules

## 1. Data Invariants
1. **Default-Deny Baseline**: Every path not explicitly matched defaults to `allow read, write: if false;`.
2. **Verified Admin & Role Isolation**: Admin mutations require `request.auth != null && request.auth.token.email_verified == true`. Initial `SUPER_ADMIN` is `manparta0101@gmail.com` or verified documents in `/admins/{uid}`. Non-admin users cannot read or write `/admins`, `/consultation_leads`, `/consultations`, `/media_assets`, or `/audit_logs`.
3. **Public Content Draft Isolation**: Public visitors may only read `published` documents in `homepage_content`, `products`, `pricing_plans`, and `articles`. Draft and archived records are strictly hidden from unauthenticated or non-admin reads.
4. **PII Isolation on Consultation Leads**: Any visitor may `create` a document in `consultation_leads` ONLY with `status == 'Baru'`, valid required fields (`fullName` 2..120, `facilityName` 2..160, `facilityType` 2..80, `requiredSolution` 2..120, valid email or phone `contactChannel` 5..160), no `adminNotes`, and server timestamp (`createdAt == request.time`, `updatedAt == request.time`). Public visitors CANNOT `get`, `list`, `update`, or `delete` any `consultation_leads` record; ONLY verified admins can read or manage them.
5. **Immutable Audit Trail**: `audit_logs` records can only be created by verified admins (`actorUid == request.auth.uid`, `createdAt == request.time`) and are immutable (`update`, `delete` forbidden).
6. **Document ID Hardening**: Single-document read/write paths enforce `isValidId(id)` (`^[a-zA-Z0-9_-]+$`, 1–128 chars).

## 2. Dirty Dozen Adversarial Payloads (Expected: PERMISSION_DENIED)
1. Unauthenticated read of `/consultation_leads/{leadId}` (PII leak attempt).
2. Unauthenticated list of `/consultation_leads` (bulk lead scraping).
3. Public user creating a consultation lead with `status: "Selesai"` instead of `"Baru"` (state shortcutting).
4. Public user creating a consultation lead with an injected ghost field `{ isAdmin: true }` or `adminNotes` (shadow update).
5. Public user creating a consultation lead with a spoofed `createdAt` timestamp in the past (temporal tampering).
6. Unauthenticated read of a `draft` or `archived` document in `/articles/{id}` or `/products/{id}`.
7. Unverified email (`email_verified: false`) matching admin email attempting to update `/pricing_plans/starter` (email spoofing).
8. Authenticated non-admin user attempting to self-insert `/admins/{uid}` with `role: "SUPER_ADMIN"` (privilege escalation).
9. `EDITOR` admin attempting to delete or modify `/admins/{otherId}` (RBAC escalation).
10. Admin attempting to tamper with or delete an existing `/audit_logs/{logId}` entry (audit tampering).
11. Oversized string (> 128 chars) or invalid characters in `{productId}` path variable (ID poisoning).
12. Consultation lead submission with invalid `contactChannel`, single-char `fullName`, or `message` > 2000 chars (schema validation & Denial of Wallet guard).
