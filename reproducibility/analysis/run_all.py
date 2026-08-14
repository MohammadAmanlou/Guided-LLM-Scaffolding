from __future__ import annotations

import subprocess
import sys
from pathlib import Path


SCRIPTS = [
    "01_flow_balance.py",
    "02_rule_following.py",
    "03_inter_rater_reliability.py",
    "04_learning_outcomes.py",
    "05_time_on_task.py",
    "06_calibration.py",
]


def main() -> None:
    for script in SCRIPTS:
        path = Path("scripts") / script
        print(f"\n=== Running {path} ===")
        subprocess.run([sys.executable, str(path)], check=True)
    print("\nAll analyses completed.")


if __name__ == "__main__":
    main()
