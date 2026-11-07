package com.aminedev.taskflow.dto;

import com.aminedev.taskflow.model.Priority;
import com.aminedev.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 2000) String description,
        TaskStatus status,
        Priority priority,
        LocalDate dueDate,
        @NotNull Long projectId) {}
