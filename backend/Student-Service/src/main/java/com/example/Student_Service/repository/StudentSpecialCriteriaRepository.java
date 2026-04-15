package com.example.Student_Service.repository;

import com.example.Student_Service.entity.StudentSpecialCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentSpecialCriteriaRepository extends JpaRepository<StudentSpecialCriteria, Long> {
    Optional<StudentSpecialCriteria> findByStudentId(Long studentId);
}
