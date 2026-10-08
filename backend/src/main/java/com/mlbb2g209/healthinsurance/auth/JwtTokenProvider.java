package com.mlbb2g209.healthinsurance.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mlbb2g209.healthinsurance.admin.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private static final String SECRET_KEY = "CarePulseHealthInsuranceSecretKeyForJwtAuthenticationTokens2026";
    private static final long EXPIRATION_SECONDS = 86400L; // 24 hours
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public String generateToken(User user, String primaryRole) {
        try {
            long now = Instant.now().getEpochSecond();
            long exp = now + EXPIRATION_SECONDS;

            Map<String, Object> header = new LinkedHashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            List<String> rolesList = new ArrayList<>();
            if ("ADMIN".equalsIgnoreCase(primaryRole)) {
                rolesList.add("ROLE_ADMIN");
                rolesList.add("ADMIN");
            } else {
                rolesList.add("ROLE_USER");
                rolesList.add("USER");
            }

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", user.getUsername());
            payload.put("userId", user.getId());
            payload.put("email", user.getEmail());
            payload.put("role", primaryRole != null ? primaryRole.toUpperCase() : "USER");
            payload.put("roles", rolesList);
            payload.put("iat", now);
            payload.put("exp", exp);

            String encodedHeader = base64UrlEncode(OBJECT_MAPPER.writeValueAsString(header).getBytes(StandardCharsets.UTF_8));
            String encodedPayload = base64UrlEncode(OBJECT_MAPPER.writeValueAsString(payload).getBytes(StandardCharsets.UTF_8));

            String content = encodedHeader + "." + encodedPayload;
            String signature = sign(content, SECRET_KEY);

            return content + "." + signature;
        } catch (Exception e) {
            log.error("Failed to generate JWT token for user: {}", user.getUsername(), e);
            throw new RuntimeException("Error generating authentication token", e);
        }
    }

    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }

            String content = parts[0] + "." + parts[1];
            String expectedSignature = sign(content, SECRET_KEY);

            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
                log.warn("Invalid JWT signature");
                return false;
            }

            Map<String, Object> claims = getClaims(token);
            if (claims == null) {
                return false;
            }

            Number expNumber = (Number) claims.get("exp");
            if (expNumber == null) {
                return false;
            }

            long exp = expNumber.longValue();
            long now = Instant.now().getEpochSecond();
            if (now > exp) {
                log.warn("JWT token is expired");
                return false;
            }

            return true;
        } catch (Exception e) {
            log.warn("JWT validation error: {}", e.getMessage());
            return false;
        }
    }

    public Map<String, Object> getClaims(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            return OBJECT_MAPPER.readValue(decoded, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse JWT claims: {}", e.getMessage());
            return null;
        }
    }

    public String getUsernameFromToken(String token) {
        Map<String, Object> claims = getClaims(token);
        return claims != null ? (String) claims.get("sub") : null;
    }

    public String getRoleFromToken(String token) {
        Map<String, Object> claims = getClaims(token);
        if (claims != null && claims.containsKey("role")) {
            return (String) claims.get("role");
        }
        return "USER";
    }

    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        Map<String, Object> claims = getClaims(token);
        if (claims != null && claims.containsKey("roles")) {
            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof List<?>) {
                List<String> list = new ArrayList<>();
                for (Object item : (List<?>) rolesObj) {
                    if (item instanceof String s) {
                        list.add(s);
                    }
                }
                return list;
            }
        }
        String role = getRoleFromToken(token);
        if ("ADMIN".equalsIgnoreCase(role)) {
            return List.of("ROLE_ADMIN", "ADMIN");
        }
        return List.of("ROLE_USER", "USER");
    }

    private static String sign(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return base64UrlEncode(rawHmac);
    }

    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
