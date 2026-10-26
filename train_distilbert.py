"""
VeritasLens AI - DistilBERT Fine-Tuning Pipeline for Fake News Classification
Dataset: ISOT / WELFake Fake News Dataset
Architecture: DistilBERT-base-uncased (Hugging Face Transformers + PyTorch)
Evaluation Metrics: Accuracy, Precision, Recall, F1-Score, Confusion Matrix
"""

import os
import torch
import numpy as np
import pandas as pd
from datasets import Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding,
    EarlyStoppingCallback
)

def compute_metrics(eval_pred):
    """
    Computes Accuracy, Precision, Recall, and F1-score for model evaluation.
    """
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, average="binary"
    )
    acc = accuracy_score(labels, predictions)
    
    return {
        "accuracy": round(acc, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
    }

def main():
    print("=" * 60)
    print("VeritasLens AI: Fine-Tuning DistilBERT on Fake News Dataset")
    print("=" * 60)
    
    # 1. Device configuration
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using compute device: {device}")
    
    # 2. Synthetic/Demo fallback or Load Real CSV
    csv_path = "fake_news_dataset.csv"
    if os.path.exists(csv_path):
        print(f"Loading dataset from {csv_path}...")
        df = pd.read_csv(csv_path)
    else:
        print("Dataset CSV not found; generating synthetic sample dataset for demonstration...")
        df = pd.DataFrame({
            "text": [
                "NASA's James Webb Space Telescope confirms discovery of ancient spiral galaxy cluster.",
                "SECRET ALIEN BUNKER FOUND IN DESERT THAT CONTROLS GLOBAL WEATHER OVERNIGHT!",
                "European Union leaders approve binding renewable energy legislation for 2035 targets.",
                "Drinking boiled lemon water and salt cures all forms of diabetes in 48 hours guaranteed!",
                "Federal Reserve announces interest rate policy update following monthly inflation reports.",
                "Government secretly banning all paper money next week to implement chip implants!"
            ] * 200,
            "label": [1, 0, 1, 0, 1, 0] * 200 # 1: Real, 0: Fake
        })
    
    # 3. Train / Validation / Test Split (80 / 10 / 10)
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df["label"])
    val_df, test_df = train_test_split(test_df, test_size=0.5, random_state=42, stratify=test_df["label"])
    
    print(f"Train size: {len(train_df)}, Val size: {len(val_df)}, Test size: {len(test_df)}")
    
    # 4. Tokenizer initialization
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    def tokenize_function(examples):
        return tokenizer(
            examples["text"],
            padding="max_length",
            truncation=True,
            max_length=256
        )
    
    train_ds = Dataset.from_pandas(train_df).map(tokenize_function, batched=True)
    val_ds = Dataset.from_pandas(val_df).map(tokenize_function, batched=True)
    test_ds = Dataset.from_pandas(test_df).map(tokenize_function, batched=True)
    
    # 5. Model initialization
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=2,
        id2label={0: "FAKE", 1: "REAL"},
        label2id={"FAKE": 0, "REAL": 1}
    ).to(device)
    
    # 6. Training Arguments
    training_args = TrainingArguments(
        output_dir="./results_distilbert",
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        num_train_epochs=5,
        weight_decay=0.01,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        fp16=torch.cuda.is_available(),
        logging_dir="./logs",
        logging_steps=50,
        report_to="none"
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        tokenizer=tokenizer,
        data_collator=DataCollatorWithPadding(tokenizer=tokenizer),
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
    )
    
    # 7. Execute Fine-Tuning
    print("\nStarting Fine-Tuning...")
    trainer.train()
    
    # 8. Evaluation on Held-Out Test Set
    print("\nEvaluating on Test Split...")
    test_results = trainer.evaluate(test_ds)
    print("\n" + "=" * 40)
    print("FINAL TEST METRICS:")
    print(f"Accuracy  : {test_results['eval_accuracy'] * 100:.2f}%")
    print(f"Precision : {test_results['eval_precision'] * 100:.2f}%")
    print(f"Recall    : {test_results['eval_recall'] * 100:.2f}%")
    print(f"F1-Score  : {test_results['eval_f1'] * 100:.2f}%")
    print("=" * 40)
    
    # Save best model
    output_model_dir = "./saved_distilbert_fake_news"
    model.save_pretrained(output_model_dir)
    tokenizer.save_pretrained(output_model_dir)
    print(f"\nModel and Tokenizer successfully saved to '{output_model_dir}'")

if __name__ == "__main__":
    main()
