use tauri::command;
use std::fs;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_teachers_data, get_teacher_mapping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
