"use client";
import { Calculator, Copy } from "lucide-react";

interface FormulasPanelProps {
  formulas: string[];
}

export default function FormulasPanel({ formulas }: FormulasPanelProps) {
  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
  };

  if (formulas.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-orange to-accent-yellow flex items-center justify-center">
            <Calculator size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Key Formulas</h3>
          <p className="text-gray-400 mb-6">
            Mathematical equations and formulas will be extracted automatically
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-border p-4 bg-dark-surface">
        <h3 className="font-semibold">Key Formulas ({formulas.length})</h3>
        <p className="text-xs text-gray-400 mt-1">Auto-extracted mathematical equations</p>
      </div>

      {/* Formulas List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          {formulas.map((formula, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-lg p-4 group hover:border-accent-orange/50 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm text-accent-orange mb-2">Formula #{index + 1}</div>
                  <code className="text-lg font-mono text-white bg-black/30 px-3 py-2 rounded block overflow-x-auto">
                    {formula}
                  </code>
                </div>
                <button
                  onClick={() => copyFormula(formula)}
                  className="p-2 hover:bg-dark-hover rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy formula"
                >
                  <Copy size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
