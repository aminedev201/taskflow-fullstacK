package com.aminedev.taskflow.repository;

import com.aminedev.taskflow.model.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    @Query("select p.status, count(p) from Project p group by p.status")
    List<Object[]> countByStatus();
}
