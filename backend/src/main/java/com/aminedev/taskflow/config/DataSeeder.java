package com.aminedev.taskflow.config;

import com.aminedev.taskflow.model.*;
import com.aminedev.taskflow.repository.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final PasswordEncoder encoder;
    private final String adminUser;
    private final String adminPass;
    private final boolean seedDemo;

    public DataSeeder(UserRepository users, ProjectRepository projects, TaskRepository tasks, PasswordEncoder encoder,
                      @Value("${app.admin.username}") String adminUser,
                      @Value("${app.admin.password}") String adminPass,
                      @Value("${app.seed-demo}") boolean seedDemo) {
        this.users = users;
        this.projects = projects;
        this.tasks = tasks;
        this.encoder = encoder;
        this.adminUser = adminUser;
        this.adminPass = adminPass;
        this.seedDemo = seedDemo;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!users.existsByUsername(adminUser)) {
            users.save(new User(adminUser, encoder.encode(adminPass)));
        }
        if (seedDemo && projects.count() == 0) {
            String[] projectNames = {"Website Redesign", "Mobile App", "E-commerce Platform",
                    "Marketing Campaign", "Internal CRM", "API Migration"};
            String[] taskTitles = {"Design mockups", "Set up CI/CD", "Write unit tests", "Fix login bug",
                    "Code review", "Database optimization", "Write documentation", "Deploy to staging",
                    "User testing", "Performance audit", "Security review", "Release planning"};
            Random rnd = new Random(42);
            for (String name : projectNames) {
                Project p = new Project();
                p.setName(name);
                p.setDescription("Demo project: " + name);
                p.setStatus(ProjectStatus.values()[rnd.nextInt(3)]);
                projects.save(p);
                List<Task> batch = new ArrayList<>();
                for (String title : taskTitles) {
                    Task t = new Task();
                    t.setTitle(title);
                    t.setDescription(title + " for " + name);
                    t.setStatus(TaskStatus.values()[rnd.nextInt(3)]);
                    t.setPriority(Priority.values()[rnd.nextInt(3)]);
                    t.setDueDate(LocalDate.now().plusDays(rnd.nextInt(40) - 10));
                    t.setProject(p);
                    batch.add(t);
                }
                tasks.saveAll(batch);
            }
        }
    }
}
