package com.mlbb2g209.healthinsurance.auth;

import com.mlbb2g209.healthinsurance.admin.UserDTO;

public interface AuthService {

    AuthResponse login(AuthRequest request);

    AuthResponse register(RegisterRequest request);

    UserDTO getCurrentUser(String username);
}
