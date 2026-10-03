package com.mlbb2g209.healthinsurance.hospital;

public class HospitalBillNotFoundException extends RuntimeException {
    public HospitalBillNotFoundException(Long id) {
        super("Hospital bill not found with id: " + id);
    }
}