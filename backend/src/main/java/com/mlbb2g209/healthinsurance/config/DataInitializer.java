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
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Set;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SupportRepository supportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           SupportRepository supportRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.supportRepository = supportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 0. Migrate any existing plain-text passwords to BCrypt (one-time migration)
        migratePlainTextPasswords();

        // 1. Ensure all standard roles exist in database
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() ->
                roleRepository.save(new Role("ROLE_ADMIN", "Administrator role with full system privileges"))
        );
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() ->
                roleRepository.save(new Role("ROLE_USER", "Standard policyholder user role"))
        );
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER").orElseGet(() ->
                roleRepository.save(new Role("ROLE_CUSTOMER", "Policyholder customer role"))
        );
        Role supportRole = roleRepository.findByName("ROLE_SUPPORT").orElseGet(() ->
                roleRepository.save(new Role("ROLE_SUPPORT", "Customer support agent role"))
        );

        // 2. Ensure default ADMIN account exists
        if (!userRepository.existsByUsername("admin")) {
            String encodedAdminPwd = passwordEncoder.encode("password123");
            User admin = new User("admin", "admin@healthinsurance.com", encodedAdminPwd, "System", "Admin", "+1-555-0100", true, Set.of(adminRole));
            userRepository.save(admin);
            log.info("Seeded default ADMIN user: username='admin', password='password123'");
        }

        // 3. Ensure default USER account exists for role-based testing
        if (!userRepository.existsByUsername("user")) {
            String encodedUserPwd = passwordEncoder.encode("password123");
            User normalUser = new User("user", "user@healthinsurance.com", encodedUserPwd, "Regular", "User", "+1-555-0199", true, Set.of(userRole));
            userRepository.save(normalUser);
            log.info("Seeded default USER user: username='user', password='password123'");
        }

        // 4. Seed initial dummy users if database is fresh
        if (userRepository.count() <= 2) {
            log.info("Seeding additional Dummy Users into database...");

            String encodedDemoPwd = passwordEncoder.encode("password123");
            User john = new User("johndoe", "john.doe@example.com", encodedDemoPwd, "John", "Doe", "+1-555-0101", true, Set.of(userRole, customerRole));
            User jane = new User("janesmith", "jane.smith@example.com", encodedDemoPwd, "Jane", "Smith", "+1-555-0102", true, Set.of(userRole, customerRole));
            User bob = new User("support_bob", "bob.support@healthinsurance.com", encodedDemoPwd, "Bob", "Miller", "+1-555-0103", true, Set.of(supportRole));
            User alice = new User("alice_w", "alice.williams@example.com", encodedDemoPwd, "Alice", "Williams", "+1-555-0104", true, Set.of(userRole, customerRole));

            userRepository.saveAll(List.of(john, jane, bob, alice));
            log.info("Successfully seeded demo users (johndoe, janesmith, support_bob, alice_w).");
        }

        // 5. Seed support tickets
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

    /**
     * One-time migration: if any user's password_hash does not start with the BCrypt prefix "$2",
     * it is treated as plain text and re-encoded with BCrypt. This handles the case where the
     * database was seeded with plain-text passwords before this fix was applied.
     */
    private void migratePlainTextPasswords() {
        userRepository.findAll().forEach(user -> {
            String hash = user.getPasswordHash();
            if (hash != null && !hash.startsWith("$2")) {
                // Plain-text password detected — encode and save
                user.setPasswordHash(passwordEncoder.encode(hash));
                userRepository.save(user);
                log.info("Migrated plain-text password to BCrypt for user: '{}'", user.getUsername());
            }
        });
    }
}
