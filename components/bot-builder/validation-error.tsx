'use client'

import { AlertCircle } from 'lucide-react'
import { ValidationError } from './types'

interface ValidationErrorsProps {
  errors: ValidationError[];
}

export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg border border-error/50 bg-error/10 p-4">
      <div className="flex items-center space-x-2 text-error mb-2">
        <AlertCircle className="h-4 w-4" />
        <h4 className="font-medium">Validation Errors</h4>
      </div>
      <ul className="space-y-1 text-sm text-error">
        {errors.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
} 