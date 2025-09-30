package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.*;
import com.g_wuy.swp391.voltera.mapper.PostMapper;
import com.g_wuy.swp391.voltera.model.dto.request.PostRequest;
import com.g_wuy.swp391.voltera.model.dto.response.PostResponse;
import com.g_wuy.swp391.voltera.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BatteryRepository batteryRepository;
    private final BatterytypeRepository batterytypeRepository;
    private final BatteryimageRepository batteryimageRepository;
    private final AccountRepository accountRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleImageRepository vehicleImageRepository;
    private final S3Service s3Service;
    private final PostMapper postMapper;

    public PostResponse createPost(PostRequest dto, String username) throws IOException {
        // 1. Xác thực seller
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new SecurityException("Account not found: " + username));
        if (!"seller".equalsIgnoreCase(account.getRole())) {
            throw new SecurityException("Only sellers can create posts");
        }
        User seller = Optional.ofNullable(account.getUser())
                .orElseThrow(() -> new SecurityException("Seller information not found"));

        // 2. Tạo Post
        Post post = postRepository.save(Post.builder()
                .sellerid(seller)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .createdat(Instant.now())
                .updatedat(Instant.now())
                .build());

        // 3. Xử lý Vehicle hoặc Battery
        if (dto.getVehicle() != null && dto.getBattery() != null) {
            throw new IllegalArgumentException("Choose either a vehicle or a battery, not both.");
        }

        Battery savedBattery = null;
        Vehicle savedVehicle = null;
        List<String> allImages = new ArrayList<>();

        if (dto.getVehicle() != null) {
            // Vehicle
            savedVehicle = vehicleRepository.save(Vehicle.builder()
                    .post(post)
                    .brand(dto.getVehicle().getBrand())
                    .model(dto.getVehicle().getModel())
                    .version(dto.getVehicle().getVersion())
                    .odo(dto.getVehicle().getOdo())
                    .batterycapacity(dto.getVehicle().getBatterycapacity())
                    .range(dto.getVehicle().getRange())
                    .chargingtime(dto.getVehicle().getChargingtime())
                    .color(dto.getVehicle().getColor())
                    .numberofseat(dto.getVehicle().getNumberofseat())
                    .style(dto.getVehicle().getStyle())
                    .bodyinsurance(Boolean.TRUE.equals(dto.getVehicle().getBodyinsurance()))
                    .vehicleinspection(Boolean.TRUE.equals(dto.getVehicle().getVehicleinspection()))
                    .licenseplate(dto.getVehicle().getLicenseplate())
                    .origin(dto.getVehicle().getOrigin())
                    .build());

            if (dto.getVehicleImages() != null) {
                for (var file : dto.getVehicleImages()) {
                    if (file != null && !file.isEmpty()) {
                        try {
                            String url = s3Service.uploadFile(file);
                            vehicleImageRepository.save(Vehicleimage.builder()
                                    .vehicle(savedVehicle)
                                    .imageurl(url)
                                    .uploadedat(Instant.now())
                                    .build());
                            allImages.add(url);
                        } catch (IOException e) {
                            throw new IOException("Failed to upload vehicle image: " + e.getMessage(), e);
                        }
                    }
                }
            }

        } else if (dto.getBattery() != null) {
            // Battery
            Integer typeId = dto.getBattery().getBatteryTypeId();
            if (typeId == null) throw new IllegalArgumentException("Battery type ID is required");

            Batterytype type = batterytypeRepository.findById(typeId)
                    .orElseThrow(() -> new IllegalArgumentException("Battery type not found: " + typeId));

            savedBattery = batteryRepository.save(Battery.builder()
                    .post(post)
                    .batterytypeid(type)
                    .serialnumber(dto.getBattery().getSerialNumber())
                    .origincapacity(dto.getBattery().getOriginCapacity())
                    .remainingcapacity(dto.getBattery().getRemainingCapacity())
                    .mileagecovered(dto.getBattery().getMileageCovered())
                    .voltage(dto.getBattery().getVoltage())
                    .cyclecount(dto.getBattery().getCycleCount())
                    .warranty(dto.getBattery().getWarranty())
                    .weight(dto.getBattery().getWeight())
                    .lifecycle(dto.getBattery().getLifeCycle())
                    .build());

            if (dto.getImages() != null) {
                for (var file : dto.getImages()) {
                    if (file != null && !file.isEmpty()) {
                        try {
                            String url = s3Service.uploadFile(file);
                            batteryimageRepository.save(Batteryimage.builder()
                                    .battery(savedBattery)
                                    .imageurl(url)
                                    .uploadedat(Instant.now())
                                    .build());
                            allImages.add(url);
                        } catch (IOException e) {
                            throw new IOException("Failed to upload battery image: " + e.getMessage(), e);
                        }
                    }
                }
            }

        } else {
            throw new IllegalArgumentException("Provide either vehicle or battery details.");
        }

        // 4. Trả về response
        return postMapper.toPostResponse(post, savedBattery, savedVehicle, allImages);
    }
}