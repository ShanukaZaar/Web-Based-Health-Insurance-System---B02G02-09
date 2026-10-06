package com.mlbb2g209.healthinsurance.claim;

/**
 * Thrown when an action is attempted against a claim that isn't in a
 * valid state for it (e.g. trying to withdraw an already-approved claim).
 */
public class InvalidClaimStateException extends RuntimeException {
    public InvalidClaimStateException(String message) {
        super(message);
    }
}