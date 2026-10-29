# Machine Learning for Phishing URL Detection

## Dataset
Phishing URLs Dataset with Extracted Features  
Kaggle: https://www.kaggle.com/datasets/victusadi/phishing-urls-dataset-with-extracted-features

## Research Question
Can machine-learning models accurately identify phishing URLs based on features found in the URL?

## Requirements
- Python 3
- pandas
- numpy
- matplotlib
- scikit-learn

## Run Instructions
1. Download `phishing_features.csv` from the Kaggle dataset above.
2. Place it in the same folder as `phishing_url_detection_notebook.ipynb`.
3. Open the notebook in Jupyter Notebook, JupyterLab, VS Code, or Google Colab.
4. Run the cells from top to bottom.

## Methods
- Logistic Regression
- Random Forest
- Stratified 80/20 train/test split
- Class weighting for the imbalanced target
- Standard scaling for Logistic Regression
- One-hot encoding for the `tld` feature

## Evaluation
Accuracy, precision, recall, F1-score, ROC-AUC, confusion matrix, false-positive rate, and false-negative rate.

## Important Limitation
The submitted dataset contains a strong class-separation pattern. In particular, `num_subdirs` is 0 for all legitimate samples while phishing samples have at least 2 in this dataset. This helps explain the perfect test results obtained by both models and means the scores should not be assumed to represent real-world performance.

## Academic Integrity
The analysis code is original project work. The Kaggle dataset should be cited in the final report and presentation.
