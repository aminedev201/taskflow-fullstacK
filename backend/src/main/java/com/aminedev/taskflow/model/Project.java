package com.aminedev.taskflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(length = 2000)
    private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.ACTIVE;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "project", cascade = CascadeType.REMOVE)
    private List<Task> tasks = new ArrayList<>();

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Task> getTasks() { return tasks; }
}
