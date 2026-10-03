package com.mlbb2g209.healthinsurance.hospital;

public class InvalidHospitalBillStateException extends RuntimeException {
    public InvalidHospitalBillStateException(String message) {
        super(message);
    }
}