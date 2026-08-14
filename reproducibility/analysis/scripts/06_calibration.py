from pathlib import Path
import argparse

from icce_analysis.calibration import analyze_calibration


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path("data_private"))
    parser.add_argument("--output-dir", type=Path, default=Path("analysis_outputs/06_calibration"))
    args = parser.parse_args()
    analyze_calibration(args.data_dir, args.output_dir)


if __name__ == "__main__":
    main()
