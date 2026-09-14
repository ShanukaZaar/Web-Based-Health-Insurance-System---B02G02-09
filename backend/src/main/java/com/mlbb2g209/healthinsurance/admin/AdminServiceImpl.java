package com.mlbb2g209.healthinsurance.admin;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<ReportDTO> getAllSystemReports() {
        return Collections.emptyList();
    }

    @Override
    public ReportDTO generateReport(ReportDTO reportDTO) {
        return reportDTO;
    }
}
