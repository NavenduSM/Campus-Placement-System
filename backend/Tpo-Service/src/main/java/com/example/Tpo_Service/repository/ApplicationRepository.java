package com.example.Tpo_Service.repository;

import com.example.Tpo_Service.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJdId(Long jdId);
    
    Application findByEnrollmentNoAndJdId(String enrollmentNo, Long jdId);
}
