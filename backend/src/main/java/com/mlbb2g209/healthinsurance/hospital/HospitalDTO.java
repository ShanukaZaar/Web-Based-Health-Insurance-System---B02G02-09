package com.mlbb2g209.healthinsurance.hospital;

public class HospitalDTO {

    private Long id;
    private String hospitalCode;
    private String name;
    private String address;
    private String city;
    private String contactNumber;
    private String email;
    private Boolean isEmpanelled;

    public HospitalDTO() {
    }

    public HospitalDTO(Long id, String hospitalCode, String name, String address, String city, String contactNumber, String email, Boolean isEmpanelled) {
        this.id = id;
        this.hospitalCode = hospitalCode;
        this.name = name;
        this.address = address;
        this.city = city;
        this.contactNumber = contactNumber;
        this.email = email;
        this.isEmpanelled = isEmpanelled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
