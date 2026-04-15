package com.example.AuthService.service;

import com.example.AuthService.model.Student;
import com.example.AuthService.model.TPO;
import com.example.AuthService.repository.StudentRepository;
import com.example.AuthService.repository.TPORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TPORepository tpoRepository;

    @Override
    public UserDetails loadUserByUsername(String emailId) throws UsernameNotFoundException {
        // Try to find in Student repository
        Student student = studentRepository.findByEmailId(emailId).orElse(null);
        if (student != null) {
            return new User(student.getEmailId(), student.getPassword(), new ArrayList<>());
        }

        // Try to find in TPO repository
        TPO tpo = tpoRepository.findByEmailId(emailId).orElse(null);
        if (tpo != null) {
            return new User(tpo.getEmailId(), tpo.getPassword(), new ArrayList<>());
        }

        throw new UsernameNotFoundException("User not found with email: " + emailId);
    }
}
