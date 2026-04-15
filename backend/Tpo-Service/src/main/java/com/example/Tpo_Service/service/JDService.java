package com.example.Tpo_Service.service;

import com.example.Tpo_Service.entity.JD;
import com.example.Tpo_Service.repository.JDRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JDService {

    @Autowired
    private JDRepository jdRepository;

    public JD saveJD(JD jd) {
        return jdRepository.save(jd);
    }

    public List<JD> getAllJDs() {
        return jdRepository.findAll();
    }

    public JD updateJD(Long id, JD jd) {
        jd.setId(id);
        return jdRepository.save(jd);
    }

    public void deleteJD(Long id) {
        jdRepository.deleteById(id);
    }

    public JD getJDByCompanyName(String companyName) {
        return jdRepository.findByCompanyName(companyName);
    }
}
