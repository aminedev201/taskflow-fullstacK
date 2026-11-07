package com.aminedev.taskflow.dto;

import com.aminedev.taskflow.model.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 2000) String description,
        ProjectStatus status) {}
