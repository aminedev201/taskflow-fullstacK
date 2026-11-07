package com.aminedev.taskflow;

import io.github.cdimascio.dotenv.Dotenv;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskFlowApplication {
    public static void main(String[] args) {
        // works whether you start from /backend or from the project root
        String dir = Files.exists(Path.of(".env")) ? "." : "./backend";
        Dotenv dotenv = Dotenv.configure().directory(dir).ignoreIfMissing().load();
        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        SpringApplication.run(TaskFlowApplication.class, args);
    }
}