from pathlib import Path
import argparse

from icce_analysis.learning_outcomes import analyze_learning_outcomes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path("data_private"))
    parser.add_argument("--output-dir", type=Path, default=Path("analysis_outputs/04_learning_outcomes"))
    args = parser.parse_args()
    analyze_learning_outcomes(args.data_dir, args.output_dir)


if __name__ == "__main__":
    main()
