package com.example.Student_Service.controller;

import com.example.Student_Service.entity.Offer;
import com.example.Student_Service.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import com.example.Student_Service.client.TpoOfferClient;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    private TpoOfferClient tpoOfferClient;

    @PostMapping("/receive")
    public ResponseEntity<Offer> receiveOffer(@RequestBody Offer offer) {
        offer.setTpoOfferId(offer.getId());
        offer.setId(null);
        Offer savedOffer = offerService.saveOffer(offer);
        return ResponseEntity.ok(savedOffer);
    }

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

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Offer>> getOffersByStudentId(@PathVariable Long studentId) {
        List<Offer> offers = offerService.getOffersByStudentId(studentId);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/student/enrollment/{enrollmentNo}")
    public ResponseEntity<List<Offer>> getOffersByEnrollmentNo(@PathVariable String enrollmentNo) {
        List<Offer> offers = offerService.getOffersByEnrollmentNo(enrollmentNo);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadOfferLetter(@PathVariable Long id) {
        Optional<Offer> offerOpt = offerService.getOfferById(id);
        if (offerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Offer offer = offerOpt.get();
        if (offer.getTpoOfferId() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            return tpoOfferClient.downloadOfferLetter(offer.getTpoOfferId());
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

}
