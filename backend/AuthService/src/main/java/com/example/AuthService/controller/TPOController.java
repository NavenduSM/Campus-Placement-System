package com.example.AuthService.controller;

import com.example.AuthService.model.TPO;
import com.example.AuthService.service.TPOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tpo")
public class TPOController {

    @Autowired
    private TPOService tpoService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody TPO tpo) {
        try {
            String response = tpoService.signup(tpo);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String emailId = request.get("emailId");
        String otp = request.get("otp");
        try {
            String response = tpoService.verifyOtp(emailId, otp);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> request) {
        String emailId = request.get("emailId");
        String password = request.get("password");
        try {
            String token = tpoService.login(emailId, password);
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out");
    }
}
