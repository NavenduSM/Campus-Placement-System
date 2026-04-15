package com.example.AuthService.service;

import com.example.AuthService.model.Student;
import com.example.AuthService.repository.StudentRepository;
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
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String signup(Student student) {
        // Check if email or enrollmentNo already exists
        if (studentRepository.findByEmailId(student.getEmailId()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (studentRepository.findByEnrollmentNo(student.getEnrollmentNo()).isPresent()) {
            throw new RuntimeException("Enrollment number already exists");
        }

        // Encode password
        student.setPassword(passwordEncoder.encode(student.getPassword()));

        // Generate OTP
        String otp = generateOtp();
        student.setOtp(otp);
        student.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        // Save student
        studentRepository.save(student);

        // Send OTP email
        emailService.sendOtpEmail(student.getEmailId(), otp);

        return "OTP sent to email. Please verify.";
    }

    public String verifyOtp(String emailId, String otp) {
        Optional<Student> studentOpt = studentRepository.findByEmailId(emailId);
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Student not found");
        }

        Student student = studentOpt.get();
        if (student.getOtp() == null || !student.getOtp().equals(otp) || student.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        student.setIsVerified(true);
        student.setOtp(null);
        student.setOtpExpiry(null);
        studentRepository.save(student);

        return "Email verified successfully";
    }

    public String login(String emailId, String password) {
        Optional<Student> studentOpt = studentRepository.findByEmailId(emailId);
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        Student student = studentOpt.get();
        if (!student.getIsVerified()) {
            throw new RuntimeException("Email not verified");
        }

        if (!passwordEncoder.matches(password, student.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "STUDENT");
        claims.put("name", student.getName());
        claims.put("enrollmentNo", student.getEnrollmentNo());
        claims.put("emailId", student.getEmailId());
        claims.put("course", student.getCourse());
        return jwtUtil.generateToken(emailId, claims);
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }
}
