package com.mlbb2g209.healthinsurance.hospital;
import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.*;
@Entity
@Table(name = "hospitals")
public class Hospital extends BaseEntity {
    @Column(name = "hospital_code") private String hospitalCode;
    @Column(name = "name") private String name;
    public String getHospitalCode() { return hospitalCode; }
    public void setHospitalCode(String hospitalCode) { this.hospitalCode = hospitalCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
