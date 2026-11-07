package com.aminedev.taskflow.dto;

import com.aminedev.taskflow.model.ProjectStatus;
import java.time.LocalDateTime;

public record ProjectResponse(Long id, String name, String description, ProjectStatus status,
                              LocalDateTime createdAt, long taskCount, long doneCount) {}
