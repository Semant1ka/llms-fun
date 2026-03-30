import type { RoutineDefinition } from '../types'
import { pushDay, pullDay, legDay } from './push-pull-legs'
import { upperDay, lowerDay } from './upper-lower'
import { fullBodyA, fullBodyB } from './full-body'

export const routines: RoutineDefinition[] = [
  pushDay,
  pullDay,
  legDay,
  upperDay,
  lowerDay,
  fullBodyA,
  fullBodyB,
]
