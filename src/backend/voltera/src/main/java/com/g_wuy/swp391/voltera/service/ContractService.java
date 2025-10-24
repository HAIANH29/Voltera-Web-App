package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Contract;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.mapper.ContractMapper;
import com.g_wuy.swp391.voltera.mapper.TransactionMapper;
import com.g_wuy.swp391.voltera.model.request.ContractRequest;
import com.g_wuy.swp391.voltera.model.response.ContractResponse;
import com.g_wuy.swp391.voltera.repository.ContractRepository;
import com.g_wuy.swp391.voltera.repository.PostRepository;
import com.g_wuy.swp391.voltera.repository.TransactionRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;

@Service
public class ContractService {
    @Autowired
    private ContractMapper contractMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private S3Service s3Service;


    @Transactional
    public ContractResponse createContract(ContractRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Contract contract = contractMapper.toEntity(request, post, buyer, seller);
        contract = contractRepository.save(contract);

        return contractMapper.toResponse(contract);
    }


    @Transactional
    public ContractResponse updateTerms(Integer id, String newTerms) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        contract.setTerms(newTerms);
        contract.setBuyersigned(false);
        contract.setSellersigned(false);
        contract.setContractstatus("UPDATED");

        contractRepository.save(contract);
        return contractMapper.toResponse(contract);
    }


    @Transactional
    public ContractResponse signContract(Integer id, Integer userId) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (contract.getBuyerid().getId().equals(userId)) {
            contract.setBuyersigned(true);
        } else if (contract.getSellerid().getId().equals(userId)) {
            contract.setSellersigned(true);
        }

        if (Boolean.TRUE.equals(contract.getBuyersigned()) && Boolean.TRUE.equals(contract.getSellersigned())) {
            contract.setContractstatus("SIGNED");
            contract.setSigneddate(LocalDate.now());
            contract.setExpirationdate(LocalDate.now().plusMonths(12));

            Transaction tx = Transaction.builder()
                    .postid(contract.getPostid())
                    .contractid(contract)
                    .transactionstatus("PAID")
                    .price(contract.getPostid().getPrice())
                    .createat(Instant.now())
                    .build();
            transactionRepository.save(tx);
        }

        contractRepository.save(contract);
        return contractMapper.toResponse(contract);
    }


    @Transactional
    public ContractResponse uploadPdf(Integer id, MultipartFile file) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));


        String pdfUrl = s3Service.uploadFile(file, "contracts");
        contract.setContractfile(pdfUrl);
        contractRepository.save(contract);
        emailService.sendContractEmailWithAttachment(contract, file);

        return contractMapper.toResponse(contract);
    }

}
