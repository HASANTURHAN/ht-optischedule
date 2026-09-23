use tauri::{command, Emitter, Window};
use std::fs;
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::thread;

#[command]
fn get_teachers_data() -> Result<String, String> {
    let csv_path = "/Users/hasanturhan/.gemini/antigravity/scratch/csv_constraints.json";
    fs::read_to_string(csv_path).map_err(|e| e.to_string())
}

#[command]
fn get_teacher_mapping() -> Result<String, String> {
    let map_path = "/Users/hasanturhan/.gemini/antigravity/scratch/teacher_mapping.json";
    fs::read_to_string(map_path).map_err(|e| e.to_string())
}

#[command]
fn start_solver(window: Window, time_limit: u32, cpu_limit: u32) -> Result<(), String> {
    // Run the solver in a background thread so we don't block the Tauri UI
    thread::spawn(move || {
        let script_path = "/Users/hasanturhan/.gemini/antigravity/scratch/solver_multi.py";
        
        let mut child = match Command::new("python3")
            .arg(script_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn() {
                Ok(c) => c,
                Err(e) => {
                    let _ = window.emit("solver-log", format!("Error starting solver: {}", e));
                    return;
                }
            };

        let _ = window.emit("solver-log", format!("Yapay Zeka Motoru Başlatıldı... (Süre Limiti: {}dk, CPU: %{})", time_limit, cpu_limit));

        if let Some(stdout) = child.stdout.take() {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(l) = line {
                    let _ = window.emit("solver-log", l);
                }
            }
        }
        
        let status = child.wait().unwrap();
        let _ = window.emit("solver-done", format!("Çözüm tamamlandı. Çıkış kodu: {}", status));
    });

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_teachers_data, 
            get_teacher_mapping,
            start_solver
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
