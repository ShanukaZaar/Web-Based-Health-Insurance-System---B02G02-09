package com.mlbb2g209.healthinsurance.hospital;

// import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.Positive;

public class HospitalDTO {

    private Long id;
    private String hospitalCode;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "address is required")
    private String address;

    @NotBlank(message = "city is required")
    private String city;

    @NotBlank(message = "contactNumber is required")
    private String contactNumber;

    private String email;
    private String status;

    public HospitalDTO() {
    }

    public HospitalDTO(Long id, String hospitalCode, String name, String address, String city,
                        String contactNumber, String email, String status) {
        this.id = id;
        this.hospitalCode = hospitalCode;
        this.name = name;
        this.address = address;
        this.city = city;
        this.contactNumber = contactNumber;
        this.email = email;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHospitalCode() { return hospitalCode; }
    public void setHospitalCode(String hospitalCode) { this.hospitalCode = hospitalCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}