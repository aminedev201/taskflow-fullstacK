package com.aminedev.taskflow.service;

import com.aminedev.taskflow.dto.StatsResponse;
import com.aminedev.taskflow.dto.StatsResponse.ProjectBreakdown;
import com.aminedev.taskflow.model.*;
import com.aminedev.taskflow.repository.*;
import java.time.LocalDate;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatsService {
    private final ProjectRepository projects;
    private final TaskRepository tasks;

    public StatsService(ProjectRepository projects, TaskRepository tasks) {
        this.projects = projects;
        this.tasks = tasks;
    }

    @Transactional(readOnly = true)
    public StatsResponse get() {
        Map<String, Long> byStatus = zeroed(TaskStatus.values());
        fill(byStatus, tasks.countByStatus());
        Map<String, Long> byPriority = zeroed(Priority.values());
        fill(byPriority, tasks.countByPriority());
        Map<String, Long> projectsByStatus = zeroed(ProjectStatus.values());
        fill(projectsByStatus, projects.countByStatus());

        Map<String, long[]> perProject = new LinkedHashMap<>();
        for (Object[] row : tasks.countPerProjectAndStatus()) {
            long[] c = perProject.computeIfAbsent((String) row[0], k -> new long[3]);
            c[((TaskStatus) row[1]).ordinal()] = ((Number) row[2]).longValue();
        }
        List<ProjectBreakdown> breakdown = perProject.entrySet().stream()
                .map(e -> new ProjectBreakdown(e.getKey(), e.getValue()[0], e.getValue()[1], e.getValue()[2]))
                .toList();

        return new StatsResponse(
                projects.count(), tasks.count(), byStatus.get("DONE"),
                tasks.countByDueDateBeforeAndStatusNot(LocalDate.now(), TaskStatus.DONE),
                byStatus, byPriority, projectsByStatus, breakdown);
    }

    private static Map<String, Long> zeroed(Enum<?>[] values) {
        Map<String, Long> m = new LinkedHashMap<>();
        for (Enum<?> e : values) m.put(e.name(), 0L);
        return m;
    }

    private static void fill(Map<String, Long> target, List<Object[]> rows) {
        for (Object[] r : rows) target.put(((Enum<?>) r[0]).name(), ((Number) r[1]).longValue());
    }
}
