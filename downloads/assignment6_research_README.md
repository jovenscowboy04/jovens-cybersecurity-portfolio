# Assignment 6 Research Experiment

## Files
- `assignment6_research_experiments.ipynb` – Jupyter Notebook with the baseline, improved models, evaluation, and ablation test.
- `assignment6_research_experiment.py` – Python script version of the experiment.
- `assignment6_experiment_results.csv` – saved model metrics.
- `assignment6_feature_importance.csv` – Random Forest feature-importance output.

## Dataset
Use the Kaggle `phishing_features.csv` file for the Phishing URLs Dataset with Extracted Features.

## Requirements
Python 3 with:
- pandas
- numpy
- scikit-learn
- matplotlib

## Reproduce
1. Place `phishing_features.csv` in the same folder as the notebook/script.
2. Run the notebook top to bottom, or run:
   `python assignment6_research_experiment.py`
3. The experiment uses a fixed `random_state=42` and a stratified 80/20 split.

## Research design
Baseline: Logistic Regression with three simple URL features.
Improvement: expanded engineered features plus class balancing, tested with balanced Logistic Regression and Random Forest.
