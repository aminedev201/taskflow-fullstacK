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
public class ProjectService {
    private final ProjectRepository repo;
    private final TaskRepository tasks;

    public ProjectService(ProjectRepository repo, TaskRepository tasks) {
        this.repo = repo;
        this.tasks = tasks;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProjectResponse> list(String search, ProjectStatus status, Pageable pageable) {
        Specification<Project> spec = (r, q, cb) -> cb.conjunction();
        if (search != null && !search.isBlank()) {
            String like = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((r, q, cb) -> cb.or(
                    cb.like(cb.lower(r.get("name")), like),
                    cb.like(cb.lower(r.get("description")), like)));
        }
        if (status != null) {
            spec = spec.and((r, q, cb) -> cb.equal(r.get("status"), status));
        }
        return PageResponse.from(repo.findAll(spec, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public ProjectResponse get(Long id) { return toResponse(find(id)); }

    @Transactional
    public ProjectResponse create(ProjectRequest req) {
        Project p = new Project();
        apply(p, req);
        return toResponse(repo.save(p));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest req) {
        Project p = find(id);
        apply(p, req);
        return toResponse(repo.save(p));
    }

    @Transactional
    public void delete(Long id) { repo.delete(find(id)); }

    private Project find(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private void apply(Project p, ProjectRequest req) {
        p.setName(req.name().trim());
        p.setDescription(req.description());
        p.setStatus(req.status() != null ? req.status() : ProjectStatus.ACTIVE);
    }

    private ProjectResponse toResponse(Project p) {
        return new ProjectResponse(p.getId(), p.getName(), p.getDescription(), p.getStatus(), p.getCreatedAt(),
                tasks.countByProjectId(p.getId()), tasks.countByProjectIdAndStatus(p.getId(), TaskStatus.DONE));
    }
}
