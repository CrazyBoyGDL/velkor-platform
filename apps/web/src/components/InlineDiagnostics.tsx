'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AdaptiveCTA from '@/components/AdaptiveCTA'
import {
  DIAGNOSTIC_SETS,
  getDiagnosticSet,
  scoreDiagnosticAnswers,
  type DiagnosticAnswer,
  type DiagnosticQuestion,
} from '@/lib/scoring'
import { buildDiagnosticLeadSignal, recordLeadSignal } from '@/lib/leadIntelligence'
import {
  trackDiagnosticAnswered,
  trackDiagnosticCompleted,
  trackDiagnosticStarted,
  trackLeadIntelligenceSignal,
} from '@/components/Analytics'
import { systemReveal } from '@/lib/motion/operationalMotion'

type Props = {
  setId: string
  location: string
  className?: string
  compact?: boolean
  maxQuestions?: number
}

const ANSWER_OPTIONS: Array<{ value: DiagnosticAnswer; label: string }> = [
  { value: 'yes', label: 'Si' },
  { value: 'partial', label: 'Parcial' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'No se' },
]

function riskDelta(question: DiagnosticQuestion, answer: DiagnosticAnswer): number {
  if (answer === 'unknown') return 35
  if (answer === 'partial') return 45
  if (answer === question.riskWhen) return 85
  return 8
}

export default function InlineDiagnostics({
  setId,
  location,
  className = '',
  compact = false,
  maxQuestions,
}: Props) {
  const diagnostic = getDiagnosticSet(setId) ?? DIAGNOSTIC_SETS[0]
  const questions = useMemo(
    () => diagnostic.questions.slice(0, maxQuestions ?? diagnostic.questions.length),
    [diagnostic.questions, maxQuestions]
  )
  const [answers, setAnswers] = useState<Partial<Record<string, DiagnosticAnswer>>>({})
  const startedRef = useRef(false)
  const completedRef = useRef(false)

  const result = useMemo(
    () => scoreDiagnosticAnswers(diagnostic.id, answers),
    [answers, diagnostic.id]
  )
  const complete = result.answeredCount >= questions.length
  const feedbackReady = result.answeredCount >= Math.min(2, questions.length)

  useEffect(() => {
    if (!complete || completedRef.current) return
    completedRef.current = true
    trackDiagnosticCompleted(
      result.diagnosticId,
      result.score,
      result.exposureLevel,
      result.service,
      result.ctaIntent
    )
    const signal = buildDiagnosticLeadSignal(result)
    recordLeadSignal(signal)
    trackLeadIntelligenceSignal('diagnostic-completed', result.diagnosticId, signal.weight, {
      service: result.service,
      urgency: result.exposureLevel,
      maturity: signal.maturity ?? 'unknown',
      intent: result.ctaIntent,
    })
  }, [complete, result])

  function answerQuestion(question: DiagnosticQuestion, answer: DiagnosticAnswer) {
    if (!startedRef.current) {
      startedRef.current = true
      trackDiagnosticStarted(diagnostic.id, location)
      recordLeadSignal({
        type: 'diagnostic-started',
        source: diagnostic.id,
        weight: 1,
        service: diagnostic.service,
        intent: diagnostic.ctaIntent,
      })
    }
    setAnswers(prev => ({ ...prev, [question.id]: answer }))
    trackDiagnosticAnswered(diagnostic.id, question.id, answer, riskDelta(question, answer))
  }

  return (
    <motion.section
      {...systemReveal(0, compact ? 'center' : 'left')}
      className={`inline-diagnostic depth-1 proximity-surface ${compact ? 'inline-diagnostic-compact' : ''} ${className}`}
      aria-label={diagnostic.title}
    >
      <div className="inline-diagnostic-head">
        <div>
          <span className="label">Diagnostico rapido</span>
          <h3>{diagnostic.title}</h3>
        </div>
        <div className="inline-diagnostic-meter" aria-live="polite">
          <strong>{feedbackReady ? result.score : '--'}</strong>
          <span>score</span>
        </div>
      </div>

      {!compact && <p className="inline-diagnostic-desc">{diagnostic.description}</p>}

      <div className="inline-diagnostic-questions">
        {questions.map(question => (
          <div key={question.id} className="inline-diagnostic-question">
            <div>
              <p>{question.question}</p>
              {!compact && <small>{question.context}</small>}
            </div>
            <div className="inline-diagnostic-options" role="group" aria-label={question.question}>
              {ANSWER_OPTIONS.map(option => {
                const selected = answers[question.id] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={selected ? 'is-selected' : ''}
                    aria-pressed={selected}
                    onClick={() => answerQuestion(question, option.value)}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={`inline-diagnostic-result ${feedbackReady ? 'is-visible' : ''}`} aria-live="polite">
        {feedbackReady ? (
          <>
            <div>
              <span>{result.exposureLabel}</span>
              <p>{result.topFinding}</p>
              {!compact && <small>{result.recommendation}</small>}
            </div>
            <AdaptiveCTA
              intent={result.ctaIntent}
              service={result.service}
              riskLevel={result.exposureLevel}
              location={`${location}-${diagnostic.id}`}
              compact
            />
          </>
        ) : (
          <p>Responde dos puntos para estimar exposicion sin abrir el assessment completo.</p>
        )}
      </div>
    </motion.section>
  )
}
