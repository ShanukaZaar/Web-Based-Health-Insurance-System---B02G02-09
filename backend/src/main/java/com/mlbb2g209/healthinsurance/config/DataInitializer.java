package com.mlbb2g209.healthinsurance.config;

import com.mlbb2g209.healthinsurance.admin.Role;
import com.mlbb2g209.healthinsurance.admin.RoleRepository;
import com.mlbb2g209.healthinsurance.admin.User;
import com.mlbb2g209.healthinsurance.admin.UserRepository;
import com.mlbb2g209.healthinsurance.support.SupportRepository;
import com.mlbb2g209.healthinsurance.support.SupportTicket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SupportRepository supportRepository;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           SupportRepository supportRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.supportRepository = supportRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            log.info("Seeding initial Roles into database...");
            Role adminRole = roleRepository.save(new Role("ROLE_ADMIN", "Administrator role with full system privileges"));
            Role customerRole = roleRepository.save(new Role("ROLE_CUSTOMER", "Policyholder customer role"));
            Role supportRole = roleRepository.save(new Role("ROLE_SUPPORT", "Customer support agent role"));

            if (userRepository.count() == 0) {
                log.info("Seeding initial Dummy Users into database...");

                User admin = new User("admin", "admin@healthinsurance.com", "password123", "System", "Admin", "+1-555-0100", true, Set.of(adminRole));
                User john = new User("johndoe", "john.doe@example.com", "password123", "John", "Doe", "+1-555-0101", true, Set.of(customerRole));
                User jane = new User("janesmith", "jane.smith@example.com", "password123", "Jane", "Smith", "+1-555-0102", true, Set.of(customerRole));
                User bob = new User("support_bob", "bob.support@healthinsurance.com", "password123", "Bob", "Miller", "+1-555-0103", true, Set.of(supportRole));
                User alice = new User("alice_w", "alice.williams@example.com", "password123", "Alice", "Williams", "+1-555-0104", true, Set.of(customerRole));

                userRepository.saveAll(List.of(admin, john, jane, bob, alice));
                log.info("Successfully seeded 5 dummy users (IDs: 1 to 5).");
            }
        }

        if (supportRepository.count() == 0) {
            userRepository.findByUsername("johndoe").ifPresent(john -> {
                SupportTicket t1 = new SupportTicket();
                t1.setTicketNumber("TKT-1001-DEMO");
                t1.setUserId(john.getId());
                t1.setSubject("Claim Status Query");
                t1.setDescription("Inquiring about status of hospitalization claim #CLM-5021 submitted last week.");
                t1.setStatus("OPEN");
                t1.setPriority("HIGH");
                supportRepository.save(t1);
            });

            userRepository.findByUsername("janesmith").ifPresent(jane -> {
                SupportTicket t2 = new SupportTicket();
                t2.setTicketNumber("TKT-1002-DEMO");
                t2.setUser(jane);
                t2.setSubject("Policy Renewal Assistance");
                t2.setDescription("Need assistance modifying payment method for annual health plan renewal.");
                t2.setStatus("IN_PROGRESS");
                t2.setPriority("MEDIUM");
                supportRepository.save(t2);
            });

            userRepository.findByUsername("alice_w").ifPresent(alice -> {
                SupportTicket t3 = new SupportTicket();
                t3.setTicketNumber("TKT-1003-DEMO");
                t3.setUser(alice);
                t3.setSubject("Hospital Network Empanelment");
                t3.setDescription("Is St. Jude City Hospital covered under Comprehensive Gold Plan?");
                t3.setStatus("RESOLVED");
                t3.setPriority("LOW");
                supportRepository.save(t3);
            });

            log.info("Successfully seeded initial dummy support tickets.");
        }
    }
}
