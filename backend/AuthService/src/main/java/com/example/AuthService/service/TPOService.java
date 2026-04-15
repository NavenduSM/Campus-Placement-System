package com.example.AuthService.service;

import com.example.AuthService.model.TPO;
import com.example.AuthService.repository.TPORepository;
import com.example.AuthService.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;
import java.util.Random;
import java.util.Map;

@Service
public class TPOService {

    @Autowired
    private TPORepository tpoRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String signup(TPO tpo) {
        // Check if email already exists
        if (tpoRepository.findByEmailId(tpo.getEmailId()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password
        tpo.setPassword(passwordEncoder.encode(tpo.getPassword()));

        // Generate OTP
        String otp = generateOtp();
        tpo.setOtp(otp);
        tpo.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        // Save tpo
        tpoRepository.save(tpo);

        // Send OTP email
        emailService.sendOtpEmail(tpo.getEmailId(), otp);

        return "OTP sent to email. Please verify.";
    }

    public String verifyOtp(String emailId, String otp) {
        Optional<TPO> tpoOpt = tpoRepository.findByEmailId(emailId);
        if (tpoOpt.isEmpty()) {
            throw new RuntimeException("TPO not found");
        }

        TPO tpo = tpoOpt.get();
        if (tpo.getOtp() == null || !tpo.getOtp().equals(otp) || tpo.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        tpo.setIsVerified(true);
        tpo.setOtp(null);
        tpo.setOtpExpiry(null);
        tpoRepository.save(tpo);

        return "Email verified successfully";
    }

    public String login(String emailId, String password) {
        Optional<TPO> tpoOpt = tpoRepository.findByEmailId(emailId);
        if (tpoOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        TPO tpo = tpoOpt.get();
        if (!tpo.getIsVerified()) {
            throw new RuntimeException("Email not verified");
        }

        if (!passwordEncoder.matches(password, tpo.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "TPO");
        claims.put("emailId", tpo.getEmailId());
        return jwtUtil.generateToken(emailId, claims);
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }
}
