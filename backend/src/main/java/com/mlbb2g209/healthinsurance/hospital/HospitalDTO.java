package com.mlbb2g209.healthinsurance.hospital;

public class HospitalDTO {

    private Long id;

    @NotBlank(message = "Hospital name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Registration number is required")
    @Size(max = 50)
    private String registrationNo;

    @Size(max = 255)
    private String address;

    @Size(max = 20)
    private String contactNo;

    @Email(message = "Enter a valid email address")
    private String email;

    private boolean active = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
