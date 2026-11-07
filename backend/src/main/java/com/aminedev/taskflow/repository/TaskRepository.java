package com.aminedev.taskflow.repository;

import com.aminedev.taskflow.model.Task;
import com.aminedev.taskflow.model.TaskStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    long countByProjectId(Long projectId);
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);
    long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);

    @Query("select t.status, count(t) from Task t group by t.status")
    List<Object[]> countByStatus();

    @Query("select t.priority, count(t) from Task t group by t.priority")
    List<Object[]> countByPriority();

    @Query("select t.project.name, t.status, count(t) from Task t group by t.project.name, t.status order by t.project.name")
    List<Object[]> countPerProjectAndStatus();
}
