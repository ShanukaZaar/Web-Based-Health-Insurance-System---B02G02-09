package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "hospitals")
public class Hospital extends BaseEntity {

    @Column(name = "hospital_code", nullable = false, unique = true)
    private String hospitalCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "is_empanelled")
    private Boolean isEmpanelled;

    public Hospital() {
    }

    public Hospital(String hospitalCode, String name, String address, String city, String contactNumber, String email, Boolean isEmpanelled) {
        this.hospitalCode = hospitalCode;
        this.name = name;
        this.address = address;
        this.city = city;
        this.contactNumber = contactNumber;
        this.email = email;
        this.isEmpanelled = isEmpanelled;
    }

    public String getHospitalCode() {
        return hospitalCode;
    }

    public void setHospitalCode(String hospitalCode) {
        this.hospitalCode = hospitalCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsEmpanelled() {
        return isEmpanelled;
    }

    public void setIsEmpanelled(Boolean isEmpanelled) {
        this.isEmpanelled = isEmpanelled;
    }
}
