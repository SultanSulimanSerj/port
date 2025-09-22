import { z } from 'zod';
import { ApprovalRule, ApprovalContextType, ApprovalDecision } from '../types';

export const CreateApprovalRequestSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  description: z.string().optional(),
  contextType: z.nativeEnum(ApprovalContextType),
  contextId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  steps: z.array(z.object({
    name: z.string().min(1, 'Название этапа обязательно'),
    rule: z.nativeEnum(ApprovalRule),
    quorumSize: z.number().min(1).optional(),
    assigneeIds: z.array(z.string().uuid()).min(1, 'Минимум один согласующий'),
    dueDate: z.string().datetime().optional(),
  })).min(1, 'Минимум один этап согласования'),
});

export const MakeDecisionRequestSchema = z.object({
  decision: z.nativeEnum(ApprovalDecision).refine(
    (val) => val !== ApprovalDecision.PENDING,
    'Решение должно быть APPROVED или REJECTED'
  ),
  comment: z.string().optional(),
}).refine(
  (data) => {
    if (data.decision === ApprovalDecision.REJECTED) {
      return data.comment && data.comment.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Комментарий обязателен при отклонении',
    path: ['comment'],
  }
);

export const EscalateApprovalRequestSchema = z.object({
  reason: z.string().min(1, 'Причина эскалации обязательна'),
  newAssigneeIds: z.array(z.string().uuid()).min(1, 'Минимум один новый согласующий'),
});

export const CreateApprovalPolicyRequestSchema = z.object({
  name: z.string().min(1, 'Название политики обязательно'),
  contextType: z.nativeEnum(ApprovalContextType),
  conditions: z.record(z.any()).optional(),
  steps: z.array(z.object({
    name: z.string().min(1, 'Название этапа обязательно'),
    rule: z.nativeEnum(ApprovalRule),
    roles: z.array(z.string()).min(1, 'Минимум одна роль'),
    quorumSize: z.number().min(1).optional(),
  })).min(1, 'Минимум один этап'),
});

export type CreateApprovalRequest = z.infer<typeof CreateApprovalRequestSchema>;
export type MakeDecisionRequest = z.infer<typeof MakeDecisionRequestSchema>;
export type EscalateApprovalRequest = z.infer<typeof EscalateApprovalRequestSchema>;
export type CreateApprovalPolicyRequest = z.infer<typeof CreateApprovalPolicyRequestSchema>;