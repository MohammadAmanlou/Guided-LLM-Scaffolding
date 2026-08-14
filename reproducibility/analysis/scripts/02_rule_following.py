from pathlib import Path
import argparse

from icce_analysis.rule_following import analyze_rule_following


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, default=Path("data_private"))
    parser.add_argument("--output-dir", type=Path, default=Path("analysis_outputs/02_rule_following"))
    args = parser.parse_args()
    analyze_rule_following(args.data_dir, args.output_dir)


if __name__ == "__main__":
    main()
