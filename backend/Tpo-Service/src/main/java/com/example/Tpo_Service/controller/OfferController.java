package com.example.Tpo_Service.controller;

import com.example.Tpo_Service.client.StudentServiceClient;
import com.example.Tpo_Service.client.StudentServiceOfferClient;
import com.example.Tpo_Service.dto.StudentDTO;
import com.example.Tpo_Service.entity.Offer;
import com.example.Tpo_Service.service.OfferService;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    private StudentServiceOfferClient studentServiceOfferClient;

    @Autowired
    private StudentServiceClient studentServiceClient;

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        List<Offer> offers = offerService.getAllOffers();
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOfferById(@PathVariable Long id) {
        Optional<Offer> offer = offerService.getOfferById(id);
        return offer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadOfferLetter(@PathVariable Long id) {
        Optional<Offer> offerOpt = offerService.getOfferById(id);
        if (offerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String pdfPath = offerOpt.get().getOfferPdfPath();
        if (pdfPath == null || pdfPath.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(pdfPath);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            if (contentType == null || contentType.isBlank()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            String fileName = filePath.getFileName().toString();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/student-lookup")
    public ResponseEntity<StudentDTO> lookupStudent(@RequestParam("query") String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String trimmed = query.trim();
        try {
            if (trimmed.matches("\\d+")) {
                StudentDTO student = studentServiceClient.getStudentById(Long.parseLong(trimmed));
                return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
            }
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().build();
        } catch (FeignException.NotFound ex) {
            return ResponseEntity.notFound().build();
        } catch (FeignException.Forbidden ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            StudentDTO student = studentServiceClient.getStudentByEnrollmentNo(trimmed);
            return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
        } catch (FeignException.NotFound ex) {
            return ResponseEntity.notFound().build();
        } catch (FeignException.Forbidden ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/student-lookup/enrollment/{enrollmentNo}")
    public ResponseEntity<StudentDTO> lookupStudentByEnrollment(@PathVariable String enrollmentNo) {
        if (enrollmentNo == null || enrollmentNo.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            StudentDTO student = studentServiceClient.getStudentByEnrollmentNo(enrollmentNo.trim());
            return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
        } catch (FeignException.NotFound ex) {
            return ResponseEntity.notFound().build();
        } catch (FeignException.Forbidden ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping
    public ResponseEntity<Offer> generateOffer(@RequestParam(required = false) String studentId,
            @RequestParam(required = false) String enrollmentNo,
            @RequestParam String companyName,
            @RequestParam(required = false) String offerDetails,
            @RequestParam(value = "offerPdf", required = false) MultipartFile offerPdf) {
        try {
            StudentDTO student = null;
            String effectiveEnrollmentNo = enrollmentNo;

            if (studentId != null && !studentId.isBlank()) {
                try {
                    student = studentServiceClient.getStudentById(Long.parseLong(studentId));
                } catch (NumberFormatException ex) {
                    effectiveEnrollmentNo = studentId;
                }
            }

            if (student == null) {
                if (effectiveEnrollmentNo == null || effectiveEnrollmentNo.isBlank()) {
                    return ResponseEntity.badRequest().build();
                }
                student = studentServiceClient.getStudentByEnrollmentNo(effectiveEnrollmentNo);
                if (student == null || student.getId() == null) {
                    return ResponseEntity.badRequest().build();
                }
            }

            if (offerPdf == null || offerPdf.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Offer offer = offerService.generateOffer(student.getId(), companyName, offerDetails, offerPdf);
            studentServiceOfferClient.sendOfferToStudent(offer);
            return ResponseEntity.ok(offer);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Offer> updateOffer(@PathVariable Long id, @RequestBody Offer offerDetails) {
        Offer updatedOffer = offerService.updateOffer(id, offerDetails);
        if (updatedOffer != null) {
            return ResponseEntity.ok(updatedOffer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }
}
