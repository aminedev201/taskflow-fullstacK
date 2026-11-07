package com.aminedev.taskflow.controller;

import com.aminedev.taskflow.dto.StatsResponse;
import com.aminedev.taskflow.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private final StatsService service;

    public StatsController(StatsService service) { this.service = service; }

    @GetMapping
    public StatsResponse stats() { return service.get(); }
}
