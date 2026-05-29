import { MockExplanationService } from '@/src/services/explanation/MockExplanationService';
import type { ExplanationService } from '@/src/services/explanation/types';

export const explanationService: ExplanationService = new MockExplanationService();
