package com.aminedev.taskflow.service;

import com.aminedev.taskflow.dto.*;
import com.aminedev.taskflow.model.*;
import com.aminedev.taskflow.repository.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaskService {
    private final TaskRepository repo;
    private final ProjectRepository projects;

    public TaskService(TaskRepository repo, ProjectRepository projects) {
        this.repo = repo;
        this.projects = projects;
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> list(String search, TaskStatus status, Priority priority,
                                           Long projectId, Pageable pageable) {
        Specification<Task> spec = (r, q, cb) -> cb.conjunction();
        if (search != null && !search.isBlank()) {
            String like = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((r, q, cb) -> cb.or(
                    cb.like(cb.lower(r.get("title")), like),
                    cb.like(cb.lower(r.get("description")), like)));
        }
        if (status != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("status"), status));
        if (priority != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("priority"), priority));
        if (projectId != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("project").get("id"), projectId));
        return PageResponse.from(repo.findAll(spec, pageable).map(this::toResponse));
    }

    @Transactional
    public TaskResponse create(TaskRequest req) {
        Task t = new Task();
        apply(t, req);
        return toResponse(repo.save(t));
    }

    @Transactional
    public TaskResponse update(Long id, TaskRequest req) {
        Task t = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        apply(t, req);
        return toResponse(repo.save(t));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        repo.deleteById(id);
    }

    private void apply(Task t, TaskRequest req) {
        Project p = projects.findById(req.projectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project not found"));
        t.setTitle(req.title().trim());
        t.setDescription(req.description());
        t.setStatus(req.status() != null ? req.status() : TaskStatus.TODO);
        t.setPriority(req.priority() != null ? req.priority() : Priority.MEDIUM);
        t.setDueDate(req.dueDate());
        t.setProject(p);
    }

    private TaskResponse toResponse(Task t) {
        return new TaskResponse(t.getId(), t.getTitle(), t.getDescription(), t.getStatus(), t.getPriority(),
                t.getDueDate(), t.getProject().getId(), t.getProject().getName(), t.getCreatedAt());
    }
}
