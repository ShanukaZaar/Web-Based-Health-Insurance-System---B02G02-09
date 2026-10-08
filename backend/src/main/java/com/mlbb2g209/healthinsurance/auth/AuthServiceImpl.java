package com.mlbb2g209.healthinsurance.auth;

import com.mlbb2g209.healthinsurance.admin.Role;
import com.mlbb2g209.healthinsurance.admin.RoleRepository;
import com.mlbb2g209.healthinsurance.admin.User;
import com.mlbb2g209.healthinsurance.admin.UserDTO;
import com.mlbb2g209.healthinsurance.admin.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        String identifier = request.getUsername() != null ? request.getUsername().trim() : "";
        String password = request.getPassword() != null ? request.getPassword() : "";

        if (identifier.isEmpty() || password.isEmpty()) {
            throw new RuntimeException("Username/email and password cannot be empty");
        }

        // Allow login by username or email
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        User user = userOpt.orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // Match password (supports BCrypt encrypted hashes as well as plain text development/seed passwords)
        boolean passwordMatches = false;
        try {
            passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());
        } catch (Exception ignored) {
            // In case of non-BCrypt format
        }
        if (!passwordMatches && password.equals(user.getPasswordHash())) {
            passwordMatches = true;
        }

        if (!passwordMatches) {
            throw new RuntimeException("Invalid username or password");
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new RuntimeException("Account is currently disabled. Please contact system administrator.");
        }

        String primaryRole = determinePrimaryRole(user);
        String token = jwtTokenProvider.generateToken(user, primaryRole);
        UserDTO userDTO = convertToUserDTO(user, primaryRole);

        log.info("User '{}' logged in successfully with role '{}'", user.getUsername(), primaryRole);
        return new AuthResponse(token, userDTO);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email '" + request.getEmail() + "' is already registered.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName() != null && !request.getFirstName().isBlank() ? request.getFirstName() : request.getUsername());
        user.setLastName(request.getLastName() != null ? request.getLastName() : "");
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        String requestedRole = request.getRole();
        boolean isAdmin = "ADMIN".equalsIgnoreCase(requestedRole) || "ROLE_ADMIN".equalsIgnoreCase(requestedRole);
        String roleName = isAdmin ? "ROLE_ADMIN" : "ROLE_USER";

        Role role = roleRepository.findByName(roleName)
                .or(() -> roleRepository.findByName(isAdmin ? "ADMIN" : "USER"))
                .orElseGet(() -> roleRepository.save(new Role(roleName, isAdmin ? "Administrator role" : "Standard user role")));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        String primaryRole = isAdmin ? "ADMIN" : "USER";
        String token = jwtTokenProvider.generateToken(savedUser, primaryRole);
        UserDTO userDTO = convertToUserDTO(savedUser, primaryRole);

        log.info("New user '{}' registered successfully with role '{}'", savedUser.getUsername(), primaryRole);
        return new AuthResponse(token, userDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        String primaryRole = determinePrimaryRole(user);
        return convertToUserDTO(user, primaryRole);
    }

    private String determinePrimaryRole(User user) {
        if (user.getRoles() != null) {
            for (Role r : user.getRoles()) {
                String name = r.getName();
                if ("ROLE_ADMIN".equalsIgnoreCase(name) || "ADMIN".equalsIgnoreCase(name)) {
                    return "ADMIN";
                }
            }
        }
        return "USER";
    }

    private UserDTO convertToUserDTO(User user, String primaryRole) {
        Set<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                : new HashSet<>();

        UserDTO dto = new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getIsActive(),
                roleNames,
                user.getCreatedAt()
        );
        dto.setRole(primaryRole);
        return dto;
    }
}
