// package com.g_wuy.swp391.voltera.repository;

// import com.g_wuy.swp391.voltera.entity.Vehicle;
// import com.g_wuy.swp391.voltera.model.request.FilterRequest;
// import org.springframework.data.jpa.domain.Specification;

// import jakarta.persistence.criteria.Predicate;
// import java.util.ArrayList;
// import java.util.List;

// public class PostVehicleSpecification {

//     public static Specification<Vehicle> filter(FilterRequest req) {
//         return (root, query, cb) -> {
//             List<Predicate> predicates = new ArrayList<>();

//             // keyword (search by brand, color, address, etc.)
//             if (req.getKeyword() != null && !req.getKeyword().isEmpty()) {
//                 String pattern = "%" + req.getKeyword().toLowerCase() + "%";
//                 predicates.add(cb.or(
//                         cb.like(cb.lower(root.get("brand")), pattern),
//                         cb.like(cb.lower(root.get("color")), pattern),
//                         cb.like(cb.lower(root.get("address")), pattern),
//                         cb.like(cb.lower(root.get("origin")), pattern),
//                         cb.like(cb.lower(root.get("style")), pattern)
//                 ));
//             }

//             if (req.getAddress() != null && !req.getAddress().isEmpty())
//                 predicates.add(cb.equal(cb.lower(root.get("address")), req.getAddress().toLowerCase()));

//             if (req.getBrand() != null && !req.getBrand().isEmpty())
//                 predicates.add(cb.equal(cb.lower(root.get("brand")), req.getBrand().toLowerCase()));

//             if (req.getColor() != null && !req.getColor().isEmpty())
//                 predicates.add(cb.equal(cb.lower(root.get("color")), req.getColor().toLowerCase()));

//             if (req.getOrigin() != null && !req.getOrigin().isEmpty())
//                 predicates.add(cb.equal(cb.lower(root.get("origin")), req.getOrigin().toLowerCase()));

//             if (req.getStyle() != null && !req.getStyle().isEmpty())
//                 predicates.add(cb.equal(cb.lower(root.get("style")), req.getStyle().toLowerCase()));

//             if (req.getMinPrice() != null)
//                 predicates.add(cb.greaterThanOrEqualTo(root.get("price"), req.getMinPrice()));

//             if (req.getMaxPrice() != null)
//                 predicates.add(cb.lessThanOrEqualTo(root.get("price"), req.getMaxPrice()));

//             if (req.getYearManufacture() > 0)
//                 predicates.add(cb.equal(root.get("yearManufacture"), req.getYearManufacture()));

//             if (req.isBodyInsurance())
//                 predicates.add(cb.isTrue(root.get("bodyInsurance")));

//             if (req.isVehicleInspection())
//                 predicates.add(cb.isTrue(root.get("vehicleInspection")));

//             return cb.and(predicates.toArray(new Predicate[0]));
//         };
//     }
// }
