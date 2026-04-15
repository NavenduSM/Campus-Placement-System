package com.example.Tpo_Service.repository;

import com.example.Tpo_Service.entity.JD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JDRepository extends JpaRepository<JD, Long> {

    JD findByCompanyName(String companyName);
}
