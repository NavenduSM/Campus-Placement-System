package com.example.AuthService.repository;

import com.example.AuthService.model.TPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TPORepository extends JpaRepository<TPO, Long> {
    Optional<TPO> findByEmailId(String emailId);
}
