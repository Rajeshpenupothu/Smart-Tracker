package com.smarttracker.controller;

import com.smarttracker.model.DailyTask;
import com.smarttracker.repository.DailyTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173") // For React dev server
public class TaskController {

    @Autowired
    private DailyTaskRepository repository;

    private static final Map<String, String> FE_TO_DB_KEYS = Map.of(
        "javaPractice", "java",
        "bookReading", "book reading",
        "newSkill", "new skill"
    );

    @GetMapping("/{date}")
    public Map<String, Object> getTaskByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        DailyTask task = repository.findByDate(localDate).orElse(new DailyTask());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", task.getId());
        response.put("date", task.getDate());
        response.put("notes", task.getNotes());
        
        Map<String, Object> completed = task.getCompletedTasks();
        if (completed != null) {
            // Backward compatibility for 'python' -> 'java'
            if (completed.containsKey("python") && !completed.containsKey("java")) {
                completed.put("java", completed.get("python"));
            }

            for (Map.Entry<String, String> entry : FE_TO_DB_KEYS.entrySet()) {
                String feKey = entry.getKey();
                String dbKey = entry.getValue();
                
                if (completed.containsKey(dbKey)) {
                    Object val = completed.get(dbKey);
                    if (val instanceof Map) {
                        Map<String, Object> categoryData = (Map<String, Object>) val;
                        // Handle transition from single "task" to "tasks" list
                        if (categoryData.containsKey("tasks")) {
                            response.put(feKey + "List", categoryData.get("tasks"));
                        } else if (categoryData.containsKey("task")) {
                            // Convert old single task to a list for the frontend
                            Map<String, Object> singleTask = new HashMap<>();
                            singleTask.put("title", categoryData.get("task"));
                            singleTask.put("done", categoryData.getOrDefault("done", false));
                            java.util.List<Map<String, Object>> list = java.util.List.of(singleTask);
                            response.put(feKey + "List", list);
                        }
                    }
                }
            }
            
            // Handle leetCode/gfg (special cases as they are just checkboxes)
            if (completed.containsKey("leetCode")) {
                Map<String, Object> info = (Map<String, Object>) completed.get("leetCode");
                response.put("leetCodeCompleted", info.getOrDefault("done", false));
            }
            if (completed.containsKey("gfg")) {
                Map<String, Object> info = (Map<String, Object>) completed.get("gfg");
                response.put("gfgCompleted", info.getOrDefault("done", false));
            }
        }
        return response;
    }

    @PostMapping
    public DailyTask saveOrUpdateTask(@RequestBody Map<String, Object> payload) {
        String dateStr = (String) payload.get("date");
        LocalDate date = (dateStr != null) ? LocalDate.parse(dateStr) : LocalDate.now();
        DailyTask task = repository.findByDate(date).orElse(new DailyTask());
        task.setDate(date);
        task.setNotes((String) payload.get("notes"));

        Map<String, Object> nestedTasks = new HashMap<>();
        
        for (Map.Entry<String, String> entry : FE_TO_DB_KEYS.entrySet()) {
            String feKey = entry.getKey();
            String dbKey = entry.getValue();
            
            Map<String, Object> categoryData = new HashMap<>();
            Object listObj = payload.get(feKey + "List");
            if (listObj instanceof java.util.List) {
                categoryData.put("tasks", listObj);
            } else {
                categoryData.put("tasks", java.util.Collections.emptyList());
            }
            nestedTasks.put(dbKey, categoryData);
        }
        
        // Handle leetCode/gfg
        nestedTasks.put("leetCode", Map.of("done", payload.getOrDefault("leetCodeCompleted", false)));
        nestedTasks.put("gfg", Map.of("done", payload.getOrDefault("gfgCompleted", false)));

        task.setCompletedTasks(nestedTasks);
        return repository.save(task);
    }
    @GetMapping
    public java.util.List<Map<String, Object>> getAllTasks() {
        return repository.findAllByOrderByDateDesc().stream().map(task -> {
            Map<String, Object> summary = new HashMap<>();
            summary.put("id", task.getId());
            summary.put("date", task.getDate());
            
            boolean hasProgress = false;
            Map<String, Object> preview = new HashMap<>();
            
            Map<String, Object> completed = task.getCompletedTasks();
            if (completed != null) {
                for (Map.Entry<String, String> entry : FE_TO_DB_KEYS.entrySet()) {
                    String dbKey = entry.getValue();
                    if (completed.containsKey(dbKey)) {
                        Object val = completed.get(dbKey);
                        if (val instanceof Map) {
                            Map<String, Object> categoryData = (Map<String, Object>) val;
                            if (categoryData.containsKey("tasks")) {
                                Object tasksListObj = categoryData.get("tasks");
                                if (tasksListObj instanceof java.util.List) {
                                    java.util.List<?> tasksList = (java.util.List<?>) tasksListObj;
                                    if (!tasksList.isEmpty()) {
                                        hasProgress = true;
                                        preview.put(dbKey, true); // Mark as done for preview
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (completed.containsKey("leetCode")) {
                    Map<String, Object> info = (Map<String, Object>) completed.get("leetCode");
                    if ((Boolean) info.getOrDefault("done", false)) {
                        hasProgress = true;
                        preview.put("leetCode", true);
                    }
                }
                if (completed.containsKey("gfg")) {
                    Map<String, Object> info = (Map<String, Object>) completed.get("gfg");
                    if ((Boolean) info.getOrDefault("done", false)) {
                        hasProgress = true;
                        preview.put("gfg", true);
                    }
                }
            }
            if (task.getNotes() != null && !task.getNotes().trim().isEmpty()) {
                hasProgress = true;
                // Add a snippet of the notes
                String snippet = task.getNotes();
                if (snippet.length() > 50) snippet = snippet.substring(0, 47) + "...";
                preview.put("notes", snippet);
            }
            
            summary.put("hasProgress", hasProgress);
            summary.put("preview", preview);
            return summary;
        }).toList();
    }
}
