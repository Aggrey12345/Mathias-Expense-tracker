# Security Specification - SpendWise

## Data Invariants
1. A transaction MUST belong to the authenticated user (`userId == request.auth.uid`).
2. A budget MUST belong to the authenticated user (`userId == request.auth.uid`).
3. Transactions and budgets cannot be modified to change their owner (`userId` is immutable).
4. Amounts and limits must be positive numbers.
5. Categories must be strings from the allowed set (validated in app, but rules check types/sizes).

## The Dirty Dozen Payloads (Rejection Tests)

1. **Identity Theft: Create transaction for another user**
   ```json
   { "userId": "attacker_id", "amount": 100, "type": "expense", "category": "food", "date": "2024-01-01" }
   ```
   *Expected: PERMISSION_DENIED (userId doesn't match auth.uid)*

2. **Privilege Escalation: Change userId of existing transaction**
   ```json
   { "userId": "victim_id", "amount": 50 } -> Update to { "userId": "attacker_id" }
   ```
   *Expected: PERMISSION_DENIED (userId is immutable)*

3. **Data Poisoning: Massive document ID**
   *Expected: PERMISSION_DENIED (isValidId() size check)*

4. **Resource Exhaustion: 1MB note in transaction**
   ```json
   { "note": "A".repeat(1024 * 1024) }
   ```
   *Expected: PERMISSION_DENIED (note size constraint)*

5. **Type Confusion: String amount**
   ```json
   { "amount": "100" }
   ```
   *Expected: PERMISSION_DENIED (amount is number)*

6. **State Bypassing: Negative amount**
   ```json
   { "amount": -100 }
   ```
   *Expected: PERMISSION_DENIED (amount must be >= 0)*

7. **Orphaned Record: Transaction without userId**
   ```json
   { "amount": 100, "type": "expense" }
   ```
   *Expected: PERMISSION_DENIED (required fields check)*

8. **Shadow Field injection**
   ```json
   { "userId": "me", "amount": 10, "isVerified": true }
   ```
   *Expected: PERMISSION_DENIED (key size check)*

9. **PII Leak: Reading another user's profile**
   *Expected: PERMISSION_DENIED (profile access restricted to owner)*

10. **Query Scraping: List all transactions**
    *Expected: PERMISSION_DENIED (Query must be filtered by userId)*

11. **Spoofed Email: Admin bypass attempt**
    *Expected: PERMISSION_DENIED (Admin check requires email_verified)*

12. **Timestamp Fraud: Future createdAt**
    ```json
    { "createdAt": "2099-01-01" }
    ```
    *Expected: PERMISSION_DENIED (Must match request.time)*
