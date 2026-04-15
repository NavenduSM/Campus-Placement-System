package com.example.Student_Service.repository;

import com.example.Student_Service.entity.StudentAcademics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAcademicsRepository extends JpaRepository<StudentAcademics, Long> {
    List<StudentAcademics> findByStudentId(Long studentId);
}
