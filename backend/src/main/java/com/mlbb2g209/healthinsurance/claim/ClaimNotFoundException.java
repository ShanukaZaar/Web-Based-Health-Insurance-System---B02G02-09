package com.mlbb2g209.healthinsurance.claim;

/**
 * Thrown when a claim id does not exist. Handled locally in ClaimController
 * (via @ExceptionHandler) so this module doesn't require touching the
 * team's shared GlobalExceptionHandler.
 */
public class ClaimNotFoundException extends RuntimeException {
    public ClaimNotFoundException(Long id) {
        super("Claim not found with id: " + id);
    }
}