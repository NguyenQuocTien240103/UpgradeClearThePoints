import { create } from 'zustand'

interface CountdownIntervalState {
  intervalIds: number[]
  addIntervalId: (id: number) => void
}
interface ResultState {
  resultState: 'None' | 'All cleared' | 'Game over'
  setResultState: (newResultState: 'None' | 'All cleared' | 'Game over') => void
}
interface PointState {
  points: string
  setPoints: (newPoints: string) => void
}

const useCountdownIntervalStore = create<CountdownIntervalState>()((set) => ({
  intervalIds: [],
  addIntervalId: (id: number) => set((state) => ({
    intervalIds: [...state.intervalIds, id],
  })),
}))
const useResultStore = create<ResultState>()((set) => ({
  resultState: 'None',
  setResultState: (newResultState: 'None' | 'All cleared' | 'Game over') => set({ resultState: newResultState }),
}))
const usePointStore = create<PointState>()((set) => ({
  points: '',
  setPoints: (newPoints: string) => set({ points: newPoints }),
}))

export { useCountdownIntervalStore, useResultStore, usePointStore }
