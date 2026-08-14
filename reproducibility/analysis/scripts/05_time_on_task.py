from pathlib import Path
import argparse

from icce_analysis.time_on_task import analyze_time_on_task


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path("data_private"))
    parser.add_argument("--output-dir", type=Path, default=Path("analysis_outputs/05_time_on_task"))
    args = parser.parse_args()
    analyze_time_on_task(args.data_dir, args.output_dir)


if __name__ == "__main__":
    main()
