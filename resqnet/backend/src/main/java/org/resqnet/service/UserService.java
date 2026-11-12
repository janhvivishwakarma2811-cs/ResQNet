package org.resqnet.service;

import org.resqnet.config.JwtTokenProvider;
import org.resqnet.dto.AuthRequest;
import org.resqnet.dto.AuthResponse;
import org.resqnet.dto.RegisterRequest;
import org.resqnet.model.ResponderStatus;
import org.resqnet.model.ResponderTeam;
import org.resqnet.model.Role;
import org.resqnet.model.User;
import org.resqnet.repository.ResponderTeamRepository;
import org.resqnet.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ResponderTeamRepository responderTeamRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserService(UserRepository userRepository,
                       ResponderTeamRepository responderTeamRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.responderTeamRepository = responderTeamRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Long responderTeamId = null;
        if (user.getRole() == Role.ROLE_RESPONDER) {
            Optional<ResponderTeam> teamOpt = responderTeamRepository.findByUserId(user.getId());
            if (teamOpt.isPresent()) {
                responderTeamId = teamOpt.get().getId();
            }
        }

        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), responderTeamId);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                request.getRole() != null ? request.getRole() : Role.ROLE_CITIZEN
        );
        user = userRepository.save(user);

        Long responderTeamId = null;
        if (user.getRole() == Role.ROLE_RESPONDER) {
            Double lat = request.getLatitude() != null ? request.getLatitude() : 28.6139; // Default center
            Double lng = request.getLongitude() != null ? request.getLongitude() : 77.2090;
            String teamName = request.getTeamName() != null ? request.getTeamName() : user.getFullName() + " Unit";
            String spec = request.getSpecialization() != null ? request.getSpecialization() : "General Rescue";
            String vehicle = request.getVehicleType() != null ? request.getVehicleType() : "Rapid Response Van";

            ResponderTeam team = new ResponderTeam(user, teamName, spec, ResponderStatus.AVAILABLE,
                    lat, lng, vehicle, user.getPhone());
            team = responderTeamRepository.save(team);
            responderTeamId = team.getId();
        }

        String jwt = tokenProvider.generateTokenFromUsername(user.getUsername());
        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), responderTeamId);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
