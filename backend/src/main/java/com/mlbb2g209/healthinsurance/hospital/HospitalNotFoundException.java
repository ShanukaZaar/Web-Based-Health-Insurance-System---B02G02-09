package com.mlbb2g209.healthinsurance.hospital;

public class HospitalNotFoundException extends RuntimeException {
    public HospitalNotFoundException(Long id) {
        super("Hospital not found with id: " + id);
    }
}