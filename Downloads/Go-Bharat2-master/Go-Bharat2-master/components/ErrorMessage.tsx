import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorMessage({
  message,
  onRetry,
  title = "Something went wrong",
}: ErrorMessageProps) {
  return (
    <div className="mx-auto my-12 max-w-lg rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl text-red-600">
        ⚠️
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
        >
          🔄 Try Again
        </button>
      )}
    </div>
  );
}
