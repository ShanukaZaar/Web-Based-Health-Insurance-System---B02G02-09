package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByStatus(HospitalStatus status);

    List<Hospital> findByCityIgnoreCase(String city);

    Optional<Hospital> findByHospitalCode(String hospitalCode);

    boolean existsByHospitalCode(String hospitalCode);
}