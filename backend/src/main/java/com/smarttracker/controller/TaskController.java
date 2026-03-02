package com.smarttracker.controller;

import com.smarttracker.model.DailyTask;
import com.smarttracker.repository.DailyTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
    public Map<String, Object> getTaskByDate(@PathVariable String date, @RequestParam String userEmail) {
        String normalizedEmail = (userEmail != null) ? userEmail.toLowerCase() : null;
        LocalDate localDate = LocalDate.parse(date);
        DailyTask task = repository.findByDateAndUserEmail(localDate, normalizedEmail).orElse(new DailyTask());
        return mapTaskToResponse(task);
    }

    private Map<String, Object> mapTaskToResponse(DailyTask task) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", task.getId());
        response.put("date", task.getDate());
        response.put("notes", task.getNotes());
        response.put("userEmail", task.getUserEmail());
        
        // Initial defaults for helper fields
        response.put("isFavorite", false);
        response.put("favoriteTitle", "");
        
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
                        if (categoryData.containsKey("tasks")) {
                            response.put(feKey + "List", categoryData.get("tasks"));
                        } else if (categoryData.containsKey("task")) {
                            Map<String, Object> singleTask = new HashMap<>();
                            singleTask.put("title", categoryData.get("task"));
                            singleTask.put("done", categoryData.getOrDefault("done", false));
                            response.put(feKey + "List", java.util.List.of(singleTask));
                        }
                    }
                } else {
                    response.put(feKey + "List", java.util.Collections.emptyList());
                }
            }
            
            if (completed.containsKey("leetCode")) {
                Map<String, Object> info = (Map<String, Object>) completed.get("leetCode");
                response.put("leetCodeCompleted", info.getOrDefault("done", false));
            } else {
                response.put("leetCodeCompleted", false);
            }
            
            if (completed.containsKey("gfg")) {
                Map<String, Object> info = (Map<String, Object>) completed.get("gfg");
                response.put("gfgCompleted", info.getOrDefault("done", false));
            } else {
                response.put("gfgCompleted", false);
            }

            if (completed.containsKey("book reading")) {
                Object val = completed.get("book reading");
                if (val instanceof Map) {
                    Map<String, Object> info = (Map<String, Object>) val;
                    response.put("bookReadingCompleted", info.getOrDefault("done", false));
                } else {
                    response.put("bookReadingCompleted", false);
                }
            } else {
                response.put("bookReadingCompleted", false);
            }

            response.put("isFavorite", completed.getOrDefault("isFavorite", false));
            response.put("favoriteTitle", completed.getOrDefault("favoriteTitle", ""));
            response.put("completedTasks", completed);
        } else {
            // Set defaults if completedTasks is null
            for (String feKey : FE_TO_DB_KEYS.keySet()) {
                response.put(feKey + "List", java.util.Collections.emptyList());
            }
            response.put("leetCodeCompleted", false);
            response.put("gfgCompleted", false);
            response.put("bookReadingCompleted", false);
            response.put("completedTasks", new HashMap<>());
        }
        return response;
    }

    @PostMapping
    @Transactional
    public Map<String, Object> saveOrUpdateTask(@RequestBody Map<String, Object> payload) {
        String dateStr = (String) payload.get("date");
        String rawUserEmail = (String) payload.get("userEmail");
        String userEmail = (rawUserEmail != null) ? rawUserEmail.toLowerCase() : "anonymous";
        
        LocalDate date = (dateStr != null) ? LocalDate.parse(dateStr) : LocalDate.now();
        System.out.println("[SaveTask] Saving task for date: " + date + ", user: " + userEmail);
        
        DailyTask task = repository.findByDateAndUserEmail(date, userEmail).orElseGet(() -> {
            DailyTask newTask = new DailyTask();
            newTask.setDate(date);
            newTask.setUserEmail(userEmail);
            return newTask;
        });
        
        task.setNotes((String) payload.get("notes"));
        Map<String, Object> nestedTasks = new HashMap<>();
        
        for (Map.Entry<String, String> entry : FE_TO_DB_KEYS.entrySet()) {
            String feKey = entry.getKey();
            String dbKey = entry.getValue();
            Object listObj = payload.get(feKey + "List");
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("tasks", (listObj instanceof java.util.List) ? listObj : java.util.Collections.emptyList());
            nestedTasks.put(dbKey, categoryData);
        }
        
        nestedTasks.put("leetCode", Map.of("done", payload.getOrDefault("leetCodeCompleted", false)));
        nestedTasks.put("gfg", Map.of("done", payload.getOrDefault("gfgCompleted", false)));
        nestedTasks.put("book reading", Map.of("done", payload.getOrDefault("bookReadingCompleted", false)));
        
        nestedTasks.put("isFavorite", payload.getOrDefault("isFavorite", false));
        nestedTasks.put("favoriteTitle", payload.getOrDefault("favoriteTitle", ""));
        
        if (payload.containsKey("hourlyLog")) {
            nestedTasks.put("hourlyLog", payload.get("hourlyLog"));
        }

        task.setCompletedTasks(nestedTasks);
        DailyTask saved = repository.save(task);
        return mapTaskToResponse(saved);
    }
    @GetMapping
    public java.util.List<Map<String, Object>> getAllTasks(@RequestParam String userEmail) {
        String normalizedEmail = (userEmail != null) ? userEmail.toLowerCase() : null;
        return repository.findAllByUserEmailOrderByDateDesc(normalizedEmail).stream().map(task -> {
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

    @GetMapping("/favorites")
    public java.util.List<Map<String, Object>> getFavorites(@RequestParam String userEmail) {
        String normalizedEmail = (userEmail != null) ? userEmail.toLowerCase() : null;
        return repository.findAllByUserEmailOrderByDateDesc(normalizedEmail).stream()
            .filter(task -> {
                Map<String, Object> completed = task.getCompletedTasks();
                return completed != null && Boolean.TRUE.equals(completed.get("isFavorite"));
            })
            .map(task -> {
                Map<String, Object> fav = new HashMap<>();
                fav.put("id", task.getId());
                fav.put("date", task.getDate().toString());
                fav.put("title", task.getCompletedTasks().getOrDefault("favoriteTitle", "Special Day"));
                return fav;
            }).toList();
    }
}
