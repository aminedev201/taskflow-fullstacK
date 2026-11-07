package com.aminedev.taskflow.dto;

import java.util.List;
import java.util.Map;

public record StatsResponse(
        long totalProjects,
        long totalTasks,
        long completedTasks,
        long overdueTasks,
        Map<String, Long> tasksByStatus,
        Map<String, Long> tasksByPriority,
        Map<String, Long> projectsByStatus,
        List<ProjectBreakdown> tasksPerProject) {

    public record ProjectBreakdown(String project, long todo, long inProgress, long done) {}
}
