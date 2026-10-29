import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score, average_precision_score

df = pd.read_csv("phishing_features.csv")
df["tld"] = df["tld"].fillna("Unknown")

train_idx, test_idx = train_test_split(np.arange(len(df)), test_size=0.20, random_state=42, stratify=df["label"])
train = df.iloc[train_idx].copy()
test = df.iloc[test_idx].copy()
y_train = train["label"]
y_test = test["label"]

baseline_features = ["url_length", "num_dots", "entropy"]
numeric_features = ["url_length","num_dots","has_https","has_ip","num_subdirs","num_params","suspicious_words","special_char_count","digits_count","entropy"]
cat_features = ["tld"]

baseline = Pipeline([
    ("scale", StandardScaler()),
    ("classifier", LogisticRegression(max_iter=1500, random_state=42))
])
baseline.fit(train[baseline_features], y_train)

lr_pre = ColumnTransformer([
    ("num", StandardScaler(), numeric_features),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_features)
])
improved_lr = Pipeline([
    ("pre", lr_pre),
    ("classifier", LogisticRegression(max_iter=2500, random_state=42, class_weight="balanced"))
])
improved_lr.fit(train[numeric_features + cat_features], y_train)

rf_pre = ColumnTransformer([
    ("num", "passthrough", numeric_features),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_features)
])
improved_rf = Pipeline([
    ("pre", rf_pre),
    ("classifier", RandomForestClassifier(n_estimators=150, random_state=42, class_weight="balanced", n_jobs=-1))
])
improved_rf.fit(train[numeric_features + cat_features], y_train)

def evaluate(name, model, X):
    p = model.predict(X)
    prob = model.predict_proba(X)[:, 1]
    tn, fp, fn, tp = confusion_matrix(y_test, p, labels=[0,1]).ravel()
    return {
        "Model": name,
        "Accuracy": accuracy_score(y_test, p),
        "Precision": precision_score(y_test, p),
        "Recall": recall_score(y_test, p),
        "F1": f1_score(y_test, p),
        "ROC_AUC": roc_auc_score(y_test, prob),
        "PR_AUC": average_precision_score(y_test, prob),
        "TN": tn, "FP": fp, "FN": fn, "TP": tp,
        "FPR": fp/(fp+tn), "FNR": fn/(fn+tp)
    }

results = pd.DataFrame([
    evaluate("Baseline Logistic Regression", baseline, test[baseline_features]),
    evaluate("Improved Balanced Logistic Regression", improved_lr, test[numeric_features + cat_features]),
    evaluate("Improved Balanced Random Forest", improved_rf, test[numeric_features + cat_features])
])
print(results.to_string(index=False))
results.to_csv("assignment6_experiment_results.csv", index=False)
