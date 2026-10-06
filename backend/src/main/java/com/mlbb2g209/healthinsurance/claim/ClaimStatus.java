package com.mlbb2g209.healthinsurance.claim;

/**
 * The lifecycle states a claim can be in.
 * PENDING -> newly submitted, awaiting review by a Claim Officer.
 * APPROVED -> reviewed and accepted. Permanent, read-only from this point on.
 * REJECTED -> reviewed and declined. Permanent, read-only from this point on.
 * WITHDRAWN -> soft-deleted by the policyholder while still PENDING.
 * Approved/Rejected claims can never be withdrawn or hard-deleted,
 * per the supervisor's guidance on preserving medical documentation.
 */
public enum ClaimStatus {
    PENDING,
    APPROVED,
    REJECTED,
    WITHDRAWN
}