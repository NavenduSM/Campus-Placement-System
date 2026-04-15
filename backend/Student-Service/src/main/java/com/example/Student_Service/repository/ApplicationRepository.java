package com.example.Student_Service.repository;

import com.example.Student_Service.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJdId(Long jdId);
    List<Application> findByStudentId(Long studentId);
    boolean existsByStudentIdAndJdId(Long studentId, Long jdId);
    Optional<Application> findByStudentIdAndJdId(Long studentId, Long jdId);
    boolean existsByEnrollmentNoAndJdId(String enrollmentNo, Long jdId);
    Optional<Application> findByEnrollmentNoAndJdId(String enrollmentNo, Long jdId);
}
