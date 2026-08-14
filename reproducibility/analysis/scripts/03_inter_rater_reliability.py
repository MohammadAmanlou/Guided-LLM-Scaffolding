from pathlib import Path
import argparse

from icce_analysis.irr import analyze_irr


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path("data_private"))
    parser.add_argument("--output-dir", type=Path, default=Path("analysis_outputs/03_irr"))
    args = parser.parse_args()
    analyze_irr(args.data_dir, args.output_dir)


if __name__ == "__main__":
    main()
