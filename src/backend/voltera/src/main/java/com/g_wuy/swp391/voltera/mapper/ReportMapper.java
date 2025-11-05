package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Report;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    ReportResponse toResponse(Report report);
}
