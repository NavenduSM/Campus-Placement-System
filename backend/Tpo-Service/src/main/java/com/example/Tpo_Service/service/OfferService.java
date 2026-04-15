package com.example.Tpo_Service.service;

import com.example.Tpo_Service.entity.Offer;
import com.example.Tpo_Service.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public Optional<Offer> getOfferById(Long id) {
        return offerRepository.findById(id);
    }

    public Offer generateOffer(Long studentId, String companyName, String offerDetails, MultipartFile offerPdf) throws IOException {
        Offer offer = new Offer();
        offer.setStudentId(studentId);
        offer.setCompanyName(companyName);
        offer.setOfferDetails(offerDetails);
        offer.setGeneratedDate(LocalDateTime.now());

        if (offerPdf != null && !offerPdf.isEmpty()) {
            String uploadDir = System.getProperty("user.home") + "/uploads/offer-pdfs";
            java.io.File uploadDirFile = new java.io.File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }
            String fileName = studentId + "_" + companyName.replaceAll("\\s+", "_") + "_" + System.currentTimeMillis() + ".pdf";
            java.io.File file = new java.io.File(uploadDir, fileName);
            offerPdf.transferTo(file);
            offer.setOfferPdfPath(file.getAbsolutePath());
        }

        return offerRepository.save(offer);
    }

    public Offer updateOffer(Long id, Offer offerDetails) {
        Optional<Offer> existingOfferOpt = offerRepository.findById(id);
        if (existingOfferOpt.isPresent()) {
            Offer existingOffer = existingOfferOpt.get();
            existingOffer.setStudentId(offerDetails.getStudentId());
            existingOffer.setCompanyName(offerDetails.getCompanyName());
            existingOffer.setOfferDetails(offerDetails.getOfferDetails());
            existingOffer.setGeneratedDate(offerDetails.getGeneratedDate());
            return offerRepository.save(existingOffer);
        }
        return null;
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }
}
