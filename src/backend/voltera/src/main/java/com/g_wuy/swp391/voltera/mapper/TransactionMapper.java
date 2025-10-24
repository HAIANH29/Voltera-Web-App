package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.model.response.TransactionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
//    @Mapping(source = "postId.productName", target = "postTitle")
//    TransactionResponse toResponse(Transaction transaction);
}
