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

// Store để quản lý countdown
const useCountdownIntervalStore = create<CountdownIntervalState>()((set) => ({
  intervalIds: [],
  addIntervalId: (id: number) => set((state) => ({
    intervalIds: [...state.intervalIds, id],
  })),
}))
// Store để quản lý kết quả
const useResultStore = create<ResultState>()((set) => ({
  resultState: 'None',
  setResultState: (newResultState: 'None' | 'All cleared' | 'Game over') => set({ resultState: newResultState }),
}))
// Store để quản lý điểm node
const usePointStore = create<PointState>()((set) => ({
  points: '',
  setPoints: (newPoints: string) => set({ points: newPoints }),
}))

export { useCountdownIntervalStore, useResultStore, usePointStore }
