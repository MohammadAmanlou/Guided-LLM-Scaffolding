def format_history(history: list) -> str:
    return "\n".join([f"{m['role']}: {m['content']}" for m in history])
