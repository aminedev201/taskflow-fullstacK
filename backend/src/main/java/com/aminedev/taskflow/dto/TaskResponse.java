package com.aminedev.taskflow.dto;

import com.aminedev.taskflow.model.Priority;
import com.aminedev.taskflow.model.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(Long id, String title, String description, TaskStatus status, Priority priority,
                           LocalDate dueDate, Long projectId, String projectName, LocalDateTime createdAt) {}
