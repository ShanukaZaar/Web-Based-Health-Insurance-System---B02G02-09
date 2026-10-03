package com.mlbb2g209.healthinsurance.hospital;

public class TreatmentRecordNotFoundException extends RuntimeException {
    public TreatmentRecordNotFoundException(Long id) {
        super("Treatment record not found with id: " + id);
    }
}